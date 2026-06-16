import os
import jwt
import datetime
import bcrypt
from bson import ObjectId
from functools import wraps
from flask import Flask, request, jsonify, send_from_directory
from pydantic import ValidationError
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from concurrent.futures import ThreadPoolExecutor
from security import token_required, sanitize_string, LoginSchema, RegisterSchema
from processing import processing_file
# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Izinkan semua origin untuk development (bisa dibatasi nanti)

# Konfigurasi MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client['quick_hire']  # Nama database
users_collection = db['users']  # Nama koleksi

# Secret Key untuk JWT
SECRET_KEY = os.getenv("SECRET_KEY")

# --- Helper Functions ---

def extract_name_from_text(text, filename):
    import re
    # Try pattern match first for explicit labels
    match = re.search(r"(?:name|nama|nama\s*lengkap)\s*[:\-]\s*([a-zA-Z\s'.]{3,30})", text, re.IGNORECASE)
    if match:
        name = match.group(1).strip()
        name = re.sub(r'\s+', ' ', name)
        return name
    
    # Heuristic: Find first capitalized block that looks like a name
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    skip_keywords = ["curriculum", "vitae", "resume", "cv", "page", "halaman", "profil", "summary"]
    
    for line in lines[:5]:
        clean_line = re.sub(r'[^a-zA-Z\s\'.]', '', line).strip()
        if not clean_line:
            continue
        
        if any(kw in clean_line.lower() for kw in skip_keywords):
            continue
            
        words = clean_line.split()
        if 2 <= len(words) <= 4:
            # Check if majority of words start with uppercase
            cap_words = [w for w in words if w[0].isupper()]
            if len(cap_words) >= len(words) - 1:
                return clean_line
                
    # Fallback to filename
    fallback = filename.replace('.pdf', '').replace('_', ' ').replace('-', ' ')
    return ' '.join([w.capitalize() for w in fallback.split()])



