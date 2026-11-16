<script lang="ts">
	import { Search, SearchX } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import FilterBar, {
		type FilterChip,
		type SortOption
	} from '#lib/components/FilterBar.svelte';
	import FilterDrawer from '#lib/components/FilterDrawer.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Picture from '#lib/components/Picture.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { SITE_URL } from '#lib/config';
	import {
		filterProducts,
		getProductsByCategory,
		sortProducts,
		type SortKey
	} from '#lib/data/products';
	import { formatPrice, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const category = $derived(data.category);
	const name = $derived(localize(category.name, lang));
	const description = $derived(localize(category.description, lang));
	const categoryProducts = $derived(getProductsByCategory(category.slug));

	const SLIDER_MIN = 100;
	const SLIDER_MAX = 1500;
	const SLIDER_STEP = 50;

	// Local filter state (the category itself is fixed by the route). Same
	// filter/sort vocabulary as the shop page: text query, max price, sort.
	let query = $state('');
	let sort = $state<SortKey>('featured');
	let sliderValue = $state(SLIDER_MAX);

	const maxPrice = $derived(sliderValue >= SLIDER_MAX ? null : sliderValue);
	const filtered = $derived(
		sortProducts(
			filterProducts(categoryProducts, { query, maxPrice }, lang),
			sort
		)
	);

	const countText = $derived(
		filtered.length === 1
			? t.categoryPage.resultOne
			: interpolate(t.categoryPage.results, { count: filtered.length })
	);

	const sortOptions = $derived<SortOption[]>([
		{ value: 'featured', label: t.shop.sortFeatured },
		{ value: 'price-asc', label: t.shop.sortPriceAsc },
		{ value: 'price-desc', label: t.shop.sortPriceDesc },
		{ value: 'rating', label: t.shop.sortRating }
	]);

	const priceDisplay = $derived(
		sliderValue >= SLIDER_MAX
			? t.shop.priceAny
			: interpolate(t.shop.maxPriceLabel, {
					price: formatPrice(sliderValue, t.meta.intlLocale)
				})
	);

	const activeFilterCount = $derived(
		(query.trim() !== '' ? 1 : 0) + (maxPrice !== null ? 1 : 0)
	);

	const chips = $derived<FilterChip[]>([
		...(query.trim() !== '' ? [{ id: 'q', label: query.trim() }] : []),
		...(maxPrice !== null
			? [
					{
						id: 'maxPrice',
						label: interpolate(t.shop.maxPriceLabel, {
							price: formatPrice(maxPrice, t.meta.intlLocale)
						})
					}
				]
			: [])
	]);

	function onSortChange(value: string): void {
		sort = ['featured', 'price-asc', 'price-desc', 'rating'].includes(value)
			? (value as SortKey)
			: 'featured';
	}

	function removeChip(id: string): void {
		if (id === 'q') query = '';
		if (id === 'maxPrice') sliderValue = SLIDER_MAX;
	}

	function clearAllFilters(): void {
		query = '';
		sliderValue = SLIDER_MAX;
		sort = 'featured';
	}

	// Mobile drawer owns DRAFT filter state: opening syncs the drafts from
	// the applied filters, Apply writes them back, Clear resets the drafts.
	let drawerOpen = $state(false);
	let draftQuery = $state('');
	let draftSliderValue = $state(SLIDER_MAX);

	const draftMaxPrice = $derived(
		draftSliderValue >= SLIDER_MAX ? null : draftSliderValue
	);
	const draftResultCount = $derived(
		filterProducts(
			categoryProducts,
			{ query: draftQuery, maxPrice: draftMaxPrice },
			lang
		).length
	);
	const draftPriceDisplay = $derived(
		draftSliderValue >= SLIDER_MAX
			? t.shop.priceAny
			: interpolate(t.shop.maxPriceLabel, {
					price: formatPrice(draftSliderValue, t.meta.intlLocale)
				})
	);

	function openDrawer(): void {
		draftQuery = query;
		draftSliderValue = sliderValue;
		drawerOpen = true;
	}

	function applyDraft(): void {
		query = draftQuery;
		sliderValue = draftSliderValue;
		drawerOpen = false;
	}

	function clearDraft(): void {
		draftQuery = '';
		draftSliderValue = SLIDER_MAX;
	}

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
	image={`${category.image}.jpg`}
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

	<div class="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6" use:reveal>
		<Picture
			base={category.image}
			alt={localize(category.imageAlt, lang)}
			width={1600}
			height={1600}
			decoding="async"
			fetchPriority="high"
			class="h-28 w-28 shrink-0 rounded-3xl bg-brand-50 object-cover sm:h-40 sm:w-40 lg:h-48 lg:w-48"
		/>
		<div class="min-w-0">
			<h1 class="text-[1.75rem] font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
				{name}
			</h1>
			<p class="mt-2 max-w-2xl leading-relaxed text-neutral-600">{description}</p>
		</div>
	</div>

	<!-- Full-width search below lg; on desktop the search lives in the FilterBar controls. -->
	<div class="relative mt-6 lg:hidden">
		<label class="sr-only" for="category-search-mobile">{t.shop.searchLabel}</label>
		<Search
			class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
			aria-hidden="true"
		/>
		<input
			id="category-search-mobile"
			type="search"
			bind:value={query}
			placeholder={t.shop.searchPlaceholder}
			class="h-11 w-full rounded-full bg-neutral-100 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:bg-white"
		/>
	</div>

	<FilterBar
		{t}
		id="category-filter-bar"
		resultCount={filtered.length}
		resultText={countText}
		{activeFilterCount}
		onOpenFilters={openDrawer}
		hideFiltersButtonOnDesktop
		sortValue={sort}
		{sortOptions}
		onSortChange={onSortChange}
		{chips}
		onRemoveChip={removeChip}
		onClearAll={clearAllFilters}
	>
		{#snippet controls()}
			<div class="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
				<div class="relative w-52 shrink-0 xl:w-64">
					<label class="sr-only" for="category-search">{t.shop.searchLabel}</label>
					<Search
						class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
						aria-hidden="true"
					/>
					<input
						id="category-search"
						type="search"
						bind:value={query}
						placeholder={t.shop.searchPlaceholder}
						class="h-11 w-full rounded-full bg-neutral-100 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:bg-white"
					/>
				</div>
				<div class="flex shrink-0 items-center gap-2">
					<label for="category-max-price" class="sr-only">{t.shop.priceLabel}</label>
					<input
						id="category-max-price"
						type="range"
						min={SLIDER_MIN}
						max={SLIDER_MAX}
						step={SLIDER_STEP}
						bind:value={sliderValue}
						class="h-11 w-24 accent-brand-700 xl:w-32"
					/>
					<span class="whitespace-nowrap text-sm font-semibold text-neutral-900" aria-live="polite">
						{priceDisplay}
					</span>
				</div>
			</div>
		{/snippet}
	</FilterBar>

	<FilterDrawer
		{t}
		open={drawerOpen}
		onClose={() => {
			drawerOpen = false;
		}}
		onApply={applyDraft}
		onClear={clearDraft}
		resultCount={draftResultCount}
		id="category-filter-drawer"
	>
		<div class="space-y-6">
			<div>
				<label for="category-drawer-search" class="mb-1 block text-sm font-medium text-neutral-700">
					{t.shop.searchLabel}
				</label>
				<div class="relative">
					<Search
						class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
						aria-hidden="true"
					/>
					<input
						id="category-drawer-search"
						type="search"
						bind:value={draftQuery}
						placeholder={t.shop.searchPlaceholder}
						class="h-11 w-full rounded-full bg-neutral-100 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:bg-white"
					/>
				</div>
			</div>
			<div>
				<div class="flex items-baseline justify-between gap-3">
					<label
						for="category-drawer-max-price"
						class="text-sm font-medium text-neutral-700"
					>
						{t.shop.priceLabel}
					</label>
					<span class="shrink-0 text-sm font-semibold text-neutral-900" aria-live="polite">
						{draftPriceDisplay}
					</span>
				</div>
				<input
					id="category-drawer-max-price"
					type="range"
					min={SLIDER_MIN}
					max={SLIDER_MAX}
					step={SLIDER_STEP}
					bind:value={draftSliderValue}
					class="h-11 w-full accent-brand-700"
				/>
			</div>
		</div>
	</FilterDrawer>

	{#if filtered.length === 0}
		<div class="mt-6 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center">
			<SearchX class="h-10 w-10 text-brand-700" aria-hidden="true" />
			<h2 class="text-xl font-bold text-neutral-900">{t.shop.noResults}</h2>
			<p class="max-w-sm text-neutral-600">{t.shop.noResultsHint}</p>
			<button
				type="button"
				onclick={clearAllFilters}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.filters.clearAll}
			</button>
		</div>
	{:else}
		<div
			class="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
			use:reveal
		>
			{#each filtered as product (product.slug)}
				<ProductCard {product} {lang} {t} />
			{/each}
		</div>
	{/if}

	<p class="mt-8">
		<a
			href={localizedPath(lang, '/shop')}
			class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
		>
			{t.categoryPage.backToShop}
		</a>
	</p>
</div>
