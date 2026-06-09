# Integration Test Script for Frontend-Backend Connection

import requests
import json
import time

BASE_URL = "http://127.0.0.1:5000"

# Test data
test_email = f"test{int(time.time())}@example.com"
test_username = f"testuser{int(time.time())}"
test_password = "Test@1234"

print("=" * 60)
print("🧪 FRONTEND-BACKEND INTEGRATION TEST")
print("=" * 60)

# Test 1: Register User
print("\n[1] Testing User Registration...")
try:
    response = requests.post(
        f"{BASE_URL}/api/register",
        json={
            "username": test_username,
            "email": test_email,
            "password": test_password
        }
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    if response.status_code == 201:
        print("✅ Registration endpoint works!")
    else:
        print("❌ Registration failed")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 2: Login User
print("\n[2] Testing User Login...")
try:
    response = requests.post(
        f"{BASE_URL}/api/login",
        json={
            "email": test_email,
            "password": test_password
        }
    )
    print(f"Status: {response.status_code}")
    data = response.json()
    print(f"Response: {data}")
    
    if response.status_code == 200:
        print("✅ Login endpoint works!")
        token = data.get('token')
        user = data.get('user')
        print(f"   Token: {token[:20]}...")
        print(f"   User: {user}")
    else:
        print("❌ Login failed")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 3: Protected Route
print("\n[3] Testing Protected Route...")
try:
    response = requests.get(
        f"{BASE_URL}/api/protected",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    if response.status_code == 200:
        print("✅ Protected route works!")
    else:
        print("❌ Protected route failed")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 4: Logout
print("\n[4] Testing Logout...")
try:
    response = requests.post(
        f"{BASE_URL}/api/logout",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    if response.status_code == 200:
        print("✅ Logout endpoint works!")
    else:
        print("❌ Logout failed")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 5: Get Profile
print("\n[5] Testing Get Profile...")
try:
    response = requests.get(
        f"{BASE_URL}/api/profile",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    if response.status_code == 200:
        print("✅ Get profile endpoint works!")
    else:
        print("❌ Get profile failed")
except Exception as e:
    print(f"❌ Error: {e}")

# Test 6: CORS Check
print("\n[6] Testing CORS Headers...")
try:
    response = requests.options(
        f"{BASE_URL}/api/login",
        headers={
            "Origin": "http://127.0.0.1:3000",
            "Access-Control-Request-Method": "POST"
        }
    )
    print(f"Status: {response.status_code}")
    print("Headers:")
    for header in ["Access-Control-Allow-Origin", "Access-Control-Allow-Methods", "Access-Control-Allow-Headers"]:
        print(f"   {header}: {response.headers.get(header, 'NOT SET')}")
    if "Access-Control-Allow-Origin" in response.headers:
        print("✅ CORS is enabled!")
    else:
        print("❌ CORS might not be properly configured")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 60)
print("✨ Integration tests completed!")
print("=" * 60)
print("\n📋 Next steps:")
print("1. Make sure MongoDB is running on localhost:27017")
print("2. Start backend: cd backend && python app.py")
print("3. Start frontend: cd Frontend && npm start")
print("4. Test login/register flow in browser")
