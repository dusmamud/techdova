import { expect, test } from '@playwright/test';

// Gap-filling round: every new route + the interactive flows built with them.
// English strings below are copied from src/lib/i18n/en.ts.

const NEW_ROUTES = [
	'checkout',
	'order-confirmation',
	'faq',
	'shipping',
	'returns',
	'payment',
	'category/audio',
	'search',
	'wishlist',
	'testimonials',
	'account',
	'track-order',
	'compare',
	'deals',
	'blog',
	'blog/choosing-noise-cancelling-headphones',
	'sitemap',
	'accessibility'
] as const;

const NOT_FOUND_TITLES = ['Page not found', 'Page introuvable'];

for (const locale of ['en', 'fr'] as const) {
	for (const route of NEW_ROUTES) {
		test(`new route /${locale}/${route} returns 200 with lang=${locale} and a visible h1`, async ({
			page
		}) => {
			const response = await page.goto(`/${locale}/${route}`);
			expect(response?.status()).toBe(200);
			const lang = await page.evaluate(() => document.documentElement.lang);
			expect(lang).toBe(locale);
			const h1 = page.locator('main h1').first();
			await expect(h1).toBeVisible();
			await expect(h1).toHaveText(/\S/);
			for (const title of NOT_FOUND_TITLES) {
				await expect(page.locator('main')).not.toContainText(title);
			}
		});
	}
}

test('checkout demo flow places an order, clears the cart and persists across reload', async ({
	page
}) => {
	await page.goto('/en');
	const card = page.locator('article', { hasText: 'iPhone 15 Pro' }).first();
	await card.getByRole('button', { name: 'Add to cart' }).click();
	await expect(page.getByRole('dialog', { name: 'Your cart' })).toBeVisible();
	await page.keyboard.press('Escape');

	await page.goto('/en/cart');
	await expect(page.locator('main')).toContainText('iPhone 15 Pro');
	await page.locator('main').getByRole('link', { name: 'Checkout (demo)' }).click();
	await expect(page.locator('main h1')).toContainText('Checkout');

	await page.locator('#checkout-name').fill('Aya Test');
	await page.locator('#checkout-email').fill('aya@example.com');
	await page.getByRole('button', { name: 'Continue' }).click();
	await expect(page.locator('#checkout-address')).toBeVisible();

	await page.locator('#checkout-address').fill('12 Rue Didouche Mourad');
	await page.locator('#checkout-city').fill('Algiers');
	await page.locator('#checkout-postal').fill('16000');
	await page.getByRole('button', { name: 'Continue' }).click();
	await expect(page.getByRole('radio', { name: /Cash on delivery/ })).toBeVisible();

	await page.getByRole('radio', { name: /Cash on delivery/ }).click();
	await page.getByRole('button', { name: 'Place order (demo)' }).click();

	const main = page.locator('main');
	await expect(main).toContainText('Order placed — thank you!');
	await expect(main).toContainText(/TD-[0-9A-Z]+/);
	const orderId = (await main.innerText()).match(/TD-[0-9A-Z]+/)?.[0];
	expect(orderId).toBeTruthy();
	// Cart is empty: the header cart link loses its item count.
	await expect(
		page.locator('header').getByRole('link', { name: 'Cart', exact: true })
	).toBeVisible();

	await page.reload();
	await expect(page.locator('main')).toContainText(orderId!);
	await expect(page.locator('main')).toContainText('iPhone 15 Pro');
});

test('wishlist flow: heart a product, see it on /wishlist, move it to the cart', async ({
	page
}) => {
	await page.goto('/en');
	const card = page.locator('article', { hasText: 'iPhone 15 Pro' }).first();
	await card
		.getByRole('button', { name: 'Add to wishlist (iPhone 15 Pro)' })
		.click();

	await page.goto('/en/wishlist');
	await expect(page.locator('main')).toContainText('Your wishlist');
	await expect(page.locator('main')).toContainText('iPhone 15 Pro');
	await page.getByRole('button', { name: 'Move iPhone 15 Pro to cart' }).click();

	await page.goto('/en/cart');
	await expect(page.locator('main')).toContainText('iPhone 15 Pro');
});

