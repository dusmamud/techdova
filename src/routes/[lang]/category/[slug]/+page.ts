import { error } from '@sveltejs/kit';
import { categorySlugs, getCategory, isCategorySlug } from '#lib/data/categories';
import { locales } from '#lib/i18n/index';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	locales.flatMap((lang) => categorySlugs.map((slug) => ({ lang, slug })));

export const load: PageLoad = ({ params }) => {
	if (!isCategorySlug(params.slug)) error(404, 'Category not found');
	return { category: getCategory(params.slug) };
};
