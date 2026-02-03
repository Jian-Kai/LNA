const http = require('http');

const server = http.createServer((req, res) => {
    // 1. 處理 CORS 與 LNA Preflight (OPTIONS 請求)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 關鍵：必須允許 Private Network Access
    res.setHeader('Access-Control-Allow-Local-Network', 'true');

    console.log(`📨 收到請求: ${req.method} ${req.url}`);

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
    console.log('🚀 Agent 執行於 http://127.0.0.1:8080');
});