import { describe, expect, it } from 'vitest';
import { computeTotals } from '#lib/cart-math';
import { getPromoCode, promoCodes } from '#lib/data/promo-codes';
import { getProduct } from '#lib/data/products';

describe('getPromoCode', () => {
	it('finds each demo code with its percent', () => {
		expect(getPromoCode('TECHDOVA10')?.percent).toBe(10);
		expect(getPromoCode('WELCOME15')?.percent).toBe(15);
		expect(getPromoCode('SAVE20')?.percent).toBe(20);
	});

	it('matches case-insensitively and ignores surrounding whitespace', () => {
		expect(getPromoCode('  techdova10 ')).toEqual(getPromoCode('TECHDOVA10'));
		expect(getPromoCode('Welcome15')?.code).toBe('WELCOME15');
	});

	it('returns undefined for unknown or empty codes', () => {
		expect(getPromoCode('NOPE')).toBeUndefined();
		expect(getPromoCode('')).toBeUndefined();
		expect(getPromoCode('   ')).toBeUndefined();
	});

	it('gives every code a sane percent and a non-empty label in both locales', () => {
		for (const promo of promoCodes) {
			expect(promo.percent).toBeGreaterThan(0);
			expect(promo.percent).toBeLessThan(100);
			expect(promo.label.en.trim()).not.toBe('');
			expect(promo.label.fr.trim()).not.toBe('');
		}
	});
});

describe('computeTotals with a promo', () => {
	it('subtracts the promo discount from the total and reports it', () => {
		// MagSafe Charger: 99 DA, old price 129 DA.
		const totals = computeTotals([{ slug: 'magsafe-charger', qty: 1 }], getProduct, 10);
		expect(totals).toEqual({
			count: 1,
			subtotal: 99,
			savings: 30,
			total: 89.1,
			promoDiscount: 9.9
		});
	});

	it('applies the promo percent to the whole subtotal', () => {
		const totals = computeTotals(
			[
				{ slug: 'magsafe-charger', qty: 2 },
				{ slug: 'usb-c-hub', qty: 1 }
			],
			getProduct,
			20
		);
		// Subtotal 99 * 2 + 149 = 347; 20% = 69.4; total 277.6.
		expect(totals.subtotal).toBe(347);
		expect(totals.promoDiscount).toBe(69.4);
		expect(totals.total).toBe(277.6);
	});

	it('leaves list-price savings untouched', () => {
		const totals = computeTotals([{ slug: 'magsafe-charger', qty: 1 }], getProduct, 15);
		expect(totals.savings).toBe(30);
		expect(totals.promoDiscount).toBe(14.85);
		expect(totals.total).toBe(84.15);
	});

	it('omits promoDiscount when no promo percent is passed', () => {
		const totals = computeTotals([{ slug: 'magsafe-charger', qty: 1 }], getProduct);
		expect(totals.promoDiscount).toBeUndefined();
		expect(totals.total).toBe(totals.subtotal);
	});

	it('treats a zero percent like no promo', () => {
		const totals = computeTotals([{ slug: 'magsafe-charger', qty: 1 }], getProduct, 0);
		expect(totals.promoDiscount).toBeUndefined();
		expect(totals.total).toBe(99);
	});

	it('prices variant lines before applying the promo', () => {
		// iPhone 15 Pro 512 GB: 999 + 200 = 1199.
		const totals = computeTotals(
			[{ slug: 'iphone-15-pro', variantId: 'storage-512', qty: 1 }],
			getProduct,
			10
		);
		expect(totals.subtotal).toBe(1199);
		expect(totals.promoDiscount).toBe(119.9);
		expect(totals.total).toBe(1079.1);
	});
});
