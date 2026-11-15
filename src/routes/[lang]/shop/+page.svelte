<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { Search, SearchX } from '@lucide/svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { categories, isCategorySlug, type CategorySlug } from '#lib/data/categories';
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
	type ShopParams = { q: string; category: CategorySlug | null; sort: SortKey; maxPrice: number | null };
	let applied = $state<ShopParams>({ q: '', category: null, sort: 'featured', maxPrice: null });

	$effect(() => {
		const sp = page.url.searchParams;
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
	const hasFilters = $derived(query !== '' || category !== null || maxPrice !== null);

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
		const url = new URL(page.url.href);
		mutator(url.searchParams);
		// Update the URL without navigating: keeps focus in the controls while
		// the $effect above re-applies the new filter state from page.url.
		replaceState(url, {});
	}

	function onSearchInput(): void {
		const value = searchText.trim();
		updateParams((params) => {
			if (value) params.set('q', value);
			else params.delete('q');
		});
	}

	function onSortChange(event: Event): void {
		const value = (event.target as HTMLSelectElement).value;
		updateParams((params) => {
			if (value === 'featured') params.delete('sort');
			else params.set('sort', value);
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
</script>

<Seo {lang} title={t.meta.shopTitle} description={t.meta.shopDescription} path="/shop" />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{t.shop.title}</h1>
	<p class="mt-2 max-w-2xl leading-relaxed text-neutral-600">{t.shop.description}</p>

	<section aria-label={t.shop.filtersLabel} class="mt-6 space-y-4">
		<div class="flex flex-wrap items-center gap-3">
			<div class="relative min-w-0 flex-1 sm:max-w-sm">
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
			<div class="flex items-center gap-2">
				<label for="shop-sort" class="text-sm font-medium text-neutral-700">{t.shop.sortLabel}</label>
				<select
					id="shop-sort"
					value={sort}
					onchange={onSortChange}
					class="h-11 rounded-full bg-neutral-100 px-3 text-sm font-medium text-neutral-900"
				>
					<option value="featured">{t.shop.sortFeatured}</option>
					<option value="price-asc">{t.shop.sortPriceAsc}</option>
					<option value="price-desc">{t.shop.sortPriceDesc}</option>
					<option value="rating">{t.shop.sortRating}</option>
				</select>
			</div>
			{#if hasFilters}
				<a
					href={localizedPath(lang, '/shop')}
					class="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-brand-700 ring-1 ring-brand-700 hover:bg-brand-50"
				>
					{t.shop.clearFilters}
				</a>
			{/if}
		</div>

		<div class="flex gap-2 overflow-x-auto pb-1" role="group" aria-label={t.nav.categories}>
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

		<div class="flex max-w-md items-center gap-3">
			<label for="shop-max-price" class="shrink-0 text-sm font-medium text-neutral-700">
				{t.shop.priceLabel}
			</label>
			<input
				id="shop-max-price"
				type="range"
				min={SLIDER_MIN}
				max={SLIDER_MAX}
				step={SLIDER_STEP}
				bind:value={sliderValue}
				onchange={onPriceChange}
				class="h-11 min-w-0 flex-1 accent-brand-700"
			/>
			<span class="shrink-0 text-sm font-semibold text-neutral-900" aria-live="polite">
				{priceDisplay}
			</span>
		</div>
	</section>

	<p role="status" aria-live="polite" class="mt-6 text-sm font-medium text-neutral-600">
		{resultsText}
	</p>

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
		<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each filtered as product (product.slug)}
				<ProductCard {product} {lang} {t} />
			{/each}
		</div>
	{/if}
</div>
