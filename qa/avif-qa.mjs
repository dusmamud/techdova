// AVIF waterfall check: loads representative pages in Chromium and asserts
// every /images/* request is an .avif file (the <picture> waterfall's first
// source) with no failed image requests. Run after `npm run build`.
// Usage: node qa/avif-qa.mjs            (serves build/ locally on a scratch port)
//        BASE_URL=https://techdova.pages.dev node qa/avif-qa.mjs   (checks a live origin)
// Live mode needs the browser to reach the origin: it honours HTTPS_PROXY,
// but on this VM the egress proxy rejects Chromium's CONNECT tunnel, so
// live verification here uses curl (MIME types, HTML sources, 404s) plus
// this script's local run, which exercises identical markup.
// No browser downloads: uses the Playwright browser already present in
// ~/.cache/ms-playwright. Exits 1 on any non-AVIF image request or failure.
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const PORT = 4175;
const LIVE = process.env.BASE_URL;
const BASE = LIVE ?? `http://127.0.0.1:${PORT}`;

const PAGES = [
	'/en',
	'/en/shop',
	'/en/product/iphone-15-pro',
	'/en/category/audio',
	'/en/blog',
	'/en/blog/laptop-buying-guide-2026',
	'/en/deals',
	'/fr',
	'/fr/product/iphone-15-pro',
	'/fr/category/audio'
];

async function waitForServer(url, tries = 40) {
	for (let i = 0; i < tries; i++) {
		try {
			const res = await fetch(url);
			if (res.ok) return;
		} catch {
			/* not up yet */
		}
		await new Promise((r) => setTimeout(r, 250));
	}
	throw new Error(`server did not come up at ${url}`);
}

let server = null;
try {
	if (!LIVE) {
		server = spawn('node', [join(HERE, 'serve.mjs')], {
			env: { ...process.env, PORT: String(PORT) },
			stdio: 'ignore'
		});
		await waitForServer(`${BASE}/en`);
	}

	const proxyServer = process.env.HTTPS_PROXY ?? process.env.https_proxy;
	const browser = await chromium.launch(
		proxyServer ? { proxy: { server: proxyServer } } : {}
	);
	const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
	const imageRequests = [];
	const failed = [];
	page.on('request', (req) => {
		const url = req.url();
		if (url.includes('/images/')) imageRequests.push(url);
	});
	page.on('response', (res) => {
		if (res.request().url().includes('/images/') && res.status() >= 400) {
			failed.push(`${res.status()} ${res.request().url()}`);
		}
	});

	let pictures = 0;
	for (const path of PAGES) {
		await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
		// Trigger lazy-loaded images below the fold.
		await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
		await page.waitForTimeout(600);
		await page.evaluate(() => window.scrollTo(0, 0));
		await page.waitForTimeout(300);
		const count = await page.evaluate(
			() => document.querySelectorAll('picture source[type="image/avif"]').length
		);
		pictures += count;
		console.log(`${path}: ${count} AVIF <source> elements in DOM`);
	}
	await browser.close();

	const byExt = {};
	for (const url of imageRequests) {
		const ext = url.split('.').pop().split('?')[0];
		byExt[ext] = (byExt[ext] ?? 0) + 1;
	}
	console.log(`\n${imageRequests.length} /images/* requests: ${JSON.stringify(byExt)}`);
	console.log(`${pictures} AVIF <source> elements across ${PAGES.length} pages`);

	const nonAvif = imageRequests.filter((u) => !u.endsWith('.avif'));
	if (nonAvif.length > 0) {
		console.error(`FAIL: ${nonAvif.length} non-AVIF image requests:\n${nonAvif.join('\n')}`);
		process.exitCode = 1;
	}
	if (failed.length > 0) {
		console.error(`FAIL: failed image requests:\n${failed.join('\n')}`);
		process.exitCode = 1;
	}
	if (!process.exitCode) console.log('OK: every image request served AVIF, none failed.');
} finally {
	if (server) server.kill();
}
