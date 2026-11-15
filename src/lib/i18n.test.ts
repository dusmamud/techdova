import { describe, expect, it } from 'vitest';
import { dictionaries, getDictionary, isLocale, locales } from '#lib/i18n/index';

function placeholders(value: string): string[] {
	return [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
}

function collectPaths(value: unknown, prefix: string, out: Map<string, unknown>): void {
	if (Array.isArray(value)) {
		out.set(prefix, value.length);
		value.forEach((item, i) => collectPaths(item, `${prefix}[${i}]`, out));
		return;
	}
	if (typeof value === 'object' && value !== null) {
		for (const [key, child] of Object.entries(value)) {
			collectPaths(child, prefix ? `${prefix}.${key}` : key, out);
		}
		return;
	}
	out.set(prefix, value);
}

describe('i18n dictionaries', () => {
	it('ships en + fr with en as the default locale', () => {
		expect(locales).toContain('en');
		expect(locales).toContain('fr');
		expect(isLocale('en')).toBe(true);
		expect(isLocale('fr')).toBe(true);
		expect(isLocale('de')).toBe(false);
		expect(getDictionary('en').localeName).toBe('English');
		expect(getDictionary('fr').localeName).toBe('Français');
	});

	it('has identical key shapes in every locale (missing keys fail here too)', () => {
		const reference = new Map<string, unknown>();
		collectPaths(dictionaries.en, '', reference);
		for (const locale of locales) {
			const actual = new Map<string, unknown>();
			collectPaths(dictionaries[locale], '', actual);
			expect([...actual.keys()].sort()).toEqual([...reference.keys()].sort());
			// Array lengths must match (hero slides, trust items, values, sections).
			for (const [path, length] of reference) {
				if (typeof length === 'number') expect(actual.get(path)).toBe(length);
			}
		}
	});

	it('has no empty strings in any locale', () => {
		for (const locale of locales) {
			const paths = new Map<string, unknown>();
			collectPaths(dictionaries[locale], '', paths);
			for (const [path, value] of paths) {
				if (typeof value === 'string') {
					expect(value.trim().length, `${locale}:${path}`).toBeGreaterThan(0);
				}
			}
		}
	});

	it('uses the same {placeholders} in every locale for each string', () => {
		const reference = new Map<string, unknown>();
		collectPaths(dictionaries.en, '', reference);
		for (const locale of locales) {
			const actual = new Map<string, unknown>();
			collectPaths(dictionaries[locale], '', actual);
			for (const [path, value] of reference) {
				if (typeof value === 'string' && typeof actual.get(path) === 'string') {
					expect(placeholders(actual.get(path) as string), `${locale}:${path}`).toEqual(
						placeholders(value)
					);
				}
			}
		}
	});

	it('declares distinct og/intl locale tags', () => {
		expect(dictionaries.en.meta.ogLocale).toBe('en_US');
		expect(dictionaries.fr.meta.ogLocale).toBe('fr_FR');
		expect(dictionaries.en.meta.intlLocale).toBe('en-US');
		expect(dictionaries.fr.meta.intlLocale).toBe('fr-FR');
	});
});
