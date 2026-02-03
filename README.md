# Chrome Local Network Access (LNA) 權限提示測試工具

本專案用於模擬與測試 Chrome 142+ 版本中的 **Local Network Access (LNA)** 機制。透過建立一個 HTTPS 網頁（發送端）與一個 HTTP Local Agent（接收端），觀察瀏覽器何時會觸發「私人網路存取」權限彈窗。

---

## 🛠 1. 環境架設

### A. 啟動 Local Agent (接收端)
你需要一個能在本地端執行並回傳正確 LNA Header 的伺服器。

1. 建立 `agent.js`:
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    // 1. 處理 CORS 與 LNA Preflight (OPTIONS 請求)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // 關鍵：必須允許 Private Network Access
    res.setHeader('Access-Control-Allow-Local-Network', 'true');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 2. 處理正式請求
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Hello from Local Agent!" }));
});

server.listen(8080, () => {
    console.log('🚀 Agent 執行於 [http://127.0.0.1:8080](http://127.0.0.1:8080)');
});
