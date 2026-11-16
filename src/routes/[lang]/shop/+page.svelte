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
	type ShopParams = { q: string; category: CategorySlug | null; sort: SortKey; maxPrice: number | null };
	let applied = $state<ShopParams>({ q: '', category: null, sort: 'featured', maxPrice: null });

	$effect(() => {
		const sp = (page.shallow?.url ?? page.url).searchParams;
		const categoryRaw = sp.get('category') ?? '';
		const sortRaw = sp.get('sort') ?? 'featured';
		const maxRaw = sp.get('max');
		const parsedMax = maxRaw ? Number(maxRaw) : NaN;
		applied = {
			q: sp.get('q') ?? '',
			category: isCategorySlug(categoryRaw) ? categoryRaw : null,
			sort: ['featured', 'price-asc', 'price-desc', 'rating'].includes(sortRaw)
				? (sortRaw as SortKey)
				: 'featured',
			maxPrice:
				Number.isFinite(parsedMax) && parsedMax >= SLIDER_MIN && parsedMax < SLIDER_MAX
					? parsedMax
					: null
		};
	});

	const query = $derived(applied.q);
	const category = $derived(applied.category);
	const sort = $derived(applied.sort);
	const maxPrice = $derived(applied.maxPrice);

	const filtered = $derived(
		sortProducts(filterProducts(products, { query, category, maxPrice }, lang), sort)
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

	function chipHref(nextCategory: CategorySlug | null): string {
		const params = new URLSearchParams();
		if (applied.q) params.set('q', applied.q);
		if (nextCategory) params.set('category', nextCategory);
		if (applied.sort !== 'featured') params.set('sort', applied.sort);
		if (applied.maxPrice !== null) params.set('max', String(applied.maxPrice));
		const suffix = params.toString();
		return localizedPath(lang, '/shop') + (suffix ? `?${suffix}` : '');
	}

	const resultsText = $derived(
		filtered.length === 1
			? t.shop.resultOne
			: interpolate(t.shop.results, { count: filtered.length })
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
		(query !== '' ? 1 : 0) + (category !== null ? 1 : 0) + (maxPrice !== null ? 1 : 0)
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
			: [])
	]);

	function removeChip(id: string): void {
		updateParams((params) => {
			if (id === 'q') params.delete('q');
			if (id === 'category') params.delete('category');
			if (id === 'maxPrice') params.delete('max');
		});
	}

	function clearAllFilters(): void {
		updateParams((params) => {
			params.delete('q');
			params.delete('category');
			params.delete('sort');
			params.delete('max');
		});
	}

	// Mobile drawer owns DRAFT filter state: opening syncs the drafts from the
	// applied (URL) filters, Apply writes them back to the URL, Clear resets
	// the drafts without closing. The search query stays live outside the
	// drawer, so the draft result count uses the applied query.
	let drawerOpen = $state(false);
	let draftCategory = $state<CategorySlug | null>(null);
	let draftSliderValue = $state(SLIDER_MAX);

	const draftMaxPrice = $derived(
		draftSliderValue >= SLIDER_MAX ? null : draftSliderValue
	);
	const draftResultCount = $derived(
		filterProducts(
			products,
			{ query, category: draftCategory, maxPrice: draftMaxPrice },
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
		drawerOpen = true;
	}

	function applyDraft(): void {
		updateParams((params) => {
			if (draftCategory) params.set('category', draftCategory);
			else params.delete('category');
			if (draftMaxPrice !== null) params.set('max', String(draftMaxPrice));
			else params.delete('max');
		});
		drawerOpen = false;
	}

	function clearDraft(): void {
		draftCategory = null;
		draftSliderValue = SLIDER_MAX;
	}
</script>

<Seo {lang} title={t.meta.shopTitle} description={t.meta.shopDescription} path="/shop" />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<h1 class="text-[1.75rem] font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
			{t.shop.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-neutral-600">{t.shop.description}</p>
	</div>

	<!-- Full-width search below lg; on desktop the search lives in the FilterBar controls. -->
	<div class="relative mt-6 lg:hidden">
		<label class="sr-only" for="shop-search-mobile">{t.shop.searchLabel}</label>
		<Search
			class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
			aria-hidden="true"
		/>
		<input
			id="shop-search-mobile"
			type="search"
			bind:value={searchText}
			oninput={onSearchInput}
			placeholder={t.shop.searchPlaceholder}
			class="h-11 w-full rounded-full bg-neutral-100 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:bg-white"
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
						class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
						aria-hidden="true"
					/>
					<input
						id="shop-search"
						type="search"
						bind:value={searchText}
						oninput={onSearchInput}
						placeholder={t.shop.searchPlaceholder}
						class="h-11 w-full rounded-full bg-neutral-100 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:bg-white"
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
						class="inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm font-medium ring-1 ring-neutral-300 hover:bg-brand-50 aria-[current=true]:bg-brand-700 aria-[current=true]:text-white aria-[current=true]:ring-brand-700"
					>
						{t.shop.allCategories}
					</a>
					{#each categories as item (item.slug)}
						<a
							href={chipHref(item.slug)}
							aria-current={category === item.slug ? 'true' : undefined}
							class="inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm font-medium ring-1 ring-neutral-300 hover:bg-brand-50 aria-[current=true]:bg-brand-700 aria-[current=true]:text-white aria-[current=true]:ring-brand-700"
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
		id="shop-filter-drawer"
	>
		<div class="space-y-6">
			<fieldset>
				<legend class="text-sm font-semibold text-neutral-900">{t.nav.categories}</legend>
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
							: 'text-neutral-800 ring-neutral-200 hover:bg-brand-50'}"
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
								: 'text-neutral-800 ring-neutral-200 hover:bg-brand-50'}"
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
						class="text-sm font-medium text-neutral-700"
					>
						{t.shop.priceLabel}
					</label>
					<span class="shrink-0 text-sm font-semibold text-neutral-900" aria-live="polite">
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
		<div class="mt-6 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center">
			<SearchX class="h-10 w-10 text-brand-700" aria-hidden="true" />
			<h2 class="text-xl font-bold text-neutral-900">{t.shop.noResults}</h2>
			<p class="max-w-sm text-neutral-600">{t.shop.noResultsHint}</p>
			<a
				href={localizedPath(lang, '/shop')}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.shop.clearFilters}
			</a>
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
</div>
