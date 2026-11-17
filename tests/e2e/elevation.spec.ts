import { expect, test, type Page } from '@playwright/test';

// Elevation round: fly-to-cart, mega menu, dark mode, PDP variants/gallery,
// promo codes, cookie consent, live chat, the six new pages, brand facets,
// the upgraded 404, drawer parity and the cart-return nudge. English/French
// strings below are copied from src/lib/i18n/en.ts / fr.ts.

// The cookie banner overlays the bottom of every fresh page; tests that do
// not exercise consent itself pre-accept it so clicks are never intercepted.
async function suppressCookieBanner(page: Page): Promise<void> {
	await page.addInitScript(() => {
		try {
			localStorage.setItem('techdova-cookie-consent', 'accepted');
		} catch {
			// Storage unavailable: the banner may still show.
		}
	});
}

test('fly-to-cart completes and the cart count increments', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.goto('/en');
	const card = page.locator('article', { hasText: 'iPhone 15 Pro' }).first();
	await card.getByRole('button', { name: 'Add to cart' }).click();
	// The flight clone exists briefly, then is removed when the flight ends.
	await expect(page.locator('body > img[aria-hidden="true"]')).toHaveCount(1, {
		timeout: 1500
	});
	await expect(page.locator('body > img[aria-hidden="true"]')).toHaveCount(0);
	await expect(page.getByRole('link', { name: /Cart, 1 item/ })).toBeVisible();
	await expect(page.getByRole('dialog', { name: 'Your cart' })).toBeVisible();
});

test('mega menu opens on hover, survives the hover bridge, and closes on mouseleave', async ({
	page
}) => {
	await suppressCookieBanner(page);
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/en');
	const trigger = page.getByRole('button', { name: /Categories/ });
	const panel = page.locator('#mega-menu');
	await expect(panel).toHaveCount(0);
	await trigger.hover();
	await expect(panel).toBeVisible();
	await expect(trigger).toHaveAttribute('aria-expanded', 'true');
	// Hover bridge: moving from the trigger into the panel keeps it open.
	await panel.getByRole('link', { name: 'Audio' }).first().hover();
	await expect(panel).toBeVisible();
	await page.mouse.move(640, 780);
	await expect(panel).toHaveCount(0);
	await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('mega menu keyboard flow: ArrowDown opens, arrows cycle, Escape returns focus', async ({
	page
}) => {
	await suppressCookieBanner(page);
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/en');
	const trigger = page.getByRole('button', { name: /Categories/ });
	const panel = page.locator('#mega-menu');
	await trigger.focus();
	await page.keyboard.press('ArrowDown');
	await expect(panel).toBeVisible();
	const firstLink = panel.locator('a').first();
	await expect(firstLink).toBeFocused();
	await page.keyboard.press('ArrowDown');
	await expect(panel.locator('a').nth(1)).toBeFocused();
	await page.keyboard.press('ArrowUp');
	await expect(firstLink).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(panel).toHaveCount(0);
	await expect(trigger).toBeFocused();
});

test('mega menu panel fits the viewport at 1024px with no horizontal overflow', async ({
	page
}) => {
	await suppressCookieBanner(page);
	await page.setViewportSize({ width: 1024, height: 768 });
	await page.goto('/en');
	await page.getByRole('button', { name: /Categories/ }).hover();
	const panel = page.locator('#mega-menu');
	await expect(panel).toBeVisible();
	const box = await panel.boundingBox();
	expect(box).not.toBeNull();
	expect(box!.x).toBeGreaterThanOrEqual(0);
	expect(box!.x + box!.width).toBeLessThanOrEqual(1024);
	const overflow = await page.evaluate(
		() => document.documentElement.scrollWidth - window.innerWidth
	);
	expect(overflow).toBeLessThanOrEqual(1);
});

test('dark toggle persists across reload and renders the dark surface', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.goto('/en');
	await expect(page.locator('html')).not.toHaveClass(/dark/);
	await page.getByRole('button', { name: 'Switch to dark mode' }).click();
	await expect(page.locator('html')).toHaveClass(/dark/);
	const stored = await page.evaluate(() => localStorage.getItem('techdova-theme'));
	expect(stored).toBe('dark');
	await page.reload();
	await expect(page.locator('html')).toHaveClass(/dark/);
	const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
	expect(bg).toBe('rgb(14, 23, 18)');
	const themeColor = await page.evaluate(
		() => document.querySelector('meta[name="theme-color"]')?.getAttribute('content')
	);
	expect(themeColor).toBe('#0e1712');
	await page.getByRole('button', { name: 'Switch to light mode' }).click();
	await expect(page.locator('html')).not.toHaveClass(/dark/);
});

test('variant selection changes the price and the cart line carries the variant', async ({
	page
}) => {
	await suppressCookieBanner(page);
	await page.goto('/en/product/iphone-15-pro');
	// Default is the base-priced 256 GB variant: the card price, 999.00 DA.
	await expect(page.locator('main')).toContainText('999.00 DA');
	await page.getByRole('button', { name: /512 GB/ }).first().click();
	await expect(page.locator('main')).toContainText('1,199.00 DA');
	// The SKU and the Storage spec row follow the selected variant.
	await expect(page.locator('main')).toContainText('TD-IP15P-512');
	const specs = page.locator('section[aria-labelledby="specs-heading"]');
	await expect(specs).toContainText('512 GB');
	await expect(specs).not.toContainText('256 GB');
	await page.getByRole('button', { name: 'Add to cart' }).first().click();
	const dialog = page.getByRole('dialog', { name: 'Your cart' });
	await expect(dialog).toBeVisible();
	await expect(dialog).toContainText('512 GB');
	await expect(dialog).toContainText('1,199.00 DA');
	const stored = await page.evaluate(() => localStorage.getItem('techdova-cart'));
	expect(JSON.parse(stored!)).toEqual([{ slug: 'iphone-15-pro', variantId: 'storage-512', qty: 1 }]);
});

test('hero carousel arrows clear the slide copy at desktop width', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/en');
	const prev = page.getByRole('button', { name: 'Previous slide' });
	await expect(prev).toBeVisible();
	// Let the slide transition settle before measuring boxes.
	await page.waitForTimeout(700);
	const slide = page.locator('[aria-roledescription="slide"][aria-hidden="false"]');
	const copy = slide.locator('p.max-w-md');
	const prevBox = await prev.boundingBox();
	const copyBox = await copy.boundingBox();
	expect(prevBox).not.toBeNull();
	expect(copyBox).not.toBeNull();
	expect(prevBox!.x + prevBox!.width).toBeLessThanOrEqual(copyBox!.x + 1);
});

