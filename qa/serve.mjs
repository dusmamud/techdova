// Minimal static file server for the prerendered build/ output, mirroring how a
// static host serves adapter-static flat .html files: /en -> en.html,
// /en/shop -> en/shop.html, anything else -> 404.html with a 404 status.
// Pure Node.js, no dependencies. Used by Playwright (webServer) and qa/visual.mjs.
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', 'build');
const PORT = Number(process.env.PORT ?? 4173);

const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.png': 'image/png',
	'.avif': 'image/avif',
	'.webp': 'image/webp',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.svg': 'image/svg+xml',
	'.ico': 'image/x-icon',
	'.xml': 'application/xml; charset=utf-8',
	'.txt': 'text/plain; charset=utf-8',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2'
};

function resolveFile(pathname) {
	const clean = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
	const direct = join(ROOT, clean);
	if (existsSync(direct) && statSync(direct).isFile()) return { file: direct, status: 200 };
	if (existsSync(direct) && statSync(direct).isDirectory()) {
		const index = join(direct, 'index.html');
		if (existsSync(index)) return { file: index, status: 200 };
	}
	const html = `${direct}.html`;
	if (existsSync(html)) return { file: html, status: 200 };
	return { file: join(ROOT, '404.html'), status: 404 };
}

const server = createServer((req, res) => {
	const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
	const { file, status } = resolveFile(pathname);
	res.writeHead(status, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
	createReadStream(file).pipe(res);
});

server.listen(PORT, '127.0.0.1', () => {
	console.log(`Serving ${ROOT} at http://127.0.0.1:${PORT}`);
});
