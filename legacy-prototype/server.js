const http = require('http');
const fs = require('fs');
const path = require('path');
const { processOrder, options, products } = require('./backend/orderProcessor');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = process.cwd();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const sendJson = (res, status, payload) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(payload));
};

const sendNotFound = (res) => {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Nenalezeno');
};

const serveStatic = (req, res, parsedUrl) => {
  let pathname = parsedUrl.pathname;
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, pathname);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.promises
    .stat(filePath)
    .then((stats) => {
      if (stats.isDirectory()) {
        sendNotFound(res);
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    })
    .catch(() => sendNotFound(res));
};

const collectRequestBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 1e6) {
        req.connection.destroy();
        reject(new Error('Request too large'));
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && parsedUrl.pathname === '/api/products') {
    sendJson(res, 200, products);
    return;
  }

  if (req.method === 'GET' && parsedUrl.pathname === '/api/options') {
    sendJson(res, 200, options);
    return;
  }

  if (req.method === 'POST' && parsedUrl.pathname === '/api/orders') {
    try {
      const rawBody = await collectRequestBody(req);
      const payload = rawBody ? JSON.parse(rawBody) : {};
      const result = await processOrder(payload);
      sendJson(res, 201, result);
    } catch (error) {
      console.error('Order processing failed:', error.message);
      sendJson(res, 400, { message: error.message || 'Neznámá chyba' });
    }
    return;
  }

  serveStatic(req, res, parsedUrl);
});

server.listen(PORT, () => {
  console.log(`Drak & Kostky server běží na http://localhost:${PORT}`);
});
