<script lang="ts">
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { SITE_NAME, SITE_URL } from '#lib/config';
	import { blogPosts } from '#lib/data/blog';
	import { formatDate, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const post = $derived(data.post);
	const title = $derived(localize(post.title, lang));
	const excerpt = $derived(localize(post.excerpt, lang));
	const intlLocale = $derived(t.meta.intlLocale);
	const index = $derived(blogPosts.findIndex((item) => item.slug === post.slug));
	const prevPost = $derived(index > 0 ? blogPosts[index - 1] : undefined);
	const nextPost = $derived(index >= 0 && index < blogPosts.length - 1 ? blogPosts[index + 1] : undefined);

	const blogJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		description: excerpt,
		image: `${SITE_URL}${post.image}`,
		datePublished: post.dateISO,
		author: {
			'@type': 'Organization',
			name: SITE_NAME,
			url: SITE_URL
		}
	});
</script>

<Seo
	{lang}
	title="{title} | {SITE_NAME}"
	description={excerpt}
	path="/blog/{post.slug}"
	image={post.image}
/>
<JsonLd json={blogJsonLd} />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
	<Breadcrumbs
		label={t.product.breadcrumbLabel}
		items={[
			{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
			{ label: t.blogPage.breadcrumbBlog, href: localizedPath(lang, '/blog') },
			{ label: title }
		]}
	/>

	<article class="mt-4">
		<p>
			<span
				class="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800"
			>
				{localize(post.category, lang)}
			</span>
		</p>
		<h1 class="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{title}</h1>
		<p class="mt-3 text-sm text-neutral-500">
			<time datetime={post.dateISO}>
				{formatDate(new Date(post.dateISO), intlLocale)}
			</time>
			{' · '}
			{interpolate(t.blogPage.readingTime, { minutes: post.readingMinutes })}
		</p>
		<figure class="mt-6 overflow-hidden rounded-3xl bg-brand-50">
			<div class="aspect-[16/9]">
				<img
					src={post.image}
					alt={localize(post.imageAlt, lang)}
					decoding="async"
					fetchpriority="high"
					class="h-full w-full object-cover"
				/>
			</div>
		</figure>
		<div class="mt-6 space-y-4">
			{#each post.body as paragraph, i (i)}
				<p class="leading-relaxed text-neutral-600">{localize(paragraph, lang)}</p>
			{/each}
		</div>
	</article>

	<div class="mt-10 grid gap-4 border-t border-neutral-200 pt-6 sm:grid-cols-2">
		{#if prevPost}
			<a
				href={localizedPath(lang, `/blog/${prevPost.slug}`)}
				class="inline-flex min-h-11 items-center gap-2 rounded-3xl px-5 py-3 text-sm ring-1 ring-neutral-200 hover:bg-neutral-50"
			>
				<ArrowLeft class="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
				<span>
					<span class="block text-xs font-semibold uppercase tracking-wide text-neutral-500">
						{t.blogPage.prevPost}
					</span>
					<span class="block font-semibold text-neutral-900">
						{localize(prevPost.title, lang)}
					</span>
				</span>
			</a>
		{:else}
			<span></span>
		{/if}
		{#if nextPost}
			<a
				href={localizedPath(lang, `/blog/${nextPost.slug}`)}
				class="inline-flex min-h-11 items-center justify-end gap-2 rounded-3xl px-5 py-3 text-right text-sm ring-1 ring-neutral-200 hover:bg-neutral-50"
			>
				<span>
					<span class="block text-xs font-semibold uppercase tracking-wide text-neutral-500">
						{t.blogPage.nextPost}
					</span>
					<span class="block font-semibold text-neutral-900">
						{localize(nextPost.title, lang)}
					</span>
				</span>
				<ArrowRight class="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
			</a>
		{/if}
	</div>

	<p class="mt-6">
		<a
			href={localizedPath(lang, '/blog')}
			class="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
		>
			<ArrowLeft class="h-4 w-4" aria-hidden="true" />
			{t.blogPage.backToBlog}
		</a>
	</p>
</div>