test('mega menu category labels are fully visible, not clipped', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.goto('/en');
	await page.getByRole('button', { name: /Categories/ }).hover();
	const panel = page.locator('#mega-menu');
	await expect(panel).toBeVisible();
	const clipped = await panel.evaluate((el) => {
		const bad: string[] = [];
		el.querySelectorAll('a[href*="/category/"]').forEach((a) => {
			if (a.scrollWidth > a.clientWidth + 1) bad.push((a.textContent ?? '').trim());
		});
		return bad;
	});
	expect(clipped).toEqual([]);
});

test('gallery switches image by thumbnail and by arrows', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.goto('/en/product/iphone-15-pro');
	const mainSource = page.locator('figure source[type="image/avif"]').first();
	await expect(mainSource).toHaveAttribute('srcset', /product-iphone-15-pro\.avif$/);
	await page.getByRole('button', { name: 'View image 2' }).first().click();
	await expect(mainSource).toHaveAttribute('srcset', /product-iphone-15-pro-2\.avif$/);
	await page.getByRole('button', { name: 'Next image' }).click();
	await expect(mainSource).toHaveAttribute('srcset', /product-iphone-15-pro-3\.avif$/);
	await page.getByRole('button', { name: 'Previous image' }).click();
	await expect(mainSource).toHaveAttribute('srcset', /product-iphone-15-pro-2\.avif$/);
});

