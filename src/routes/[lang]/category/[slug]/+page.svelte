<script lang="ts">
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { SITE_URL } from '#lib/config';
	import { getProductsByCategory } from '#lib/data/products';
	import { interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const category = $derived(data.category);
	const name = $derived(localize(category.name, lang));
	const description = $derived(localize(category.description, lang));
	const products = $derived(getProductsByCategory(category.slug));

	const countText = $derived(
		products.length === 1
			? t.categoryPage.resultOne
			: interpolate(t.categoryPage.results, { count: products.length })
	);

	const breadcrumbJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: t.nav.home,
				item: `${SITE_URL}/${lang}`
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: t.nav.shop,
				item: `${SITE_URL}/${lang}/shop`
			},
			{
				'@type': 'ListItem',
				position: 3,
				name,
				item: `${SITE_URL}/${lang}/category/${category.slug}`
			}
		]
	});
</script>

<Seo
	{lang}
	title={interpolate(t.meta.categoryTitle, { category: name })}
	description={interpolate(t.meta.categoryDescription, { category: name })}
	path="/category/{category.slug}"
	image={category.image}
/>
<JsonLd json={breadcrumbJsonLd} />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<Breadcrumbs
		label={t.categoryPage.breadcrumbLabel}
		items={[
			{ label: t.nav.home, href: localizedPath(lang, '/') },
			{ label: t.nav.shop, href: localizedPath(lang, '/shop') },
			{ label: name }
		]}
	/>

	<div class="mt-2 flex flex-col gap-6 sm:flex-row sm:items-center">
		<img
			src={category.image}
			alt={localize(category.imageAlt, lang)}
			width="1600"
			height="1600"
			decoding="async"
			fetchpriority="high"
			class="h-40 w-40 shrink-0 rounded-3xl bg-brand-50 object-cover sm:h-48 sm:w-48"
		/>
		<div class="min-w-0">
			<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{name}</h1>
			<p class="mt-2 max-w-2xl leading-relaxed text-neutral-600">{description}</p>
			<p role="status" aria-live="polite" class="mt-3 text-sm font-medium text-neutral-600">
				{countText}
			</p>
		</div>
	</div>

	<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each products as product (product.slug)}
			<ProductCard {product} {lang} {t} />
		{/each}
	</div>

	<p class="mt-8">
		<a
			href={localizedPath(lang, '/shop')}
			class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
		>
			{t.categoryPage.backToShop}
		</a>
	</p>
</div>
