import { describe, expect, it } from 'vitest';
import { getProductQA } from '#lib/data/product-qa';
import { products } from '#lib/data/products';

describe('getProductQA', () => {
	it('gives every product 2–3 Q&As', () => {
		for (const product of products) {
			const qa = getProductQA(product.slug);
			expect(qa.length).toBeGreaterThanOrEqual(2);
			expect(qa.length).toBeLessThanOrEqual(3);
		}
	});

	it('has a non-empty question and answer in both locales', () => {
		for (const product of products) {
			for (const item of getProductQA(product.slug)) {
				expect(item.question.en.trim()).not.toBe('');
				expect(item.question.fr.trim()).not.toBe('');
				expect(item.answer.en.trim()).not.toBe('');
				expect(item.answer.fr.trim()).not.toBe('');
			}
		}
	});

	it('returns [] for unknown slugs', () => {
		expect(getProductQA('no-such-product')).toEqual([]);
	});
});
