import { describe, expect, it } from 'vitest';
import { getRemaining, pad2 } from '#lib/countdown';

describe('getRemaining', () => {
	it('splits the difference into days, hours, minutes and seconds', () => {
		const now = Date.parse('2026-11-16T12:00:00+01:00');
		const target = now + ((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000;
		expect(getRemaining(target, now)).toEqual({
			days: 2,
			hours: 3,
			minutes: 4,
			seconds: 5,
			totalMs: ((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000,
			expired: false
		});
	});

	it('reports expired with all fields clamped to zero at and past the target', () => {
		const now = Date.parse('2026-11-30T23:59:59+01:00');
		expect(getRemaining(now, now)).toEqual({
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			totalMs: 0,
			expired: true
		});
		expect(getRemaining(now - 1000, now).expired).toBe(true);
		expect(getRemaining(now - 1000, now).totalMs).toBe(0);
	});

	it('floors partial seconds', () => {
		const now = 1000;
		expect(getRemaining(now + 1500, now).seconds).toBe(1);
		expect(getRemaining(now + 999, now).seconds).toBe(0);
	});
});

describe('pad2', () => {
	it('zero-pads single digits and leaves larger values alone', () => {
		expect(pad2(0)).toBe('00');
		expect(pad2(5)).toBe('05');
		expect(pad2(12)).toBe('12');
		expect(pad2(123)).toBe('123');
	});
});
