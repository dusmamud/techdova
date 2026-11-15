import { describe, expect, it } from 'vitest';
import { formatCount, formatDate, formatDecimal, formatPrice, interpolate } from '#lib/format';

describe('formatPrice', () => {
	it('formats English prices with a dot decimal and DA suffix', () => {
		expect(formatPrice(999, 'en-US')).toBe('999.00 DA');
		expect(formatPrice(1299, 'en-US')).toBe('1,299.00 DA');
	});

	it('formats French prices with a comma decimal and DA suffix', () => {
		expect(formatPrice(999, 'fr-FR')).toBe('999,00 DA');
		const large = formatPrice(1299, 'fr-FR');
		expect(large.endsWith('299,00 DA')).toBe(true);
		expect(large).toContain('1');
	});

	it('always shows two decimals', () => {
		expect(formatPrice(100, 'en-US')).toBe('100.00 DA');
		expect(formatPrice(99.5, 'en-US')).toBe('99.50 DA');
	});
});

describe('formatCount / formatDecimal / formatDate', () => {
	it('formats counts per locale', () => {
		expect(formatCount(124, 'en-US')).toBe('124');
		expect(formatCount(1203, 'en-US')).toBe('1,203');
	});

	it('formats decimals per locale', () => {
		expect(formatDecimal(4.8, 'en-US')).toBe('4.8');
		expect(formatDecimal(4.8, 'fr-FR')).toBe('4,8');
	});

	it('formats dates per locale', () => {
		const date = new Date(2026, 10, 15);
		expect(formatDate(date, 'en-US')).toContain('2026');
		expect(formatDate(date, 'fr-FR')).toContain('2026');
	});
});

describe('interpolate', () => {
	it('replaces placeholders', () => {
		expect(interpolate('Hello {name}, you have {count} items', { name: 'Aya', count: 3 })).toBe(
			'Hello Aya, you have 3 items'
		);
	});

	it('leaves unknown placeholders empty', () => {
		expect(interpolate('Order {orderId}', {})).toBe('Order ');
	});
});
