import { en } from './en';
import { fr } from './fr';

/**
 * i18n registry — typed custom dictionaries (no runtime, no build plugin, so it
 * prerenders cleanly with adapter-static).
 *
 * HOW TO ADD A LOCALE (no component changes):
 * 1. Create `src/lib/i18n/xx.ts` exporting `xx: Dictionary` (copy `en.ts`,
 *    translate every string — TypeScript errors on any missing/extra key).
 * 2. Add ONE line to the `dictionaries` object below: import the file and add
 *    `xx` to the object. `Locale`, `locales`, hreflang, the language switcher,
 *    sitemap and prerender entries all derive from this registry.
 */
export type Dictionary = typeof en;

export const dictionaries = { en, fr } satisfies Record<string, Dictionary>;

export type Locale = keyof typeof dictionaries;

export const locales = Object.keys(dictionaries) as Locale[];

export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
	return value in dictionaries;
}

export function getDictionary(locale: Locale): Dictionary {
	return dictionaries[locale];
}

/** Localized strings for data (products, categories) keyed by locale. */
export type LocalizedString = Record<Locale, string>;

export function localize(value: LocalizedString, locale: Locale): string {
	return value[locale] ?? value[defaultLocale];
}
