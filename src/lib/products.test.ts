import { describe, expect, it } from 'vitest';
import { categories, getCategory, isCategorySlug } from '#lib/data/categories';
import {
	filterProducts,
	getDiscountedProducts,
	getFeaturedProducts,
	getNewProducts,
	getPairsWellWith,
	getProduct,
	getRelatedProducts,
	products,
	sortProducts
} from '#lib/data/products';
import { locales, type LocalizedString } from '#lib/i18n/index';

function expectLocalized(value: LocalizedString, label: string): void {
	for (const locale of locales) {
		expect(value[locale]?.trim().length, `${label} [${locale}]`).toBeGreaterThan(0);
	}
}

describe('categories', () => {
	it('has exactly 6 categories with unique slugs', () => {
		expect(categories).toHaveLength(6);
		expect(new Set(categories.map((c) => c.slug)).size).toBe(6);
		for (const category of categories) {
			expect(isCategorySlug(category.slug)).toBe(true);
			expectLocalized(category.name, `category ${category.slug} name`);
			expectLocalized(category.description, `category ${category.slug} description`);
			expectLocalized(category.imageAlt, `category ${category.slug} imageAlt`);
			expect(category.image).toMatch(/^\/images\/category-[a-z-]+\.png$/);
			expect(getCategory(category.slug)).toBe(category);
		}
	});
});

