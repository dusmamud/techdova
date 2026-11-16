import { expect, test } from '@playwright/test';

// Polish round: responsive grids, filter drawer, category sort, track-order
// deep links, the five new routes and reduced-motion reveal behaviour.
// English/French strings below are copied from src/lib/i18n/en.ts / fr.ts.

test('shop grid is exactly 2 columns at 390px with no card overflowing', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/en/shop');
	const cards = page.locator('main article');
	await expect(cards).toHaveCount(12);
	const boxes = await cards.evaluateAll((els) =>
		els.map((el) => {
			const rect = el.getBoundingClientRect();
			return { top: rect.top, left: rect.left, right: rect.right };
		})
	);
	const firstTop = boxes[0].top;
	const firstRow = boxes.filter((box) => Math.abs(box.top - firstTop) <= 2);
	expect(firstRow).toHaveLength(2);
	expect(boxes[2].top).toBeGreaterThan(firstTop + 50);
	for (const box of boxes) {
		expect(box.left).toBeGreaterThanOrEqual(0);
		expect(box.right).toBeLessThanOrEqual(390);
	}
});

test('filter drawer Apply flow on mobile: pick a category, apply, results change', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/en/shop');
	await expect(page.locator('main')).toContainText('12 products');

	await page.getByRole('button', { name: 'Filters', exact: true }).click();
	const dialog = page.getByRole('dialog', { name: 'Filters' });
	await expect(dialog).toBeVisible();
	await dialog.getByRole('button', { name: 'Audio', exact: true }).click();
	await dialog.getByRole('button', { name: 'Show 2 results' }).click();

	await expect(dialog).toHaveCount(0);
	await expect(page).toHaveURL(/category=audio/);
	await expect(page.locator('main')).toContainText('2 products');
	await expect(page.locator('main')).toContainText('AirPods Pro');
	await expect(page.locator('main')).not.toContainText('iPhone 15 Pro');
});

test('category sort: price high-to-low puts the dearer product first', async ({ page }) => {
	await page.goto('/en/category/audio');
	const cards = page.locator('main article');
	await expect(cards).toHaveCount(2);
	await expect(cards.first()).toContainText('AirPods Pro');

	await page.locator('#category-filter-bar-sort').selectOption('price-desc');
	await expect(cards.first()).toContainText('Sony WH-1000XM5');
	await expect(cards.nth(1)).toContainText('AirPods Pro');

	await page.locator('#category-filter-bar-sort').selectOption('price-asc');
	await expect(cards.first()).toContainText('AirPods Pro');
});

test('track-order ?code= prefill: seeded demo order shows its timeline without typing', async ({
	page
}) => {
	await page.goto('/en/track-order');
	await page.evaluate(() => {
		const order = {
			id: 'TD-TEST123',
			placedAtISO: new Date().toISOString(),
			name: 'Aya Test',
			email: 'aya@example.com',
			lines: [{ slug: 'iphone-15-pro', qty: 1, unitPrice: 999 }],
			total: 999
		};
		localStorage.setItem('techdova-orders', JSON.stringify([order]));
	});

	await page.goto('/en/track-order?code=TD-TEST123');
	await expect(page.locator('#track-code')).toHaveCount(0);
	await expect(page.locator('main')).toContainText('Order TD-TEST123');
	await expect(page.locator('main')).toContainText('Order items');
	await expect(page.locator('main')).toContainText('iPhone 15 Pro');
	await expect(page.getByRole('list', { name: 'Delivery timeline' })).toBeVisible();
});

test('track-order ?code=BOGUS shows the demo not-found note and a sample timeline', async ({
	page
}) => {
	await page.goto('/en/track-order?code=BOGUS');
	await expect(page.locator('main')).toContainText('Order BOGUS');
	await expect(page.locator('main')).toContainText('No order was found for this code');
	await expect(page.getByRole('list', { name: 'Delivery timeline' })).toBeVisible();
});

const NEW_PAGES = [
	{
		route: 'stores',
		en: { h1: 'Our stores', key: 'All cities' },
		fr: { h1: 'Nos boutiques', key: 'Toutes les villes' }
	},
	{
		route: 'gift-cards',
		en: { h1: 'Gift cards', key: 'Check a gift-card balance' },
		fr: { h1: 'Cartes cadeaux', key: 'DEMO-1000' }
	},
	{
		route: 'help',
		en: { h1: 'Help centre', key: 'Browse help topics' },
		fr: { h1: 'Centre d', key: 'Parcourir les rubriques' }
	},
	{
		route: 'new-arrivals',
		en: { h1: 'New arrivals', key: 'latest tech to land' },
		fr: { h1: 'Nouveautés', key: 'dernières technologies' }
	},
	{
		route: 'best-sellers',
		en: { h1: 'Best sellers', key: 'most-loved products' },
		fr: { h1: 'Meilleures ventes', key: 'les plus appréciés' }
	}
] as const;

const NOT_FOUND_TITLES = ['Page not found', 'Page introuvable'];

for (const locale of ['en', 'fr'] as const) {
	for (const entry of NEW_PAGES) {
		test(`new page /${locale}/${entry.route} returns 200 with h1 and key content`, async ({
			page
		}) => {
			const response = await page.goto(`/${locale}/${entry.route}`);
			expect(response?.status()).toBe(200);
			const lang = await page.evaluate(() => document.documentElement.lang);
			expect(lang).toBe(locale);
			const h1 = page.locator('main h1').first();
			await expect(h1).toBeVisible();
			await expect(h1).toContainText(entry[locale].h1);
			await expect(page.locator('main')).toContainText(entry[locale].key);
			for (const title of NOT_FOUND_TITLES) {
				await expect(page.locator('main')).not.toContainText(title);
			}
		});
	}
}

test('reveal content is fully visible under reduced motion without scrolling', async ({
	page
}) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/en');
	const section = page.locator('section[aria-labelledby="brand-story-heading"]');
	await expect(section).toBeAttached();
	// The section sits below the fold and the page has not been scrolled.
	const scrollY = await page.evaluate(() => window.scrollY);
	expect(scrollY).toBe(0);
	const box = await section.boundingBox();
	expect(box).not.toBeNull();
	expect(box!.y).toBeGreaterThan(720);
	// No reveal-hidden state anywhere, and the section is fully opaque.
	const hiddenCount = await page.evaluate(
		() => document.querySelectorAll('.reveal:not(.reveal-visible)').length
	);
	expect(hiddenCount).toBe(0);
	const style = await section.evaluate((el) => {
		const computed = getComputedStyle(el);
		return { opacity: computed.opacity, transform: computed.transform };
	});
	expect(style.opacity).toBe('1');
	expect(style.transform).toBe('none');
});
