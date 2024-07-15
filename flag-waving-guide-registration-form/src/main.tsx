import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 'root' 要素の存在を確実にするために、TypeScriptの非nullアサーション演算子（!）を使用します。
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}
