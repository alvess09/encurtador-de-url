const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const {
  shortenUrl,
  getUrlById,
  getUrlsByDate,
  getUrlByShortCode,
} = require('./urlService');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.json': 'application/json',
  '.ico':  'image/x-icon',
};


function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const fullPath = path.join(__dirname, 'public', filePath);

  fs.readFile(fullPath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Arquivo não encontrado');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error('JSON inválido'));
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;
  const query = parsed.query;
  const method = req.method;

  try {
    // Arquivos estáticos
    if (method === 'GET') {

      if (pathname === '/' || pathname === '/index.html') return serveStatic(res, 'index.html');
      if (pathname === '/lista.html') return serveStatic(res, 'lista.html');
      if (pathname === '/ajuda.html') return serveStatic(res, 'ajuda.html');
      if (pathname === '/style.css')  return serveStatic(res, 'style.css');
      // Documentação Swagger API
      if (pathname === '/docs')       return serveStatic(res, 'docs.html');
      if (pathname === '/swagger.json') return serveStatic(res, 'swagger.json');

    }

    // API: POST /shorten
    if (method === 'POST' && pathname === '/shorten') {
      const body = await parseBody(req);
      if (!body.url) return sendJson(res, 400, { error: 'Campo "url" é obrigatório' });
      const record = shortenUrl(body.url);
      return sendJson(res, 201, record);
    }

    // API: GET /urls/:id
    const matchById = pathname.match(/^\/urls\/(\d+)$/);
    if (method === 'GET' && matchById) {
      const record = getUrlById(matchById[1]);
      if (!record) return sendJson(res, 404, { error: 'URL não encontrada' });
      return sendJson(res, 200, record);
    }

    // API: GET /urls?date=YYYY-MM-DD
    if (method === 'GET' && pathname === '/urls' && query.date) {
      const records = getUrlsByDate(query.date);
      return sendJson(res, 200, records);
    }

    // API: GET /info/:shortCode
    const matchInfo = pathname.match(/^\/info\/([a-zA-Z0-9_-]{6})$/);
    if (method === 'GET' && matchInfo) {
      const record = getUrlByShortCode(matchInfo[1]);
      if (!record) return sendJson(res, 404, { error: 'Código não encontrado' });
      return sendJson(res, 200, record);
    }

    // GET /:shortCode → redireciona
    const matchByCode = pathname.match(/^\/([a-zA-Z0-9_-]{6})$/);
    if (method === 'GET' && matchByCode) {
      const record = getUrlByShortCode(matchByCode[1]);
      if (!record) return sendJson(res, 404, { error: 'Código não encontrado' });
      res.writeHead(302, { Location: record.originalUrl });
      return res.end();
    }

    sendJson(res, 404, { error: 'Rota não encontrada' });
  } catch (err) {
    sendJson(res, 400, { error: err.message });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n Encurtador rodando em http://localhost:${PORT}\n`);
});
