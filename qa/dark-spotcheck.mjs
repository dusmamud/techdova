// Dark-mode spot check (elevation round, foundation worker): screenshots
// home + shop + one product page in DARK at 1440 + 390, plus light-mode
// home/shop for regression comparison. Serves the prerendered build/ via
// qa/serve.mjs on a scratch port. Run after `npm run build`. Dark mode is
// engaged exactly as a real user gets it: localStorage 'techdova-theme'
// set to 'dark' before load, so the no-flash script in app.html applies
// .dark pre-paint. Exits 1 if .dark is missing or the body background is
// not the dark surface token.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const SHOTS = join(HERE, 'shots');
const PORT = 4175;
const BASE = `http://127.0.0.1:${PORT}`;

const PAGES = [
	{ name: 'home', path: '/en' },
	{ name: 'shop', path: '/en/shop' },
	{ name: 'product-iphone-15-pro', path: '/en/product/iphone-15-pro' }
];
const VIEWPORTS = [
	{ name: '1440', width: 1440, height: 900 },
	{ name: '390', width: 390, height: 844 }
];

mkdirSync(SHOTS, { recursive: true });

const server = spawn('node', ['qa/serve.mjs'], {
	cwd: join(HERE, '..'),
	env: { ...process.env, PORT: String(PORT) },
	stdio: 'ignore'
});

const waitForServer = () =>
	new Promise((resolve) => {
		const tick = async () => {
			try {
				const res = await fetch(`${BASE}/en`);
				if (res.ok) return resolve();
			} catch {
				// Not up yet.
			}
			setTimeout(tick, 200);
		};
		tick();
	});

let failed = false;
try {
	await waitForServer();
	const browser = await chromium.launch();
	try {
		for (const vp of VIEWPORTS) {
			const context = await browser.newContext({
				viewport: { width: vp.width, height: vp.height },
				colorScheme: 'dark'
			});
			await context.addInitScript(() => {
				try {
					localStorage.setItem('techdova-theme', 'dark');
				} catch {
					// Ignore: the OS-preference fallback still yields dark here.
				}
			});
			const page = await context.newPage();
			for (const { name, path } of PAGES) {
				await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
				await page.waitForTimeout(600);
				// Scroll through the page so scroll-reveal sections (hidden
				// until they enter the viewport) all reveal before the
				// full-page screenshot, mirroring qa/visual.mjs.
				await page.evaluate(async () => {
					document.documentElement.style.scrollBehavior = 'auto';
					await new Promise((resolve) => {
						const step = () => {
							const y = window.scrollY + window.innerHeight;
							window.scrollTo({ top: y, behavior: 'instant' });
							if (y < document.body.scrollHeight) setTimeout(step, 100);
							else {
								window.scrollTo({ top: 0, behavior: 'instant' });
								resolve(undefined);
							}
						};
						step();
					});
				});
				await page.waitForTimeout(600);
				const state = await page.evaluate(() => ({
					dark: document.documentElement.classList.contains('dark'),
					bg: getComputedStyle(document.body).backgroundColor,
					themeColor:
						document.querySelector('meta[name="theme-color"]')?.getAttribute('content') ?? null
				}));
				console.log(`dark ${name} ${vp.name}:`, JSON.stringify(state));
				if (!state.dark || state.bg !== 'rgb(14, 23, 18)') {
					console.error(`DARK CHECK FAILED for ${name} at ${vp.name}`);
					failed = true;
				}
				await page.screenshot({
					path: join(SHOTS, `dark-spot-${name}-${vp.name}.png`),
					fullPage: true
				});
			}
			await context.close();
		}

		// Light-mode regression comparison (no stored choice, light OS).
		const lightContext = await browser.newContext({
			viewport: { width: 1440, height: 900 },
			colorScheme: 'light'
		});
		const lightPage = await lightContext.newPage();
		for (const { name, path } of PAGES.slice(0, 2)) {
			await lightPage.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
			await lightPage.waitForTimeout(600);
			await lightPage.evaluate(async () => {
				document.documentElement.style.scrollBehavior = 'auto';
				await new Promise((resolve) => {
					const step = () => {
						const y = window.scrollY + window.innerHeight;
						window.scrollTo({ top: y, behavior: 'instant' });
						if (y < document.body.scrollHeight) setTimeout(step, 100);
						else {
							window.scrollTo({ top: 0, behavior: 'instant' });
							resolve(undefined);
						}
					};
					step();
				});
			});
			await lightPage.waitForTimeout(600);
			await lightPage.screenshot({
				path: join(SHOTS, `light-spot-${name}-1440.png`),
				fullPage: true
			});
		}
		await lightContext.close();
	} finally {
		await browser.close();
	}
} finally {
	server.kill();
}

process.exit(failed ? 1 : 0);
