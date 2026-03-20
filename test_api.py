import requests

url = "http://localhost:8000/api/process-live"
payload = {"transcript": "This is a test lecture about artificial intelligence and machine learning."}
headers = {"Content-Type": "application/json"}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
