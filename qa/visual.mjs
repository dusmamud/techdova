// Visual QA: screenshots (desktop + mobile, EN + FR) and horizontal-overflow
// checks across widths. Serves the prerendered build/ via qa/serve.mjs on a
// scratch port. Run after `npm run build`. Exits 1 on any overflow, unloaded
// image or failed branded-404 check. No browser downloads: uses the
// Playwright browser already present in ~/.cache/ms-playwright.
//
// Coverage: EVERY route in BOTH locales (49 paths x 2 locales = 98 pages:
// the 48 sitemap paths plus /order-confirmation, which the sitemap excludes
// as noindex) is screenshotted at 1440x900 and
// 390x844 and checked for horizontal overflow at those widths. The
// home/shop/product pages additionally keep the original 5-width overflow
// sweep (320/375/768/1024/1440).
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const SHOTS = join(HERE, 'shots');
const PORT = 4174;
const BASE = `http://127.0.0.1:${PORT}`;

const STATIC_PATHS = [
	'',
	'/shop',
	'/about',
	'/contact',
	'/cart',
	'/terms',
	'/privacy',
	'/checkout',
	'/order-confirmation',
	'/faq',
	'/shipping',
	'/returns',
	'/payment',
	'/search',
	'/wishlist',
	'/testimonials',
	'/account',
	'/track-order',
	'/compare',
	'/deals',
	'/blog',
	'/sitemap',
	'/accessibility',
	'/stores',
	'/gift-cards',
	'/help',
	'/new-arrivals',
	'/best-sellers'
];
const CATEGORY_SLUGS = ['smartphones', 'computers', 'audio', 'smartwatches', 'gaming', 'accessories'];
const BLOG_SLUGS = [
	'choosing-noise-cancelling-headphones',
	'laptop-buying-guide-2026',
	'smartwatch-health-features'
];
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

const ALL_PATHS = [
	...STATIC_PATHS,
	...CATEGORY_SLUGS.map((slug) => `/category/${slug}`),
	...BLOG_SLUGS.map((slug) => `/blog/${slug}`),
	...PRODUCT_SLUGS.map((slug) => `/product/${slug}`)
];

function pageName(path) {
	if (path === '') return 'home';
	return path.replace(/^\//, '').replaceAll('/', '-');
}

const VIEWPORTS = [
	{ name: 'desktop', width: 1440, height: 900 },
	{ name: 'mobile', width: 390, height: 844 }
];
// Extra widths for the home/shop/product sweep (390/1440 are covered by the
// screenshot pass itself, but the full 5-width set is kept for continuity).
const OVERFLOW_WIDTHS = [320, 375, 768, 1024, 1440];
const OVERFLOW_PAGES = [
	{ name: 'home-en', path: '/en' },
	{ name: 'shop-en', path: '/en/shop' },
	{ name: 'product-en', path: '/en/product/iphone-15-pro' }
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

async function measureOverflow(page) {
	return page.evaluate(() => ({
		scrollWidth: document.documentElement.scrollWidth,
		innerWidth: window.innerWidth
	}));
}

async function main() {
	mkdirSync(SHOTS, { recursive: true });
	const server = spawn(process.execPath, [join(HERE, 'serve.mjs')], {
		env: { ...process.env, PORT: String(PORT) },
		stdio: 'ignore'
	});
	const report = {
		generatedAt: new Date().toISOString(),
		routes: ALL_PATHS.length,
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
			// Screenshots + overflow at both screenshot widths, every route,
			// both locales.
			for (const locale of ['en', 'fr']) {
				for (const vp of VIEWPORTS) {
					const context = await browser.newContext({ viewport: vp });
					const page = await context.newPage();
					page.on('pageerror', (err) =>
						report.consoleErrors.push({ where: `${locale}/${vp.name}`, message: String(err) })
					);
					for (const path of ALL_PATHS) {
						const name = pageName(path);
						const file = `${name}-${locale}-${vp.name}.png`;
						const response = await page.goto(`${BASE}/${locale}${path}`, {
							waitUntil: 'networkidle'
						});
						if (response?.status() !== 200) {
							report.consoleErrors.push({
								where: `${name}-${locale}-${vp.name}`,
								message: `HTTP ${response?.status()} for /${locale}${path}`
							});
							failed = true;
						}
						await page.waitForTimeout(700);
						const unloaded = await loadAllImages(page);
						if (unloaded.length > 0) {
							report.unloadedImages.push({ where: `${name}-${locale}-${vp.name}`, srcs: unloaded });
							failed = true;
						}
						const { scrollWidth, innerWidth } = await measureOverflow(page);
						const overflow = scrollWidth > innerWidth + 1;
						report.overflow.push({
							width: vp.width,
							page: `${name}-${locale}`,
							scrollWidth,
							innerWidth,
							overflow
						});
						if (overflow) failed = true;
						await page.screenshot({ path: join(SHOTS, file), fullPage: true });
						report.screenshots.push(file);
					}
					await context.close();
				}
			}
			// Extra 5-width overflow sweep for home/shop/product (EN).
			for (const width of OVERFLOW_WIDTHS) {
				const context = await browser.newContext({ viewport: { width, height: 800 } });
				const page = await context.newPage();
				for (const p of OVERFLOW_PAGES) {
					await page.goto(`${BASE}${p.path}`, { waitUntil: 'networkidle' });
					await page.waitForTimeout(300);
					const { scrollWidth, innerWidth } = await measureOverflow(page);
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
	const overflowFailures = report.overflow.filter((o) => o.overflow);
	console.log(
		JSON.stringify(
			{
				...report,
				summary: {
					screenshots: report.screenshots.length,
					overflowChecks: report.overflow.length,
					overflowFailures: overflowFailures.length,
					overflowFailurePages: overflowFailures,
					unloadedImages: report.unloadedImages.length,
					notFoundCheck: report.notFoundCheck,
					consoleErrors: report.consoleErrors.length
				}
			},
			null,
			2
		)
	);
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
