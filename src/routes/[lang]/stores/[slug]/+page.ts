import { error } from '@sveltejs/kit';
import { getStore, stores } from '#lib/data/stores';
import { locales } from '#lib/i18n/index';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	locales.flatMap((lang) => stores.map((store) => ({ lang, slug: store.slug })));

export const load: PageLoad = ({ params }) => {
	const store = getStore(params.slug);
	if (!store) error(404, 'Store not found');
	return { store };
};
