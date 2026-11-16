import { error } from '@sveltejs/kit';
import { blogPosts, getBlogPost } from '#lib/data/blog';
import { locales } from '#lib/i18n/index';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () =>
	locales.flatMap((lang) => blogPosts.map((post) => ({ lang, slug: post.slug })));

export const load: PageLoad = ({ params }) => {
	const post = getBlogPost(params.slug);
	if (!post) error(404, 'Blog post not found');
	return { post };
};
