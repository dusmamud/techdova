<script lang="ts" module>
	/** One active filter shown as a removable chip. `id` is passed back to `onRemoveChip`. */
	export type FilterChip = { id: string; label: string };

	/** One entry of the sort `<select>`. Values are plain strings so pages can
	 * pass the catalogue `SortKey` values ('featured' | 'price-asc' |
	 * 'price-desc' | 'rating', see `sortProducts` in #lib/data/products) or
	 * any page-specific sort key. Labels come from the page (e.g. the
	 * `t.shop.sort*` strings) so the bar stays generic. */
	export type SortOption = { value: string; label: string };
</script>

<script lang="ts">
	import { SlidersHorizontal, X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { interpolate } from '#lib/format';
	import type { Dictionary } from '#lib/i18n/index';

	/**
	 * Sticky filter/sort bar for listing pages (shop, category, deals,
	 * search, …). Generic: the parent owns all filter/sort state and passes
	 * it down; the bar only renders the controls and reports interactions.
	 *
	 * Row: [Filters button + active-count badge] [Sort select] [inline
	 * desktop controls snippet] [result count]. Below it, the active-filter
	 * chips with × remove + Clear all. The bar sticks under the sticky
	 * header (see `stickyTopClass`).
	 *
	 * @example
	 * ```svelte
	 * <FilterBar
	 *   {t}
	 *   resultCount={filtered.length}
	 *   activeFilterCount={activeCount}
	 *   onOpenFilters={() => (drawerOpen = true)}
	 *   hideFiltersButtonOnDesktop
	 *   sortValue={sort}
	 *   sortOptions={[
	 *     { value: 'featured', label: t.shop.sortFeatured },
	 *     { value: 'price-asc', label: t.shop.sortPriceAsc },
	 *     { value: 'price-desc', label: t.shop.sortPriceDesc },
	 *     { value: 'rating', label: t.shop.sortRating }
	 *   ]}
	 *   onSortChange={(value) => setSort(value)}
	 *   chips={[{ id: 'cat:audio', label: 'Audio' }]}
	 *   onRemoveChip={(id) => removeChip(id)}
	 *   onClearAll={clearAllFilters}
	 * >
	 *   {#snippet controls()}
	 *     <div class="hidden lg:flex"><!-- inline desktop filter controls --></div>
	 *   {/snippet}
	 * </FilterBar>
	 * ```
	 */
	let {
		t,
		resultCount,
		resultText,
		activeFilterCount = 0,
		onOpenFilters,
		hideFiltersButtonOnDesktop = false,
		sortValue,
		sortOptions,
		onSortChange,
		chips = [],
		onRemoveChip,
		onClearAll,
		id = 'filter-bar',
		stickyTopClass = 'top-28 lg:top-[7.5rem]',
		controls
	}: {
		t: Dictionary;
		resultCount: number;
		/** Override for the result-count line. Defaults to `t.filters.results` / `t.filters.resultOne`. */
		resultText?: string;
		activeFilterCount?: number;
		/** When provided, the Filters button renders and calls this (typically: open FilterDrawer). Omit it on pages with no drawer. */
		onOpenFilters?: () => void;
		/** Hide the Filters button at `lg`+ (pages whose filters are inline on desktop). The button still shows below `lg`. */
		hideFiltersButtonOnDesktop?: boolean;
		sortValue?: string;
		sortOptions?: SortOption[];
		onSortChange?: (value: string) => void;
		chips?: FilterChip[];
		onRemoveChip?: (id: string) => void;
		onClearAll?: () => void;
		/** Prefix for generated element ids (`{id}-sort`). Change it if a page ever renders two bars. */
		id?: string;
		/** Sticky offset under the sticky header. Default = announcement bar (44px) + header row (64px / 72px at lg) + 4px buffer. */
		stickyTopClass?: string;
		/** Inline desktop controls (e.g. category chips, price slider). Rendered bare in the row — gate visibility with your own responsive classes, e.g. `hidden lg:flex`. */
		controls?: Snippet;
	} = $props();

	const sortId = $derived(`${id}-sort`);
	const showSort = $derived(
		sortOptions !== undefined && sortOptions.length > 0 && onSortChange !== undefined
	);
	const resultLine = $derived(
		resultText ??
			(resultCount === 1
				? t.filters.resultOne
				: interpolate(t.filters.results, { count: resultCount }))
	);
</script>

<div class="sticky {stickyTopClass} z-30 border-b border-neutral-200 bg-white/95 py-3 backdrop-blur">
	<div class="flex flex-wrap items-center gap-3">
		{#if onOpenFilters}
			<button
				type="button"
				onclick={onOpenFilters}
				class="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-neutral-900 ring-1 ring-neutral-300 hover:bg-brand-50 {hideFiltersButtonOnDesktop
					? 'lg:hidden'
					: ''}"
			>
				<SlidersHorizontal class="h-4 w-4" aria-hidden="true" />
				{t.filters.filters}
				{#if activeFilterCount > 0}
					<span
						class="grid h-5 min-w-5 place-items-center rounded-full bg-brand-700 px-1 text-[11px] font-bold text-white"
						aria-hidden="true"
					>
						{activeFilterCount}
					</span>
					<span class="sr-only">
						{interpolate(t.filters.activeCount, { count: activeFilterCount })}
					</span>
				{/if}
			</button>
		{/if}

		{#if showSort}
			<div class="flex items-center gap-2">
				<label for={sortId} class="sr-only text-sm font-medium text-neutral-700 sm:not-sr-only">
					{t.filters.sortBy}
				</label>
				<select
					id={sortId}
					value={sortValue}
					onchange={(event) => onSortChange?.((event.target as HTMLSelectElement).value)}
					class="h-11 rounded-full bg-neutral-100 px-3 text-sm font-medium text-neutral-900"
				>
					{#each sortOptions ?? [] as option (option.value)}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>
		{/if}

		{#if controls}
			{@render controls()}
		{/if}

		<p role="status" aria-live="polite" class="ml-auto text-sm font-medium text-neutral-600">
			{resultLine}
		</p>
	</div>

	{#if chips.length > 0}
		<div
			role="group"
			aria-label={t.filters.activeFilters}
			class="mt-3 flex flex-wrap items-center gap-2"
		>
			{#each chips as chip (chip.id)}
				{#if onRemoveChip}
					<button
						type="button"
						onclick={() => onRemoveChip(chip.id)}
						aria-label={interpolate(t.filters.removeFilter, { label: chip.label })}
						class="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-brand-50 px-3 text-sm font-medium text-brand-800 ring-1 ring-brand-200 hover:bg-brand-100"
					>
						{chip.label}
						<X class="h-4 w-4" aria-hidden="true" />
					</button>
				{:else}
					<span
						class="inline-flex min-h-11 items-center rounded-full bg-brand-50 px-3 text-sm font-medium text-brand-800 ring-1 ring-brand-200"
					>
						{chip.label}
					</span>
				{/if}
			{/each}
			{#if onClearAll}
				<button
					type="button"
					onclick={onClearAll}
					class="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-brand-700 ring-1 ring-brand-700 hover:bg-brand-50"
				>
					{t.filters.clearAll}
				</button>
			{/if}
		</div>
	{/if}
</div>