test('promo code TECHDOVA10 takes 10% off the cart total, bad codes error, remove restores', async ({
	page
}) => {
	await suppressCookieBanner(page);
	await page.goto('/en');
	const card = page.locator('article', { hasText: 'iPhone 15 Pro' }).first();
	await card.getByRole('button', { name: 'Add to cart' }).click();
	await page.keyboard.press('Escape');
	await page.goto('/en/cart');
	const aside = page.locator('aside');
	await expect(aside).toContainText('999.00 DA');

	await page.locator('#cart-promo').fill('NOPE');
	await page.getByRole('button', { name: 'Apply' }).click();
	await expect(page.locator('#cart-promo-error')).toBeVisible();
	await expect(page.locator('#cart-promo-error')).toContainText('not recognised');
	await expect(aside).toContainText('999.00 DA');

	await page.locator('#cart-promo').fill('TECHDOVA10');
	await page.getByRole('button', { name: 'Apply' }).click();
	await expect(aside).toContainText('Code TECHDOVA10 applied: 10% off your order');
	await expect(aside).toContainText('−99.90 DA');
	await expect(aside).toContainText('899.10 DA');
	const stored = await page.evaluate(() => localStorage.getItem('techdova-promo'));
	expect(stored).toBe('TECHDOVA10');

	await page.getByRole('button', { name: 'Remove promo code TECHDOVA10' }).click();
	await expect(page.locator('#cart-promo')).toBeVisible();
	await expect(aside).toContainText('999.00 DA');
	await expect(aside).not.toContainText('899.10 DA');
});

test('cookie consent persists the choice and the banner stays hidden on reload', async ({
	page
}) => {
	await page.goto('/en');
	const banner = page.getByRole('region', { name: 'Your privacy, honestly' });
	await expect(banner).toBeVisible();
	await banner.getByRole('button', { name: 'Accept', exact: true }).click();
	await expect(banner).toHaveCount(0);
	const stored = await page.evaluate(() => localStorage.getItem('techdova-cookie-consent'));
	expect(stored).toBe('accepted');
	await page.reload();
	await expect(banner).toHaveCount(0);
});

test('cookie settings clear stored data for real', async ({ page }) => {
	await page.goto('/en');
	await page.evaluate(() => {
		localStorage.setItem('techdova-cart', JSON.stringify([{ slug: 'iphone-15-pro', qty: 1 }]));
		localStorage.setItem('techdova-theme', 'dark');
		localStorage.setItem('techdova-promo', 'TECHDOVA10');
		localStorage.setItem('techdova-cookie-consent', 'accepted');
	});
	await page.reload();
	await page.locator('footer').getByRole('button', { name: 'Cookie settings' }).click();
	const dialog = page.getByRole('dialog', { name: 'Cookie and storage settings' });
	await expect(dialog).toBeVisible();
	await dialog.getByRole('button', { name: 'Clear my stored data' }).click();
	await expect(dialog).toContainText('cleared');
	const remaining = await page.evaluate(() =>
		Object.keys(localStorage).filter((key) => key.startsWith('techdova-'))
	);
	// Clearing removes every TechDova key, including the consent choice and
	// the promo code; the layout re-persists only the locale on next render.
	expect(remaining.filter((key) => key !== 'techdova-locale')).toEqual([]);
});

test('chat answers a shipping question with the canned reply', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.goto('/en');
	await page.getByRole('button', { name: 'Open live chat (demo)' }).click();
	const panel = page.locator('#techdova-chat-panel');
	await expect(panel).toBeVisible();
	await expect(panel).toContainText('demo assistant');
	await page.locator('#techdova-chat-input').fill('How long is delivery?');
	await page.getByRole('button', { name: 'Send message' }).click();
	await expect(panel).toContainText('Delivery is free on all demo orders');
});

test('chat answers a French shipping keyword in French', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.goto('/fr');
	await page.getByRole('button', { name: 'Ouvrir le chat en direct (démo)' }).click();
	const panel = page.locator('#techdova-chat-panel');
	await expect(panel).toBeVisible();
	await page.locator('#techdova-chat-input').fill('Quels sont les délais de livraison ?');
	await page.getByRole('button', { name: 'Envoyer le message' }).click();
	await expect(panel).toContainText('La livraison est gratuite');
});

const NEW_PAGES = [
	{ route: 'brands', en: 'Shop by brand', fr: 'Acheter par marque' },
	{ route: 'rewards', en: 'TechDova Rewards', fr: 'TechDova Rewards' },
	{ route: 'trade-in', en: 'Trade in your device', fr: 'Reprenez votre appareil' },
	{ route: 'financing', en: 'Financing and instalments', fr: 'Financement et versements' },
	{ route: 'warranty', en: 'Extended warranty', fr: 'Garantie étendue' },
	{ route: 'cookies', en: 'Cookie and storage policy', fr: 'Politique en matière de cookies et de stockage' }
] as const;

