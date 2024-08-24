import os
import json
from flask import Flask, request, jsonify
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from mock_service import get_mock_sheets_service
from dotenv import load_dotenv

app = Flask(__name__)

# .envファイルを読み込む
load_dotenv()

# 実行環境に応じてサービスを選択
use_mock = os.environ.get('USE_MOCK', 'false').lower() == 'true'
if use_mock:
    sheets_service = get_mock_sheets_service()
else:
    # 環境変数からサービスアカウントキーを取得
    service_account_info = json.loads(os.environ['SERVICE_ACCOUNT_KEY'])
    credentials = Credentials.from_service_account_info(service_account_info, scopes=['https://www.googleapis.com/auth/spreadsheets.readonly'])
    sheets_service = build('sheets', 'v4', credentials=credentials)

@app.route('/function-1', methods=['GET'])
def get_spreadsheet_data():
    if not use_mock:
        spreadsheet_id = os.environ['SPREADSHEET_ID']
    range_name = request.args.get('range')

    if not range_name or not (range_name in ["locations!A1:C22", "formData!B1:C1000"]):
        return jsonify({'error': 'Invalid or missing range parameter.'}), 400

    try:
        if use_mock:
            result = sheets_service.spreadsheets().values().get(spreadsheetId='dummy_id', range=range_name).execute()
        else:
            result = sheets_service.spreadsheets().values().get(spreadsheetId=spreadsheet_id, range=range_name).execute()
        data = result.get('values', [])

        response = jsonify(data)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

    except Exception as e:
        print('Error:', e)
        return jsonify({'error': 'Error retrieving data'}), 500

# ローカル開発環境用のコード
if __name__ == '__main__':
    app.run(debug=True, port=8080)

# Cloud Functionsのエントリーポイント
if __name__ != '__main__':
    import google.cloud.functions_framework

    google.cloud.functions_framework.wrap_wsgi_app(app)
