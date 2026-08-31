#!/usr/bin/env node
/* Foreground static server for the built site.
 *
 * `astro preview` daemonizes itself, so Playwright's webServer sees the
 * parent exit and gives up. This also serves exactly what a static host
 * serves — a directory maps to its index.html, with no redirects to muddy
 * link checking.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const dir = process.argv[2] ?? 'dist';
const port = Number(process.argv[3] ?? 4322);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let file = join(dir, normalize(url).replace(/^(\.\.[/\\])+/, ''));
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
  } catch {
    /* fall through to the 404 below */
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    try {
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      res.end(await readFile(join(dir, '404', 'index.html')));
    } catch { res.writeHead(404).end('Not found'); }
  }
}).listen(port, () => console.log(`serving ${dir} on http://localhost:${port}`));
