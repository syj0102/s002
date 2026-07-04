const http = require('http');
const fs = require('fs');
const path = require('path');

const { scanSkills, getDefaultScanRoots } = require('./src/scanner');
const { importSkillToLibrary, listLibrarySkills } = require('./src/library');
const { installSkill } = require('./src/installer');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');

let lastScan = [];

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data, null, 2));
}

function sendText(res, status, text) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(text);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 2 * 1024 * 1024) {
        reject(new Error('Request body too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('Invalid JSON body'));
      }
    });
  });
}

function serveStatic(req, res) {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const safePath = urlPath === '/' ? '/index.html' : urlPath;
  const filePath = path.normalize(path.join(PUBLIC_DIR, safePath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    return sendText(res, 403, 'Forbidden');
  }

  fs.readFile(filePath, (err, content) => {
    if (err) return sendText(res, 404, 'Not found');

    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8'
    };

    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
    res.end(content);
  });
}

async function router(req, res) {
  try {
    if (req.method === 'GET' && req.url.startsWith('/api/roots')) {
      return sendJson(res, 200, { roots: getDefaultScanRoots(ROOT) });
    }

    if (req.method === 'POST' && req.url.startsWith('/api/scan')) {
      const body = await readBody(req);
      const roots = Array.isArray(body.roots) && body.roots.length ? body.roots : getDefaultScanRoots(ROOT);
      lastScan = scanSkills(roots);
      return sendJson(res, 200, { count: lastScan.length, skills: lastScan });
    }

    if (req.method === 'GET' && req.url.startsWith('/api/library')) {
      return sendJson(res, 200, { skills: listLibrarySkills(ROOT) });
    }

    if (req.method === 'POST' && req.url.startsWith('/api/import')) {
      const body = await readBody(req);
      if (!body.sourcePath) return sendJson(res, 400, { error: 'sourcePath is required' });
      const result = importSkillToLibrary(ROOT, body.sourcePath, body.name);
      return sendJson(res, 200, result);
    }

    if (req.method === 'POST' && req.url.startsWith('/api/install')) {
      const body = await readBody(req);
      if (!body.skillName || !body.targetPath) {
        return sendJson(res, 400, { error: 'skillName and targetPath are required' });
      }
      const result = installSkill(ROOT, body.skillName, body.targetPath);
      return sendJson(res, 200, result);
    }

    return serveStatic(req, res);
  } catch (error) {
    return sendJson(res, 500, { error: error.message });
  }
}

http.createServer(router).listen(PORT, () => {
  console.log(`Agent Skills Manager running at http://localhost:${PORT}`);
});
