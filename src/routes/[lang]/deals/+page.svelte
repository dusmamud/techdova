<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import CountdownTimer from '#lib/components/CountdownTimer.svelte';
	import FilterBar, { type SortOption } from '#lib/components/FilterBar.svelte';
	import Picture from '#lib/components/Picture.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { SITE_URL } from '#lib/config';
	import { DEAL_END_ISO } from '#lib/data/deal';
	import { getDiscountedProducts, sortProducts, type SortKey } from '#lib/data/products';
	import { interpolate } from '#lib/format';
	import { getDictionary } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));

	// WebPage only: the deals page has no visible breadcrumb trail, so no
	// BreadcrumbList, and no ItemList (a product list earns no carousel).
	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/deals`,
		url: `${SITE_URL}/${lang}/deals`,
		name: t.dealsPage.title,
		description: t.meta.dealsDescription,
		inLanguage: lang
	});
	const allDeals = getDiscountedProducts();
	let sort = $state<SortKey>('featured');
	const deals = $derived(sortProducts(allDeals, sort));

	const sortOptions = $derived<SortOption[]>([
		{ value: 'featured', label: t.shop.sortFeatured },
		{ value: 'price-asc', label: t.shop.sortPriceAsc },
		{ value: 'price-desc', label: t.shop.sortPriceDesc },
		{ value: 'rating', label: t.shop.sortRating }
	]);

	function onSortChange(value: string): void {
		sort = ['featured', 'price-asc', 'price-desc', 'rating'].includes(value)
			? (value as SortKey)
			: 'featured';
	}

	const countText = $derived(
		deals.length === 1
			? t.dealsPage.resultOne
			: interpolate(t.dealsPage.results, { count: deals.length })
	);
</script>

<Seo {lang} title={t.meta.dealsTitle} description={t.meta.dealsDescription} path="/deals" />
<JsonLd json={webPageJsonLd} />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<h1 class="text-[1.75rem] font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
			{t.dealsPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.dealsPage.description}</p>
	</div>

	<div class="mt-6" use:reveal>
		<p class="text-sm font-semibold text-ink">{t.dealsPage.endsIn}</p>
		<div class="mt-2">
			<CountdownTimer targetIso={DEAL_END_ISO} labels={t.countdown} />
		</div>
	</div>

	{#if deals.length === 0}
		<div class="mt-8 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center dark:bg-surface-soft">
			<h2 class="text-xl font-bold text-ink">{t.dealsPage.empty}</h2>
			<p class="max-w-sm text-muted">{t.dealsPage.emptyHint}</p>
			<a
				href={localizedPath(lang, '/shop')}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.dealsPage.browseShop}
			</a>
		</div>
	{:else}
		<h2 class="sr-only">{t.filters.facetsHeading}</h2>
		<FilterBar
			{t}
			id="deals-filter-bar"
			resultCount={deals.length}
			resultText={countText}
			sortValue={sort}
			{sortOptions}
			onSortChange={onSortChange}
		/>
		{#key sort}
			<div
				class="mt-6 grid animate-grid-in grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
			>
				{#each deals as product (product.slug)}
					<ProductCard {product} {lang} {t} />
				{/each}
			</div>
		{/key}
	{/if}

	<section
		aria-labelledby="deals-promo-heading"
		class="mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-100 via-brand-50 to-white ring-1 ring-brand-100 dark:from-surface-strong dark:via-surface-soft dark:to-surface sm:mt-12"
		use:reveal
	>
		<div class="grid items-center gap-5 p-5 sm:gap-6 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10">
			<div>
				<p class="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-300">{t.promo.eyebrow}</p>
				<h2
					id="deals-promo-heading"
					class="mt-3 text-[1.625rem] font-bold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl"
				>
					{t.promo.titleA}
					<span class="block text-lg font-semibold text-ink-soft sm:text-xl lg:text-2xl">{t.promo.titleB}</span>
				</h2>
				<p class="mt-3 max-w-md leading-relaxed text-muted">{t.promo.subtitle}</p>
				<a
					href={localizedPath(lang, '/shop')}
					class="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-surface px-6 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
				>
					{t.promo.cta}
					<ArrowRight class="h-4 w-4" aria-hidden="true" />
				</a>
			</div>
			<div class="relative min-h-[220px] overflow-hidden rounded-3xl sm:min-h-[280px]">
				<Picture
					base="/images/promo-devices"
					alt={t.promo.imageAlt}
					width={2048}
					height={1152}
					loading="lazy"
					decoding="async"
					sizes="(max-width: 1023px) 100vw, 620px"
					class="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
		</div>
	</section>
</div>
