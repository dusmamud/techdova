import { expect, test, type Page } from '@playwright/test';

// Interactive tests need a hydrated page: in dev the client bundle takes a
// moment to load, and a click before hydration is a silent no-op. Waiting
// for network idle (bounded) plus a short settle covers both dev and the
// fast prerendered build in CI.
async function gotoHydrated(page: Page, url: string): Promise<void> {
	await page.goto(url);
	await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
	await page.waitForTimeout(500);
}

const newPages: { path: string; h1: string }[] = [
	{ path: '/en/categories', h1: 'All categories' },
	{ path: '/en/outlet', h1: 'Outlet' },
	{ path: '/en/gift-finder', h1: 'Gift finder' },
	{ path: '/en/guides', h1: 'Buying guides' },
	{ path: '/en/price-match', h1: 'Price match promise' },
	{ path: '/en/student', h1: 'Student discount' },
	{ path: '/en/business', h1: 'TechDova for business' },
	{ path: '/en/repairs', h1: 'Repairs and service' }
];

for (const { path, h1 } of newPages) {
	test(`${path} loads with its h1`, async ({ page }) => {
		await page.goto(path);
		await expect(page.locator('h1')).toContainText(h1);
		await expect(page.locator('main')).toBeVisible();
	});
}

test('new pages load in French too', async ({ page }) => {
	await page.goto('/fr/categories');
	await expect(page.locator('h1')).toContainText('Toutes les catégories');
	await page.goto('/fr/outlet');
	await expect(page.locator('h1')).toContainText('Outlet');
	await page.goto('/fr/repairs');
	await expect(page.locator('h1')).toContainText('Réparations et service');
});

test('categories page links to a category page', async ({ page }) => {
	await page.goto('/en/categories');
	await expect(page.locator('main')).toContainText('6 categories');
	await page.getByRole('link', { name: /Shop Smartphones/ }).click();
	await expect(page).toHaveURL(/\/en\/category\/smartphones/);
	await expect(page.locator('h1')).toContainText('Smartphones');
});

test('outlet filter narrows to refurbished items', async ({ page }) => {
	await gotoHydrated(page, '/en/outlet');
	await expect(page.locator('main')).toContainText('10 outlet items');
	await page.getByRole('button', { name: 'Refurbished', exact: true }).click();
	await expect(page.locator('main')).toContainText('3 outlet items');
	await expect(page.locator('main')).toContainText('Galaxy S24');
	await page.getByRole('button', { name: 'All outlet items' }).click();
	await expect(page.locator('main')).toContainText('10 outlet items');
});

test('gift finder quiz returns recommendations', async ({ page }) => {
	await gotoHydrated(page, '/en/gift-finder');
	await page.getByRole('button', { name: 'Start the quiz' }).click();
	for (let q = 1; q <= 7; q++) {
		await expect(page.locator('main')).toContainText(`Question ${q} of 7`);
		// Pick the first option each time: budget under 200 DA, music,
		// beginner, birthday, Apple, battery life.
		await page.locator('fieldset button').first().click();
		if (q < 7) {
			await page.getByRole('button', { name: 'Next' }).click();
		} else {
			await page.getByRole('button', { name: 'See my gift ideas' }).click();
		}
	}
	await expect(page.locator('main')).toContainText('Your gift ideas');
	await expect(page.locator('main')).toContainText('Why this fits');
	await expect(page.locator('main article').first()).toBeVisible();
	// Retake resets to the intro.
	await page.getByRole('button', { name: 'Retake the quiz' }).click();
	await expect(page.locator('main')).toContainText('Find a gift in under a minute');
});

test('gift finder with a wide budget returns several recommendations', async ({ page }) => {
	await gotoHydrated(page, '/en/gift-finder');
	await page.getByRole('button', { name: 'Start the quiz' }).click();
	const picks = ['Myself', 'Over 1,000 DA', 'Music', 'Expert', 'Birthday', 'Any brand', 'Sound quality'];
	for (let q = 0; q < 7; q++) {
		await page.locator('fieldset button', { hasText: picks[q] }).click();
		if (q < 6) {
			await page.getByRole('button', { name: 'Next' }).click();
		} else {
			await page.getByRole('button', { name: 'See my gift ideas' }).click();
		}
	}
	await expect(page.locator('main')).toContainText('Your gift ideas');
	await expect(page.locator('main article').nth(2)).toBeVisible();
});

test('guides hub links guides and categories', async ({ page }) => {
	await page.goto('/en/guides');
	await expect(page.locator('h1')).toContainText('Buying guides');
	await expect(page.getByRole('link', { name: 'How to choose noise-cancelling headphones' }).first()).toBeVisible();
	await page.getByRole('link', { name: 'Read the guide' }).first().click();
	await expect(page).toHaveURL(/\/en\/blog\/choosing-noise-cancelling-headphones/);
});

test('repairs booking flow completes (demo)', async ({ page }) => {
	await gotoHydrated(page, '/en/repairs');
	// Empty submit shows the validation error.
	await page.getByRole('button', { name: 'Book my slot' }).click();
	await expect(page.getByRole('alert')).toBeVisible();
	await page.locator('#repairs-device').selectOption('iphone-15-pro');
	await page.getByRole('button', { name: 'Screen repair' }).click();
	await page.locator('fieldset:has(legend:text-is("Choose a day")) button').first().click();
	await page.getByRole('button', { name: /^\d{2}:\d{2}$/ }).first().click();
	await page.locator('#repairs-name').fill('Aya Test');
	await page.locator('#repairs-email').fill('aya@example.com');
	await page.getByRole('button', { name: 'Book my slot' }).click();
	await expect(page.locator('main')).toContainText('Demo booking confirmed');
	await expect(page.locator('main')).toContainText(/TD-R-\d{6}/);
	// Booking another slot resets the form.
	await page.getByRole('button', { name: 'Book another slot' }).click();
	await expect(page.locator('main')).toContainText('Book a service slot');
});

const storePages: { path: string; h1: string }[] = [
	{ path: '/en/stores/algiers-centre', h1: 'TechDova Algiers Centre' },
	{ path: '/en/stores/oran-front-de-mer', h1: 'TechDova Oran Front de Mer' },
	{ path: '/en/stores/constantine-centre', h1: 'TechDova Constantine Centre' }
];

for (const { path, h1 } of storePages) {
	test(`store detail ${path} loads`, async ({ page }) => {
		await page.goto(path);
		await expect(page.locator('h1')).toContainText(h1);
		await expect(page.locator('main')).toContainText('Opening hours');
		await expect(page.locator('main')).toContainText('Services at this store');
		await expect(page.locator('main')).toContainText('In-store pickup');
	});
}

test('store detail page loads in French', async ({ page }) => {
	await page.goto('/fr/stores/algiers-centre');
	await expect(page.locator('h1')).toContainText('TechDova Alger Centre');
	await expect(page.locator('main')).toContainText('Horaires d’ouverture');
});

test('html sitemap links the new pages', async ({ page }) => {
	await page.goto('/en/sitemap');
	for (const href of ['/en/categories', '/en/outlet', '/en/gift-finder', '/en/guides', '/en/price-match', '/en/student', '/en/business', '/en/repairs', '/en/stores/algiers-centre']) {
		await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
	}
});
