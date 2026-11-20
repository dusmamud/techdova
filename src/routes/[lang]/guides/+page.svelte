<script lang="ts">
	import { ArrowRight, BookOpen } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import Picture from '#lib/components/Picture.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { SITE_URL } from '#lib/config';
	import { blogPosts } from '#lib/data/blog';
	import { categories, type CategorySlug } from '#lib/data/categories';
	import { formatDate, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));

	const breadcrumbJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: t.product.breadcrumbHome,
				item: `${SITE_URL}/${lang}`
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: t.guidesPage.title,
				item: `${SITE_URL}/${lang}/guides`
			}
		]
	});

	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/guides`,
		url: `${SITE_URL}/${lang}/guides`,
		name: t.guidesPage.title,
		description: t.meta.guidesDescription,
		inLanguage: lang
	});

	// Which catalogue category each guide is about, by blog slug.
	const guideCategories: Record<string, CategorySlug> = {
		'choosing-noise-cancelling-headphones': 'audio',
		'laptop-buying-guide-2026': 'computers',
		'smartwatch-health-features': 'smartwatches',
		'mechanical-vs-membrane-keyboards': 'gaming',
		'getting-started-with-sleep-tracking': 'smartwatches',
		'what-to-look-for-in-wireless-earbuds': 'audio'
	};

	const intlLocale = $derived(t.meta.intlLocale);
</script>

<Seo {lang} title={t.meta.guidesTitle} description={t.meta.guidesDescription} path="/guides" />
<JsonLd json={breadcrumbJsonLd} />
<JsonLd json={webPageJsonLd} />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.guidesPage.title }
			]}
		/>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			{t.guidesPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.guidesPage.description}</p>
	</div>

	<section aria-labelledby="guides-heading" class="mt-10" use:reveal>
		<h2 id="guides-heading" class="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
			{t.guidesPage.guidesHeading}
		</h2>
		<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each blogPosts as post, i (post.slug)}
				<article
					class="flex flex-col overflow-hidden rounded-3xl bg-surface ring-1 ring-line"
					use:reveal={{ delay: Math.min(i * 60, 300) }}
				>
					<a
						href={localizedPath(lang, `/blog/${post.slug}`)}
						tabindex="-1"
						aria-hidden="true"
						class="block"
					>
						<span class="block aspect-[16/10] overflow-hidden bg-brand-50">
							<Picture
								base={post.image}
								alt={localize(post.imageAlt, lang)}
								width={1600}
								height={1000}
								loading="lazy"
								decoding="async"
								sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 400px"
								class="h-full w-full object-cover"
							/>
						</span>
					</a>
					<div class="flex flex-1 flex-col p-5">
						<p class="text-xs font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-300">
							{localize(post.category, lang)} · {interpolate(t.guidesPage.readingMinutes, {
								minutes: post.readingMinutes
							})}
						</p>
						<h3 class="mt-2 text-lg font-bold leading-snug text-ink">
							<a
								href={localizedPath(lang, `/blog/${post.slug}`)}
								class="hover:text-brand-800 dark:hover:text-brand-200"
							>
								{localize(post.title, lang)}
							</a>
						</h3>
						<p class="mt-2 text-sm leading-relaxed text-muted">
							{localize(post.excerpt, lang)}
						</p>
						<p class="mt-3 text-xs text-muted">
							{formatDate(new Date(`${post.dateISO}T00:00:00`), intlLocale)}
						</p>
						<a
							href={localizedPath(lang, `/blog/${post.slug}`)}
							class="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700 dark:text-brand-300 hover:text-brand-800 dark:hover:text-brand-200"
						>
							{t.guidesPage.readGuide}
							<ArrowRight class="h-4 w-4" aria-hidden="true" />
						</a>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section aria-labelledby="guides-categories-heading" class="mt-14" use:reveal>
		<h2
			id="guides-categories-heading"
			class="text-2xl font-bold tracking-tight text-ink sm:text-3xl"
		>
			{t.guidesPage.categoriesHeading}
		</h2>
		<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each categories as category, i (category.slug)}
				{@const guides = blogPosts.filter((post) => guideCategories[post.slug] === category.slug)}
				{#if guides.length > 0}
					<div
						class="rounded-3xl bg-brand-50 p-5 dark:bg-surface-soft"
						use:reveal={{ delay: Math.min(i * 60, 300) }}
					>
						<BookOpen class="h-6 w-6 text-brand-700 dark:text-brand-300" aria-hidden="true" />
						<h3 class="mt-3 font-semibold text-ink">{localize(category.name, lang)}</h3>
						<ul class="mt-2 space-y-2 text-sm">
							{#each guides as guide (guide.slug)}
								<li>
									<a
										href={localizedPath(lang, `/blog/${guide.slug}`)}
										class="font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
									>
										{localize(guide.title, lang)}
									</a>
								</li>
							{/each}
						</ul>
						<a
							href={localizedPath(lang, `/category/${category.slug}`)}
							class="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700 dark:text-brand-300 hover:text-brand-800 dark:hover:text-brand-200"
						>
							{interpolate(t.guidesPage.shopCategory, {
								category: localize(category.name, lang)
							})}
							<ArrowRight class="h-4 w-4" aria-hidden="true" />
						</a>
					</div>
				{/if}
			{/each}
		</div>
	</section>
</div>
