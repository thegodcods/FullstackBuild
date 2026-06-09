# CV Screening Platform - Full Stack Setup Guide

A full-stack application combining **React Frontend** with **Python Flask Backend** for CV screening and analysis.

## 📁 Project Structure

```
cvscreening/
├── Frontend/                  # React Application
│   ├── src/
│   │   ├── services/         # API services (authService, cvService)
│   │   ├── context/          # React context (AuthContext)
│   │   ├── pages/            # Page components (Login, Signup, Dashboard, etc)
│   │   ├── components/       # Reusable components
│   │   ├── config/           # Configuration (api.js)
│   │   └── App.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                   # Python Flask Backend
│   ├── app.py               # Main Flask application
│   ├── security.py          # JWT and security utilities
│   ├── ekstraksi_pdf.py     # PDF extraction logic
│   ├── text_processor.py    # NLP text processing
│   ├── clean_text.py        # Text cleaning utilities
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Environment variables
│   ├── .venv                # Virtual environment
│   └── test_integration.py  # Integration tests
│
├── .env                     # Root environment configuration
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 14+ and npm
- **Python** 3.8+
- **MongoDB** 4.4+ (running on localhost:27017)

### Installation

#### 1. Clone and navigate
```bash
cd cvscreening
```

#### 2. Setup Backend

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment (Optional)
python -m venv .venv
# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Verify .env configuration
# Check that MONGO_URI and SECRET_KEY are set correctly
```

#### 3. Setup Frontend

```bash
# Navigate to frontend
cd Frontend

# Install dependencies
npm install

# Start development server
npm start
```

#### 4. Start Backend

```bash
# From backend directory
python app.py
```

The backend will run on `http://127.0.0.1:5000`
The frontend will run on `http://127.0.0.1:3000`

## 🔗 API Integration

### Base URL
- **Development**: `http://127.0.0.1:5000`
- **Production**: Set `REACT_APP_API_URL` in `.env`

### Authentication Endpoints

#### Register User
```
POST /api/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response: 201 Created
{
  "message": "User registered successfully!"
}
```

#### Login User
```
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}

Response: 200 OK
{
  "message": "Login successful!",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### CV Screening Endpoints

#### Upload CVs
```
POST /api/upload-cv
Authorization: Bearer <token>
Content-Type: multipart/form-data

Files: [cv1.pdf, cv2.pdf]
jobDescription: "Job description text"

Response: 201 Created
{
  "message": "CVs uploaded successfully!",
  "screening_id": "507f1f77bcf86cd799439011",
  "cv_count": 2
}
```

#### Get Results
```
GET /api/results/{screening_id}
Authorization: Bearer <token>

Response: 200 OK
{
  "screening_id": "507f1f77bcf86cd799439011",
  "job_description": "...",
  "cv_count": 2,
  "created_at": "2026-06-06T16:34:00Z"
}
```

#### Get Rankings
```
GET /api/rankings/{screening_id}
Authorization: Bearer <token>

Response: 200 OK
{
  "screening_id": "507f1f77bcf86cd799439011",
  "rankings": [
    {
      "rank": 1,
      "filename": "cv1.pdf",
      "score": 0.95
    }
  ]
}
```

## 🧪 Testing Integration

Run the integration test script to verify frontend-backend connectivity:

```bash
cd backend
python test_integration.py
```

This will test:
- ✅ User registration
- ✅ User login
- ✅ Protected routes
- ✅ Logout
- ✅ Profile retrieval
- ✅ CORS headers

## 📝 Environment Variables

### Frontend (.env)
```
# Backend API URL
REACT_APP_API_URL=http://127.0.0.1:5000
```

### Backend (.env)
```
# MongoDB connection
MONGO_URI=mongodb://localhost:27017/

# JWT secret key (change in production!)
SECRET_KEY=thisismysecretkey123

# Flask configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

## 🔐 Security Notes

⚠️ **Important for Production:**
1. Change `SECRET_KEY` to a strong random string
2. Use environment variables for all sensitive data
3. Enable HTTPS
4. Set appropriate CORS origins instead of allowing all
5. Use a production-grade database (MongoDB Atlas)
6. Implement rate limiting
7. Add input validation and sanitization

## 🛠️ Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running
```bash
# macOS
brew services start mongodb-community

# Windows (if installed)
net start MongoDB

# Or use MongoDB Atlas cloud service
```

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: CORS is already enabled in `app.py` with `CORS(app)`

### JWT Token Invalid
```
Token has expired or is invalid
```
**Solution**: 
- Check that `SECRET_KEY` matches between frontend and backend
- Tokens expire after 24 hours - user needs to login again

### Port Already in Use
```
Address already in use
```
**Solution**: 
- Backend: Change port in `app.py` (line 126)
- Frontend: `npm start` will prompt to use different port

## 📚 File Reference

### authService.js
Handles all authentication API calls:
- `register()` - Create new user account
- `login()` - Authenticate and get JWT token
- `logout()` - Logout user
- `getProfile()` - Fetch user profile
- `updateProfile()` - Update user information

### cvService.js
Handles CV screening operations:
- `uploadCVs()` - Upload CV files
- `screenCVs()` - Screen CVs against job description
- `getResults()` - Get screening results
- `getRankings()` - Get CV rankings
- `getHistory()` - Get user's screening history

### Backend Endpoints
- `security.py` - JWT token validation and password hashing
- `ekstraksi_pdf.py` - PDF text extraction
- `text_processor.py` - NLP and text embedding
- `clean_text.py` - Text preprocessing

## 🚢 Deployment

### Deploy Backend (Flask)
```bash
# Using Gunicorn for production
gunicorn --bind 0.0.0.0:5000 app:app
```

### Deploy Frontend (React)
```bash
# Build production bundle
npm run build

# Deploy to hosting service (Vercel, Netlify, etc)
npm install -g vercel
vercel
```

## 💡 Next Steps

1. **Add more CV screening features** - Implement actual ranking algorithm
2. **Improve text processing** - Add more NLP features
3. **Add job templates** - Pre-defined job descriptions
4. **Analytics dashboard** - Track screening statistics
5. **Export results** - Generate PDF reports
6. **Email notifications** - Notify users of screening results

## 📞 Support

For issues or questions, check:
- Backend logs: `python app.py` console output
- Frontend logs: Browser DevTools console
- MongoDB logs: MongoDB service logs

## 📄 License

This project is open source and available under the MIT License.