# --- Routes ---

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        validated_data = RegisterSchema(**data)
        
        username = validated_data.username
        email = validated_data.email
        password = validated_data.password

        # Cek apakah user sudah ada
        if users_collection.find_one({'email': email}):
            return jsonify({
                "status": 409,
                'message': 'User already exists!'}), 409

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Simpan ke MongoDB
        new_user = {
            'username': username,
            'email': email,
            'password': hashed_password,
            'created_at': datetime.datetime.utcnow()
        }
        users_collection.insert_one(new_user)

        return jsonify({
            'status': 201,
            'message': 'User registered successfully!'
        }), 201
    except ValidationError as e:
        # Jika validasi gagal, kirim error detail ke frontend
        errors = [error['msg'] for error in e.errors()]
        return jsonify({"status": 400, 'message': 'Validation failed', 'errors': errors}), 400
    
    except Exception as e:
        return jsonify({"status": 500, 'message': 'Internal server error'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        validated_data = LoginSchema(**data)
            
        email = validated_data.email
        password = validated_data.password

        # Cari user di database
        user = users_collection.find_one({'email': email})

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            # Buat Token JWT
            token = jwt.encode({
                'user_id': str(user['_id']),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, SECRET_KEY, algorithm="HS256")

            return jsonify({
                'status': 200,
                'message': 'Login successful!',
                'token': token,
                'user': {
                    'id': str(user['_id']),
                    'username': user['username'],
                    'email': user['email']
                },
                'data': {
                    'token': token,
                    'user': {
                        'id': str(user['_id']),
                        'username': user['username'],
                        'email': user['email']
                    }
                }
            }), 200
        else:
            return jsonify({'status': 401, 'message': 'Invalid email or password!'}), 401
    except ValidationError as e:
        errors = [error['msg'] for error in e.errors()]
        return jsonify({'status': 400, 'message': 'Validation failed', 'errors': errors}), 400

@app.route('/api/protected', methods=['GET'])
@token_required
def protected_route(current_user_id):
    return jsonify({
        'status': 200,
        'message': f'Hello, this is a protected route. User ID: {current_user_id}'
    }), 200

@app.route("/api/analyze", methods=["POST"])
@token_required
def analyze_pdf(current_user_id):
    try:
        files = request.files.getlist("image")
        job_deskription = request.form.get("job_description")
        arr_result = []

        with ThreadPoolExecutor(max_workers=3) as executor:
            results = [executor.submit(processing_file, file, job_deskription) for file in files]
            for result in results:
                score, job_struct, cv_struct, filename, raw_text = result.result()
                print(f"score: {score}, job_struct: {job_struct}, cv_struct: {cv_struct}, filename: {filename}")
                arr_result.append({
                    "score": score,
                    "cv_struct": cv_struct,
                    "name": filename.split(".")[0]
                })
        # simpan ke database screenings
        screenings_record = {
            "user_id": current_user_id,
            "job_deskription": job_deskription,
            "created_at": datetime.datetime.utcnow(),
            "result": arr_result
        }
        screenings_collection = db['screenings']
        screenings_collection.insert_one(screenings_record)
        return jsonify({"status": 200, "message": "Success", "data": {"job_deskription": job_deskription, "result": arr_result}}), 200
    except Exception as e:
        return jsonify({"status": 500, "message": "Failed Upload"}), 500
    
@app.route("/api/screenings", methods=["GET"])
@token_required
def get_screenings(current_user_id):
    screenings_collection = db['screenings']
    # urutkan berdaarkan created_at
    screenings = screenings_collection.find({"user_id": current_user_id}).sort("created_at", -1)
    history = []

    for s in screenings:
        history.append({
            "job_deskription": s["job_deskription"],
            "result": s["result"],
            "created_at": s["created_at"]
        })
    return jsonify({"status": 200, "message": "Success", "data": history}), 200

# buat api perankingan berdasarkan score
@app.route("/api/ranking", methods=["GET"])
@token_required
def get_ranking(current_user_id):
    try:
        screenings_collection = db['screenings']
        screenings_result = screenings_collection.find({"user_id": current_user_id}).sort("created_at", -1)
        history = []
        for s in screenings_result:
            history.append({
                "screening_id": str(s["_id"]),
                "job_description": s.get("job_description", s.get("job_deskription", "")),
                "created_at": s.get("created_at"),
                "cv_count": len(s.get("cv_results", s.get("result", [])))
            })
        return jsonify({"status": 200, "message": "Success", "data": history}), 200
    except Exception as e:
        return jsonify({"status": 500, "message": f"Failed to fetch rankings: {str(e)}"}), 500

@app.route("/api/ranking/<screening_id>", methods=["GET"])
@token_required
def get_ranking_by_id(current_user_id, screening_id):
    try:
        screenings_collection = db['screenings']
        
        try:
            obj_id = ObjectId(screening_id)
        except Exception:
            return jsonify({
                "status": 400, 
                "message": "Invalid Screening ID format."
            }), 400

        screening_doc = screenings_collection.find_one({
            "_id": obj_id,
            "user_id": current_user_id
        })

        if not screening_doc:
            return jsonify({
                "status": 404, 
                "message": "Screening not found or access denied."
            }), 404

        results = screening_doc.get("result", screening_doc.get("cv_results", []))
        
        if not results:
            return jsonify({
                "status": 200, 
                "message": "Screening found but no candidates processed.", 
                "data": []
            }), 200

        ranked_results = sorted(results, key=lambda x: x.get("score", 0), reverse=True)

        final_data = []
        for rank, item in enumerate(ranked_results, start=1):
            final_data.append({
                "rank": rank,
                "name": item.get("name"),
                "score": scale_score(item.get("score", 0)), 
                "cv_struct": item.get("cv_struct", ""),
            })

        return jsonify({
            "status": 200,
            "message": "Success",
            "data": {
                "screening_id": str(screening_doc['_id']),
                "job_description_preview": screening_doc.get('job_deskription', screening_doc.get('job_description', ''))[:100] + "...",
                "total_candidates": len(final_data),
                "created_at": screening_doc.get('created_at'),
                "ranked_list": final_data
            }
        }), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({
            "status": 500, 
            "message": f"Internal Server Error: {str(e)}"
        }), 500

# --- Compatibility Routes for Frontend ---

@app.route('/api/upload-cv', methods=['POST'])
@token_required
def upload_cv(current_user_id):
    """Upload CV files for screening using the new ML IndoBERTRanker"""
    try:
        # Check for files
        if 'files' not in request.files:
            return jsonify({'message': 'No files provided'}), 400
        
        files = request.files.getlist('files')
        job_description = request.form.get('jobDescription', '').strip()
        
        # Validate files list
        valid_files = [f for f in files if f and f.filename and f.filename.endswith('.pdf')]
        
        if not valid_files:
            return jsonify({'message': 'No valid PDF files provided'}), 400
        
        if not job_description:
            return jsonify({'message': 'Job description is required'}), 400
        
        # Process files using the new ThreadPoolExecutor and processing_file logic
        arr_result = []
        with ThreadPoolExecutor(max_workers=3) as executor:
            results = [executor.submit(processing_file, file, job_description) for file in valid_files]
            for result in results:
                try:
                    score, job_struct, cv_struct, filename, raw_text = result.result()
                    
                    # Extract Candidate Email from raw text
                    import re
                    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text)
                    candidate_email = email_match.group(0) if email_match else "N/A"
                    
                    # Extract Candidate Name from raw text
                    candidate_name = extract_name_from_text(raw_text, filename)
                    
                    arr_result.append({
                        'filename': filename,
                        'name': candidate_name,
                        'email': candidate_email,
                        'score': score, # Keep raw score in database
                        'cv_struct': cv_struct
                    })
                except Exception as file_error:
                    print(f"Error processing file: {str(file_error)}")
                    continue
        
        if not arr_result:
            return jsonify({'message': 'No files could be successfully processed'}), 400
            
        # Save screening to database
        screening_record = {
            "user_id": current_user_id,
            "job_description": job_description,
            "created_at": datetime.datetime.utcnow(),
            "cv_results": arr_result
        }
        screenings_collection = db['screenings']
        result = screenings_collection.insert_one(screening_record)
        
        return jsonify({
            'message': 'CVs uploaded and screened successfully!',
            'screening_id': str(result.inserted_id),
            'cv_count': len(arr_result)
        }), 201
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'Upload failed', 'error': str(e)}), 500

