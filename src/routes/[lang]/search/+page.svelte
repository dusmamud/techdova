<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, SearchX } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import FilterBar, {
		type FilterChip,
		type SortOption
	} from '#lib/components/FilterBar.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { filterProducts, products, sortProducts, type SortKey } from '#lib/data/products';
	import { interpolate } from '#lib/format';
	import { getDictionary } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));

	// The query string is unavailable during prerendering: read ?q= only on
	// the client, after mount. The input then filters live via `query`.
	let query = $state('');

	onMount(() => {
		const q = new URLSearchParams(window.location.search).get('q');
		if (q) query = q;
	});

	const trimmed = $derived(query.trim());
	let sort = $state<SortKey>('featured');
	const results = $derived(
		sortProducts(filterProducts(products, { query: trimmed }, lang), sort)
	);

	const sortOptions = $derived<SortOption[]>([
		{ value: 'featured', label: t.shop.sortFeatured },
		{ value: 'price-asc', label: t.shop.sortPriceAsc },
		{ value: 'price-desc', label: t.shop.sortPriceDesc },
		{ value: 'rating', label: t.shop.sortRating }
	]);

	const chips = $derived<FilterChip[]>(
		trimmed !== '' ? [{ id: 'q', label: trimmed }] : []
	);

	function onSortChange(value: string): void {
		sort = ['featured', 'price-asc', 'price-desc', 'rating'].includes(value)
			? (value as SortKey)
			: 'featured';
	}

	function clearQuery(): void {
		query = '';
	}

	const resultsText = $derived(
		results.length === 1
			? interpolate(t.searchPage.resultOne, { query: trimmed })
			: interpolate(t.searchPage.results, { count: results.length, query: trimmed })
	);

	function searchTerm(term: string): void {
		query = term;
	}
</script>

<Seo {lang} title={t.meta.searchTitle} description={t.meta.searchDescription} path="/search" />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<h1 class="text-[1.75rem] font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
			{t.searchPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-neutral-600">{t.searchPage.hint}</p>
	</div>

	<div class="relative mt-6 max-w-xl">
		<label class="sr-only" for="search-page-input">{t.searchPage.searchLabel}</label>
		<Search
			class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
			aria-hidden="true"
		/>
		<input
			id="search-page-input"
			type="search"
			bind:value={query}
			placeholder={t.searchPage.searchPlaceholder}
			class="h-11 w-full rounded-full bg-neutral-100 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:bg-white"
		/>
	</div>

	{#if trimmed === ''}
		<section aria-labelledby="popular-heading" class="mt-8">
			<h2 id="popular-heading" class="text-sm font-semibold text-neutral-900">
				{t.searchPage.popularLabel}
			</h2>
			<div class="mt-3 flex flex-wrap gap-2">
				{#each t.searchPage.popularSearches as term (term)}
					<button
						type="button"
						onclick={() => searchTerm(term)}
						class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-neutral-800 ring-1 ring-neutral-300 hover:bg-brand-50"
					>
						{term}
					</button>
				{/each}
			</div>
		</section>
	{:else if results.length === 0}
		<div class="mt-8 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center">
			<SearchX class="h-10 w-10 text-brand-700" aria-hidden="true" />
			<h2 class="text-xl font-bold text-neutral-900">
				{interpolate(t.searchPage.noResults, { query: trimmed })}
			</h2>
			<p class="max-w-sm text-neutral-600">{t.searchPage.noResultsHint}</p>
			<ul class="max-w-sm list-disc space-y-1 pl-5 text-left text-sm text-neutral-600">
				{#each t.searchPage.noResultsTips as tip (tip)}
					<li>{tip}</li>
				{/each}
			</ul>
			<p class="mt-2 text-sm font-semibold text-neutral-900">{t.searchPage.suggestionsLabel}</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each t.searchPage.popularSearches as term (term)}
					<!-- Full reload: the ?q= reader runs in onMount, so a
						client-side navigation to this same route would leave
						the previous query in place. -->
					<a
						href="{localizedPath(lang, '/search')}?q={encodeURIComponent(term)}"
						data-sveltekit-reload
						class="inline-flex min-h-11 items-center rounded-full bg-white px-4 text-sm font-medium text-neutral-800 ring-1 ring-neutral-300 hover:bg-brand-50"
					>
						{term}
					</a>
				{/each}
			</div>
			<a
				href={localizedPath(lang, '/shop')}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.searchPage.browseShop}
			</a>
		</div>
	{:else}
		<FilterBar
			{t}
			id="search-filter-bar"
			resultCount={results.length}
			resultText={resultsText}
			sortValue={sort}
			{sortOptions}
			onSortChange={onSortChange}
			{chips}
			onRemoveChip={clearQuery}
			onClearAll={clearQuery}
		/>
		<div
			class="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
			use:reveal
		>
			{#each results as product (product.slug)}
				<ProductCard {product} {lang} {t} />
			{/each}
		</div>
	{/if}
</div>
