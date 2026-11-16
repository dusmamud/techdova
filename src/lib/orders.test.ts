import { describe, expect, it } from 'vitest';
import { generateOrderId, orderTotal, statusFromAge } from '#lib/orders';

describe('generateOrderId', () => {
	it('uses the TD- prefix with an uppercase base-36 timestamp', () => {
		expect(generateOrderId()).toMatch(/^TD-[0-9A-Z]+$/);
	});
});

describe('orderTotal', () => {
	it('sums qty x unitPrice', () => {
		expect(
			orderTotal([
				{ slug: 'iphone-15-pro', qty: 2, unitPrice: 999 },
				{ slug: 'magsafe-charger', qty: 1, unitPrice: 99 }
			])
		).toBe(2097);
		expect(orderTotal([])).toBe(0);
	});
});

describe('statusFromAge', () => {
	const placed = '2026-11-10T12:00:00+01:00';
	const placedMs = Date.parse(placed);
	const hour = 3600_000;

	it('is ordered under 24h and shipped at exactly 24h', () => {
		expect(statusFromAge(placed, placedMs + 23 * hour + 59 * 60_000)).toBe('ordered');
		expect(statusFromAge(placed, placedMs + 24 * hour)).toBe('shipped');
	});

	it('is shipped under 48h and out-for-delivery at exactly 48h', () => {
		expect(statusFromAge(placed, placedMs + 47 * hour)).toBe('shipped');
		expect(statusFromAge(placed, placedMs + 48 * hour)).toBe('out-for-delivery');
	});

	it('is out-for-delivery under 72h and delivered at exactly 72h', () => {
		expect(statusFromAge(placed, placedMs + 71 * hour)).toBe('out-for-delivery');
		expect(statusFromAge(placed, placedMs + 72 * hour)).toBe('delivered');
		expect(statusFromAge(placed, placedMs + 200 * hour)).toBe('delivered');
	});

	it('treats a future placed date as just ordered', () => {
		expect(statusFromAge(placed, placedMs - hour)).toBe('ordered');
	});
});