describe('products', () => {
	it('has 12 products with unique slugs', () => {
		expect(products).toHaveLength(12);
		expect(new Set(products.map((p) => p.slug)).size).toBe(12);
	});

	it('keeps the reference best sellers with exact names, prices and reviews', () => {
		const expected = [
			{ slug: 'iphone-15-pro', price: 999, oldPrice: 1169, badge: '-15%', reviewCount: 124 },
			{ slug: 'macbook-air-m2', price: 1299, oldPrice: 1449, badge: '-10%', reviewCount: 98 },
			{ slug: 'airpods-pro', price: 649, oldPrice: 819, badge: '-20%', reviewCount: 76 },
			{ slug: 'galaxy-watch-6', price: 699, oldPrice: 790, badge: '-12%', reviewCount: 63 }
		];
		for (const item of expected) {
			const product = getProduct(item.slug);
			expect(product).toBeDefined();
			expect(product?.price).toBe(item.price);
			expect(product?.oldPrice).toBe(item.oldPrice);
			expect(product?.badge).toBe(item.badge);
			expect(product?.reviewCount).toBe(item.reviewCount);
			expect(product?.featured).toBe(true);
		}
		expect(getFeaturedProducts()).toHaveLength(4);
	});

	it('validates every product shape', () => {
		for (const product of products) {
			expect(product.slug).toMatch(/^[a-z0-9-]+$/);
			expect(isCategorySlug(product.category)).toBe(true);
			expect(product.price).toBeGreaterThan(0);
			expect(Number.isInteger(product.price)).toBe(true);
			if (product.oldPrice !== undefined) {
				expect(product.oldPrice).toBeGreaterThan(product.price);
				expect(product.badge).toMatch(/^-\d+%$/);
			}
			expect(product.rating).toBeGreaterThanOrEqual(0);
			expect(product.rating).toBeLessThanOrEqual(5);
			expect(product.reviewCount).toBeGreaterThanOrEqual(0);
			expect(Number.isInteger(product.stock)).toBe(true);
			expect(product.stock).toBeGreaterThanOrEqual(0);
			expect(product.image).toMatch(/^\/images\/product-[a-z0-9-]+\.png$/);
			expectLocalized(product.name, `${product.slug} name`);
			expectLocalized(product.shortDescription, `${product.slug} shortDescription`);
			expectLocalized(product.description, `${product.slug} description`);
			expectLocalized(product.imageAlt, `${product.slug} imageAlt`);
			expect(product.specs.length).toBeGreaterThanOrEqual(4);
			for (const spec of product.specs) {
				expectLocalized(spec.label, `${product.slug} spec label`);
				expectLocalized(spec.value, `${product.slug} spec value`);
			}
		}
	});

	it('covers every category with 2 products', () => {
		for (const category of categories) {
			const inCategory = products.filter((p) => p.category === category.slug);
			expect(inCategory.length, category.slug).toBe(2);
		}
	});

	it('returns related products excluding the product itself, same category first', () => {
		const product = getProduct('iphone-15-pro');
		const related = getRelatedProducts(product!, 4);
		expect(related).toHaveLength(4);
		expect(related.map((p) => p.slug)).not.toContain('iphone-15-pro');
		expect(related[0].category).toBe('smartphones');
	});

	it('marks exactly four products as new', () => {
		expect(getNewProducts().map((p) => p.slug).sort()).toEqual([
			'apple-watch-9',
			'galaxy-s24',
			'nintendo-switch',
			'sony-wh1000xm5'
		]);
	});

	it('returns discounted products sorted by discount percentage desc', () => {
		const discounted = getDiscountedProducts();
		expect(discounted.length).toBeGreaterThan(0);
		for (const product of discounted) {
			expect(product.badge).toBeDefined();
			expect(product.oldPrice).toBeGreaterThan(product.price);
		}
		const percents = discounted.map((p) => ((p.oldPrice! - p.price) / p.oldPrice!) * 100);
		expect(percents).toEqual([...percents].sort((a, b) => b - a));
		expect(discounted[0].slug).toBe('magsafe-charger');
	});

	it('returns every discounted product exactly once, smallest discount last', () => {
		const discounted = getDiscountedProducts();
		// Every catalogue product currently carries a badge + oldPrice.
		expect(discounted).toHaveLength(products.length);
		expect(discounted.map((p) => p.slug).sort()).toEqual(products.map((p) => p.slug).sort());
		expect(discounted[discounted.length - 1].slug).toBe('macbook-air-m2');
	});

	it('returns pairs-well-with products from complementary categories first', () => {
		const phone = getProduct('iphone-15-pro')!;
		const paired = getPairsWellWith(phone, 3);
		expect(paired).toHaveLength(3);
		expect(paired.map((p) => p.slug)).not.toContain('iphone-15-pro');
		expect(['accessories', 'audio']).toContain(paired[0].category);
		expect(['accessories', 'audio']).toContain(paired[1].category);

		const hub = getProduct('usb-c-hub')!;
		const hubPaired = getPairsWellWith(hub, 3);
		expect(hubPaired.map((p) => p.slug)).not.toContain('usb-c-hub');
		expect(hubPaired[0].category).toBe('computers');

		const gaming = getProduct('nintendo-switch')!;
		expect(getPairsWellWith(gaming, 3)[0].category).toBe('audio');
	});

	it('never returns the product itself, has no duplicates and keeps complements first, for every product', () => {
		const complements: Record<string, string[]> = {
			smartphones: ['accessories', 'audio'],
			computers: ['accessories'],
			audio: ['smartphones'],
			smartwatches: ['smartphones'],
			gaming: ['audio'],
			accessories: ['computers']
		};
		for (const product of products) {
			const paired = getPairsWellWith(product, 5);
			expect(paired).toHaveLength(5);
			expect(paired.map((p) => p.slug)).not.toContain(product.slug);
			expect(new Set(paired.map((p) => p.slug)).size).toBe(5);
			const wanted = complements[product.category] ?? [];
			const firstNonComplement = paired.findIndex((p) => !wanted.includes(p.category));
			if (firstNonComplement >= 0) {
				expect(
					paired.slice(firstNonComplement).every((p) => !wanted.includes(p.category)),
					`${product.slug}: complements must all precede the rest`
				).toBe(true);
			}
			expect(getPairsWellWith(product, 99)).toHaveLength(products.length - 1);
		}
	});
});

