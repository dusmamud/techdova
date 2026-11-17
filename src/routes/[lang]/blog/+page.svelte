<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
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

	// Client-side category filter only — no query params, so prerendering
	// is unaffected and the full list is in the prerendered HTML. The
	// English category name is the stable filter key across locales.
	const categories = [...new Map(blogPosts.map((post) => [post.category.en, post.category])).values()];
	let selectedCategory = $state<string | null>(null);

	const visiblePosts = $derived(
		selectedCategory ? blogPosts.filter((post) => post.category.en === selectedCategory) : blogPosts
	);

	const countText = $derived(
		visiblePosts.length === 1
			? t.blogPage.resultOne
			: interpolate(t.blogPage.results, { count: visiblePosts.length })
	);
</script>

<Seo {lang} title={t.meta.blogTitle} description={t.meta.blogDescription} path="/blog" />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<Breadcrumbs
		label={t.product.breadcrumbLabel}
		items={[
			{ label: t.nav.home, href: localizedPath(lang, '/') },
			{ label: t.blogPage.breadcrumbBlog }
		]}
	/>
	<h1 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl" use:reveal>
		{t.blogPage.title}
	</h1>
	<p class="mt-3 max-w-2xl leading-relaxed text-muted">{t.blogPage.description}</p>

	<div class="mt-8" use:reveal>
		<div class="flex flex-wrap gap-2" role="group" aria-label={t.blogPage.filterLabel}>
			<button
				type="button"
				aria-pressed={selectedCategory === null}
				onclick={() => {
					selectedCategory = null;
				}}
				class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft aria-pressed:bg-brand-700 aria-pressed:text-white aria-pressed:ring-brand-700"
			>
				{t.blogPage.allCategories}
			</button>
			{#each categories as category (category.en)}
				<button
					type="button"
					aria-pressed={selectedCategory === category.en}
					onclick={() => {
						selectedCategory = category.en;
					}}
					class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft aria-pressed:bg-brand-700 aria-pressed:text-white aria-pressed:ring-brand-700"
				>
					{localize(category, lang)}
				</button>
			{/each}
		</div>
		<p role="status" aria-live="polite" class="mt-4 text-sm font-medium text-muted">
			{countText}
		</p>
	</div>

	{#if visiblePosts.length === 0}
		<p class="mt-6 rounded-3xl bg-brand-50 px-6 py-10 text-center font-semibold text-ink dark:bg-surface-soft" use:reveal>
			{t.blogPage.noResults}
		</p>
	{:else}
	<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
		{#each visiblePosts as post, i (post.slug)}
			{@const title = localize(post.title, lang)}
			<article
				class="card-lift flex flex-col overflow-hidden rounded-3xl bg-surface ring-1 ring-line"
				use:reveal={{ delay: Math.min(i * 60, 300) }}
			>
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
					<h2 class="mt-3 text-lg font-bold leading-snug text-ink">
						<a
							href={localizedPath(lang, `/blog/${post.slug}`)}
							class="hover:text-brand-800 dark:hover:text-brand-200"
						>
							{title}
						</a>
					</h2>
					<p class="mt-2 flex-1 text-sm leading-relaxed text-muted">
						{localize(post.excerpt, lang)}
					</p>
					<p class="mt-4 text-sm text-muted">
						<time datetime={post.dateISO}>
							{formatDate(new Date(post.dateISO), intlLocale)}
						</time>
						{' · '}
						{interpolate(t.blogPage.readingTime, { minutes: post.readingMinutes })}
					</p>
					<p class="mt-2">
						<a
							href={localizedPath(lang, `/blog/${post.slug}`)}
							class="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700 dark:text-brand-300 hover:text-brand-800 dark:hover:text-brand-200"
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
	{/if}
</div>
