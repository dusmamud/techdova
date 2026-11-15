import { error } from '@sveltejs/kit';
import { getProduct, products } from '#lib/data/products';
import { locales } from '#lib/i18n/index';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	locales.flatMap((lang) => products.map((product) => ({ lang, slug: product.slug })));

export const load: PageLoad = ({ params }) => {
	const product = getProduct(params.slug);
	if (!product) error(404, 'Product not found');
	return { product };
};
