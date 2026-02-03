const http = require('http');

const server = http.createServer((req, res) => {
    console.log(`📨 收到請求: ${req.method} ${req.url}`);

    // 設定 CORS 標頭
    res.setHeader('Access-Control-Allow-Origin', 'https://jian-kai.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // 1. 處理預檢請求
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Force-Preflight'); // 這裡要對應
        res.setHeader('Access-Control-Allow-Local-Network', 'false');

        res.writeHead(204);
        res.end();
        return;
    }

    // 2. 處理正式請求
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Hello from Local Agent!" }));
});

server.listen(8080, () => {
    console.log('🚀 Agent 執行於 http://127.0.0.1:8080');
});