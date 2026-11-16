import { SITE_URL } from '#lib/config';
import { blogPosts } from '#lib/data/blog';
import { categorySlugs } from '#lib/data/categories';
import { products } from '#lib/data/products';
import { defaultLocale, locales } from '#lib/i18n/index';

export const prerender = true;

const LASTMOD = '2026-11-16';

const staticPaths = [
	'',
	'/shop',
	'/about',
	'/contact',
	'/cart',
	'/terms',
	'/privacy',
	'/checkout',
	// NOTE: /order-confirmation is deliberately excluded — it is noindex
	// (session-specific) and noindex pages do not belong in a sitemap.
	'/faq',
	'/shipping',
	'/returns',
	'/payment',
	'/search',
	'/wishlist',
	'/testimonials',
	'/account',
	'/track-order',
	'/compare',
	'/deals',
	'/blog',
	'/sitemap',
	'/accessibility',
	'/stores',
	'/gift-cards',
	'/help',
	'/new-arrivals',
	'/best-sellers'
];

function absoluteUrl(locale: string, path: string): string {
	return `${SITE_URL}/${locale}${path}`;
}

export function GET(): Response {
	const paths = [
		...staticPaths,
		...categorySlugs.map((slug) => `/category/${slug}`),
		...blogPosts.map((p) => `/blog/${p.slug}`),
		...products.map((p) => `/product/${p.slug}`)
	];
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
