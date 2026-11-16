import { expect, test } from '@playwright/test';

test('home loads in English with hero and best sellers', async ({ page }) => {
	await page.goto('/en');
	await expect(page.locator('h1').first()).toContainText('Technology');
	await expect(page.getByRole('heading', { name: 'Browse by category' })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Best sellers' })).toBeVisible();
	await expect(page.getByRole('link', { name: /iPhone 15 Pro/ }).first()).toBeVisible();
});

test('add to cart opens the drawer and persists across reload', async ({ page }) => {
	await page.goto('/en');
	const card = page.locator('article', { hasText: 'iPhone 15 Pro' }).first();
	await card.getByRole('button', { name: 'Add to cart' }).click();
	await expect(page.getByRole('dialog', { name: 'Your cart' })).toBeVisible();
	await expect(page.getByRole('dialog', { name: 'Your cart' })).toContainText('iPhone 15 Pro');
	await page.keyboard.press('Escape');
	await page.reload();
	await expect(page.getByRole('link', { name: /Cart, 1 item/ })).toBeVisible();
	await page.goto('/en/cart');
	await expect(page.locator('main')).toContainText('iPhone 15 Pro');
	await expect(page.locator('main')).toContainText('999.00 DA');
});

test('language switch preserves the route and query', async ({ page }) => {
	await page.goto('/en/shop?category=audio');
	await expect(page.locator('h1')).toContainText('Shop');
	await page.getByRole('link', { name: 'Switch to Français' }).first().click();
	await expect(page).toHaveURL(/\/fr\/shop\?category=audio/);
	await expect(page.locator('h1')).toContainText('Boutique');
	await expect(page.locator('main')).toContainText('2 produits');
});

test('shop category filter and search work', async ({ page }) => {
	await page.goto('/en/shop');
	await page.getByRole('link', { name: 'Audio', exact: true }).click();
	await expect(page.locator('main')).toContainText('2 products');
	await expect(page.locator('main')).toContainText('AirPods Pro');
	await expect(page.locator('main')).not.toContainText('iPhone 15 Pro');
	await page.getByRole('link', { name: 'All categories' }).click();
	await page.locator('#shop-search').fill('watch');
	await expect(page.locator('main')).toContainText('2 products');
	await expect(page.locator('main')).toContainText('Galaxy Watch 6');
});

test('product page quantity math shows in the drawer', async ({ page }) => {
	await page.goto('/en/product/iphone-15-pro');
	await page.getByRole('button', { name: 'Quantity: 2' }).click();
	await page.getByRole('button', { name: 'Add to cart' }).first().click();
	await expect(page.getByRole('dialog', { name: 'Your cart' })).toContainText('1,998.00 DA');
});

test('contact form validates and shows a local success state', async ({ page }) => {
	await page.goto('/en/contact');
	await page.getByRole('button', { name: 'Send message' }).click();
	await expect(page.locator('#contact-name-error')).toBeVisible();
	await page.locator('#contact-name').fill('Aya Test');
	await page.locator('#contact-email').fill('aya@example.com');
	await page.locator('#contact-message').fill('Hello, I have a question.');
	await page.getByRole('button', { name: 'Send message' }).click();
	await expect(page.locator('main')).toContainText('Message sent');
	await expect(page.locator('main')).toContainText('Aya Test');
});

test('newsletter validates email locally', async ({ page }) => {
	await page.goto('/en');
	const footer = page.locator('footer');
	await page.locator('#newsletter-email').fill('not-an-email');
	await footer.getByRole('button', { name: 'Subscribe' }).click();
	await expect(page.locator('#newsletter-error')).toBeVisible();
	await page.locator('#newsletter-email').fill('aya@example.com');
	await footer.getByRole('button', { name: 'Subscribe' }).click();
	await expect(page.locator('#newsletter-success')).toBeVisible();
});

test('home newsletter band validates email locally', async ({ page }) => {
	await page.goto('/en');
	await page.locator('#newsletter-home-email').fill('not-an-email');
	await page.locator('main').getByRole('button', { name: 'Subscribe' }).click();
	await expect(page.locator('#newsletter-home-error')).toBeVisible();
	await page.locator('#newsletter-home-email').fill('aya@example.com');
	await page.locator('main').getByRole('button', { name: 'Subscribe' }).click();
	await expect(page.locator('#newsletter-home-success')).toBeVisible();
});

test('cart live region announces the added product', async ({ page }) => {
	await page.goto('/en');
	const card = page.locator('article', { hasText: 'iPhone 15 Pro' }).first();
	await card.getByRole('button', { name: 'Add to cart' }).click();
	await expect(page.getByRole('status').first()).toContainText(
		'Added iPhone 15 Pro to your cart.'
	);
});

test('contact error summary appears, takes focus and links to fields', async ({ page }) => {
	await page.goto('/en/contact');
	await page.getByRole('button', { name: 'Send message' }).click();
	const summary = page.getByRole('alert');
	await expect(summary).toBeVisible();
	await expect(summary).toContainText('Please correct the following errors:');
	await expect(summary).toBeFocused();
	await page.getByRole('link', { name: 'Full name' }).click();
	await expect(page.locator('#contact-name')).toBeFocused();
});
