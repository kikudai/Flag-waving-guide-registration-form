| タイムスタンプ | 旗振り指導場所 | 対応可能日付 | 誘導者名前 |
| ---- | ---- | ---- | ---- |
| 2024/05/01 10:28:29 | 場所1 | 2024/05/02 | きくち |
| 2024/05/01 11:20:01 | 場所22 | 2024/05/02 | A.K |
| 2024/05/01 11:25:10 | 場所3 | 2024/05/03 | さいとう |
| 2024/05/01 11:50:55 | 場所3 | 2024/05/02 | あき |


## ローカル開発
python で http サーバーを起動

## 初期構築
```
cd bin

# python 仮想環境構築（初回だけ）
python -m venv .venv

# 仮想環境START
source .venv/bin/activate

# ライブラリインストール
pip install --upgrade pip
pip install -r requirements.txt

# http（リバースプロキシ込）起動
# 引数 flag-waving-guide-registration-form 部分を変更することでURLのパスを変更できる
cd ../docs
python ../bin/local_proxy_server.py flag-waving-guide-registration-form
```

## ブラウザ実行
http://localhost:5000/flag-waving-guide-registration-form/index.html
