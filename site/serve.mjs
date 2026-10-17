// Local preview server for the built site.
// Usage: node serve.mjs [port] [--watch]   (default port 4517)
// With --watch, the site rebuilds when anything in ../docs or ./src changes.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(HERE, 'dist');
const PORT = Number(process.argv.find((a) => /^\d+$/.test(a)) || process.env.DOCS_PORT || 4517);
const HOST = '127.0.0.1';
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
};

if (process.argv.includes('--watch') || !fs.existsSync(DIST)) await build();
if (process.argv.includes('--watch')) {
  let timer;
  for (const dir of [path.join(HERE, '..', 'docs'), path.join(HERE, 'src')]) {
    fs.watch(dir, { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(() => build().catch((e) => console.error(e)), 150);
    });
  }
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = path.join(DIST, decodeURIComponent(url.pathname));
  if (!file.startsWith(DIST)) { res.writeHead(403); return res.end('Forbidden'); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, HOST, () => console.log(`Docs preview: http://${HOST}:${PORT}/`));
