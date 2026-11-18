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
	import { categories, getCategory, type CategorySlug } from '#lib/data/categories';
	import { filterProducts, products, sortProducts, type SortKey } from '#lib/data/products';
	import { getSynonymCategories } from '#lib/data/search-synonyms';
	import { interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
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
	let selectedCategory = $state<CategorySlug | null>(null);
	const results = $derived(
		sortProducts(
			filterProducts(products, { query: trimmed, category: selectedCategory }, lang),
			sort
		)
	);
	// True when any query word maps to a category via the synonym map (same
	// word-splitting `filterProducts` uses), so the note only shows when a
	// synonym actually widened the search.
	const hasSynonymMatch = $derived(
		trimmed
			.toLowerCase()
			.split(/\s+/)
			.some((word) => getSynonymCategories(word).length > 0)
	);
	const filterSignature = $derived(`${trimmed}|${selectedCategory ?? ''}|${sort}`);

	const sortOptions = $derived<SortOption[]>([
		{ value: 'featured', label: t.shop.sortFeatured },
		{ value: 'price-asc', label: t.shop.sortPriceAsc },
		{ value: 'price-desc', label: t.shop.sortPriceDesc },
		{ value: 'rating', label: t.shop.sortRating }
	]);

	const chips = $derived<FilterChip[]>([
		...(trimmed !== '' ? [{ id: 'q', label: trimmed }] : []),
		...(selectedCategory !== null
			? [{ id: 'category', label: localize(getCategory(selectedCategory).name, lang) }]
			: [])
	]);

	function onSortChange(value: string): void {
		sort = ['featured', 'price-asc', 'price-desc', 'rating'].includes(value)
			? (value as SortKey)
			: 'featured';
	}

	function removeChip(id: string): void {
		if (id === 'q') query = '';
		if (id === 'category') selectedCategory = null;
	}

	function clearAll(): void {
		query = '';
		selectedCategory = null;
	}

	const resultsText = $derived(
		results.length === 1
			? interpolate(t.searchPage.resultOne, { query: trimmed })
			: interpolate(t.searchPage.results, { count: results.length, query: trimmed })
	);

	function searchTerm(term: string): void {
		// A popular search starts fresh: any category picked for a previous
		// query would otherwise silently narrow the new search.
		selectedCategory = null;
		query = term;
	}
</script>

<Seo {lang} title={t.meta.searchTitle} description={t.meta.searchDescription} path="/search" noindex />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<h1 class="text-[1.75rem] font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
			{t.searchPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.searchPage.hint}</p>
	</div>

	<div class="relative mt-6 max-w-xl">
		<label class="sr-only" for="search-page-input">{t.searchPage.searchLabel}</label>
		<Search
			class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
			aria-hidden="true"
		/>
		<input
			id="search-page-input"
			type="search"
			bind:value={query}
			placeholder={t.searchPage.searchPlaceholder}
			class="h-11 w-full rounded-full bg-surface-soft pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:bg-surface"
		/>
	</div>

	{#if trimmed !== ''}
		<div
			class="mt-6 flex flex-wrap items-center gap-2"
			role="group"
			aria-label={t.searchPage.categoryFilterLabel}
		>
			<span class="text-sm font-semibold text-ink">{t.searchPage.categoryFilterLabel}</span>
			<button
				type="button"
				aria-pressed={selectedCategory === null}
				onclick={() => {
					selectedCategory = null;
				}}
				class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft aria-[pressed=true]:bg-brand-700 aria-[pressed=true]:text-white aria-[pressed=true]:ring-brand-700"
			>
				{t.searchPage.allCategories}
			</button>
			{#each categories as item (item.slug)}
				<button
					type="button"
					aria-pressed={selectedCategory === item.slug}
					onclick={() => {
						selectedCategory = item.slug;
					}}
					class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft aria-[pressed=true]:bg-brand-700 aria-[pressed=true]:text-white aria-[pressed=true]:ring-brand-700"
				>
					{localize(item.name, lang)}
				</button>
			{/each}
		</div>
		{#if hasSynonymMatch}
			<p class="mt-3 text-sm text-muted">{t.searchPage.synonymsNote}</p>
		{/if}
	{/if}

	{#if trimmed === ''}
		<section aria-labelledby="popular-heading" class="mt-8">
			<h2 id="popular-heading" class="text-sm font-semibold text-ink">
				{t.searchPage.popularLabel}
			</h2>
			<div class="mt-3 flex flex-wrap gap-2">
				{#each t.searchPage.popularSearches as term (term)}
					<button
						type="button"
						onclick={() => searchTerm(term)}
						class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-ink-soft ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft"
					>
						{term}
					</button>
				{/each}
			</div>
		</section>
	{:else if results.length === 0}
		<div class="mt-8 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center dark:bg-surface-soft">
			<SearchX class="h-10 w-10 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			<h2 class="text-xl font-bold text-ink">
				{interpolate(t.searchPage.noResults, { query: trimmed })}
			</h2>
			<p class="max-w-sm text-muted">{t.searchPage.noResultsHint}</p>
			<ul class="max-w-sm list-disc space-y-1 pl-5 text-left text-sm text-muted">
				{#each t.searchPage.noResultsTips as tip (tip)}
					<li>{tip}</li>
				{/each}
			</ul>
			<p class="mt-2 text-sm font-semibold text-ink">{t.searchPage.suggestionsLabel}</p>
			<div class="flex flex-wrap justify-center gap-2">
				{#each t.searchPage.popularSearches as term (term)}
					<!-- Full reload: the ?q= reader runs in onMount, so a
						client-side navigation to this same route would leave
						the previous query in place. -->
					<a
						href="{localizedPath(lang, '/search')}?q={encodeURIComponent(term)}"
						data-sveltekit-reload
						class="inline-flex min-h-11 items-center rounded-full bg-surface px-4 text-sm font-medium text-ink-soft ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft"
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
		<h2 class="sr-only">{t.filters.facetsHeading}</h2>
		<FilterBar
			{t}
			id="search-filter-bar"
			resultCount={results.length}
			resultText={resultsText}
			sortValue={sort}
			{sortOptions}
			onSortChange={onSortChange}
			{chips}
			onRemoveChip={removeChip}
			onClearAll={clearAll}
		/>
		{#key filterSignature}
			<div
				class="mt-6 grid animate-grid-in grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
			>
				{#each results as product (product.slug)}
					<ProductCard {product} {lang} {t} />
				{/each}
			</div>
		{/key}
	{/if}
</div>
