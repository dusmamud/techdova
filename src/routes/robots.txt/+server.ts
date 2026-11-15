import { SITE_URL } from '#lib/config';

export const prerender = true;

export function GET(): Response {
	const body = ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n');
	return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