for (const locale of ['en', 'fr'] as const) {
	for (const entry of NEW_PAGES) {
		test(`new page /${locale}/${entry.route} returns 200 with its h1`, async ({ page }) => {
			const response = await page.goto(`/${locale}/${entry.route}`);
			expect(response?.status()).toBe(200);
			await expect(page.locator('main h1').first()).toContainText(entry[locale]);
			await expect(page.locator('main')).not.toContainText('Page not found');
			await expect(page.locator('main')).not.toContainText('Page introuvable');
		});
	}
}

test('brand filter deep link shows only Apple products with a removable chip', async ({
	page
}) => {
	await suppressCookieBanner(page);
	await page.goto('/en/shop?brand=Apple');
	await expect(page.locator('main article')).toHaveCount(5);
	await expect(page.locator('main')).toContainText('iPhone 15 Pro');
	await expect(page.locator('main')).not.toContainText('Samsung Galaxy S24');
	await page.getByRole('button', { name: 'Remove filter: Apple' }).click();
	await expect(page).toHaveURL(/\/en\/shop$/);
	await expect(page.locator('main article')).toHaveCount(12);
});

test('brands page links drive the shop brand filter end to end', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.goto('/en/brands');
	await page.getByRole('link', { name: /Shop all Apple/ }).first().click();
	await expect(page).toHaveURL(/\/en\/shop\?brand=Apple/);
	await expect(page.locator('main article')).toHaveCount(5);
	await expect(page.locator('main')).toContainText('AirPods Pro');
});

test('404 page has a search box, best sellers and popular links', async ({ page }) => {
	await suppressCookieBanner(page);
	const response = await page.goto('/en/does-not-exist');
	expect(response?.status()).toBe(404);
	await expect(page.locator('main h1')).toContainText('Page not found');
	await expect(page.locator('#not-found-search')).toBeVisible();
	await expect(page.locator('main article')).toHaveCount(4);
	await expect(page.locator('main')).toContainText('iPhone 15 Pro');
	await page.locator('#not-found-search').fill('watch');
	await page.getByRole('button', { name: 'Search' }).click();
	await expect(page).toHaveURL(/\/en\/search\?q=watch/);
	await expect(page.locator('main')).toContainText('2 results for "watch"');
});

test('shop drawer brand facet applies on mobile with the other facets', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/en/shop');
	await page.getByRole('button', { name: 'Filters', exact: true }).click();
	const dialog = page.getByRole('dialog', { name: 'Filters' });
	await expect(dialog).toBeVisible();
	await dialog.getByLabel('Apple').check();
	await expect(dialog.getByRole('button', { name: 'Show 5 results' })).toBeVisible();
	await dialog.getByRole('button', { name: 'Show 5 results' }).click();
	await expect(dialog).toHaveCount(0);
	await expect(page).toHaveURL(/brand=Apple/);
	await expect(page.locator('main article')).toHaveCount(5);
	await expect(page.locator('main')).toContainText('iPhone 15 Pro');
	await expect(page.locator('main')).not.toContainText('Samsung Galaxy S24');
});

test('cart return nudge shows once per session for a returning cart', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.goto('/en');
	const card = page.locator('article', { hasText: 'iPhone 15 Pro' }).first();
	await card.getByRole('button', { name: 'Add to cart' }).click();
	await page.keyboard.press('Escape');
	await page.reload();
	const nudge = page.getByRole('status').filter({ hasText: 'Welcome back' });
	await expect(nudge).toBeVisible();
	await expect(nudge).toContainText('1 item is still there');
	await nudge.getByRole('button', { name: 'Dismiss' }).click();
	await expect(nudge).toHaveCount(0);
	await page.reload();
	await expect(nudge).toHaveCount(0);
});

test('tab reminder shows the cart count in the title while hidden, then restores it', async ({
	page
}) => {
	await suppressCookieBanner(page);
	await page.goto('/en');
	const card = page.locator('article', { hasText: 'iPhone 15 Pro' }).first();
	await card.getByRole('button', { name: 'Add to cart' }).click();
	await page.keyboard.press('Escape');
	const original = await page.title();
	await page.evaluate(() => {
		Object.defineProperty(document, 'hidden', { get: () => true, configurable: true });
		document.dispatchEvent(new Event('visibilitychange'));
	});
	await expect
		.poll(async () => page.title())
		.toBe('(1) items waiting in your cart');
	await page.evaluate(() => {
		Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
		document.dispatchEvent(new Event('visibilitychange'));
	});
	await expect.poll(async () => page.title()).toBe(original);
});