test('compare flow: toggle two products, tray appears, compare table, clear all', async ({
	page
}) => {
	await page.goto('/en/shop');
	const iphone = page.locator('article', { hasText: 'iPhone 15 Pro' }).first();
	await iphone.getByRole('button', { name: 'Add to compare (iPhone 15 Pro)' }).click();
	const galaxy = page.locator('article', { hasText: 'Samsung Galaxy S24' }).first();
	await galaxy.getByRole('button', { name: 'Add to compare (Samsung Galaxy S24)' }).click();

	const tray = page.getByRole('region', { name: 'Comparison tray' });
	await expect(tray).toBeVisible();
	await expect(tray).toContainText('2 products to compare');
	await tray.getByRole('link', { name: 'Compare now' }).click();

	await expect(page.locator('main h1')).toContainText('Compare products');
	const table = page.locator('main table');
	await expect(table).toContainText('iPhone 15 Pro');
	await expect(table).toContainText('Samsung Galaxy S24');

	await page.getByRole('button', { name: 'Clear all' }).click();
	await expect(page.locator('main')).toContainText('Nothing to compare yet');
});

test('FAQ accordion opens answers and stays multi-open', async ({ page }) => {
	const firstQuestion = 'How much does delivery cost, and how fast is it?';
	const secondQuestion = 'How do I return a product?';

	async function panelHeight(question: string): Promise<number> {
		const button = page.getByRole('button', { name: question });
		const panelId = await button.getAttribute('aria-controls');
		return page.evaluate((id) => document.getElementById(id!)?.clientHeight ?? 0, panelId);
	}

	await page.goto('/en/faq');
	const firstButton = page.getByRole('button', { name: firstQuestion });
	const secondButton = page.getByRole('button', { name: secondQuestion });
	await expect(firstButton).toHaveAttribute('aria-expanded', 'false');

	await firstButton.click();
	await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
	await expect
		.poll(async () => panelHeight(firstQuestion))
		.toBeGreaterThan(40);
	await expect(page.locator('main')).toContainText('Delivery is free on all demo orders');

	await secondButton.click();
	await expect(secondButton).toHaveAttribute('aria-expanded', 'true');
	await expect
		.poll(async () => panelHeight(secondQuestion))
		.toBeGreaterThan(40);
	// Multi-open: the first answer stays open.
	await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
	await expect
		.poll(async () => panelHeight(firstQuestion))
		.toBeGreaterThan(40);
});

test('search page: ?q= results, popular chips with no query, live filtering', async ({
	page
}) => {
	await page.goto('/en/search?q=watch');
	await expect(page.locator('main')).toContainText('2 results for "watch"');
	await expect(page.locator('main')).toContainText('Samsung Galaxy Watch 6');

	await page.goto('/en/search');
	await expect(page.getByRole('heading', { name: 'Popular searches' })).toBeVisible();
	for (const term of ['iPhone', 'headphones', 'laptop', 'smartwatch']) {
		await expect(page.getByRole('button', { name: term, exact: true })).toBeVisible();
	}

	await page.locator('#search-page-input').fill('watch');
	await expect(page.locator('main')).toContainText('2 results for "watch"');
	await expect(page.locator('main')).toContainText('Samsung Galaxy Watch 6');
	await page.locator('#search-page-input').fill('iphone');
	await expect(page.locator('main')).toContainText('1 result for "iphone"');
	await expect(page.locator('main')).toContainText('iPhone 15 Pro');
	await expect(page.locator('main')).not.toContainText('Samsung Galaxy Watch 6');
});

