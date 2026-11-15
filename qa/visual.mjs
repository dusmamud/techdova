// Visual QA: screenshots (desktop + mobile, EN + FR) and horizontal-overflow
// checks across widths. Serves the prerendered build/ via qa/serve.mjs on a
// scratch port. Run after `npm run build`. Exits 1 if overflow or the
// branded-404 check fails. No browser downloads: uses the Playwright browser
// already present in ~/.cache/ms-playwright.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const SHOTS = join(HERE, 'shots');
const PORT = 4174;
const BASE = `http://127.0.0.1:${PORT}`;

const PAGES = [
	{ name: 'home', path: '' },
	{ name: 'shop', path: '/shop' },
	{ name: 'product', path: '/product/iphone-15-pro' }
];
const VIEWPORTS = [
	{ name: 'desktop', width: 1440, height: 900 },
	{ name: 'mobile', width: 390, height: 844 }
];
const OVERFLOW_WIDTHS = [320, 375, 768, 1024, 1440];
const OVERFLOW_PAGES = [
	{ name: 'home-en', path: '/en' },
	{ name: 'home-fr', path: '/fr' },
	{ name: 'shop-en', path: '/en/shop' },
	{ name: 'product-en', path: '/en/product/iphone-15-pro' },
	{ name: 'cart-en', path: '/en/cart' },
	{ name: 'contact-en', path: '/en/contact' }
];

async function waitForServer(url, tries = 40) {
	for (let i = 0; i < tries; i++) {
		try {
			const res = await fetch(url);
			if (res.ok || res.status === 404) return;
		} catch {
			// Not up yet.
		}
		await new Promise((r) => setTimeout(r, 250));
	}
	throw new Error(`Server did not come up at ${url}`);
}

// Scroll through the page so native lazy-loaded images fetch, then wait
// until every <img> is complete. Returns the srcs that never loaded.
async function loadAllImages(page) {
	await page.evaluate(async () => {
		// The site sets scroll-behavior: smooth; instant jumps are required
		// here or the page never actually reaches the bottom.
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
	// Large PNGs on tall pages need more than a fixed nap: poll until every
	// <img> reports complete (or 15s), then check decoded widths.
	await page
		.waitForFunction(() => [...document.images].every((img) => img.complete), null, {
			timeout: 15000
		})
		.catch(() => {});
	await page.waitForTimeout(400);
	return page.evaluate(() =>
		[...document.images]
			.filter((img) => !img.complete || img.naturalWidth === 0)
			.map((img) => img.getAttribute('src'))
	);
}

async function main() {
	mkdirSync(SHOTS, { recursive: true });
	const server = spawn(process.execPath, [join(HERE, 'serve.mjs')], {
		env: { ...process.env, PORT: String(PORT) },
		stdio: 'ignore'
	});
	const report = {
		generatedAt: new Date().toISOString(),
		screenshots: [],
		overflow: [],
		unloadedImages: [],
		notFoundCheck: null,
		consoleErrors: []
	};
	let failed = false;
	try {
		await waitForServer(`${BASE}/en`);
		const browser = await chromium.launch();
		try {
			// Screenshots.
			for (const locale of ['en', 'fr']) {
				for (const vp of VIEWPORTS) {
					const context = await browser.newContext({ viewport: vp });
					const page = await context.newPage();
					page.on('pageerror', (err) =>
						report.consoleErrors.push({ where: `${locale}/${vp.name}`, message: String(err) })
					);
					for (const p of PAGES) {
						const file = `${p.name}-${locale}-${vp.name}.png`;
						await page.goto(`${BASE}/${locale}${p.path}`, { waitUntil: 'networkidle' });
						await page.waitForTimeout(700);
						const unloaded = await loadAllImages(page);
						if (unloaded.length > 0) {
							report.unloadedImages.push({ where: `${p.name}-${locale}-${vp.name}`, srcs: unloaded });
							failed = true;
						}
						await page.screenshot({ path: join(SHOTS, file), fullPage: true });
						report.screenshots.push(file);
					}
					await context.close();
				}
			}
			// Overflow checks.
			for (const width of OVERFLOW_WIDTHS) {
				const context = await browser.newContext({ viewport: { width, height: 800 } });
				const page = await context.newPage();
				for (const p of OVERFLOW_PAGES) {
					await page.goto(`${BASE}${p.path}`, { waitUntil: 'networkidle' });
					await page.waitForTimeout(300);
					const { scrollWidth, innerWidth } = await page.evaluate(() => ({
						scrollWidth: document.documentElement.scrollWidth,
						innerWidth: window.innerWidth
					}));
					const overflow = scrollWidth > innerWidth + 1;
					report.overflow.push({ width, page: p.name, scrollWidth, innerWidth, overflow });
					if (overflow) failed = true;
				}
				await context.close();
			}
			// Branded 404 (client-rendered from the adapter-static fallback shell).
			{
				const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
				const page = await context.newPage();
				const response = await page.goto(`${BASE}/en/does-not-exist`, {
					waitUntil: 'networkidle'
				});
				const bodyText = await page.locator('main').innerText().catch(() => '');
				const ok = bodyText.includes('Page not found');
				report.notFoundCheck = { status: response?.status() ?? null, branded: ok };
				if (!ok) failed = true;
				await page.screenshot({ path: join(SHOTS, 'not-found-en-desktop.png'), fullPage: true });
				report.screenshots.push('not-found-en-desktop.png');
				await context.close();
			}
		} finally {
			await browser.close();
		}
	} finally {
		server.kill();
		writeFileSync(join(HERE, 'qa-report.json'), JSON.stringify(report, null, 2));
	}
	console.log(JSON.stringify(report, null, 2));
	if (failed) {
		console.error('QA FAILED: see qa/qa-report.json');
		process.exit(1);
	}
	console.log('QA PASSED');
}

main().catch((err) => {
	console.error(err);
	process.exit(2);
});