test('announcement bar rotates messages, and stays on the first under reduced motion', async ({
	page
}) => {
	await suppressCookieBanner(page);
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/en');
	const bar = page.locator('header').locator('p').first();
	await expect(bar).toContainText(/Free delivery|Original products|Secure payment/);
	const first = await bar.innerText();
	// Rotation advances within ~5s; poll for any change from the first text.
	await expect
		.poll(async () => bar.innerText(), { timeout: 8000 })
		.not.toBe(first);
});

test('announcement bar does not rotate under reduced motion', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/en');
	const bar = page.locator('header').locator('p').first();
	await expect(bar).toContainText('Free delivery on all orders');
	await page.waitForTimeout(6000);
	await expect(bar).toContainText('Free delivery on all orders');
	await expect(bar).not.toContainText('Original products');
});

test('bundle total excludes the out-of-stock hub partner on the MacBook page', async ({
	page
}) => {
	await suppressCookieBanner(page);
	await page.goto('/en/product/macbook-air-m2');
	const bundle = page.locator('section[aria-labelledby="bundle-heading"]');
	await expect(bundle).toBeVisible();
	await expect(bundle).toContainText('USB-C Hub 7-in-1');
	await expect(bundle).toContainText('Out of stock');
	// MacBook 1,299.00 + Sony 749.00 = 2,048.00 for 2 items; the hub is shown
	// but excluded from the total.
	await expect(bundle).toContainText('Total for 2 items: 2,048.00 DA');
	await expect(bundle.getByRole('button', { name: 'Add all 2 to cart' })).toBeVisible();
});

test('financing slider math: 1,200 over 12 months is 100.00 a month', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.goto('/en/financing');
	await page.locator('#financing-price').fill('1200');
	await page.locator('#financing-months').selectOption({ index: 2 });
	await expect(page.locator('main')).toContainText('100.00 DA');
	await expect(page.locator('main')).toContainText('1,200.00 DA');
});

test('cookie banner does not cover the compare tray on a first visit', async ({ page }) => {
	// No consent preset: the banner shows, and the tray must lift above it.
	await page.goto('/en/shop');
	await expect(
		page.getByRole('region', { name: 'Your privacy, honestly' })
	).toBeVisible();
	const card = page.locator('article', { hasText: 'iPhone 15 Pro' }).first();
	await card.getByRole('button', { name: 'Add to compare (iPhone 15 Pro)' }).click();
	const tray = page.getByRole('region', { name: 'Comparison tray' });
	await expect(tray).toBeVisible();
	const boxes = await page.evaluate(() => {
		const banner = document
			.querySelector('[aria-label="Your privacy, honestly"]')!
			.getBoundingClientRect();
		const trayEl = document.querySelector('[aria-label="Comparison tray"]')!.getBoundingClientRect();
		return { bannerTop: banner.top, trayBottom: trayEl.bottom };
	});
	expect(boxes.trayBottom).toBeLessThanOrEqual(boxes.bannerTop);
	await tray.getByRole('link', { name: 'Compare now' }).click();
	await expect(page).toHaveURL(/\/en\/compare/);
});

test('trade-in estimate updates and the checked condition highlights', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.goto('/en/trade-in');
	const estimate = page.getByRole('status').filter({ hasText: 'Estimated credit' });
	await expect(estimate).toContainText('260.00 DA');
	await page.locator('#tradein-age').selectOption({ index: 0 });
	await page.getByRole('radio', { name: /Like new/ }).check();
	await expect(estimate).toContainText('400.00 DA');
	// has-checked highlight: the checked option's label fills with brand-50.
	const checkedLabel = page.locator('label:has(input[type="radio"]:checked)');
	const checkedBg = await checkedLabel.evaluate((el) => getComputedStyle(el).backgroundColor);
	expect(checkedBg).toBe('rgb(239, 248, 243)');
	const uncheckedBg = await page
		.locator('label:has(input[type="radio"]:not(:checked))')
		.first()
		.evaluate((el) => getComputedStyle(el).backgroundColor);
	expect(uncheckedBg).toBe('rgba(0, 0, 0, 0)');
});

test('rewards join form validates, then shows the joined state', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.goto('/en/rewards');
	await page.getByRole('button', { name: 'Join Rewards' }).click();
	await expect(page.locator('#rewards-name-error')).toBeVisible();
	await expect(page.locator('#rewards-email-error')).toBeVisible();
	await page.locator('#rewards-name').fill('Aya Test');
	await page.locator('#rewards-email').fill('aya@example.com');
	await page.getByRole('button', { name: 'Join Rewards' }).click();
	await expect(page.locator('main')).toContainText('Welcome to TechDova Rewards!');
	await expect(page.locator('main')).toContainText('Aya Test');
});

