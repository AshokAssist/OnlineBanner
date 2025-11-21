#!/usr/bin/env python3
"""
Simple test script for order flow
"""
import requests
import json
from io import BytesIO

# Configuration
BASE_URL = "http://localhost:8000/api"

def test_order():
    print("Testing Order Flow")
    print("=" * 30)
    
    # Step 1: Login
    print("1. Logging in...")
    login_response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin@example.com",
        "password": "admin123"
    })
    
    if login_response.status_code != 200:
        print(f"Login failed: {login_response.text}")
        return
    
    auth_data = login_response.json()
    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"Logged in as: {auth_data['user']['email']}")
    
    # Step 2: Test form data
    print("\n2. Testing form data...")
    test_file_content = b"Test banner file content"
    test_config = {
        "widthCm": 100,
        "heightCm": 50,
        "material": "vinyl",
        "grommets": False,
        "lamination": False
    }
    
    files = [("files", ("test.jpg", BytesIO(test_file_content), "image/jpeg"))]
    data = [("configs", json.dumps(test_config))]
    
    test_response = requests.post(
        f"{BASE_URL}/orders/test",
        files=files,
        data=data,
        headers=headers
    )
    
    print(f"Test response: {test_response.status_code}")
    if test_response.status_code == 200:
        print(f"Test result: {test_response.json()}")
    else:
        print(f"Test error: {test_response.text}")
        return
    
    # Step 3: Create order
    print("\n3. Creating order...")
    files = [("files", ("test.jpg", BytesIO(test_file_content), "image/jpeg"))]
    data = [("configs", json.dumps(test_config))]
    
    order_response = requests.post(
        f"{BASE_URL}/orders/",
        files=files,
        data=data,
        headers=headers
    )
    
    print(f"Order response: {order_response.status_code}")
    if order_response.status_code == 200:
        order_data = order_response.json()
        print(f"Order created: {order_data['id']}")
        print(f"Total price: ₹{order_data['total_price']}")
    else:
        print(f"Order error: {order_response.text}")

if __name__ == "__main__":
    test_order()