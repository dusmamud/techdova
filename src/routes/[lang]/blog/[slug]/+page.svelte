<script lang="ts">
	import { browser } from '$app/env';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Picture from '#lib/components/Picture.svelte';
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
	const relatedPosts = $derived(
		blogPosts
			.filter((item) => item.slug !== post.slug && item.category.en === post.category.en)
			.slice(0, 3)
	);

	// Reading progress: a scroll listener updates a 0–1 value rendered as
	// a transform scaleX bar. Browser-only; the bar starts empty during
	// prerender and fills only from real scrolling.
	let progress = $state(0);

	$effect(() => {
		if (!browser) return;
		const onScroll = (): void => {
			const total = document.documentElement.scrollHeight - window.innerHeight;
			progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
		};
	});

	const blogJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		description: excerpt,
		image: `${SITE_URL}${post.image}.jpg`,
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
	image={`${post.image}.jpg`}
/>
<JsonLd json={blogJsonLd} />

<div
	role="progressbar"
	aria-label={t.blogPage.progressLabel}
	aria-valuemin={0}
	aria-valuemax={100}
	aria-valuenow={Math.round(progress * 100)}
	class="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-brand-700"
	style="transform: scaleX({progress})"
></div>

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
	<Breadcrumbs
		label={t.product.breadcrumbLabel}
		items={[
			{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
			{ label: t.blogPage.breadcrumbBlog, href: localizedPath(lang, '/blog') },
			{ label: title }
		]}
	/>

	<article class="mt-4" use:reveal>
		<p>
			<span
				class="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800"
			>
				{localize(post.category, lang)}
			</span>
		</p>
		<h1 class="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
		<p class="mt-3 text-sm text-muted">
			<time datetime={post.dateISO}>
				{formatDate(new Date(post.dateISO), intlLocale)}
			</time>
			{' · '}
			{interpolate(t.blogPage.readingTime, { minutes: post.readingMinutes })}
		</p>
		<figure class="mt-6 overflow-hidden rounded-3xl bg-brand-50">
			<div class="aspect-[16/9]">
				<Picture
					base={post.image}
					alt={localize(post.imageAlt, lang)}
					decoding="async"
					fetchPriority="high"
					class="h-full w-full object-cover"
				/>
			</div>
		</figure>
		<div class="mt-6 space-y-4">
			{#each post.body as paragraph, i (i)}
				<p class="leading-relaxed text-muted">{localize(paragraph, lang)}</p>
			{/each}
		</div>
	</article>

	<div class="mt-10 grid gap-4 border-t border-line pt-6 sm:grid-cols-2" use:reveal>
		{#if prevPost}
			<a
				href={localizedPath(lang, `/blog/${prevPost.slug}`)}
				class="inline-flex min-h-11 items-center gap-2 rounded-3xl px-5 py-3 text-sm ring-1 ring-line hover:bg-surface-soft"
			>
				<ArrowLeft class="h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
				<span>
					<span class="block text-xs font-semibold uppercase tracking-wide text-muted">
						{t.blogPage.prevPost}
					</span>
					<span class="block font-semibold text-ink">
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
				class="inline-flex min-h-11 items-center justify-end gap-2 rounded-3xl px-5 py-3 text-right text-sm ring-1 ring-line hover:bg-surface-soft"
			>
				<span>
					<span class="block text-xs font-semibold uppercase tracking-wide text-muted">
						{t.blogPage.nextPost}
					</span>
					<span class="block font-semibold text-ink">
						{localize(nextPost.title, lang)}
					</span>
				</span>
				<ArrowRight class="h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			</a>
		{/if}
	</div>

	<p class="mt-6" use:reveal>
		<a
			href={localizedPath(lang, '/blog')}
			class="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700 dark:text-brand-300 hover:text-brand-800 dark:hover:text-brand-200"
		>
			<ArrowLeft class="h-4 w-4" aria-hidden="true" />
			{t.blogPage.backToBlog}
		</a>
	</p>

	{#if relatedPosts.length > 0}
		<section aria-labelledby="related-posts-heading" class="mt-10" use:reveal>
			<h2 id="related-posts-heading" class="text-xl font-bold text-ink">
				{t.blogPage.relatedTitle}
			</h2>
			<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each relatedPosts as related, i (related.slug)}
					{@const relatedTitle = localize(related.title, lang)}
					<article
						class="flex flex-col overflow-hidden rounded-3xl bg-surface ring-1 ring-line"
						use:reveal={{ delay: Math.min(i * 60, 300) }}
					>
						<a
							href={localizedPath(lang, `/blog/${related.slug}`)}
							class="block aspect-[16/9] overflow-hidden bg-brand-50"
							aria-label={relatedTitle}
						>
							<Picture
								base={related.image}
								alt={localize(related.imageAlt, lang)}
								loading="lazy"
								decoding="async"
								class="h-full w-full object-cover"
							/>
						</a>
						<div class="flex flex-1 flex-col p-4">
							<h3 class="font-bold leading-snug text-ink">
								<a
									href={localizedPath(lang, `/blog/${related.slug}`)}
									class="hover:text-brand-800 dark:hover:text-brand-200"
								>
									{relatedTitle}
								</a>
							</h3>
							<p class="mt-2 flex-1 text-sm leading-relaxed text-muted">
								{localize(related.excerpt, lang)}
							</p>
							<p class="mt-3 text-sm text-muted">
								<time datetime={related.dateISO}>
									{formatDate(new Date(related.dateISO), intlLocale)}
								</time>
								{' · '}
								{interpolate(t.blogPage.readingTime, { minutes: related.readingMinutes })}
							</p>
						</div>
					</article>
				{/each}
			</div>
		</section>
	{/if}
</div>
