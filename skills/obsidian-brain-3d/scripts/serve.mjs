#!/usr/bin/env node
/**
 * serve.mjs - tiny static server for the viewer, bound to 127.0.0.1 only (not reachable from other PCs).
 *   node scripts/serve.mjs [dir=./brain-site] [port=8770]
 * Then open http://127.0.0.1:8770/ . Stop with Ctrl+C.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || 'brain-site');
const port = Number(process.argv[3] || 8770);
if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error('index.html not found in ' + root + ' (run build-data.mjs first / build-data.mjs 를 먼저 실행하세요)');
  process.exit(2);
}
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.md': 'text/plain; charset=utf-8', '.css': 'text/css' };
http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400); return res.end(); }
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, path.normalize(p));
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(buf);
  });
}).on('error', (e) => {
  if (e.code === 'EADDRINUSE') console.error(`Port ${port} is busy. Try another number / ${port}번 자리를 이미 다른 프로그램이 쓰고 있습니다. 다른 번호로 여세요:\n  node serve.mjs "${root}" ${port + 1}`);
  else console.error(e.message);
  process.exit(1);
}).listen(port, '127.0.0.1', () => console.log(`serving ${root} at http://127.0.0.1:${port}/  (Ctrl+C to stop / 끄려면 Ctrl+C)`));
