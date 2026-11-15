import { describe, expect, it } from 'vitest';
import { addLine, computeTotals, removeLine, setLineQty } from '#lib/cart-math';
import { getProduct } from '#lib/data/products';

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
