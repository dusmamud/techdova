<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import Picture from '#lib/components/Picture.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { SITE_URL } from '#lib/config';
	import { categories } from '#lib/data/categories';
	import { getProductsByCategory } from '#lib/data/products';
	import { interpolate } from '#lib/format';
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
				name: t.categoriesPage.title,
				item: `${SITE_URL}/${lang}/categories`
			}
		]
	});

	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/categories`,
		url: `${SITE_URL}/${lang}/categories`,
		name: t.categoriesPage.title,
		description: t.meta.categoriesDescription,
		inLanguage: lang
	});
</script>

<Seo {lang} title={t.meta.categoriesTitle} description={t.meta.categoriesDescription} path="/categories" />
<JsonLd json={breadcrumbJsonLd} />
<JsonLd json={webPageJsonLd} />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.categoriesPage.title }
			]}
		/>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			{t.categoriesPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.categoriesPage.description}</p>
		<p role="status" class="mt-4 text-sm font-medium text-muted">
			{interpolate(t.categoriesPage.count, { count: categories.length })}
		</p>
	</div>

	<div class="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
		{#each categories as category, i (category.slug)}
			<a
				href={localizedPath(lang, `/category/${category.slug}`)}
				aria-label={interpolate(t.categoriesPage.viewCategory, {
					category: localize(category.name, lang)
				})}
				class="group block overflow-hidden rounded-3xl bg-surface ring-1 ring-line"
				use:reveal={{ delay: Math.min(i * 60, 300) }}
			>
				<span class="block aspect-[16/10] overflow-hidden bg-brand-50">
					<Picture
						base={category.image}
						alt={localize(category.imageAlt, lang)}
						width={1600}
						height={1000}
						loading="lazy"
						decoding="async"
						sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 400px"
						class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				</span>
				<span class="block p-4 sm:p-5">
					<span class="block text-lg font-bold text-ink group-hover:text-brand-800 dark:group-hover:text-brand-200">
						{localize(category.name, lang)}
					</span>
					<span class="mt-1 block text-sm leading-relaxed text-muted">
						{localize(category.description, lang)}
					</span>
					<span class="mt-3 block text-sm font-semibold text-brand-700 dark:text-brand-300">
						{interpolate(t.categoriesPage.productsCount, {
							count: getProductsByCategory(category.slug).length
						})}
					</span>
				</span>
			</a>
		{/each}
	</div>

	<div class="mt-10 text-center" use:reveal>
		<a
			href={localizedPath(lang, '/shop')}
			class="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
		>
			{t.categoriesPage.shopAll}
			<ArrowRight class="h-4 w-4" aria-hidden="true" />
		</a>
	</div>
</div>
