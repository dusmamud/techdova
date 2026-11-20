import { expect, test, type Page } from '@playwright/test';

// Elevation round 2 — motion + chrome (worker B3): FAB overlap (G-01),
// fly-to-cart visibility + delayed drawer (G-02), page transitions
// (G-06), shop skeletons (G-07), hero dots below the image on mobile
// (G-10). English strings below are copied from src/lib/i18n/en.ts.
//
// The cookie banner overlays the bottom of every fresh page; tests that
// measure bottom-fixed chrome pre-accept it (same pattern as
// elevation.spec.ts).

async function gotoAccepted(page: Page, url: string): Promise<void> {
	await page.addInitScript(() => {
		localStorage.setItem('techdova-cookie-consent', 'accepted');
	});
	await page.goto(url);
}

/** Visible FAB rects (opacity > 0.1) overlapping an in-viewport CTA. */
async function fabCtaOverlaps(page: Page): Promise<string[]> {
	return page.evaluate(() => {
		const overlaps: string[] = [];
		const fabs = [...document.querySelectorAll('[data-testid="chat-fab"], [data-testid="back-to-top"]')]
			.map((el) => ({
				id: el.getAttribute('data-testid') ?? 'fab',
				rect: el.getBoundingClientRect(),
				opacity: Number(getComputedStyle(el).opacity)
			}))
			.filter(
				(f) => f.opacity > 0.1 && f.rect.bottom > 0 && f.rect.top < window.innerHeight
			);
		const ctas = [...document.querySelectorAll('article button')]
			.filter((button) => button.textContent?.trim() === 'Add to cart')
			.map((button) => button.getBoundingClientRect())
			.filter((rect) => rect.bottom > 0 && rect.top < window.innerHeight);
		for (const fab of fabs) {
			for (const cta of ctas) {
				if (
					fab.rect.left < cta.right &&
					fab.rect.right > cta.left &&
					fab.rect.top < cta.bottom &&
					fab.rect.bottom > cta.top
				) {
					overlaps.push(`${fab.id} overlaps an Add to cart button`);
				}
			}
		}
		return overlaps;
	});
}

test('G-01: FABs do not overlap product-card CTAs on mobile while scrolling', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await gotoAccepted(page, '/en/shop');
	await expect(page.locator('main h1')).toContainText('Shop');

	// Scroll down through the grid in steps (real wheel events, so the
	// scroll-direction hide runs) and let the FABs settle hidden.
	await page.mouse.wheel(0, 800);
	await page.waitForTimeout(300);
	await page.mouse.wheel(0, 800);
	await page.waitForTimeout(300);

	// The chat FAB moved to the bottom-LEFT on <sm.
	const chatBox = await page.getByTestId('chat-fab').boundingBox();
	expect(chatBox).not.toBeNull();
	expect(chatBox!.x).toBeLessThan(195);

	// No visible FAB rect overlaps any in-viewport Add to cart button.
	expect(await fabCtaOverlaps(page)).toEqual([]);

	// Scrolling back up re-shows the back-to-top button (it hides only
	// while scrolling down).
	await page.mouse.wheel(0, -400);
	await page.waitForTimeout(300);
	await expect(page.getByTestId('back-to-top')).toBeVisible();
});

test('G-02: fly-to-cart clone stays visible mid-flight and the drawer opens after landing', async ({
	page
}) => {
	await page.setViewportSize({ width: 1280, height: 900 });
	await gotoAccepted(page, '/en/product/iphone-15-pro');
	await expect(page.locator('main h1')).toContainText('iPhone 15 Pro');

	const cartDialog = page.getByRole('dialog', { name: 'Your cart' });
	// Click the buy-box ATC without scrolling: a Playwright click would
	// scroll the button into view and push the gallery out of the
	// viewport (the PDP falls back to flying from the button then).
	// At scroll 0 the gallery is fully in view, so the flight starts
	// from the product image — the case this test measures.
	await page.evaluate(() => window.scrollTo(0, 0));
	await page.evaluate(() => {
		const button = [...document.querySelectorAll('main button')].find(
			(candidate) => candidate.textContent?.trim() === 'Add to cart'
		);
		button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
	});

	// Mid-flight (~150ms of the 600ms flight): the clone flies from the
	// product image, so it is large and still mostly opaque.
	await page.waitForTimeout(150);
	const midFlight = await page.evaluate(() => {
		const clone = [...document.querySelectorAll('img[aria-hidden="true"]')].find(
			(img) => getComputedStyle(img).position === 'fixed' && getComputedStyle(img).zIndex === '60'
		);
		if (!clone) return null;
		const rect = clone.getBoundingClientRect();
		return { width: rect.width, height: rect.height, opacity: Number(getComputedStyle(clone).opacity) };
	});
	expect(midFlight).not.toBeNull();
	expect(midFlight!.width).toBeGreaterThan(50);
	expect(midFlight!.height).toBeGreaterThan(50);
	expect(midFlight!.opacity).toBeGreaterThanOrEqual(0.6);

	// The drawer must NOT be open yet — it waits for the landing + badge pop.
	await expect(cartDialog).toBeHidden({ timeout: 100 });

	// …and it does open once the flight lands (~600ms + 200ms grace).
	await expect(cartDialog).toBeVisible({ timeout: 5000 });
	await expect(cartDialog).toContainText('iPhone 15 Pro');
});

test('G-06: page transition does not break navigation', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await gotoAccepted(page, '/en');

	// The View Transitions API exists in this Chromium; where it does
	// not, the layout falls back to an instant navigation.
	const hasViewTransitions = await page.evaluate(
		() => 'startViewTransition' in document
	);
	expect(hasViewTransitions).toBe(true);

	await page.getByRole('link', { name: 'Shop', exact: true }).first().click();
	await expect(page).toHaveURL(/\/en\/shop$/);
	await expect(page.locator('main h1')).toContainText('Shop');

	await page.getByRole('link', { name: 'iPhone 15 Pro' }).first().click();
	await expect(page).toHaveURL(/\/en\/product\/iphone-15-pro$/);
	await expect(page.locator('main h1')).toContainText('iPhone 15 Pro');
});

test('G-07: skeletons appear on the shop grid while filters change', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await gotoAccepted(page, '/en/shop');
	await expect(page.locator('main h1')).toContainText('Shop');

	// Typing in the desktop search flashes the skeleton grid (250ms)
	// while the URL-synced filter state re-applies.
	await page.locator('#shop-search').fill('iphone');
	await expect(page.getByTestId('skeleton-card').first()).toBeVisible({ timeout: 2000 });

	// …then the filtered products replace the skeletons.
	await expect(
		page.locator('article', { hasText: 'iPhone 15 Pro' }).first()
	).toBeVisible({ timeout: 5000 });
	await expect(page.getByTestId('skeleton-card').first()).toBeHidden({ timeout: 5000 });
});

test('G-10: hero dots sit below the image on mobile, not overlaid on it', async ({
	page
}) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await gotoAccepted(page, '/en');

	const dots = page.getByTestId('hero-dots-mobile');
	await expect(dots).toBeVisible();
	await expect(page.getByTestId('hero-dots-desktop')).toBeHidden();

	const imageBox = await page.getByTestId('hero-slide-image').first().boundingBox();
	const dotsBox = await dots.boundingBox();
	expect(imageBox).not.toBeNull();
	expect(dotsBox).not.toBeNull();
	// The dots row starts at or below the bottom edge of the hero image.
	expect(dotsBox!.y).toBeGreaterThanOrEqual(imageBox!.y + imageBox!.height - 2);
});
