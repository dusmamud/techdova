import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

// Audit-fix round (2026-11-18): PageSpeed P-1/P-2/P-3, structured-data
// R-1/R-4/R-5/R-6, and sitemap/headers S-1/S-2/S-3/S-4/S-8/S-9. Strings
// below are copied from src/lib/i18n/en.ts / fr.ts. Build-output tests
// read the prerendered build/ directory (the Playwright webServer serves
// the same output via qa/serve.mjs), so they must run after `npm run build`.

async function suppressCookieBanner(page: Page): Promise<void> {
	await page.addInitScript(() => {
		try {
			localStorage.setItem('techdova-cookie-consent', 'accepted');
		} catch {
			// Storage unavailable: the banner may still show.
		}
	});
}

// --- (1) Cookie banner link: descriptive accessible name + rendered text ---

const COOKIE_LINK = {
	en: { visible: 'Learn more', label: 'Learn more about our cookie policy' },
	fr: { visible: 'En savoir plus', label: 'En savoir plus sur notre politique de cookies' }
} as const;

for (const locale of ['en', 'fr'] as const) {
	test(`cookie banner "Learn more" link has a descriptive name in ${locale}`, async ({
		page
	}) => {
		// Fresh consent state: do NOT suppress the banner.
		await page.goto(`/${locale}`);
		const link = page.getByRole('link', { name: COOKIE_LINK[locale].label });
		await expect(link).toBeVisible();
		await expect(link).toHaveAttribute('href', `/${locale}/cookies`);
		// The accessible name is the descriptive label (aria-label).
		const accessibleName = await link.evaluate((el) => {
			// aria-label wins over content for the accessible name.
			return el.getAttribute('aria-label');
		});
		expect(accessibleName).toBe(COOKIE_LINK[locale].label);
		// The rendered text itself composes to the descriptive phrase:
		// Lighthouse's link-text audit reads innerText, which ignores
		// aria-label, so the sr-only suffix must carry the description.
		await expect(link).toHaveText(COOKIE_LINK[locale].label);
		// The visible text is byte-identical to before the fix: the first
		// text node is the short label, the rest is sr-only.
		const firstText = await link.evaluate((el) => el.childNodes[0]?.textContent?.trim());
		expect(firstText).toBe(COOKIE_LINK[locale].visible);
		const suffix = link.locator('.sr-only');
		await expect(suffix).toHaveCount(1);
	});
}

// --- (2) Heading order sequential at 390px (accessibility tree) ---

const LISTING_PAGES = ['/shop', '/category/smartphones', '/deals', '/new-arrivals', '/best-sellers'];

async function headingLevels(page: Page): Promise<number[]> {
	// getByRole('heading') queries the accessibility tree in DOM order, so
	// headings inside display:none containers (the P-2 root cause) are
	// excluded exactly as Lighthouse's heading-order audit excludes them.
	const headings = page.getByRole('heading');
	const count = await headings.count();
	const levels: number[] = [];
	for (let i = 0; i < count; i++) {
		const tag = await headings.nth(i).evaluate((el) => el.tagName);
		const level = Number(tag.slice(1));
		if (level >= 1 && level <= 6) levels.push(level);
	}
	return levels;
}

for (const locale of ['en', 'fr']) {
	for (const path of LISTING_PAGES) {
		test(`heading order is sequential at 390px on ${locale}${path}`, async ({ page }) => {
			await suppressCookieBanner(page);
			await page.setViewportSize({ width: 390, height: 844 });
			await page.goto(`/${locale}${path}`);
			const levels = await headingLevels(page);
			expect(levels.length).toBeGreaterThan(0);
			expect(levels[0]).toBe(1);
			for (let i = 1; i < levels.length; i++) {
				expect(
					levels[i],
					`heading level jumps ${levels[i - 1]} -> ${levels[i]} in [${levels.join(', ')}]`
				).toBeLessThanOrEqual(levels[i - 1] + 1);
			}
		});
	}
}

// --- (3) noindex + sitemap exclusion ---

const UTILITY_PATHS = [
	'/checkout',
	'/cart',
	'/account',
	'/search',
	'/wishlist',
	'/compare',
	'/track-order',
	'/order-confirmation'
];

test('utility and order-confirmation pages carry noindex in both locales', async ({
	page
}) => {
	await suppressCookieBanner(page);
	for (const locale of ['en', 'fr']) {
		for (const path of UTILITY_PATHS) {
			await page.goto(`/${locale}${path}`);
			const robots = await page
				.locator('meta[name="robots"]')
				.getAttribute('content');
			expect(robots, `/${locale}${path}`).toContain('noindex');
		}
	}
});

test('sitemap has 100 URLs, no utility paths, no lastmod', async ({ request }) => {
	const response = await request.get('/sitemap.xml');
	expect(response.ok()).toBe(true);
	const xml = await response.text();
	const urlCount = (xml.match(/<url>/g) ?? []).length;
	expect(urlCount).toBe(100);
	expect(xml).not.toContain('lastmod');
	expect(xml).not.toContain('order-confirmation');
	for (const path of UTILITY_PATHS) {
		if (path === '/order-confirmation') continue;
		expect(xml).not.toContain(`${path}</loc>`);
	}
});

