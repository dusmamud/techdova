import { error } from '@sveltejs/kit';
import { isLocale } from '#lib/i18n/index';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = ({ params }) => {
	if (!isLocale(params.lang)) error(404, 'Unknown locale');
	return { lang: params.lang };
};
