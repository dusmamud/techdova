<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import Picture from '#lib/components/Picture.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { blogPosts } from '#lib/data/blog';
	import { formatDate, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const intlLocale = $derived(t.meta.intlLocale);
</script>

<Seo {lang} title={t.meta.blogTitle} description={t.meta.blogDescription} path="/blog" />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
		{t.blogPage.title}
	</h1>
	<p class="mt-3 max-w-2xl leading-relaxed text-neutral-600">{t.blogPage.description}</p>

	<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
		{#each blogPosts as post (post.slug)}
			{@const title = localize(post.title, lang)}
			<article class="flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-neutral-200">
				<a
					href={localizedPath(lang, `/blog/${post.slug}`)}
					class="block aspect-[16/9] overflow-hidden bg-brand-50"
					aria-label={title}
				>
					<Picture
						base={post.image}
						alt={localize(post.imageAlt, lang)}
						loading="lazy"
						decoding="async"
						class="h-full w-full object-cover"
					/>
				</a>
				<div class="flex flex-1 flex-col p-5">
					<p>
						<span
							class="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800"
						>
							{localize(post.category, lang)}
						</span>
					</p>
					<h2 class="mt-3 text-lg font-bold leading-snug text-neutral-900">
						<a
							href={localizedPath(lang, `/blog/${post.slug}`)}
							class="hover:text-brand-800"
						>
							{title}
						</a>
					</h2>
					<p class="mt-2 flex-1 text-sm leading-relaxed text-neutral-600">
						{localize(post.excerpt, lang)}
					</p>
					<p class="mt-4 text-sm text-neutral-500">
						<time datetime={post.dateISO}>
							{formatDate(new Date(post.dateISO), intlLocale)}
						</time>
						{' · '}
						{interpolate(t.blogPage.readingTime, { minutes: post.readingMinutes })}
					</p>
					<p class="mt-2">
						<a
							href={localizedPath(lang, `/blog/${post.slug}`)}
							class="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800"
						>
							{t.blogPage.readMore}
							<span class="sr-only">: {title}</span>
							<ArrowRight class="h-4 w-4" aria-hidden="true" />
						</a>
					</p>
				</div>
			</article>
		{/each}
	</div>
</div>
