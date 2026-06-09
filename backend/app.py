import os
import jwt
import datetime
import bcrypt
from functools import wraps
from flask import Flask, request, jsonify
from pydantic import ValidationError
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

from security import token_required, sanitize_string, LoginSchema, RegisterSchema
from ekstraksi_pdf import ekstraksi_pdf_cv
from clean_text import cleaning
from text_processor import clean_cv_text, get_embedding, inspect_tokens
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
            return jsonify({'message': 'User already exists!'}), 409

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

        return jsonify({'message': 'User registered successfully!'}), 201
    except ValidationError as e:
        # Jika validasi gagal, kirim error detail ke frontend
        errors = [error['msg'] for error in e.errors()]
        return jsonify({'message': 'Validation failed', 'errors': errors}), 400
    
    except Exception as e:
        return jsonify({'message': 'Internal server error'}), 500

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
                'message': 'Login successful!',
                'token': token,
                'user': {
                    'id': str(user['_id']),
                    'username': user['username'],
                    'email': user['email']
                }
            }), 200
        else:
            return jsonify({'message': 'Invalid email or password!'}), 401
    except ValidationError as e:
        errors = [error['msg'] for error in e.errors()]
        return jsonify({'message': 'Validation failed', 'errors': errors}), 400

@app.route('/api/protected', methods=['GET'])
@token_required
def protected_route(current_user_id):
    return jsonify({
        'message': f'Hello, this is a protected route. User ID: {current_user_id}'
    }), 200

@app.route("/api/analyze", methods=["POST"])
def analyze_pdf():
    file = request.files.get("image")
    if file:
        text = ekstraksi_pdf_cv(file, file.filename)
        clean_cv = clean_cv_text(text)
        vec_cv = get_embedding(clean_cv)
        token = inspect_tokens(clean_cv)
        return jsonify({"token": token, "vektor": vec_cv.tolist(), "text": clean_cv}), 200
    else:
        return jsonify({"error": "No file uploaded"}), 400

# --- CV Screening Endpoints ---

@app.route('/api/upload-cv', methods=['POST'])
@token_required
def upload_cv(current_user_id):
    """Upload CV files for screening"""
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
        
        # Process files
        cv_results = []
        for file in valid_files:
            try:
                text = ekstraksi_pdf_cv(file, file.filename)
                
                # Extract Candidate Email
                import re
                email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
                candidate_email = email_match.group(0) if email_match else "N/A"
                
                # Extract Candidate Name
                candidate_name = extract_name_from_text(text, file.filename)
                
                clean_cv = clean_cv_text(text)
                vec_cv = get_embedding(clean_cv)
                
                cv_results.append({
                    'filename': file.filename,
                    'name': candidate_name,
                    'email': candidate_email,
                    'text': clean_cv,
                    'embedding': vec_cv.tolist()
                })
            except Exception as file_error:
                print(f"Error processing file {file.filename}: {str(file_error)}")
                continue
        
        if not cv_results:
            return jsonify({'message': 'No valid PDF files could be processed'}), 400
        
        # Save screening to database
        screening_record = {
            'user_id': current_user_id,
            'job_description': job_description,
            'cv_results': cv_results,
            'created_at': datetime.datetime.utcnow()
        }
        
        # Save to MongoDB
        screenings_collection = db['screenings']
        result = screenings_collection.insert_one(screening_record)
        
        return jsonify({
            'message': 'CVs uploaded and screened successfully!',
            'screening_id': str(result.inserted_id),
            'cv_count': len(cv_results)
        }), 201
    except Exception as e:
        return jsonify({'message': 'Upload failed', 'error': str(e)}), 500