// --- (4) srcset/sizes on pictures ---

for (const path of ['/en', '/en/shop', '/en/product/iphone-15-pro']) {
	test(`every picture on ${path} has srcset with w descriptors and sizes`, async ({
		page
	}) => {
		await suppressCookieBanner(page);
		await page.goto(path);
		const bad = await page.evaluate(() => {
			const problems: string[] = [];
			for (const picture of document.querySelectorAll('picture')) {
				for (const source of picture.querySelectorAll('source')) {
					const srcset = source.getAttribute('srcset') ?? '';
					if (!/\d+w/.test(srcset)) problems.push(`source without w srcset: ${srcset}`);
					if (!source.getAttribute('sizes')) problems.push('source without sizes');
				}
				const img = picture.querySelector('img');
				if (!img) {
					problems.push('picture without img');
					continue;
				}
				if (!/\d+w/.test(img.getAttribute('srcset') ?? '')) {
					problems.push(`img without w srcset: ${img.getAttribute('src')}`);
				}
				if (!img.getAttribute('sizes')) problems.push('img without sizes');
			}
			return problems;
		});
		expect(bad).toEqual([]);
	});
}

// --- (5) JSON-LD validity sweep over build output ---

const BUILD_DIR = join(process.cwd(), 'build');

function buildHtmlFiles(): { rel: string; html: string }[] {
	const out: { rel: string; html: string }[] = [];
	const walk = (dir: string, prefix: string): void => {
		for (const entry of readdirSync(dir)) {
			const full = join(dir, entry);
			if (statSync(full).isDirectory()) walk(full, `${prefix}${entry}/`);
			else if (entry.endsWith('.html')) {
				out.push({ rel: `${prefix}${entry}`, html: readFileSync(full, 'utf8') });
			}
		}
	};
	walk(BUILD_DIR, '');
	return out;
}

function ldBlocks(html: string): unknown[] {
	const blocks: unknown[] = [];
	const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
	for (const match of html.matchAll(re)) blocks.push(JSON.parse(match[1]));
	return blocks;
}

function flatten(block: unknown): Record<string, unknown>[] {
	if (Array.isArray(block)) return block as Record<string, unknown>[];
	const obj = block as Record<string, unknown>;
	if (Array.isArray(obj['@graph'])) return obj['@graph'] as Record<string, unknown>[];
	return [obj];
}

test('every ld+json block in build output parses as valid JSON', () => {
	const files = buildHtmlFiles().filter(
		(f) => f.rel !== '404.html' && f.rel !== 'index.html'
	);
	expect(files.length).toBe(116);
	let blocks = 0;
	for (const { rel, html } of files) {
		const matches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
		for (const m of matches) {
			blocks++;
			expect(() => JSON.parse(m[1]), `ld+json in ${rel}`).not.toThrow();
		}
	}
	expect(blocks).toBe(192);
});