test('account profile edit and notification toggles persist across reload', async ({
	page
}) => {
	await suppressCookieBanner(page);
	await page.goto('/en/account');
	await page.locator('#account-name').fill('Aya Test');
	await page.locator('#account-email').fill('aya@example.com');
	await page.getByRole('button', { name: 'Sign in (demo)' }).click();
	await expect(page.locator('main')).toContainText('Hello, Aya Test');

	await page.getByRole('button', { name: 'Edit profile' }).click();
	await page.locator('#profile-edit-name').fill('Aya Renamed');
	await page.getByRole('button', { name: 'Save profile' }).click();
	await expect(page.locator('main')).toContainText('Hello, Aya Renamed');

	const toggle = page.getByLabel(/Order updates/);
	const wasChecked = await toggle.isChecked();
	await toggle.click();
	await expect(toggle).toBeChecked({ checked: !wasChecked });
	await page.reload();
	await expect(page.locator('main')).toContainText('Hello, Aya Renamed');
	await expect(page.getByLabel(/Order updates/)).toBeChecked({ checked: !wasChecked });
});

test('compare highlight-differences toggle marks differing rows', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/en/shop');
	const iphone = page.locator('article', { hasText: 'iPhone 15 Pro' }).first();
	await iphone.getByRole('button', { name: 'Add to compare (iPhone 15 Pro)' }).click();
	const galaxy = page.locator('article', { hasText: 'Samsung Galaxy S24' }).first();
	await galaxy.getByRole('button', { name: 'Add to compare (Samsung Galaxy S24)' }).click();
	await page.getByRole('link', { name: 'Compare now' }).click();
	await expect(page.locator('main h1')).toContainText('Compare products');
	const highlighted = page.locator('main table tr.bg-brand-50');
	await expect(highlighted).toHaveCount(0);
	await page.getByRole('button', { name: 'Highlight differences' }).click();
	await expect(highlighted.first()).toBeVisible();
});

test('product card hover swaps to the second gallery image', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/en/shop');
	const card = page.locator('article', { hasText: 'iPhone 15 Pro' }).first();
	const alternate = card.locator('picture').nth(1).locator('img');
	await expect(alternate).toHaveCSS('opacity', '0');
	await card.hover();
	await expect
		.poll(async () => alternate.evaluate((el) => getComputedStyle(el).opacity))
		.toBe('1');
});

test('typing in shop search keeps focus and filters per keystroke', async ({ page }) => {
	await suppressCookieBanner(page);
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/en/shop');
	await page.locator('#shop-search').click();
	await page.locator('#shop-search').pressSequentially('watch', { delay: 60 });
	await expect(page.locator('#shop-search')).toBeFocused();
	await expect(page.locator('main article')).toHaveCount(2);
	await expect(page).toHaveURL(/q=watch/);
});

test('hero respects reduced motion: no ken-burns, solid dot, no pause control', async ({
	page
}) => {
	await suppressCookieBanner(page);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/en');
	await expect(page.getByRole('button', { name: 'Pause automatic slide rotation' })).toHaveCount(0);
	const heroImg = page.locator('section[aria-label="Featured products"] img').first();
	const animationName = await heroImg.evaluate((el) => getComputedStyle(el).animationName);
	expect(animationName).toBe('none');
	const activeDot = page
		.getByRole('group', { name: 'Choose a slide' })
		.getByRole('button', { name: 'Go to slide 1' })
		.locator('span')
		.first();
	await expect(activeDot).toHaveClass(/bg-brand-700/);
});

test('PWA manifest and icons serve with the right content', async ({ page }) => {
	const manifest = await page.request.get('/manifest.webmanifest');
	expect(manifest.ok()).toBe(true);
	const body = await manifest.json();
	expect(body.name).toBe('TechDova');
	expect(body.icons.length).toBeGreaterThanOrEqual(2);
	for (const icon of body.icons) {
		const res = await page.request.get(icon.src);
		expect(res.ok()).toBe(true);
	}
	const touchIcon = await page.request.get('/icons/apple-touch-icon.png');
	expect(touchIcon.ok()).toBe(true);
});