@app.route('/api/upload-cv/history', methods=['GET'])
@token_required
def get_history(current_user_id):
    """Get user's screening history"""
    try:
        screenings_collection = db['screenings']
        screenings = screenings_collection.find(
            {'user_id': current_user_id},
            {'job_description': 1, 'created_at': 1, 'cv_results': 1}
        ).sort('created_at', -1)
        
        history = []
        for s in screenings:
            history.append({
                'screening_id': str(s['_id']),
                'job_description': s['job_description'],
                'cv_count': len(s.get('cv_results', [])),
                'created_at': s['created_at'].isoformat() if 'created_at' in s else None
            })
        return jsonify({'history': history}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch history', 'error': str(e)}), 500

@app.route('/api/results/<screening_id>', methods=['GET'])
@token_required
def get_results(current_user_id, screening_id):
    """Get screening results"""
    try:
        from bson import ObjectId
        
        screenings_collection = db['screenings']
        screening = screenings_collection.find_one({
            '_id': ObjectId(screening_id),
            'user_id': current_user_id
        })
        
        if not screening:
            return jsonify({'message': 'Screening not found'}), 404
        
        return jsonify({
            'screening_id': str(screening['_id']),
            'job_description': screening['job_description'],
            'cv_count': len(screening.get('cv_results', [])),
            'created_at': screening['created_at'].isoformat() if 'created_at' in screening else None
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch results', 'error': str(e)}), 500

@app.route('/api/rankings/<screening_id>', methods=['GET'])
@token_required
def get_rankings(current_user_id, screening_id):
    """Get CV rankings for a screening"""
    try:
        from bson import ObjectId
        from sklearn.metrics.pairwise import cosine_similarity
        import numpy as np
        
        screenings_collection = db['screenings']
        screening = screenings_collection.find_one({
            '_id': ObjectId(screening_id),
            'user_id': current_user_id
        })
        
        if not screening:
            return jsonify({'message': 'Screening not found'}), 404
        
        cv_results = screening.get('cv_results', [])
        job_desc = screening.get('job_description', '')
        
        # Get job description embedding
        job_embedding = get_embedding(job_desc)
        job_embedding_np = np.array(job_embedding).reshape(1, -1)
        
        # Calculate scores for each CV
        rankings = []
        for idx, cv in enumerate(cv_results):
            cv_embedding = np.array(cv.get('embedding', [])).reshape(1, -1)
            
            # Calculate cosine similarity (0-1)
            if cv_embedding.size > 0:
                similarity = cosine_similarity(job_embedding_np, cv_embedding)[0][0]
                score = max(0, min(100, int(similarity * 100)))  # Convert to 0-100
            else:
                score = 0
            
            # Get candidate name and email, fall back if not saved
            filename = cv.get('filename', f'Candidate {idx+1}')
            candidate_name_fallback = filename.replace('.pdf', '').replace('_', ' ').replace('-', ' ')
            candidate_name_fallback = ' '.join([w.capitalize() for w in candidate_name_fallback.split()])
            
            candidate_name = cv.get('name', candidate_name_fallback)
            candidate_email = cv.get('email', f'candidate{idx+1}@example.com')
            
            rankings.append({
                'rank': idx + 1,
                'id': idx + 1,
                'filename': filename,
                'name': candidate_name,
                'email': candidate_email,
                'score': score,
                'text_preview': cv.get('text', '')
            })
        
        # Sort by score descending
        rankings.sort(key=lambda x: x['score'], reverse=True)
        
        # Reorder ranks after sorting
        for idx, ranking in enumerate(rankings):
            ranking['rank'] = idx + 1
        
        return jsonify({
            'screening_id': str(screening['_id']),
            'rankings': rankings
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch rankings', 'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
@token_required
def logout(current_user_id):
    """Logout user"""
    return jsonify({'message': 'Logout successful!'}), 200

@app.route('/api/profile', methods=['GET'])
@token_required
def get_profile(current_user_id):
    """Get user profile"""
    try:
        from bson import ObjectId
        
        user = users_collection.find_one({'_id': ObjectId(current_user_id)})
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email'],
            'created_at': user['created_at'].isoformat() if 'created_at' in user else None
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to fetch profile', 'error': str(e)}), 500

@app.route('/api/profile/update', methods=['PUT'])
@token_required
def update_profile(current_user_id):
    """Update user profile"""
    try:
        from bson import ObjectId
        
        data = request.get_json()
        
        update_data = {}
        if 'username' in data:
            update_data['username'] = data['username']
        if 'email' in data:
            update_data['email'] = data['email']
        
        if not update_data:
            return jsonify({'message': 'No data to update'}), 400
        
        result = users_collection.update_one(
            {'_id': ObjectId(current_user_id)},
            {'$set': update_data}
        )
        
        if result.matched_count == 0:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({'message': 'Profile updated successfully!'}), 200
    except Exception as e:
        return jsonify({'message': 'Update failed', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)