def get_job_category(job_desc):
    if not job_desc:
        return "Custom"
    clean_desc = job_desc.lower()
    if "data scientist" in clean_desc:
        return "Data Scientist"
    if "machine learning engineer" in clean_desc or "ml engineer" in clean_desc:
        return "Machine Learning Engineer"
    if "data analyst" in clean_desc:
        return "Data Analyst"
    if "software engineer" in clean_desc:
        return "Software Engineer"
    if "business analyst" in clean_desc:
        return "Business Analyst"
    if "ui/ux designer" in clean_desc or "ui/ux" in clean_desc:
        return "UI/UX Designer"
    return job_desc[:30] + "..." if len(job_desc) > 30 else job_desc

@app.route('/api/upload-cv/history', methods=['GET'])
@token_required
def get_upload_cv_history(current_user_id):
    """Get user's screening history grouped by category for Frontend compatibility"""
    try:
        screenings_collection = db['screenings']
        screenings = screenings_collection.find(
            {'user_id': current_user_id},
            {'job_description': 1, 'created_at': 1, 'cv_results': 1}
        ).sort('created_at', -1)
        
        categories_map = {}
        for s in screenings:
            desc = s.get('job_description', '')
            cat = get_job_category(desc)
            cv_count = len(s.get('cv_results', []))
            
            if cat not in categories_map:
                categories_map[cat] = {
                    'screening_id': cat,  # Use category name as ID
                    'job_description': cat,
                    'cv_count': 0,
                    'created_at': s.get('created_at')
                }
            categories_map[cat]['cv_count'] += cv_count
            if s.get('created_at') and (not categories_map[cat]['created_at'] or s['created_at'] > categories_map[cat]['created_at']):
                categories_map[cat]['created_at'] = s['created_at']
        
        history = list(categories_map.values())
        history.sort(key=lambda x: x['created_at'] if x['created_at'] else datetime.datetime.min, reverse=True)
        
        for h in history:
            if h['created_at']:
                h['created_at'] = h['created_at'].isoformat()
                
        return jsonify({'history': history}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch history', 'error': str(e)}), 500

@app.route('/api/results/<screening_id>', methods=['GET'])
@token_required
def get_results_compat(current_user_id, screening_id):
    """Get screening results metadata for Frontend compatibility"""
    try:
        from bson import ObjectId
        
        is_object_id = True
        try:
            ObjectId(screening_id)
        except:
            is_object_id = False
            
        if is_object_id:
            screenings_collection = db['screenings']
            screening = screenings_collection.find_one({
                '_id': ObjectId(screening_id),
                'user_id': current_user_id
            })
            if not screening:
                return jsonify({'message': 'Screening not found'}), 404
            
            category = get_job_category(screening.get('job_description', ''))
            # Count CVs in same category
            all_screenings = screenings_collection.find({'user_id': current_user_id})
            cv_count = 0
            for s in all_screenings:
                if get_job_category(s.get('job_description', '')) == category:
                    cv_count += len(s.get('cv_results', []))
                    
            return jsonify({
                'screening_id': str(screening['_id']),
                'job_description': category,
                'cv_count': cv_count,
                'created_at': screening['created_at'].isoformat() if 'created_at' in screening else None
            }), 200
        else:
            category = screening_id
            screenings_collection = db['screenings']
            screenings = screenings_collection.find({'user_id': current_user_id})
            cv_count = 0
            latest_created_at = None
            
            for s in screenings:
                if get_job_category(s.get('job_description', '')) == category:
                    cv_count += len(s.get('cv_results', []))
                    if not latest_created_at or (s.get('created_at') and s['created_at'] > latest_created_at):
                        latest_created_at = s.get('created_at')
                        
            return jsonify({
                'screening_id': category,
                'job_description': category,
                'cv_count': cv_count,
                'created_at': latest_created_at.isoformat() if latest_created_at else None
            }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch results', 'error': str(e)}), 500

import math
def scale_score(raw_score):
    try:
        if raw_score > 1.0:
            return max(0, min(100, int(raw_score)))
        # Calibrate raw logits (typically 0.01 - 0.03) to a wider spread (40% - 95%)
        calibrated_x = 110.0 * raw_score - 1.67
        sigmoid_val = 1 / (1 + math.exp(-calibrated_x))
        return max(0, min(100, int(sigmoid_val * 100)))
    except:
        return 0

@app.route('/api/rankings/<screening_id>', methods=['GET'])
@token_required
def get_rankings_compat(current_user_id, screening_id):
    """Get CV rankings for a screening for Frontend compatibility"""
    try:
        from bson import ObjectId
        
        screenings_collection = db['screenings']
        
        is_object_id = True
        try:
            ObjectId(screening_id)
        except:
            is_object_id = False
            
        if is_object_id:
            screening = screenings_collection.find_one({
                '_id': ObjectId(screening_id),
                'user_id': current_user_id
            })
            if not screening:
                return jsonify({'message': 'Screening not found'}), 404
            category = get_job_category(screening.get('job_description', ''))
        else:
            category = screening_id
            
        all_screenings = screenings_collection.find({'user_id': current_user_id})
        merged_cv_results = []
        for s in all_screenings:
            if get_job_category(s.get('job_description', '')) == category:
                merged_cv_results.extend(s.get('cv_results', []))
                
        rankings = []
        unique_candidates = {}
        for cv in merged_cv_results:
            email = cv.get('email', 'N/A')
            score = cv.get('score', 0)
            key = email if email != 'N/A' else cv.get('name', '')
            
            if key not in unique_candidates or score > unique_candidates[key].get('score', 0):
                unique_candidates[key] = cv
                
        for idx, cv in enumerate(unique_candidates.values()):
            raw_score = cv.get('score', 0)
            score_pct = scale_score(raw_score)
            
            rankings.append({
                'rank': idx + 1,
                'id': idx + 1,
                'filename': cv.get('filename', f'Candidate {idx+1}'),
                'name': cv.get('name', 'Candidate'),
                'email': cv.get('email', 'candidate@example.com'),
                'score': score_pct,
                'text_preview': cv.get('cv_struct', '')
            })
            
        rankings.sort(key=lambda x: x['score'], reverse=True)
        
        for idx, ranking in enumerate(rankings):
            ranking['rank'] = idx + 1
            
        return jsonify({
            'screening_id': screening_id,
            'rankings': rankings
        }), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'Failed to fetch rankings', 'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
@token_required
def logout_compat(current_user_id):
    """Logout user for Frontend compatibility"""
    return jsonify({'message': 'Logout successful!'}), 200

@app.route('/api/cvs/<filename>', methods=['GET'])
def get_cv_file(filename):
    try:
        filename = os.path.basename(filename)
        abs_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'temp_pdf'))
        return send_from_directory(abs_path, filename)
    except Exception as e:
        return jsonify({'message': 'File not found', 'error': str(e)}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)