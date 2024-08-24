from unittest import mock

# モックデータの設定
MOCK_DATA = {
    'values': [
        ['Name', 'Age', 'City'],
        ['Alice', '24', 'New York'],
        ['Bob', '30', 'Los Angeles'],
        ['Charlie', '28', 'Chicago']
    ]
}

# Google Sheets APIのモック
def mock_get_spreadsheet_values(*args, **kwargs):
    class MockValues:
        def execute(self):
            return MOCK_DATA

    return MockValues()

def get_mock_sheets_service():
    with mock.patch('googleapiclient.discovery.build') as mock_build:
        mock_build.return_value.spreadsheets.return_value.values.return_value.get.side_effect = mock_get_spreadsheet_values
        return mock_build.return_value