test('tracking: unknown code shows a generic demo timeline', async ({ page }) => {
	await page.goto('/en/track-order');
	await expect(page.locator('main h1')).toContainText('Track your order');
	await expect(page.locator('#track-code')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Track order' })).toBeVisible();

	await page.locator('#track-code').fill('TD-UNKNOWN123');
	await page.getByRole('button', { name: 'Track order' }).click();

	await expect(page.locator('main')).toContainText('Order TD-UNKNOWN123');
	await expect(page.getByRole('list', { name: 'Delivery timeline' })).toBeVisible();
	await expect(page.locator('main')).toContainText('Demo tracking:');
	await expect(page.locator('main')).toContainText('Shipped');
});

test('account: demo sign-in shows a greeting, sign-out returns to the form', async ({
	page
}) => {
	await page.goto('/en/account');
	await expect(page.getByRole('heading', { name: 'Sign in (demo)' })).toBeVisible();

	await page.locator('#account-name').fill('Aya Test');
	await page.locator('#account-email').fill('aya@example.com');
	await page.getByRole('button', { name: 'Sign in (demo)' }).click();

	await expect(page.locator('main')).toContainText('Hello, Aya Test');
	await expect(page.locator('main')).toContainText('Signed in as aya@example.com');

	await page.getByRole('button', { name: 'Sign out' }).click();
	await expect(page.getByRole('heading', { name: 'Sign in (demo)' })).toBeVisible();
	await expect(page.locator('#account-name')).toBeVisible();
});

test('category page lists 2 products with a breadcrumb; unknown category is a 404', async ({
	page
}) => {
	await page.goto('/en/category/audio');
	await expect(page.locator('main h1')).toContainText('Audio');
	await expect(page.locator('main')).toContainText('2 products');
	await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
	await expect(page.locator('main article')).toHaveCount(2);
	await expect(page.locator('main')).toContainText('AirPods Pro');
	await expect(page.locator('main')).toContainText('Sony WH-1000XM5');

	const response = await page.goto('/en/category/nope');
	expect(response?.status()).toBe(404);
	await expect(page.locator('main')).toContainText('Page not found');
});

test('deals page shows a countdown timer and a non-empty discounted grid', async ({
	page
}) => {
	await page.goto('/en/deals');
	await expect(page.locator('main h1')).toContainText('Deals');
	const timer = page.getByRole('timer');
	await expect(timer).toBeVisible();
	for (const label of ['Days', 'Hours', 'Min', 'Sec']) {
		await expect(timer).toContainText(label);
	}
	await expect(page.locator('main')).toContainText('12 deals');
	await expect(page.locator('main article')).toHaveCount(12);
});

test('blog: index lists 3 posts; a post page shows body and prev/next links', async ({
	page
}) => {
	await page.goto('/en/blog');
	await expect(page.locator('main h1')).toContainText('TechDova blog');
	await expect(page.locator('main article')).toHaveCount(3);
	await expect(page.locator('main')).toContainText('How to choose noise-cancelling headphones');
	await expect(page.locator('main')).toContainText('Laptop buying guide: what matters in 2026');
	await expect(page.locator('main')).toContainText('Smartwatch health features, explained simply');

	await page.goto('/en/blog/laptop-buying-guide-2026');
	await expect(page.locator('main h1')).toContainText('Laptop buying guide: what matters in 2026');
	await expect(page.locator('main')).toContainText(
		'Buying a laptop in 2026 is easier than it looks'
	);
	await expect(page.getByRole('link', { name: /Previous article/ })).toBeVisible();
	await expect(page.getByRole('link', { name: /Next article/ })).toBeVisible();
});

test('QuickView: opens from a product card, Escape closes, focus returns', async ({
	page
}) => {
	await page.goto('/en/shop');
	const card = page.locator('article', { hasText: 'iPhone 15 Pro' }).first();
	const quickViewButton = card.getByRole('button', { name: 'Quick view (iPhone 15 Pro)' });
	// The Quick view button only becomes tappable on card hover.
	await card.hover();
	await quickViewButton.click();

	const dialog = page.getByRole('dialog', { name: 'iPhone 15 Pro' });
	await expect(dialog).toBeVisible();
	await expect(dialog).toContainText('999.00 DA');

	await page.keyboard.press('Escape');
	await expect(dialog).toHaveCount(0);
	await expect(quickViewButton).toBeFocused();
});

test('header autocomplete: typing shows product suggestions, Escape closes them', async ({
	page
}) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/en');
	await page.locator('#header-search').fill('watch');

	const listbox = page.locator('#header-search-listbox');
	await expect(listbox).toBeVisible();
	const options = listbox.getByRole('option');
	await expect(options).toHaveCount(2);
	await expect(listbox).toContainText('Samsung Galaxy Watch 6');

	await page.keyboard.press('Escape');
	await expect(listbox).toHaveCount(0);
});

test('order-confirmation with empty storage shows an empty state and a shop link', async ({
	page
}) => {
	const response = await page.goto('/en/order-confirmation');
	expect(response?.status()).toBe(200);
	await expect(page.locator('main h1')).toContainText('No recent order found');
	await expect(
		page.locator('main').getByRole('link', { name: 'Continue shopping' })
	).toBeVisible();
	await expect(page.locator('main')).not.toContainText('TD-');
});
