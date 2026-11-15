import type { Locale } from '#lib/i18n/index';

/** Build a locale-prefixed absolute path, e.g. localizedPath('fr', '/shop') -> '/fr/shop'. */
export function localizedPath(locale: Locale, path: string): string {
	const clean = path.startsWith('/') ? path : `/${path}`;
	if (clean === '/') return `/${locale}`;
	return `/${locale}${clean}`;
}

export function productPath(locale: Locale, slug: string): string {
	return localizedPath(locale, `/product/${slug}`);
}

export function shopPath(locale: Locale, category?: string, query?: string): string {
	const params = new URLSearchParams();
	if (category) params.set('category', category);
	if (query) params.set('q', query);
	const suffix = params.toString();
	return localizedPath(locale, '/shop') + (suffix ? `?${suffix}` : '');
}

/** Swap the locale segment of the current pathname, preserving the rest of the route. */
export function switchLocalePath(pathname: string, newLocale: Locale): string {
	const segments = pathname.split('/').filter(Boolean);
	if (segments.length === 0) return `/${newLocale}`;
	segments[0] = newLocale;
	return `/${segments.join('/')}`;
}