describe('filterProducts / sortProducts', () => {
	it('filters by category', () => {
		const result = filterProducts(products, { category: 'audio' }, 'en');
		expect(result.map((p) => p.slug).sort()).toEqual(['airpods-pro', 'sony-wh1000xm5']);
	});

	it('filters by maximum price', () => {
		const result = filterProducts(products, { maxPrice: 200 }, 'en');
		expect(result.every((p) => p.price <= 200)).toBe(true);
		expect(result.map((p) => p.slug).sort()).toEqual([
			'dualsense-controller',
			'magsafe-charger',
			'usb-c-hub'
		]);
	});

	it('searches localized names and descriptions', () => {
		expect(filterProducts(products, { query: 'watch' }, 'en').map((p) => p.slug).sort()).toEqual([
			'apple-watch-9',
			'galaxy-watch-6'
		]);
		expect(filterProducts(products, { query: 'montre' }, 'fr').length).toBeGreaterThan(0);
		expect(filterProducts(products, { query: 'zzz-no-match' }, 'en')).toHaveLength(0);
	});

	it('requires every word of a multi-word query to match (AND semantics)', () => {
		expect(filterProducts(products, { query: 'galaxy watch' }, 'en').map((p) => p.slug)).toEqual(
			['galaxy-watch-6']
		);
		// "noise cancelling" matches only Sony; "noise cancellation" only AirPods.
		expect(filterProducts(products, { query: 'noise cancelling' }, 'en').map((p) => p.slug)).toEqual(
			['sony-wh1000xm5']
		);
		expect(
			filterProducts(products, { query: 'noise cancellation' }, 'en').map((p) => p.slug)
		).toEqual(['airpods-pro']);
	});

	it('matches queries case-insensitively', () => {
		expect(filterProducts(products, { query: 'WATCH' }, 'en').map((p) => p.slug).sort()).toEqual([
			'apple-watch-9',
			'galaxy-watch-6'
		]);
		expect(filterProducts(products, { query: 'GaLaXy WaTcH' }, 'en').map((p) => p.slug)).toEqual(
			['galaxy-watch-6']
		);
		expect(filterProducts(products, { query: 'IPHONE' }, 'en').map((p) => p.slug)).toEqual([
			'iphone-15-pro'
		]);
	});

	it('combines a query with a category filter', () => {
		expect(
			filterProducts(products, { query: 'galaxy', category: 'smartphones' }, 'en').map(
				(p) => p.slug
			)
		).toEqual(['galaxy-s24']);
		expect(
			filterProducts(products, { query: 'galaxy', category: 'smartwatches' }, 'en').map(
				(p) => p.slug
			)
		).toEqual(['galaxy-watch-6']);
		expect(
			filterProducts(products, { query: 'watch', category: 'audio' }, 'en')
		).toHaveLength(0);
		expect(
			filterProducts(products, { query: 'watch', category: 'smartwatches' }, 'en').map(
				(p) => p.slug
			).sort()
		).toEqual(['apple-watch-9', 'galaxy-watch-6']);
	});

	it('trims surrounding whitespace and treats a blank query as no query', () => {
		expect(filterProducts(products, { query: '  watch  ' }, 'en').map((p) => p.slug).sort()).toEqual(
			['apple-watch-9', 'galaxy-watch-6']
		);
		expect(filterProducts(products, { query: '   ' }, 'en')).toHaveLength(products.length);
		expect(filterProducts(products, {}, 'en')).toHaveLength(products.length);
	});

	it('returns nothing when no product contains all query words', () => {
		expect(filterProducts(products, { query: 'titanium watch' }, 'en')).toHaveLength(0);
		expect(filterProducts(products, { query: 'watch charger' }, 'en')).toHaveLength(0);
		expect(
			filterProducts(products, { query: 'galaxy watch headphones' }, 'en')
		).toHaveLength(0);
	});

	it('sorts by price and rating', () => {
		const asc = sortProducts(products, 'price-asc');
		expect(asc[0].price).toBe(99);
		expect(asc[asc.length - 1].price).toBe(1499);
		const desc = sortProducts(products, 'price-desc');
		expect(desc[0].price).toBe(1499);
		const rated = sortProducts(products, 'rating');
		expect(rated[0].rating).toBe(4.9);
		expect(sortProducts(products, 'featured').map((p) => p.slug)).toEqual(
			products.map((p) => p.slug)
		);
	});
});
