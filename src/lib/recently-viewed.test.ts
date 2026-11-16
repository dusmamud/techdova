import { describe, expect, it } from 'vitest';
import { recordViewed } from '#lib/recently-viewed';

describe('recordViewed', () => {
	it('prepends the viewed slug', () => {
		expect(recordViewed(['a', 'b'], 'c')).toEqual(['c', 'a', 'b']);
		expect(recordViewed([], 'a')).toEqual(['a']);
	});

	it('moves a re-viewed slug to the front without duplicating it', () => {
		expect(recordViewed(['a', 'b', 'c'], 'b')).toEqual(['b', 'a', 'c']);
		expect(recordViewed(['a', 'b'], 'a')).toEqual(['a', 'b']);
	});

	it('caps the list at max, dropping the oldest', () => {
		expect(recordViewed(['a', 'b', 'c'], 'd', 3)).toEqual(['d', 'a', 'b']);
		const long = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
		expect(recordViewed(long, 'i')).toHaveLength(8);
		expect(recordViewed(long, 'i')[0]).toBe('i');
		expect(recordViewed(long, 'i')).not.toContain('h');
	});

	it('does not mutate the input list', () => {
		const input = ['a', 'b'];
		recordViewed(input, 'c');
		expect(input).toEqual(['a', 'b']);
	});
});
