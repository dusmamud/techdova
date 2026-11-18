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
		getBrands,
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
	// filter/sort vocabulary as the shop page: text query, max price, sort,
	// plus brand / rating / availability facets.
	let query = $state('');
	let sort = $state<SortKey>('featured');
	let sliderValue = $state(SLIDER_MAX);
	let selectedBrands = $state<string[]>([]);
	let minRating = $state<number | null>(null);
	let inStockOnly = $state(false);
	let onSaleOnly = $state(false);

	// Only brands present in this category are offered as facets.
	const brandOptions = $derived(
		getBrands().filter((brand) =>
			categoryProducts.some((product) => product.brand === brand)
		)
	);

	const maxPrice = $derived(sliderValue >= SLIDER_MAX ? null : sliderValue);
	const filtered = $derived(
		sortProducts(
			filterProducts(
				categoryProducts,
				{
					query,
					maxPrice,
					brands: selectedBrands.length > 0 ? selectedBrands : undefined,
					minRating,
					inStockOnly,
					onSaleOnly
				},
				lang
			),
			sort
		)
	);

	const filterSignature = $derived(
		[
			query,
			sort,
			maxPrice ?? '',
			selectedBrands.join(','),
			minRating ?? '',
			inStockOnly,
			onSaleOnly
		].join('|')
	);

	const countText = $derived(
		filtered.length === 1
			? interpolate(t.filters.showingOfOne, { total: categoryProducts.length })
			: interpolate(t.filters.showingOf, {
					shown: filtered.length,
					total: categoryProducts.length
				})
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
		(query.trim() !== '' ? 1 : 0) +
			(maxPrice !== null ? 1 : 0) +
			selectedBrands.length +
			(minRating !== null ? 1 : 0) +
			(inStockOnly ? 1 : 0) +
			(onSaleOnly ? 1 : 0)
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
			: []),
		...selectedBrands.map((brand) => ({ id: `brand:${brand}`, label: brand })),
		...(minRating !== null
			? [
					{
						id: 'rating',
						label: minRating === 4 ? t.filters.ratingFourPlus : t.filters.ratingThreePlus
					}
				]
			: []),
		...(inStockOnly ? [{ id: 'instock', label: t.filters.inStockOnly }] : []),
		...(onSaleOnly ? [{ id: 'onsale', label: t.filters.onSaleOnly }] : [])
	]);

	function toggleBrand(brand: string): void {
		selectedBrands = selectedBrands.includes(brand)
			? selectedBrands.filter((candidate) => candidate !== brand)
			: [...selectedBrands, brand];
	}

	function onSortChange(value: string): void {
		sort = ['featured', 'price-asc', 'price-desc', 'rating'].includes(value)
			? (value as SortKey)
			: 'featured';
	}

	function removeChip(id: string): void {
		if (id === 'q') query = '';
		if (id === 'maxPrice') sliderValue = SLIDER_MAX;
		if (id === 'rating') minRating = null;
		if (id === 'instock') inStockOnly = false;
		if (id === 'onsale') onSaleOnly = false;
		if (id.startsWith('brand:')) {
			const removed = id.slice('brand:'.length);
			selectedBrands = selectedBrands.filter((candidate) => candidate !== removed);
		}
	}

	function clearAllFilters(): void {
		query = '';
		sliderValue = SLIDER_MAX;
		sort = 'featured';
		selectedBrands = [];
		minRating = null;
		inStockOnly = false;
		onSaleOnly = false;
	}

	// Mobile drawer owns DRAFT filter state: opening syncs the drafts from
	// the applied filters, Apply writes them back, Clear resets the drafts.
	let drawerOpen = $state(false);
	let draftQuery = $state('');
	let draftSliderValue = $state(SLIDER_MAX);
	let draftBrands = $state<string[]>([]);
	let draftMinRating = $state<number | null>(null);
	let draftInStock = $state(false);
	let draftOnSale = $state(false);

	const draftMaxPrice = $derived(
		draftSliderValue >= SLIDER_MAX ? null : draftSliderValue
	);
	const draftResultCount = $derived(
		filterProducts(
			categoryProducts,
			{
				query: draftQuery,
				maxPrice: draftMaxPrice,
				brands: draftBrands.length > 0 ? draftBrands : undefined,
				minRating: draftMinRating,
				inStockOnly: draftInStock,
				onSaleOnly: draftOnSale
			},
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
		draftBrands = [...selectedBrands];
		draftMinRating = minRating;
		draftInStock = inStockOnly;
		draftOnSale = onSaleOnly;
		drawerOpen = true;
	}

	function toggleDraftBrand(brand: string): void {
		draftBrands = draftBrands.includes(brand)
			? draftBrands.filter((candidate) => candidate !== brand)
			: [...draftBrands, brand];
	}

	function applyDraft(): void {
		query = draftQuery;
		sliderValue = draftSliderValue;
		selectedBrands = [...draftBrands];
		minRating = draftMinRating;
		inStockOnly = draftInStock;
		onSaleOnly = draftOnSale;
		drawerOpen = false;
	}

	function clearDraft(): void {
		draftQuery = '';
		draftSliderValue = SLIDER_MAX;
		draftBrands = [];
		draftMinRating = null;
		draftInStock = false;
		draftOnSale = false;
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

	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/category/${category.slug}`,
		url: `${SITE_URL}/${lang}/category/${category.slug}`,
		name,
		description: interpolate(t.meta.categoryDescription, { category: name }),
		inLanguage: lang
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
<JsonLd json={webPageJsonLd} />

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
			sizes="(max-width: 639px) 112px, (max-width: 1023px) 160px, 192px"
			class="h-28 w-28 shrink-0 rounded-3xl bg-brand-50 object-cover sm:h-40 sm:w-40 lg:h-48 lg:w-48"
		/>
		<div class="min-w-0">
			<h1 class="text-[1.75rem] font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
				{name}
			</h1>
			<p class="mt-2 max-w-2xl leading-relaxed text-muted">{description}</p>
		</div>
	</div>

	<!-- Full-width search below lg; on desktop the search lives in the FilterBar controls. -->
	<div class="relative mt-6 lg:hidden">
		<label class="sr-only" for="category-search-mobile">{t.shop.searchLabel}</label>
		<Search
			class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
			aria-hidden="true"
		/>
		<input
			id="category-search-mobile"
			type="search"
			bind:value={query}
			placeholder={t.shop.searchPlaceholder}
			class="h-11 w-full rounded-full bg-surface-soft pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:bg-surface"
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
						class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
						aria-hidden="true"
					/>
					<input
						id="category-search"
						type="search"
						bind:value={query}
						placeholder={t.shop.searchPlaceholder}
						class="h-11 w-full rounded-full bg-surface-soft pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:bg-surface"
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
					<span class="whitespace-nowrap text-sm font-semibold text-ink" aria-live="polite">
						{priceDisplay}
					</span>
				</div>
			</div>
		{/snippet}
		{#snippet facets()}
			<h2 class="sr-only">{t.filters.facetsHeading}</h2>
			<div
				class="mt-4 hidden flex-wrap items-end gap-x-6 gap-y-4 border-t border-line pt-4 lg:flex"
			>
				<fieldset class="min-w-0">
					<legend class="text-sm font-semibold text-ink">{t.filters.brandsLabel}</legend>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each brandOptions as brand (brand)}
							<label
								class="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-sm font-medium ring-1 {selectedBrands.includes(brand)
									? 'bg-brand-50 text-brand-800 ring-brand-700 dark:bg-surface-soft'
									: 'text-ink-soft ring-line hover:bg-surface-soft'}"
							>
								<input
									type="checkbox"
									checked={selectedBrands.includes(brand)}
									onchange={() => toggleBrand(brand)}
									class="h-4 w-4 shrink-0 accent-brand-700"
								/>
								{brand}
							</label>
						{/each}
					</div>
				</fieldset>
				<fieldset class="min-w-0">
					<legend class="text-sm font-semibold text-ink">{t.filters.ratingLabel}</legend>
					<div class="mt-2 flex flex-wrap gap-2">
						<button
							type="button"
							aria-pressed={minRating === null}
							onclick={() => {
								minRating = null;
							}}
							class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ring-1 {minRating ===
							null
								? 'bg-brand-700 text-white ring-brand-700'
								: 'text-ink-soft ring-line hover:bg-surface-soft'}"
						>
							{t.filters.ratingAny}
						</button>
						<button
							type="button"
							aria-pressed={minRating === 4}
							onclick={() => {
								minRating = 4;
							}}
							class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ring-1 {minRating ===
							4
								? 'bg-brand-700 text-white ring-brand-700'
								: 'text-ink-soft ring-line hover:bg-surface-soft'}"
						>
							{t.filters.ratingFourPlus}
						</button>
						<button
							type="button"
							aria-pressed={minRating === 3}
							onclick={() => {
								minRating = 3;
							}}
							class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ring-1 {minRating ===
							3
								? 'bg-brand-700 text-white ring-brand-700'
								: 'text-ink-soft ring-line hover:bg-surface-soft'}"
						>
							{t.filters.ratingThreePlus}
						</button>
					</div>
				</fieldset>
				<div class="flex flex-wrap gap-2">
					<label
						class="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-sm font-medium ring-1 {inStockOnly
							? 'bg-brand-50 text-brand-800 ring-brand-700 dark:bg-surface-soft'
							: 'text-ink-soft ring-line hover:bg-surface-soft'}"
					>
						<input
							type="checkbox"
							checked={inStockOnly}
							onchange={() => {
								inStockOnly = !inStockOnly;
							}}
							class="h-4 w-4 shrink-0 accent-brand-700"
						/>
						{t.filters.inStockOnly}
					</label>
					<label
						class="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-sm font-medium ring-1 {onSaleOnly
							? 'bg-brand-50 text-brand-800 ring-brand-700 dark:bg-surface-soft'
							: 'text-ink-soft ring-line hover:bg-surface-soft'}"
					>
						<input
							type="checkbox"
							checked={onSaleOnly}
							onchange={() => {
								onSaleOnly = !onSaleOnly;
							}}
							class="h-4 w-4 shrink-0 accent-brand-700"
						/>
						{t.filters.onSaleOnly}
					</label>
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
		{#snippet facets()}
			<div class="space-y-6">
				<fieldset>
					<legend class="text-sm font-semibold text-ink">{t.filters.brandsLabel}</legend>
					<div class="mt-3 flex flex-wrap gap-2">
						{#each brandOptions as brand (brand)}
							<label
								class="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-sm font-medium ring-1 {draftBrands.includes(brand)
									? 'bg-brand-50 text-brand-800 ring-brand-700 dark:bg-surface-soft'
									: 'text-ink-soft ring-line hover:bg-surface-soft'}"
							>
								<input
									type="checkbox"
									checked={draftBrands.includes(brand)}
									onchange={() => toggleDraftBrand(brand)}
									class="h-4 w-4 shrink-0 accent-brand-700"
								/>
								{brand}
							</label>
						{/each}
					</div>
				</fieldset>
				<fieldset>
					<legend class="text-sm font-semibold text-ink">{t.filters.ratingLabel}</legend>
					<div class="mt-3 flex flex-wrap gap-2">
						<button
							type="button"
							aria-pressed={draftMinRating === null}
							onclick={() => {
								draftMinRating = null;
							}}
							class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ring-1 {draftMinRating ===
							null
								? 'bg-brand-700 text-white ring-brand-700'
								: 'text-ink-soft ring-line hover:bg-surface-soft'}"
						>
							{t.filters.ratingAny}
						</button>
						<button
							type="button"
							aria-pressed={draftMinRating === 4}
							onclick={() => {
								draftMinRating = 4;
							}}
							class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ring-1 {draftMinRating ===
							4
								? 'bg-brand-700 text-white ring-brand-700'
								: 'text-ink-soft ring-line hover:bg-surface-soft'}"
						>
							{t.filters.ratingFourPlus}
						</button>
						<button
							type="button"
							aria-pressed={draftMinRating === 3}
							onclick={() => {
								draftMinRating = 3;
							}}
							class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ring-1 {draftMinRating ===
							3
								? 'bg-brand-700 text-white ring-brand-700'
								: 'text-ink-soft ring-line hover:bg-surface-soft'}"
						>
							{t.filters.ratingThreePlus}
						</button>
					</div>
				</fieldset>
				<div class="flex flex-wrap gap-2">
					<label
						class="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-sm font-medium ring-1 {draftInStock
							? 'bg-brand-50 text-brand-800 ring-brand-700 dark:bg-surface-soft'
							: 'text-ink-soft ring-line hover:bg-surface-soft'}"
					>
						<input
							type="checkbox"
							checked={draftInStock}
							onchange={() => {
								draftInStock = !draftInStock;
							}}
							class="h-4 w-4 shrink-0 accent-brand-700"
						/>
						{t.filters.inStockOnly}
					</label>
					<label
						class="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-sm font-medium ring-1 {draftOnSale
							? 'bg-brand-50 text-brand-800 ring-brand-700 dark:bg-surface-soft'
							: 'text-ink-soft ring-line hover:bg-surface-soft'}"
					>
						<input
							type="checkbox"
							checked={draftOnSale}
							onchange={() => {
								draftOnSale = !draftOnSale;
							}}
							class="h-4 w-4 shrink-0 accent-brand-700"
						/>
						{t.filters.onSaleOnly}
					</label>
				</div>
			</div>
		{/snippet}
		<div class="space-y-6">
			<div>
				<label for="category-drawer-search" class="mb-1 block text-sm font-medium text-ink-soft">
					{t.shop.searchLabel}
				</label>
				<div class="relative">
					<Search
						class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
						aria-hidden="true"
					/>
					<input
						id="category-drawer-search"
						type="search"
						bind:value={draftQuery}
						placeholder={t.shop.searchPlaceholder}
						class="h-11 w-full rounded-full bg-surface-soft pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:bg-surface"
					/>
				</div>
			</div>
			<div>
				<div class="flex items-baseline justify-between gap-3">
					<label
						for="category-drawer-max-price"
						class="text-sm font-medium text-ink-soft"
					>
						{t.shop.priceLabel}
					</label>
					<span class="shrink-0 text-sm font-semibold text-ink" aria-live="polite">
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
		<div class="mt-6 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center dark:bg-surface-soft">
			<SearchX class="h-10 w-10 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			<h2 class="text-xl font-bold text-ink">{t.shop.noResults}</h2>
			<p class="max-w-sm text-muted">{t.shop.noResultsHint}</p>
			<button
				type="button"
				onclick={clearAllFilters}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.filters.clearAll}
			</button>
		</div>
	{:else}
		{#key filterSignature}
			<div
				class="mt-6 grid animate-grid-in grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
			>
				{#each filtered as product (product.slug)}
					<ProductCard {product} {lang} {t} />
				{/each}
			</div>
		{/key}
	{/if}

	<p class="mt-8">
		<a
			href={localizedPath(lang, '/shop')}
			class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
		>
			{t.categoryPage.backToShop}
		</a>
	</p>
</div>
