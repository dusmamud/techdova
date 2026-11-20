import { expect, test } from '@playwright/test';

// Elevation round 2 — B2 commerce features (H4/H5/H6/H8, M5/M8/M9/M10,
// G-03/G-04). H7 (free-delivery progress bar) is deliberately NOT built:
// shipping copy already promises free delivery on all orders.

test('PDP shows a price-per-GB line for storage variants', async ({ page }) => {
	await page.goto('/en/product/iphone-15-pro');
	const perGb = page.getByTestId('price-per-gb');
	await expect(perGb).toBeVisible();
	await expect(perGb).toHaveText(/^\d+[.,]\d{2} DA\/GB$/);
	// Switching storage variant recomputes the line (512 GB is cheaper per GB).
	await page.getByRole('button', { name: /512 GB/ }).first().click();
	await expect(perGb).toHaveText(/^\d+[.,]\d{2} DA\/GB$/);
	await expect(perGb).not.toHaveText('3.90 DA/GB');
});

test('gifting options on the PDP flow into the cart drawer and cart page', async ({
	page
}) => {
	await page.goto('/en/product/iphone-15-pro');
	await page.getByLabel('Gift wrap (free, demo)').check();
	await page.getByLabel('Gift message').fill('Happy birthday!');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();
	const drawer = page.getByRole('dialog', { name: 'Your cart' });
	await expect(drawer).toBeVisible();
	await expect(drawer.getByTestId('gift-line')).toContainText('Gift wrap + message');
	await expect(drawer.getByTestId('gift-line')).toContainText('Happy birthday!');
	await page.keyboard.press('Escape');
	await page.goto('/en/cart');
	await expect(page.getByTestId('gift-line')).toContainText('Gift wrap + message');
	await expect(page.getByTestId('gift-line')).toContainText('Happy birthday!');
});

test('staff replies are styled distinctly and review photos open a lightbox', async ({
	page
}) => {
	await page.goto('/en/product/iphone-15-pro');
	const reply = page.getByTestId('staff-reply').first();
	await expect(reply).toBeVisible();
	await expect(reply).toContainText('TechDova team');
	// Reviewer photos reuse product images (demo) and navigate across reviews.
	await page.getByRole('button', { name: 'Reviewer photo 1' }).first().click();
	const lightbox = page.getByRole('dialog', { name: /Reviewer photo 1 of/ });
	await expect(lightbox).toBeVisible();
	await lightbox.getByRole('button', { name: 'Next image' }).click();
	await expect(page.getByRole('dialog', { name: /Reviewer photo 2 of/ })).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(lightbox).toBeHidden();
});

test('price alert can be set on the PDP and is listed in the account', async ({ page }) => {
	await page.goto('/en/product/iphone-15-pro');
	await page.locator('#price-alert-target').fill('800');
	await page.getByRole('button', { name: 'Set price alert (demo)' }).click();
	await expect(page.getByTestId('price-alert')).toContainText(
		'Price alert active below 800.00 DA.'
	);
	await page.goto('/en/account');
	await page.locator('#account-name').fill('Demo User');
	await page.locator('#account-email').fill('demo@example.com');
	await page.getByRole('button', { name: 'Sign in (demo)' }).click();
	const list = page.getByTestId('price-alerts-list');
	await expect(list).toContainText('iPhone 15 Pro');
	await expect(list).toContainText('Alert below 800.00 DA');
});

test('extended-warranty upsell shows near the PDP buy box', async ({ page }) => {
	await page.goto('/en/product/iphone-15-pro');
	const upsell = page.getByTestId('warranty-upsell');
	await expect(upsell).toBeVisible();
	await expect(upsell).toContainText('Protect your purchase');
	await page.getByRole('button', { name: /Add extended warranty/ }).click();
	await expect(upsell).toContainText('Extended warranty added');
});

test('typo query shows "did you mean" and keeps the query in the box', async ({
	page
}) => {
	await page.goto('/en/search?q=iphnoe');
	const input = page.locator('#search-page-input');
	await expect(input).toHaveValue('iphnoe');
	const suggestion = page.getByTestId('did-you-mean');
	await expect(suggestion).toContainText('Did you mean “iphone”?');
	await suggestion.getByRole('button', { name: 'Search for “iphone”' }).click();
	await expect(page.locator('main')).toContainText('iPhone 15 Pro');
	await expect(input).toHaveValue('iphone');
});

test('order confirmation offers a one-password demo account creation', async ({
	page
}) => {
	await page.goto('/en/product/iphone-15-pro');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();
	await expect(page.getByRole('dialog', { name: 'Your cart' })).toBeVisible();
	await page.keyboard.press('Escape');
	await page.goto('/en/checkout');
	await page.locator('#checkout-name').fill('Demo User');
	await page.locator('#checkout-email').fill('demo@example.com');
	await page.getByRole('button', { name: 'Continue' }).click();
	await expect(page.getByTestId('step-summary-1')).toContainText('Demo User');
	await page.locator('#checkout-address').fill('12 Rue Didouche');
	await page.locator('#checkout-city').fill('Algiers');
	await page.locator('#checkout-postal').fill('16000');
	await page.getByRole('button', { name: 'Continue' }).click();
	await expect(page.getByTestId('step-summary-2')).toContainText('Algiers');
	await page.locator('#checkout-card-number').fill('4242424242424242');
	await page.locator('#checkout-expiry').fill('12/28');
	await page.locator('#checkout-cvc').fill('123');
	await page.getByRole('button', { name: 'Place order (demo)' }).click();
	await expect(page.locator('h1')).toContainText('Order placed');
	const createAccount = page.getByTestId('create-account');
	await expect(createAccount).toBeVisible();
	await createAccount.locator('#create-account-password').fill('demo-pass-123');
	await createAccount.locator('#create-account-confirm-password').fill('demo-pass-123');
	await createAccount.getByRole('button', { name: 'Create demo account' }).click();
	await expect(createAccount).toContainText('Demo account created on this device');
});

test('MacBook Air M2 has a third gallery image', async ({ page }) => {
	await page.goto('/en/product/macbook-air-m2');
	await expect(
		page.getByRole('button', { name: 'View image 3' }).first()
	).toBeVisible();
});

test('PDP mobile shows dots but not thumbnails below lg', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/en/product/iphone-15-pro');
	// Role locators only see the accessibility tree: the thumbnail strip
	// is display:none below lg, so exactly one "View image 1" button —
	// the dot — is exposed and visible.
	const navButtons = page.getByRole('button', { name: 'View image 1' });
	await expect(navButtons).toHaveCount(1);
	await expect(navButtons.first()).toBeVisible();
	// The thumbnail strip itself is hidden at this width.
	await expect(page.locator('div.mt-3.hidden button').first()).toBeHidden();
});
