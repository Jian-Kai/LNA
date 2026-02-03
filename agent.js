const http = require('http');

const server = http.createServer((req, res) => {
    // 1. 設定明確的 Origin，不要用 '*'
    // 請將下方的網址替換成你 GitHub Pages 的實際網址
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', origin || 'https://jian-kai.github.io');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 允許帶上憑證 (如果要解決你遇到的報錯，這行通常需要配合明確的 Origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // 關鍵：LNA 必要 Header
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