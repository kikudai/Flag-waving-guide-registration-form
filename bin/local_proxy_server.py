from flask import Flask, request, Response
import requests
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer
import sys

# コマンドライン引数でベースパスを取得
if len(sys.argv) != 2:
    print("Usage: python server.py <base_path>")
    sys.exit(1)

base_path = sys.argv[1]

# Flask リバースプロキシの設定
app = Flask(__name__)
TARGET_URL = 'http://localhost:8000'

@app.route(f'/{base_path}/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def proxy(path):
    url = f'{TARGET_URL}/{path}'
    method = request.method
    headers = {key: value for key, value in request.headers if key != 'Host'}
    
    if method == 'GET':
        resp = requests.get(url, headers=headers)
    elif method == 'POST':
        resp = requests.post(url, headers=headers, data=request.data)
    elif method == 'PUT':
        resp = requests.put(url, headers=headers, data=request.data)
    elif method == 'DELETE':
        resp = requests.delete(url, headers=headers)
    
    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
    headers = [(name, value) for name, value in resp.raw.headers.items() if name.lower() not in excluded_headers]

    response = Response(resp.content, resp.status_code, headers)
    return response

# HTTPサーバをバックグラウンドで実行する関数
def run_http_server():
    handler = SimpleHTTPRequestHandler
    httpd = HTTPServer(('localhost', 8000), handler)
    print("Starting http.server on port 8000")
    httpd.serve_forever()

# スレッドでHTTPサーバを実行
http_server_thread = threading.Thread(target=run_http_server)
http_server_thread.daemon = True
http_server_thread.start()

# Flaskアプリケーションを実行
if __name__ == '__main__':
    print(f"Starting Flask server on port 5000 with base path /{base_path}/")
    app.run(host='0.0.0.0', port=5000)
