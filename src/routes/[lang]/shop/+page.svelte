<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { Check, Search, SearchX } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import FilterBar, {
		type FilterChip,
		type SortOption
	} from '#lib/components/FilterBar.svelte';
	import FilterDrawer from '#lib/components/FilterDrawer.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { categories, getCategory, isCategorySlug, type CategorySlug } from '#lib/data/categories';
	import {
		filterProducts,
		getBrands,
		products,
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

	const SLIDER_MIN = 100;
	const SLIDER_MAX = 1500;
	const SLIDER_STEP = 50;

	// Query params are unavailable during prerendering, so filter state lives in
	// `applied`: defaults at prerender time, then synced from the URL in a
	// client-only $effect (which never runs during SSR/prerender).
	// SvelteKit 3 shallow routing: `replaceState` does NOT update `page.url`
	// — the new URL lands in `page.shallow.url` instead, and `page.url` keeps
	// the last full navigation. Reading only `page.url` would leave this
	// effect deaf to every replaceState filter change (search, sort, price,
	// drawer Apply). `page.shallow?.url ?? page.url` covers both: a full
	// navigation clears `shallow` and updates `page.url`, a shallow one sets
	// `shallow` and leaves `page.url` stale.
	type ShopParams = {
		q: string;
		category: CategorySlug | null;
		sort: SortKey;
		maxPrice: number | null;
		brands: string[];
		minRating: number | null;
		inStockOnly: boolean;
		onSaleOnly: boolean;
	};
	let applied = $state<ShopParams>({
		q: '',
		category: null,
		sort: 'featured',
		maxPrice: null,
		brands: [],
		minRating: null,
		inStockOnly: false,
		onSaleOnly: false
	});

	$effect(() => {
		const sp = (page.shallow?.url ?? page.url).searchParams;
		const categoryRaw = sp.get('category') ?? '';
		const sortRaw = sp.get('sort') ?? 'featured';
		const maxRaw = sp.get('max');
		const parsedMax = maxRaw ? Number(maxRaw) : NaN;
		const brandRaw = sp.get('brand') ?? '';
		const ratingRaw = sp.get('rating') ?? '';
		const validBrands = getBrands();
		applied = {
			q: sp.get('q') ?? '',
			category: isCategorySlug(categoryRaw) ? categoryRaw : null,
			sort: ['featured', 'price-asc', 'price-desc', 'rating'].includes(sortRaw)
				? (sortRaw as SortKey)
				: 'featured',
			maxPrice:
				Number.isFinite(parsedMax) && parsedMax >= SLIDER_MIN && parsedMax < SLIDER_MAX
					? parsedMax
					: null,
			// `brand` is comma-separated, URL-encoded brand names
			// (/shop?brand=Apple — the contract the brands page links use);
			// unknown names are dropped.
			brands: [
				...new Set(
					brandRaw
						.split(',')
						.map((brand) => brand.trim())
						.filter((brand) => validBrands.includes(brand))
				)
			],
			minRating: ratingRaw === '4' ? 4 : ratingRaw === '3' ? 3 : null,
			inStockOnly: sp.get('instock') === '1',
			onSaleOnly: sp.get('onsale') === '1'
		};
	});

	const query = $derived(applied.q);
	const category = $derived(applied.category);
	const sort = $derived(applied.sort);
	const maxPrice = $derived(applied.maxPrice);
	const brands = $derived(applied.brands);
	const minRating = $derived(applied.minRating);
	const inStockOnly = $derived(applied.inStockOnly);
	const onSaleOnly = $derived(applied.onSaleOnly);
	const brandOptions = $derived(getBrands());

	const filtered = $derived(
		sortProducts(
			filterProducts(
				products,
				{
					query,
					category,
					maxPrice,
					brands: brands.length > 0 ? brands : undefined,
					minRating,
					inStockOnly,
					onSaleOnly
				},
				lang
			),
			sort
		)
	);

	// Grid re-render animation key: every filter dimension, so any change
	// replays `animate-grid-in` on a synchronously swapped grid (no empty flash).
	const filterSignature = $derived(
		[
			query,
			category ?? '',
			sort,
			maxPrice ?? '',
			brands.join(','),
			minRating ?? '',
			inStockOnly,
			onSaleOnly
		].join('|')
	);

	let searchText = $state('');
	let sliderValue = $state(SLIDER_MAX);

	// Keep control state in sync with the URL (back/forward, shared links).
	$effect(() => {
		searchText = applied.q;
	});
	$effect(() => {
		sliderValue = applied.maxPrice ?? SLIDER_MAX;
	});

	function updateParams(mutator: (params: URLSearchParams) => void): void {
		// Build from the effective URL (see the $effect above): after a
		// replaceState, `page.url` is stale, so building from it would drop
		// params set by earlier filter changes.
		const url = new URL((page.shallow?.url ?? page.url).href);
		mutator(url.searchParams);
		// Update the URL without navigating: keeps focus in the controls while
		// the $effect above re-applies the new filter state from the URL.
		replaceState(url, {});
	}

	function onSearchInput(): void {
		const value = searchText.trim();
		updateParams((params) => {
			if (value) params.set('q', value);
			else params.delete('q');
		});
	}

	function onSortChangeValue(value: string): void {
		const next: SortKey = ['featured', 'price-asc', 'price-desc', 'rating'].includes(value)
			? (value as SortKey)
			: 'featured';
		updateParams((params) => {
			if (next === 'featured') params.delete('sort');
			else params.set('sort', next);
		});
	}

	function onPriceChange(): void {
		const value = sliderValue;
		updateParams((params) => {
			if (value >= SLIDER_MAX) params.delete('max');
			else params.set('max', String(value));
		});
	}

	function toggleBrand(brand: string): void {
		const next = brands.includes(brand)
			? brands.filter((candidate) => candidate !== brand)
			: [...brands, brand];
		updateParams((params) => {
			if (next.length > 0) params.set('brand', next.join(','));
			else params.delete('brand');
		});
	}

	function onRatingChange(value: number | null): void {
		updateParams((params) => {
			if (value === null) params.delete('rating');
			else params.set('rating', String(value));
		});
	}

	function toggleInStock(): void {
		updateParams((params) => {
			if (inStockOnly) params.delete('instock');
			else params.set('instock', '1');
		});
	}

	function toggleOnSale(): void {
		updateParams((params) => {
			if (onSaleOnly) params.delete('onsale');
			else params.set('onsale', '1');
		});
	}

	function chipHref(nextCategory: CategorySlug | null): string {
		const params = new URLSearchParams();
		if (applied.q) params.set('q', applied.q);
		if (nextCategory) params.set('category', nextCategory);
		if (applied.sort !== 'featured') params.set('sort', applied.sort);
		if (applied.maxPrice !== null) params.set('max', String(applied.maxPrice));
		if (applied.brands.length > 0) params.set('brand', applied.brands.join(','));
		if (applied.minRating !== null) params.set('rating', String(applied.minRating));
		if (applied.inStockOnly) params.set('instock', '1');
		if (applied.onSaleOnly) params.set('onsale', '1');
		const suffix = params.toString();
		return localizedPath(lang, '/shop') + (suffix ? `?${suffix}` : '');
	}

	const resultsText = $derived(
		filtered.length === 1
			? interpolate(t.filters.showingOfOne, { total: products.length })
			: interpolate(t.filters.showingOf, {
					shown: filtered.length,
					total: products.length
				})
	);
	const priceDisplay = $derived(
		sliderValue >= SLIDER_MAX
			? t.shop.priceAny
			: interpolate(t.shop.maxPriceLabel, {
					price: formatPrice(sliderValue, t.meta.intlLocale)
				})
	);

	const sortOptions = $derived<SortOption[]>([
		{ value: 'featured', label: t.shop.sortFeatured },
		{ value: 'price-asc', label: t.shop.sortPriceAsc },
		{ value: 'price-desc', label: t.shop.sortPriceDesc },
		{ value: 'rating', label: t.shop.sortRating }
	]);

	const activeFilterCount = $derived(
		(query !== '' ? 1 : 0) +
			(category !== null ? 1 : 0) +
			(maxPrice !== null ? 1 : 0) +
			brands.length +
			(minRating !== null ? 1 : 0) +
			(inStockOnly ? 1 : 0) +
			(onSaleOnly ? 1 : 0)
	);

	const chips = $derived<FilterChip[]>([
		...(query !== '' ? [{ id: 'q', label: query }] : []),
		...(category !== null
			? [{ id: 'category', label: localize(getCategory(category).name, lang) }]
			: []),
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
		...brands.map((brand) => ({ id: `brand:${brand}`, label: brand })),
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

	function removeChip(id: string): void {
		updateParams((params) => {
			if (id === 'q') params.delete('q');
			if (id === 'category') params.delete('category');
			if (id === 'maxPrice') params.delete('max');
			if (id === 'rating') params.delete('rating');
			if (id === 'instock') params.delete('instock');
			if (id === 'onsale') params.delete('onsale');
			if (id.startsWith('brand:')) {
				const removed = id.slice('brand:'.length);
				const next = brands.filter((candidate) => candidate !== removed);
				if (next.length > 0) params.set('brand', next.join(','));
				else params.delete('brand');
			}
		});
	}

	function clearAllFilters(): void {
		updateParams((params) => {
			params.delete('q');
			params.delete('category');
			params.delete('sort');
			params.delete('max');
			params.delete('brand');
			params.delete('rating');
			params.delete('instock');
			params.delete('onsale');
		});
	}

	// Mobile drawer owns DRAFT filter state: opening syncs the drafts from the
	// applied (URL) filters, Apply writes them back to the URL, Clear resets
	// the drafts without closing. The search query stays live outside the
	// drawer, so the draft result count uses the applied query.
	let drawerOpen = $state(false);
	let draftCategory = $state<CategorySlug | null>(null);
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
			products,
			{
				query,
				category: draftCategory,
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
		draftCategory = applied.category;
		draftSliderValue = applied.maxPrice ?? SLIDER_MAX;
		draftBrands = [...applied.brands];
		draftMinRating = applied.minRating;
		draftInStock = applied.inStockOnly;
		draftOnSale = applied.onSaleOnly;
		drawerOpen = true;
	}

	function toggleDraftBrand(brand: string): void {
		draftBrands = draftBrands.includes(brand)
			? draftBrands.filter((candidate) => candidate !== brand)
			: [...draftBrands, brand];
	}

	function applyDraft(): void {
		updateParams((params) => {
			if (draftCategory) params.set('category', draftCategory);
			else params.delete('category');
			if (draftMaxPrice !== null) params.set('max', String(draftMaxPrice));
			else params.delete('max');
			if (draftBrands.length > 0) params.set('brand', draftBrands.join(','));
			else params.delete('brand');
			if (draftMinRating !== null) params.set('rating', String(draftMinRating));
			else params.delete('rating');
			if (draftInStock) params.set('instock', '1');
			else params.delete('instock');
			if (draftOnSale) params.set('onsale', '1');
			else params.delete('onsale');
		});
		drawerOpen = false;
	}

	function clearDraft(): void {
		draftCategory = null;
		draftSliderValue = SLIDER_MAX;
		draftBrands = [];
		draftMinRating = null;
		draftInStock = false;
		draftOnSale = false;
	}
</script>

<Seo {lang} title={t.meta.shopTitle} description={t.meta.shopDescription} path="/shop" />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<h1 class="text-[1.75rem] font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
			{t.shop.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.shop.description}</p>
	</div>

	<!-- Full-width search below lg; on desktop the search lives in the FilterBar controls. -->
	<div class="relative mt-6 lg:hidden">
		<label class="sr-only" for="shop-search-mobile">{t.shop.searchLabel}</label>
		<Search
			class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
			aria-hidden="true"
		/>
		<input
			id="shop-search-mobile"
			type="search"
			bind:value={searchText}
			oninput={onSearchInput}
			placeholder={t.shop.searchPlaceholder}
			class="h-11 w-full rounded-full bg-surface-soft pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:bg-surface"
		/>
	</div>

	<FilterBar
		{t}
		id="shop-filter-bar"
		resultCount={filtered.length}
		resultText={resultsText}
		{activeFilterCount}
		onOpenFilters={openDrawer}
		hideFiltersButtonOnDesktop
		sortValue={sort}
		{sortOptions}
		onSortChange={onSortChangeValue}
		{chips}
		onRemoveChip={removeChip}
		onClearAll={clearAllFilters}
	>
		{#snippet controls()}
			<div class="hidden min-w-0 flex-1 items-center gap-3 lg:flex">
				<div class="relative w-52 shrink-0 xl:w-64">
					<label class="sr-only" for="shop-search">{t.shop.searchLabel}</label>
					<Search
						class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
						aria-hidden="true"
					/>
					<input
						id="shop-search"
						type="search"
						bind:value={searchText}
						oninput={onSearchInput}
						placeholder={t.shop.searchPlaceholder}
						class="h-11 w-full rounded-full bg-surface-soft pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:bg-surface"
					/>
				</div>
				<div
					class="flex min-w-0 flex-1 gap-2 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
					role="group"
					aria-label={t.nav.categories}
				>
					<a
						href={chipHref(null)}
						aria-current={category === null ? 'true' : undefined}
						class="inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm font-medium ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft aria-[current=true]:bg-brand-700 aria-[current=true]:text-white aria-[current=true]:ring-brand-700"
					>
						{t.shop.allCategories}
					</a>
					{#each categories as item (item.slug)}
						<a
							href={chipHref(item.slug)}
							aria-current={category === item.slug ? 'true' : undefined}
							class="inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm font-medium ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft aria-[current=true]:bg-brand-700 aria-[current=true]:text-white aria-[current=true]:ring-brand-700"
						>
							{localize(item.name, lang)}
						</a>
					{/each}
				</div>
				<div class="flex shrink-0 items-center gap-2">
					<label for="shop-max-price" class="sr-only">{t.shop.priceLabel}</label>
					<input
						id="shop-max-price"
						type="range"
						min={SLIDER_MIN}
						max={SLIDER_MAX}
						step={SLIDER_STEP}
						bind:value={sliderValue}
						onchange={onPriceChange}
						class="h-11 w-24 accent-brand-700 xl:w-32"
					/>
					<span class="whitespace-nowrap text-sm font-semibold text-ink" aria-live="polite">
						{priceDisplay}
					</span>
				</div>
			</div>
		{/snippet}
		{#snippet facets()}
			<div
				class="mt-4 hidden flex-wrap items-end gap-x-6 gap-y-4 border-t border-line pt-4 lg:flex"
			>
				<h2 class="sr-only">{t.filters.facetsHeading}</h2>
				<fieldset class="min-w-0">
					<legend class="text-sm font-semibold text-ink">{t.filters.brandsLabel}</legend>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each brandOptions as brand (brand)}
							<label
								class="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-sm font-medium ring-1 {brands.includes(brand)
									? 'bg-brand-50 text-brand-800 ring-brand-700 dark:bg-surface-soft'
									: 'text-ink-soft ring-line hover:bg-surface-soft'}"
							>
								<input
									type="checkbox"
									checked={brands.includes(brand)}
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
							onclick={() => onRatingChange(null)}
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
							onclick={() => onRatingChange(4)}
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
							onclick={() => onRatingChange(3)}
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
							onchange={toggleInStock}
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
							onchange={toggleOnSale}
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
		id="shop-filter-drawer"
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
			<fieldset>
				<legend class="text-sm font-semibold text-ink">{t.nav.categories}</legend>
				<div class="mt-3 space-y-1">
					<button
						type="button"
						aria-pressed={draftCategory === null}
						onclick={() => {
							draftCategory = null;
						}}
						class="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-sm font-medium ring-1 {draftCategory ===
						null
							? 'bg-brand-50 text-brand-800 ring-brand-700'
							: 'text-ink-soft ring-line hover:bg-brand-50'}"
					>
						{t.shop.allCategories}
						{#if draftCategory === null}
							<Check class="h-4 w-4 shrink-0" aria-hidden="true" />
						{/if}
					</button>
					{#each categories as item (item.slug)}
						<button
							type="button"
							aria-pressed={draftCategory === item.slug}
							onclick={() => {
								draftCategory = item.slug;
							}}
							class="flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-sm font-medium ring-1 {draftCategory ===
							item.slug
								? 'bg-brand-50 text-brand-800 ring-brand-700'
								: 'text-ink-soft ring-line hover:bg-brand-50'}"
						>
							{localize(item.name, lang)}
							{#if draftCategory === item.slug}
								<Check class="h-4 w-4 shrink-0" aria-hidden="true" />
							{/if}
						</button>
					{/each}
				</div>
			</fieldset>
			<div>
				<div class="flex items-baseline justify-between gap-3">
					<label
						for="shop-drawer-max-price"
						class="text-sm font-medium text-ink-soft"
					>
						{t.shop.priceLabel}
					</label>
					<span class="shrink-0 text-sm font-semibold text-ink" aria-live="polite">
						{draftPriceDisplay}
					</span>
				</div>
				<input
					id="shop-drawer-max-price"
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
			<a
				href={localizedPath(lang, '/shop')}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.shop.clearFilters}
			</a>
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
</div>
