// Visual QA: screenshots (desktop + mobile, EN + FR, light + dark) and
// horizontal-overflow checks across widths. Serves the prerendered build/
// via qa/serve.mjs on a scratch port. Run after `npm run build`. Exits 1 on
// any overflow, unloaded image, failed branded-404 check, failed dark-mode
// check or sitemap-count mismatch. No browser downloads: uses the
// Playwright browser already present in ~/.cache/ms-playwright.
//
// Coverage: EVERY route in BOTH locales (58 paths x 2 locales = 116 pages:
// the 57 sitemap paths plus /order-confirmation, which the sitemap excludes
// as noindex) is screenshotted at 1440x900 and 390x844 in LIGHT mode and
// again at both widths in DARK mode, and checked for horizontal overflow
// at 390/768/1024/1440 in light mode (screenshots at 390/1440, overflow-only
// checks at 768/1024) and at 390/1440 in dark mode. The home/shop/product
// pages additionally keep the original 5-width overflow sweep
// (320/375/768/1024/1440). The sitemap must contain exactly 114 <url>
// entries with no order-confirmation URL.
//
// Cookie consent is pre-accepted in the QA contexts (addInitScript) so
// screenshots show the pages themselves; banner behaviour is covered by
// E2E. One dedicated banner screenshot plus chat-open and mega-menu-open
// state captures are taken separately at the end.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const SHOTS = join(HERE, 'shots');
const PORT = 4174;
const BASE = `http://127.0.0.1:${PORT}`;
const EXPECTED_SITEMAP_URLS = 114;

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
	'/best-sellers',
	'/brands',
	'/rewards',
	'/trade-in',
	'/financing',
	'/warranty',
	'/cookies'
];
const CATEGORY_SLUGS = ['smartphones', 'computers', 'audio', 'smartwatches', 'gaming', 'accessories'];
const BLOG_SLUGS = [
	'choosing-noise-cancelling-headphones',
	'laptop-buying-guide-2026',
	'smartwatch-health-features',
	'mechanical-vs-membrane-keyboards',
	'getting-started-with-sleep-tracking',
	'what-to-look-for-in-wireless-earbuds'
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
// Overflow-only widths (no screenshots): every page, both locales.
const OVERFLOW_ONLY_WIDTHS = [768, 1024];
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

// Scroll through the page so native lazy-loaded images fetch and
// scroll-reveal sections reveal, then wait until every <img> is complete.
// Returns the srcs that never loaded.
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

// Scroll-through only (no image-load assertion): used by the dark pass,
// where image loading is already proven by the light pass but reveals must
// still fire before the screenshot.
async function scrollThrough(page) {
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
	await page.waitForTimeout(400);
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
		sitemapCheck: null,
		darkChecks: [],
		consoleErrors: []
	};
	let failed = false;
	try {
		await waitForServer(`${BASE}/en`);
		// Sitemap assertion: exactly 114 <url> entries, no order-confirmation.
		{
			const res = await fetch(`${BASE}/sitemap.xml`);
			const xml = await res.text();
			const urlCount = (xml.match(/<url>/g) ?? []).length;
			const hasOrderConfirmation = xml.includes('order-confirmation');
			report.sitemapCheck = { status: res.status, urlCount, hasOrderConfirmation };
			if (res.status !== 200 || urlCount !== EXPECTED_SITEMAP_URLS || hasOrderConfirmation) {
				failed = true;
			}
		}
		const browser = await chromium.launch();
		try {
			// LIGHT screenshots + overflow at both screenshot widths, every
			// route, both locales.
			for (const locale of ['en', 'fr']) {
				for (const vp of VIEWPORTS) {
					const context = await browser.newContext({ viewport: vp });
					await context.addInitScript(() => {
						try {
							localStorage.setItem('techdova-cookie-consent', 'accepted');
						} catch {
							// Ignore.
						}
					});
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
							mode: 'light',
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
			// LIGHT overflow-only checks at 768/1024, every route, both locales.
			for (const locale of ['en', 'fr']) {
				for (const width of OVERFLOW_ONLY_WIDTHS) {
					const context = await browser.newContext({ viewport: { width, height: 800 } });
					await context.addInitScript(() => {
						try {
							localStorage.setItem('techdova-cookie-consent', 'accepted');
						} catch {
							// Ignore.
						}
					});
					const page = await context.newPage();
					for (const path of ALL_PATHS) {
						await page.goto(`${BASE}/${locale}${path}`, { waitUntil: 'networkidle' });
						await page.waitForTimeout(300);
						const { scrollWidth, innerWidth } = await measureOverflow(page);
						const overflow = scrollWidth > innerWidth + 1;
						report.overflow.push({
							mode: 'light',
							width,
							page: `${pageName(path)}-${locale}`,
							scrollWidth,
							innerWidth,
							overflow
						});
						if (overflow) failed = true;
					}
					await context.close();
				}
			}
			// DARK screenshots + overflow at both widths, every route, both
			// locales. Dark mode is engaged exactly as a real user gets it:
			// localStorage 'techdova-theme' set to 'dark' before load, so the
			// no-flash script in app.html applies .dark pre-paint. Each page
			// must carry .dark and the dark surface background.
			for (const locale of ['en', 'fr']) {
				for (const vp of VIEWPORTS) {
					const context = await browser.newContext({
						viewport: vp,
						colorScheme: 'dark'
					});
					await context.addInitScript(() => {
						try {
							localStorage.setItem('techdova-theme', 'dark');
							localStorage.setItem('techdova-cookie-consent', 'accepted');
						} catch {
							// Ignore: the OS-preference fallback still yields dark here.
						}
					});
					const page = await context.newPage();
					page.on('pageerror', (err) =>
						report.consoleErrors.push({
							where: `dark/${locale}/${vp.name}`,
							message: String(err)
						})
					);
					for (const path of ALL_PATHS) {
						const name = pageName(path);
						const file = `${name}-${locale}-${vp.name}-dark.png`;
						const response = await page.goto(`${BASE}/${locale}${path}`, {
							waitUntil: 'networkidle'
						});
						if (response?.status() !== 200) {
							report.consoleErrors.push({
								where: `dark/${name}-${locale}-${vp.name}`,
								message: `HTTP ${response?.status()} for /${locale}${path}`
							});
							failed = true;
						}
						await page.waitForTimeout(700);
						await scrollThrough(page);
						const state = await page.evaluate(() => ({
							dark: document.documentElement.classList.contains('dark'),
							bg: getComputedStyle(document.body).backgroundColor
						}));
						const darkOk = state.dark && state.bg === 'rgb(14, 23, 18)';
						report.darkChecks.push({
							page: `${name}-${locale}`,
							width: vp.width,
							...state,
							ok: darkOk
						});
						if (!darkOk) failed = true;
						const { scrollWidth, innerWidth } = await measureOverflow(page);
						const overflow = scrollWidth > innerWidth + 1;
						report.overflow.push({
							mode: 'dark',
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
				await context.addInitScript(() => {
					try {
						localStorage.setItem('techdova-cookie-consent', 'accepted');
					} catch {
						// Ignore.
					}
				});
				const page = await context.newPage();
				for (const p of OVERFLOW_PAGES) {
					await page.goto(`${BASE}${p.path}`, { waitUntil: 'networkidle' });
					await page.waitForTimeout(300);
					const { scrollWidth, innerWidth } = await measureOverflow(page);
					const overflow = scrollWidth > innerWidth + 1;
					report.overflow.push({
						mode: 'light',
						width,
						page: p.name,
						scrollWidth,
						innerWidth,
						overflow
					});
					if (overflow) failed = true;
				}
				await context.close();
			}
			// Branded 404 (client-rendered from the adapter-static fallback shell).
			{
				const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
				await context.addInitScript(() => {
					try {
						localStorage.setItem('techdova-cookie-consent', 'accepted');
					} catch {
						// Ignore.
					}
				});
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
			// State captures for manual review: cookie banner, open chat
			// panel, and the mega menu open at 1024px (viewport-clamp check).
			{
				const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
				const page = await context.newPage();
				await page.goto(`${BASE}/en`, { waitUntil: 'networkidle' });
				await page.waitForTimeout(800);
				await page.screenshot({ path: join(SHOTS, 'state-cookie-banner.png') });
				report.screenshots.push('state-cookie-banner.png');
				await page.getByRole('button', { name: 'Accept', exact: true }).click();
				await page.getByRole('button', { name: 'Open live chat (demo)' }).click();
				await page.waitForTimeout(600);
				await page.screenshot({ path: join(SHOTS, 'state-chat-open.png') });
				report.screenshots.push('state-chat-open.png');
				await context.close();
			}
			{
				const context = await browser.newContext({ viewport: { width: 1024, height: 768 } });
				await context.addInitScript(() => {
					try {
						localStorage.setItem('techdova-cookie-consent', 'accepted');
					} catch {
						// Ignore.
					}
				});
				const page = await context.newPage();
				await page.goto(`${BASE}/en`, { waitUntil: 'networkidle' });
				await page.getByRole('button', { name: /Categories/ }).hover();
				await page.waitForTimeout(500);
				await page.screenshot({ path: join(SHOTS, 'state-mega-menu-1024.png') });
				report.screenshots.push('state-mega-menu-1024.png');
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
	const darkFailures = report.darkChecks.filter((d) => !d.ok);
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
					sitemapCheck: report.sitemapCheck,
					darkChecks: report.darkChecks.length,
					darkFailures: darkFailures.length,
					darkFailurePages: darkFailures,
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
