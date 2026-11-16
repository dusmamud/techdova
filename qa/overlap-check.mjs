// One-off check: with the compare tray open AND the page scrolled (so
// BackToTop is visible), the two fixed elements must not overlap at 390px.
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4175;
const BASE = `http://127.0.0.1:${PORT}`;
const server = spawn(process.execPath, ['qa/serve.mjs'], {
	env: { ...process.env, PORT: String(PORT) },
	stdio: 'ignore'
});

async function waitForServer(url, tries = 40) {
	for (let i = 0; i < tries; i++) {
		try {
			const res = await fetch(url);
			if (res.ok || res.status === 404) return;
		} catch {}
		await new Promise((r) => setTimeout(r, 250));
	}
	throw new Error('server did not come up');
}

try {
	await waitForServer(`${BASE}/en`);
	const browser = await chromium.launch();
	const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
	const page = await context.newPage();
	await page.goto(`${BASE}/en/shop`, { waitUntil: 'networkidle' });
	// Add two products to compare via their card toggle buttons.
	const iphone = page.locator('article', { hasText: 'iPhone 15 Pro' }).first();
	await iphone.getByRole('button', { name: 'Add to compare (iPhone 15 Pro)' }).click();
	const galaxy = page.locator('article', { hasText: 'Samsung Galaxy S24' }).first();
	await galaxy.getByRole('button', { name: 'Add to compare (Samsung Galaxy S24)' }).click();
	await page.getByRole('region', { name: 'Comparison tray' }).waitFor({ state: 'visible' });
	// Scroll so BackToTop appears.
	await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }));
	await page.waitForTimeout(500);
	const tray = await page.getByRole('region', { name: 'Comparison tray' }).boundingBox();
	const toTop = await page.getByRole('button', { name: 'Back to top' }).boundingBox();
	console.log('tray box:', JSON.stringify(tray));
	console.log('backToTop box:', JSON.stringify(toTop));
	const overlap =
		tray &&
		toTop &&
		!(toTop.y >= tray.y + tray.height || toTop.y + toTop.height <= tray.y) &&
		!(toTop.x >= tray.x + tray.width || toTop.x + toTop.width <= tray.x);
	console.log('OVERLAP:', overlap ? 'YES' : 'NO');
	console.log('gap px (backToTop bottom edge to tray top edge):', tray && toTop ? tray.y - (toTop.y + toTop.height) : null);
	await page.screenshot({ path: 'qa/shots/compare-tray-backtotop-mobile.png' });
	await browser.close();
	if (overlap) process.exit(1);
} finally {
	server.kill();
}
