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

const PRODUCT_SLUGS = [
	'iphone-15-pro',
	'galaxy-s24',
	'macbook-air-m2',
	'dell-xps-13',
	'airpods-pro',
	'sony-wh1000xm5',
	'galaxy-watch-6',
	'apple-watch-9',
	'dualsense-controller',
	'nintendo-switch',
	'magsafe-charger',
	'usb-c-hub'
];

const PAGES = [
	'/en',
	'/en/shop',
	'/en/category/audio',
	'/en/blog',
	'/en/blog/laptop-buying-guide-2026',
	'/en/deals',
	'/en/brands',
	'/en/best-sellers',
	...PRODUCT_SLUGS.map((slug) => `/en/product/${slug}`),
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

	// The egress proxy is only for the live origin: routing localhost
	// through it makes Chromium's requests fail (the proxy rejects the
	// tunnel), so local runs launch with no proxy at all.
	const proxyServer = LIVE ? (process.env.HTTPS_PROXY ?? process.env.https_proxy) : undefined;
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
		// Step through the page so native lazy-loaded images (gallery
		// thumbnails, below-fold cards) all fetch, then wait until every
		// <img> is complete. A single jump to the bottom can skip images
		// in the middle of long pages.
		await page.evaluate(async () => {
			document.documentElement.style.scrollBehavior = 'auto';
			await new Promise((resolve) => {
				let y = 0;
				const step = () => {
					y += 500;
					window.scrollTo({ top: y, behavior: 'instant' });
					if (y < document.body.scrollHeight) setTimeout(step, 100);
					else {
						window.scrollTo({ top: 0, behavior: 'instant' });
						resolve();
					}
				};
				step();
			});
		});
		await page
			.waitForFunction(() => [...document.images].every((img) => img.complete), null, {
				timeout: 15000
			})
			.catch(() => {});
		await page.waitForTimeout(400);
		// On product pages, switch the gallery to every angle so the main
		// image requests each gallery file too (thumbnails alone only
		// prove the thumbnail requests).
		if (path.includes('/product/')) {
			const thumbs = page.getByRole('button', { name: /View image \d+/ });
			const count = await thumbs.count();
			for (let i = 1; i < Math.min(count, 3); i++) {
				await thumbs.nth(i).click().catch(() => {});
				await page.waitForTimeout(250);
			}
		}
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
