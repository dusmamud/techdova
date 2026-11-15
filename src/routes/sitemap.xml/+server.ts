import { SITE_URL } from '#lib/config';
import { products } from '#lib/data/products';
import { defaultLocale, locales } from '#lib/i18n/index';

export const prerender = true;

const LASTMOD = '2026-11-15';

const staticPaths = ['', '/shop', '/about', '/contact', '/cart', '/terms', '/privacy'];

function absoluteUrl(locale: string, path: string): string {
	return `${SITE_URL}/${locale}${path}`;
}

export function GET(): Response {
	const paths = [...staticPaths, ...products.map((p) => `/product/${p.slug}`)];
	const entries = paths.flatMap((path) =>
		locales.map((locale) => {
			const alternates = locales
				.map(
					(l) =>
						`    <xhtml:link rel="alternate" hreflang="${l}" href="${absoluteUrl(l, path)}" />`
				)
				.join('\n');
			return [
				'  <url>',
				`    <loc>${absoluteUrl(locale, path)}</loc>`,
				`    <lastmod>${LASTMOD}</lastmod>`,
				alternates,
				`    <xhtml:link rel="alternate" hreflang="x-default" href="${absoluteUrl(defaultLocale, path)}" />`,
				'  </url>'
			].join('\n');
		})
	);
	const body = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
		...entries,
		'</urlset>'
	].join('\n');
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
