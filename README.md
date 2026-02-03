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
```

1. 執行：node agent.js

### B. 部署 Web App (發送端)

將以下代碼部署至 HTTPS 環境（如 CodeSandbox, GitHub Pages, Vercel）：

```html
<button id="testBtn">測試 LNA 請求</button>
<p id="status">等待操作...</p>

<script>
  document.getElementById('testBtn').onclick = () => {
    document.getElementById('status').innerText = '請求中...';
    
    // 故意使用 IP 而非 localhost 以確保觸發邊界檢查
    fetch('[http://127.0.0.1:8080/](http://127.0.0.1:8080/)')
      .then(res => res.json())
      .then(data => {
        document.getElementById('status').innerText = '成功：' + data.message;
      })
      .catch(err => {
        document.getElementById('status').innerText = '失敗：' + err.message;
        console.error(err);
      });
  };
</script>
```

## ⚙️ 2. Chrome 強制開啟 LNA 提示

由於 LNA 權限提示目前仍處於實驗階段，請手動開啟以下 Flag：

1. 開啟 chrome://flags/
2. 將以下項目設為 Enabled:
    - #private-network-access-permission-prompt (核心：開啟提示窗)
    - #block-insecure-private-network-requests (開啟安全性攔截)
3. 點擊 Relaunch 重啟。

## 🧪 3. 測試與觀察

1. 第一次請求：
    在 HTTPS 網頁點擊按鈕，瀏覽器網址列應會彈出：「此網站正在要求存取您私人網路上的設備」。

2. 觀察 Header：
    在 DevTools -> Network 觀察，你會發現瀏覽器先發送了一個 OPTIONS 請求，且包含 Access-Control-Request-Local-Network: true。

3. 重置測試：
    若想重新看到彈窗，點擊網址列左側的「鎖頭」或「設定」圖示，找到「私人網路存取 (Private network access)」並重設權限。

## 📚 延伸閱讀

Chrome Developers: Private Network Access Preflight
