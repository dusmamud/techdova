import { describe, expect, it } from 'vitest';
import { toggleCompareList } from '#lib/compare';

describe('toggleCompareList', () => {
	it('adds a slug that is not in the list', () => {
		expect(toggleCompareList([], 'iphone-15-pro')).toEqual({
			list: ['iphone-15-pro'],
			result: 'added'
		});
		expect(toggleCompareList(['a'], 'b')).toEqual({ list: ['a', 'b'], result: 'added' });
	});

	it('removes a slug that is already in the list', () => {
		expect(toggleCompareList(['a', 'b'], 'a')).toEqual({ list: ['b'], result: 'removed' });
	});

	it('refuses to grow past the cap and reports full', () => {
		const full = ['a', 'b', 'c', 'd'];
		expect(toggleCompareList(full, 'e')).toEqual({ list: full, result: 'full' });
		expect(toggleCompareList(full, 'e', 2)).toEqual({ list: full, result: 'full' });
	});

	it('still allows removing from a full list', () => {
		expect(toggleCompareList(['a', 'b', 'c', 'd'], 'c')).toEqual({
			list: ['a', 'b', 'd'],
			result: 'removed'
		});
	});

	it('does not mutate the input list', () => {
		const input = ['a'];
		toggleCompareList(input, 'b');
		expect(input).toEqual(['a']);
	});
});
