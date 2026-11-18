import { SITE_URL } from '#lib/config';
import { blogPosts } from '#lib/data/blog';
import { categorySlugs } from '#lib/data/categories';
import { products } from '#lib/data/products';
import { defaultLocale, locales } from '#lib/i18n/index';

export const prerender = true;

const staticPaths = [
	'',
	'/shop',
	'/about',
	'/contact',
	'/terms',
	'/privacy',
	// NOTE: noindex pages are deliberately excluded — noindex pages do
	// not belong in a sitemap. Excluded: /order-confirmation
	// (session-specific) and the utility pages /cart, /checkout,
	// /account, /search, /wishlist, /compare and /track-order.
	'/faq',
	'/shipping',
	'/returns',
	'/payment',
	'/testimonials',
	'/deals',
	'/blog',
	'/sitemap',
	'/accessibility',
	'/stores',
	'/gift-cards',
	'/help',
	'/new-arrivals',
	'/best-sellers',
	'/brands',
	'/rewards',
	'/trade-in',
	'/financing',
	'/warranty',
	'/cookies'
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
