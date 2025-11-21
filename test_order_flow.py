#!/usr/bin/env python3
"""
Test script for complete order flow
"""
import requests
import json
from io import BytesIO

# Configuration
BASE_URL = "http://localhost:8000/api"
TEST_USER = {
    "email": "test@example.com",
    "password": "testpass123",
    "name": "Test User"
}

def test_complete_flow():
    print("🧪 Testing Complete Order Flow")
    print("=" * 50)
    
    # Step 1: Register/Login
    print("1️⃣ Authenticating user...")
    try:
        # Try login first
        login_response = requests.post(f"{BASE_URL}/auth/login", json={
            "email": TEST_USER["email"],
            "password": TEST_USER["password"]
        })
        
        if login_response.status_code != 200:
            # Register if login fails
            print("   Registering new user...")
            register_response = requests.post(f"{BASE_URL}/auth/register", json=TEST_USER)
            if register_response.status_code != 200:
                print(f"   ❌ Registration failed: {register_response.text}")
                return
            auth_data = register_response.json()
        else:
            auth_data = login_response.json()
        
        token = auth_data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print(f"   ✅ Authenticated: {auth_data['user']['email']}")
        
    except Exception as e:
        print(f"   ❌ Auth failed: {e}")
        return
    
    # Step 2: Test form data structure
    print("\n2️⃣ Testing form data structure...")
    try:
        # Create test file
        test_file_content = b"This is a test banner image file"
        test_config = {
            "widthCm": 100,
            "heightCm": 50,
            "material": "vinyl",
            "grommets": False,
            "lamination": False
        }
        
        # Test the debug endpoint
        files = [("files", ("test_banner.jpg", BytesIO(test_file_content), "image/jpeg"))]
        data = [("configs", json.dumps(test_config))]
        
        test_response = requests.post(
            f"{BASE_URL}/orders/test",
            files=files,
            data=data,
            headers=headers
        )
        
        if test_response.status_code == 200:
            test_result = test_response.json()
            print(f"      Files: {test_result['files_count']}")
            print(f"      Configs: {test_result['configs_count']}")
            print(f"      File names: {test_result['file_names']}")
        else:
            print(f"   ❌ Form data test failed: {test_response.status_code} - {test_response.text}")
            return
            
    except Exception as e:
        
        print(f"   ❌ Form data test error: {e}")
        return
    
    # Step 3: Create actual order
    print("\n3️⃣ Creating order...")
    try:
        # Reset file pointer
        files = [("files", ("test_banner.jpg", BytesIO(test_file_content), "image/jpeg"))]
        data = [("configs", json.dumps(test_config))]
        
        order_response = requests.post(
            f"{BASE_URL}/orders/",
            files=files,
            data=data,
            headers=headers
        )
        
        if order_response.status_code == 200:
            order_data = order_response.json()
            print(f"   ✅ Order created successfully:")
            print(f"      Order ID: {order_data['id']}")
            print(f"      Status: {order_data['status']}")
            print(f"      Total Price: ${order_data['total_price']}")
            print(f"      Items: {len(order_data['items'])}")
            
            order_id = order_data['id']
            item_id = order_data['items'][0]['id'] if order_data['items'] else None
            
        else:
            print(f"   ❌ Order creation failed: {order_response.status_code} - {order_response.text}")
            return
            
    except Exception as e:
        print(f"   ❌ Order creation error: {e}")
        return
    
    # Step 4: Check file storage
    print("\n4️⃣ Verifying file storage...")
    try:
        import os
        uploads_dir = "backend/uploads"
        if os.path.exists(uploads_dir):
            files_in_uploads = os.listdir(uploads_dir)
            print(f"   ✅ Files in uploads directory: {len(files_in_uploads)}")
            if files_in_uploads:
                print(f"      Latest file: {files_in_uploads[-1]}")
        else:
            print(f"   ⚠️ Uploads directory not found: {uploads_dir}")
            
    except Exception as e:
        print(f"   ❌ File storage check error: {e}")
    
    # Step 5: Test user orders endpoint
    print("\n5️⃣ Testing user orders...")
    try:
        orders_response = requests.get(f"{BASE_URL}/orders/me", headers=headers)
        
        if orders_response.status_code == 200:
            orders_data = orders_response.json()
            print(f"   ✅ User orders retrieved: {len(orders_data)} orders")
            
        else:
            print(f"   ❌ User orders failed: {orders_response.status_code} - {orders_response.text}")
            
    except Exception as e:
        print(f"   ❌ User orders error: {e}")
    
    print("\n🎉 Order flow test completed!")

if __name__ == "__main__":
    test_complete_flow()