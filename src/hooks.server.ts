import type { Handle } from '@sveltejs/kit/hooks';
import { isLocale } from '#lib/i18n/index';

/**
 * Runs at prerender time (and only there — the output is fully static).
 * Sets the correct <html lang> per locale page by rewriting the app.html
 * placeholder value. Root and unknown paths default to English.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const firstSegment = event.url.pathname.split('/')[1] ?? '';
	const lang = isLocale(firstSegment) ? firstSegment : 'en';
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('<html lang="en">', `<html lang="${lang}">`)
	});
};
