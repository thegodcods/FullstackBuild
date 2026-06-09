# Quick test for CV Upload endpoint
import requests
import io

BASE_URL = "http://127.0.0.1:5000"

# First, login to get token
print("Logging in...")
login_response = requests.post(
    f"{BASE_URL}/api/login",
    json={
        "email": "test@example.com",
        "password": "Test@1234"
    }
)

if login_response.status_code != 200:
    print("❌ Login failed")
    print(login_response.json())
    exit()

token = login_response.json().get('token')
print(f"✅ Login successful, token: {token[:20]}...")

# Create a dummy PDF file for testing
print("\nCreating dummy PDF file...")
dummy_pdf = b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R>>endobj 4 0 obj<</Length 44>>stream BT /F1 12 Tf 100 700 Td (Test CV) Tj ET endstream endobj xref 0 5 0000000000 65535 f 0000000009 00000 n 0000000058 00000 n 0000000115 00000 n 0000000214 00000 n trailer<</Size 5/Root 1 0 R>>startxref 308 %%EOF"

# Test 1: Upload CV with template job
print("\n[TEST 1] Upload CV with template job description...")
try:
    files = {'files': ('test_cv.pdf', io.BytesIO(dummy_pdf), 'application/pdf')}
    data = {'jobDescription': 'Analyze data and build machine learning models.'}
    
    response = requests.post(
        f"{BASE_URL}/api/upload-cv",
        files=files,
        data=data,
        headers={'Authorization': f'Bearer {token}'}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 201:
        print("✅ CV upload with template works!")
        screening_id = response.json().get('screening_id')
    else:
        print("❌ CV upload failed")
        
except Exception as e:
    print(f"❌ Error: {e}")

# Test 2: Get rankings
print("\n[TEST 2] Get CV rankings...")
try:
    response = requests.get(
        f"{BASE_URL}/api/rankings/{screening_id}",
        headers={'Authorization': f'Bearer {token}'}
    )
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        print("✅ Get rankings works!")
    else:
        print("❌ Get rankings failed")
        
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "="*60)
print("✨ CV Upload tests completed!")
print("="*60)
