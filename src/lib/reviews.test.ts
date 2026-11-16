import { describe, expect, it } from 'vitest';
import { getRatingBreakdown, getReviewsForProduct, toggleVote } from '#lib/data/reviews';

describe('getRatingBreakdown', () => {
	it('sums to exactly 100 for every product-like rating', () => {
		for (const rating of [1, 2.5, 3, 4.5, 4.6, 4.7, 4.8, 4.9, 5]) {
			const breakdown = getRatingBreakdown(rating, 100);
			expect(breakdown.map((row) => row.stars)).toEqual([5, 4, 3, 2, 1]);
			expect(breakdown.reduce((sum, row) => sum + row.percent, 0)).toBe(100);
			for (const row of breakdown) {
				expect(Number.isInteger(row.percent)).toBe(true);
				expect(row.percent).toBeGreaterThanOrEqual(0);
			}
		}
	});

	it('has a weighted mean within 0.3 of the input rating', () => {
		for (const rating of [1, 2.5, 3, 4.5, 4.6, 4.7, 4.8, 4.9, 5]) {
			const breakdown = getRatingBreakdown(rating, 100);
			const mean =
				breakdown.reduce((sum, row) => sum + row.stars * row.percent, 0) / 100;
			expect(Math.abs(mean - rating)).toBeLessThanOrEqual(0.3);
		}
	});
});

describe('getReviewsForProduct', () => {
	it('returns 3 distinct reviews, deterministically', () => {
		const first = getReviewsForProduct('iphone-15-pro');
		const second = getReviewsForProduct('iphone-15-pro');
		expect(first).toHaveLength(3);
		expect(first).toEqual(second);
		expect(new Set(first.map((r) => r.id)).size).toBe(3);
	});

	it('varies the selection between different slugs', () => {
		const selections = ['iphone-15-pro', 'macbook-air-m2', 'airpods-pro', 'usb-c-hub'].map(
			(slug) => getReviewsForProduct(slug).map((r) => r.id).join(',')
		);
		expect(new Set(selections).size).toBeGreaterThan(1);
	});
});

describe('toggleVote', () => {
	it('adds an id that is not voted and removes one that is', () => {
		expect(toggleVote([], 'review-1')).toEqual(['review-1']);
		expect(toggleVote(['review-1'], 'review-1')).toEqual([]);
		expect(toggleVote(['review-1'], 'review-2')).toEqual(['review-1', 'review-2']);
	});

	it('does not mutate the input list', () => {
		const input = ['review-1'];
		toggleVote(input, 'review-2');
		expect(input).toEqual(['review-1']);
	});
});