test('JSON-LD fields match the audit-fix rules on every page', () => {
	const files = buildHtmlFiles().filter(
		(f) => f.rel !== '404.html' && f.rel !== 'index.html'
	);
	let products = 0;
	let blogPostings = 0;
	let withLd = 0;
	const withoutLd: string[] = [];
	for (const { rel, html } of files) {
		const blocks = ldBlocks(html);
		if (blocks.length === 0) {
			withoutLd.push(rel);
			continue;
		}
		withLd++;
		for (const block of blocks) {
			for (const node of flatten(block)) {
				const type = node['@type'];
				expect(
					['ProductGroup', 'ItemList', 'Review'],
					`forbidden @type ${String(type)} in ${rel}`
				).not.toContain(type);
				expect(JSON.stringify(node), `SearchAction in ${rel}`).not.toContain('SearchAction');
				if (type === 'Product') {
					products++;
					expect(node.brand, `${rel} brand`).toMatchObject({ '@type': 'Brand' });
					expect(node.url, `${rel} url`).toMatch(/^https:\/\/techdova\.pages\.dev\//);
					expect(node['@id'], `${rel} @id`).toBe(node.url);
					const offers = node.offers as Record<string, unknown>;
					expect(
						(node.itemCondition as string | undefined) ??
							(offers?.itemCondition as string | undefined),
						`${rel} itemCondition`
					).toBe('https://schema.org/NewCondition');
					expect(node.aggregateRating, `${rel} aggregateRating`).toBeDefined();
					expect(node, `${rel} forbidden fields`).not.toHaveProperty('shippingDetails');
					expect(node, `${rel} forbidden fields`).not.toHaveProperty(
						'hasMerchantReturnPolicy'
					);
					expect(node, `${rel} forbidden fields`).not.toHaveProperty('priceValidUntil');
					const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
					expect(canonical, `${rel} canonical`).toBe(node.url);
				}
				if (type === 'BlogPosting') {
					blogPostings++;
					expect(node.datePublished, `${rel} datePublished`).toMatch(
						/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+01:00$/
					);
					expect(node, `${rel} dateModified`).not.toHaveProperty('dateModified');
					expect(node.publisher, `${rel} publisher`).toMatchObject({ logo: expect.anything() });
					expect(node.mainEntityOfPage, `${rel} mainEntityOfPage`).toBeDefined();
					expect(node.inLanguage, `${rel} inLanguage`).toMatch(/^(en|fr)$/);
				}
				if (type === 'OnlineStore') {
					expect(node['@id'], `${rel} @id`).toBeDefined();
					expect(node.description, `${rel} description`).toBeTruthy();
					expect(node.logo, `${rel} logo`).toContain('icon-512.png');
					expect(node.logo, `${rel} logo`).not.toContain('favicon.svg');
				}
			}
		}
	}
	expect(products).toBe(24);
	expect(blogPostings).toBe(12);
	expect(withLd).toBe(100);
	expect(withoutLd.sort()).toEqual(
		['en', 'fr'].flatMap((locale) =>
			UTILITY_PATHS.map((p) => `${locale}${p}.html`)
		).sort()
	);
});

// --- (6) _headers in build output ---

test('_headers in build output is byte-identical to static/_headers', () => {
	const expected = readFileSync(join(process.cwd(), 'static', '_headers'));
	const actual = readFileSync(join(BUILD_DIR, '_headers'));
	expect(actual.equals(expected)).toBe(true);
	const text = expected.toString('utf8');
	expect(text).toContain('Strict-Transport-Security: max-age=31536000');
	expect(text).toContain('X-Frame-Options: DENY');
	expect(text).toContain('Permissions-Policy:');
	expect(text).toContain('Cache-Control: public, max-age=31536000, immutable');
	// /images/* must NOT be immutable (unhashed filenames).
	const imagesBlock = text.split('/images/*')[1]?.split('\n\n')[0] ?? '';
	expect(imagesBlock).not.toContain('immutable');
});

// --- (7) Request logging: hover-image deferral + responsive widths ---

// Hover-swap (-2) files are requested through srcset, so the URL carries a
// width suffix (product-…-2-480w.avif) or, at large slots, no suffix
// (product-…-2.avif). Both forms must be caught.
const HOVER_IMAGE_RE = /-2(-\d+w)?\.(avif|webp|jpg)(\?|$)/;

test('mobile emulation: zero -2 image requests on initial load of home and shop', async ({
	browser
}) => {
	const context = await browser.newContext({
		viewport: { width: 390, height: 844 },
		hasTouch: true,
		isMobile: true,
		deviceScaleFactor: 2
	});
	const page = await context.newPage();
	await suppressCookieBanner(page);
	const hoverRequests: string[] = [];
	page.on('request', (req) => {
		if (HOVER_IMAGE_RE.test(req.url())) hoverRequests.push(req.url());
	});
	for (const path of ['/en', '/en/shop']) {
		await page.goto(path, { waitUntil: 'networkidle' });
		await page.waitForTimeout(500);
	}
	expect(hoverRequests).toEqual([]);
	await context.close();
});

test('desktop: no -2 request before hover, exactly one after hovering a card', async ({
	browser
}) => {
	const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
	const page = await context.newPage();
	await suppressCookieBanner(page);
	const hoverRequests: string[] = [];
	page.on('request', (req) => {
		if (HOVER_IMAGE_RE.test(req.url())) hoverRequests.push(req.url());
	});
	await page.goto('/en/shop', { waitUntil: 'networkidle' });
	await page.waitForTimeout(500);
	expect(hoverRequests).toEqual([]);
	const card = page.locator('article', { hasText: 'iPhone 15 Pro' }).first();
	await expect(card.locator('picture')).toHaveCount(1);
	await card.hover();
	await expect(card.locator('picture')).toHaveCount(2);
	await expect.poll(() => hoverRequests.length).toBe(1);
	expect(hoverRequests[0]).toContain('product-iphone-15-pro-2');
	const alternate = card.locator('picture').nth(1).locator('img');
	await expect
		.poll(async () => alternate.evaluate((el) => getComputedStyle(el).opacity))
		.toBe('1');
	await context.close();
});

test('at 390px card images request 480w/800w AVIFs, never full resolution', async ({
	browser
}) => {
	const context = await browser.newContext({
		viewport: { width: 390, height: 844 },
		hasTouch: true,
		isMobile: true,
		deviceScaleFactor: 2
	});
	const page = await context.newPage();
	await suppressCookieBanner(page);
	const imageRequests: string[] = [];
	page.on('request', (req) => {
		const url = req.url();
		if (url.includes('/images/product-')) imageRequests.push(url);
	});
	await page.goto('/en/shop', { waitUntil: 'networkidle' });
	await page.waitForTimeout(500);
	expect(imageRequests.length).toBeGreaterThan(0);
	for (const url of imageRequests) {
		expect(url, `full-res or wrong-width request: ${url}`).toMatch(/-(480|800)w\.avif$/);
	}
	await context.close();
});
