import { describe, expect, it } from 'vitest';
import { addLine, computeTotals, removeLine, setLineQty } from '#lib/cart-math';
import { getProduct, type Product } from '#lib/data/products';

/** iPhone 15 Pro with two demo variants, for variant-aware math tests. */
function variantProduct(): Product {
	const base = getProduct('iphone-15-pro')!;
	return {
		...base,
		variants: [
			{
				id: 'storage-512',
				kind: 'storage',
				label: { en: '512 GB', fr: '512 Go' },
				priceDelta: 200,
				stock: 4
			},
			{
				id: 'color-blue',
				kind: 'color',
				label: { en: 'Blue Titanium', fr: 'Titane bleu' },
				priceDelta: 0,
				stock: 2,
				swatch: '#3b4a5c'
			}
		]
	};
}

function variantLookup(slug: string): Product | undefined {
	return slug === 'iphone-15-pro' ? variantProduct() : getProduct(slug);
}

describe('computeTotals', () => {
	it('is zero for an empty cart', () => {
		expect(computeTotals([], getProduct)).toEqual({ count: 0, subtotal: 0, savings: 0, total: 0 });
	});

	it('sums price x qty and counts items', () => {
		const totals = computeTotals(
			[
				{ slug: 'iphone-15-pro', qty: 2 },
				{ slug: 'magsafe-charger', qty: 1 }
			],
			getProduct
		);
		expect(totals.count).toBe(3);
		expect(totals.subtotal).toBe(999 * 2 + 99);
		expect(totals.total).toBe(totals.subtotal);
	});

	it('computes savings from old prices', () => {
		const totals = computeTotals([{ slug: 'iphone-15-pro', qty: 1 }], getProduct);
		expect(totals.savings).toBe(1169 - 999);
		const noDiscount = computeTotals([{ slug: 'magsafe-charger', qty: 1 }], getProduct);
		expect(noDiscount.savings).toBe(129 - 99);
	});

	it('ignores unknown slugs and non-positive quantities', () => {
		const totals = computeTotals(
			[
				{ slug: 'nope', qty: 5 },
				{ slug: 'iphone-15-pro', qty: 0 }
			],
			getProduct
		);
		expect(totals).toEqual({ count: 0, subtotal: 0, savings: 0, total: 0 });
	});
});

describe('addLine / setLineQty / removeLine', () => {
	it('adds new lines and accumulates quantities', () => {
		const lines = addLine([], 'iphone-15-pro', 1, 12);
		expect(lines).toEqual([{ slug: 'iphone-15-pro', qty: 1 }]);
		expect(addLine(lines, 'iphone-15-pro', 2, 12)).toEqual([{ slug: 'iphone-15-pro', qty: 3 }]);
	});

	it('clamps quantities to available stock', () => {
		expect(addLine([], 'dell-xps-13', 10, 3)).toEqual([{ slug: 'dell-xps-13', qty: 3 }]);
		expect(setLineQty([{ slug: 'dell-xps-13', qty: 1 }], 'dell-xps-13', 99, 3)).toEqual([
			{ slug: 'dell-xps-13', qty: 3 }
		]);
	});

	it('removes the line when quantity reaches zero', () => {
		const lines = [{ slug: 'iphone-15-pro', qty: 1 }];
		expect(setLineQty(lines, 'iphone-15-pro', 0, 12)).toEqual([]);
		expect(addLine(lines, 'iphone-15-pro', -5, 12)).toEqual([]);
	});

	it('removes only the requested line', () => {
		const lines = [
			{ slug: 'iphone-15-pro', qty: 1 },
			{ slug: 'airpods-pro', qty: 2 }
		];
		expect(removeLine(lines, 'airpods-pro')).toEqual([{ slug: 'iphone-15-pro', qty: 1 }]);
	});

	it('does not mutate the input array', () => {
		const lines = [{ slug: 'iphone-15-pro', qty: 1 }];
		addLine(lines, 'iphone-15-pro', 1, 12);
		expect(lines).toEqual([{ slug: 'iphone-15-pro', qty: 1 }]);
	});
});

describe('variant-aware lines', () => {
	it('prices lines with the variant delta and keeps savings unchanged', () => {
		const totals = computeTotals(
			[{ slug: 'iphone-15-pro', variantId: 'storage-512', qty: 1 }],
			variantLookup
		);
		expect(totals.subtotal).toBe(999 + 200);
		expect(totals.savings).toBe(1169 - 999);
		expect(totals.total).toBe(totals.subtotal);
	});

	it('falls back to the base price for an unknown variantId', () => {
		const totals = computeTotals(
			[{ slug: 'iphone-15-pro', variantId: 'nope', qty: 1 }],
			variantLookup
		);
		expect(totals.subtotal).toBe(999);
	});

	it('keeps default and variant lines separate and accumulates per variant', () => {
		const lines = addLine([], 'iphone-15-pro', 1, 12);
		const withVariant = addLine(lines, 'iphone-15-pro', 1, 4, 'storage-512');
		expect(withVariant).toHaveLength(2);
		const again = addLine(withVariant, 'iphone-15-pro', 2, 4, 'storage-512');
		expect(again).toEqual([
			{ slug: 'iphone-15-pro', qty: 1 },
			{ slug: 'iphone-15-pro', variantId: 'storage-512', qty: 3 }
		]);
	});

	it('clamps variant quantities to the per-variant cap', () => {
		expect(addLine([], 'iphone-15-pro', 9, 4, 'storage-512')).toEqual([
			{ slug: 'iphone-15-pro', variantId: 'storage-512', qty: 4 }
		]);
	});

	it('scopes setLineQty and removeLine to one variant line', () => {
		const lines = [
			{ slug: 'iphone-15-pro', qty: 1 },
			{ slug: 'iphone-15-pro', variantId: 'storage-512', qty: 2 }
		];
		expect(setLineQty(lines, 'iphone-15-pro', 3, 4, 'storage-512')).toEqual([
			{ slug: 'iphone-15-pro', qty: 1 },
			{ slug: 'iphone-15-pro', variantId: 'storage-512', qty: 3 }
		]);
		expect(removeLine(lines, 'iphone-15-pro')).toEqual([
			{ slug: 'iphone-15-pro', variantId: 'storage-512', qty: 2 }
		]);
		expect(removeLine(lines, 'iphone-15-pro', 'storage-512')).toEqual([
			{ slug: 'iphone-15-pro', qty: 1 }
		]);
	});
});
