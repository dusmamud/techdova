<script lang="ts">
	import { SearchX } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import FilterBar from '#lib/components/FilterBar.svelte';
	import FilterDrawer from '#lib/components/FilterDrawer.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { categories, getCategory, type CategorySlug } from '#lib/data/categories';
	import {
		filterProducts,
		getNewProducts,
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

	const baseProducts = getNewProducts();

	// Applied filter state (client-side only; the full list prerenders).
	let category = $state<CategorySlug | null>(null);
	let maxPrice = $state<number | null>(null);
	let sort = $state<SortKey>('featured');

	const filtered = $derived(
		sortProducts(filterProducts(baseProducts, { category, maxPrice }, lang), sort)
	);

	// Grid re-render animation key: every filter dimension.
	const filterSignature = $derived(`${category ?? ''}|${maxPrice ?? ''}|${sort}`);

	const sortOptions = $derived([
		{ value: 'featured', label: t.shop.sortFeatured },
		{ value: 'price-asc', label: t.shop.sortPriceAsc },
		{ value: 'price-desc', label: t.shop.sortPriceDesc },
		{ value: 'rating', label: t.shop.sortRating }
	]);

	function onSortChange(value: string): void {
		if (['featured', 'price-asc', 'price-desc', 'rating'].includes(value)) {
			sort = value as SortKey;
		}
	}

	const activeFilterCount = $derived((category ? 1 : 0) + (maxPrice !== null ? 1 : 0));

	const chips = $derived(
		[
			category
				? {
						id: 'category',
						label: localize(getCategory(category).name, lang)
					}
				: null,
			maxPrice !== null
				? {
						id: 'price',
						label: interpolate(t.newArrivalsPage.maxPriceValue, {
							price: formatPrice(maxPrice, t.meta.intlLocale)
						})
					}
				: null
		].filter((chip) => chip !== null)
	);

	function removeChip(id: string): void {
		if (id === 'category') category = null;
		if (id === 'price') maxPrice = null;
	}

	// Drawer draft state: applied only when the user taps Apply.
	let drawerOpen = $state(false);
	let draftCategory = $state<CategorySlug | null>(null);
	let draftSlider = $state(SLIDER_MAX);

	function clearAllFilters(): void {
		category = null;
		maxPrice = null;
		draftCategory = null;
		draftSlider = SLIDER_MAX;
	}

	function openDrawer(): void {
		draftCategory = category;
		draftSlider = maxPrice ?? SLIDER_MAX;
		drawerOpen = true;
	}

	function applyDraft(): void {
		category = draftCategory;
		maxPrice = draftSlider >= SLIDER_MAX ? null : draftSlider;
		drawerOpen = false;
	}

	function clearDrawer(): void {
		clearAllFilters();
		drawerOpen = false;
	}

	const draftPriceDisplay = $derived(
		draftSlider >= SLIDER_MAX
			? t.newArrivalsPage.priceAny
			: interpolate(t.newArrivalsPage.maxPriceValue, {
					price: formatPrice(draftSlider, t.meta.intlLocale)
				})
	);

	// What Apply would show, so the drawer footer count matches the draft.
	const draftCount = $derived(
		filterProducts(
			baseProducts,
			{
				category: draftCategory,
				maxPrice: draftSlider >= SLIDER_MAX ? null : draftSlider
			},
			lang
		).length
	);
</script>

<Seo
	{lang}
	title={t.meta.newArrivalsTitle}
	description={t.meta.newArrivalsDescription}
	path="/new-arrivals"
/>

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.nav.shop, href: localizedPath(lang, '/shop') },
				{ label: t.newArrivalsPage.title }
			]}
		/>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			{t.newArrivalsPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">
			{t.newArrivalsPage.description}
		</p>
	</div>

	<div class="mt-6">
		<FilterBar
			{t}
			resultCount={filtered.length}
			activeFilterCount={activeFilterCount}
			onOpenFilters={openDrawer}
			sortValue={sort}
			{sortOptions}
			{onSortChange}
			{chips}
			onRemoveChip={removeChip}
			onClearAll={clearAllFilters}
			id="new-arrivals-filter-bar"
		/>
	</div>

	{#if filtered.length === 0}
		<div
			class="mt-6 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center dark:bg-surface-soft"
			use:reveal
		>
			<SearchX class="h-10 w-10 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			<h2 class="text-xl font-bold text-ink">{t.newArrivalsPage.empty}</h2>
			<p class="max-w-sm text-muted">{t.newArrivalsPage.emptyHint}</p>
			<a
				href={localizedPath(lang, '/shop')}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.newArrivalsPage.browseShop}
			</a>
		</div>
	{:else}
		{#key filterSignature}
			<div class="mt-6 grid animate-grid-in grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
				{#each filtered as product, i (product.slug)}
					<div use:reveal={{ delay: Math.min(i * 60, 300) }}>
						<ProductCard {product} {lang} {t} />
					</div>
				{/each}
			</div>
		{/key}
	{/if}
</div>

<FilterDrawer
	{t}
	open={drawerOpen}
	onClose={() => {
		drawerOpen = false;
	}}
	onApply={applyDraft}
	onClear={clearDrawer}
	resultCount={draftCount}
	id="new-arrivals-filter-drawer"
>
	<div class="space-y-6">
		<fieldset>
			<legend class="text-sm font-semibold text-ink">
				{t.newArrivalsPage.categoryLabel}
			</legend>
			<div class="mt-3 space-y-1">
				<label class="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink-soft">
					<input
						type="radio"
						name="new-arrivals-category"
						checked={draftCategory === null}
						onchange={() => {
							draftCategory = null;
						}}
						class="h-4 w-4 accent-brand-700"
					/>
					{t.newArrivalsPage.allCategories}
				</label>
				{#each categories as item (item.slug)}
					<label class="flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink-soft">
						<input
							type="radio"
							name="new-arrivals-category"
							checked={draftCategory === item.slug}
							onchange={() => {
								draftCategory = item.slug;
							}}
							class="h-4 w-4 accent-brand-700"
						/>
						{localize(item.name, lang)}
					</label>
				{/each}
			</div>
		</fieldset>

		<div>
			<label
				for="new-arrivals-max-price"
				class="text-sm font-semibold text-ink"
			>
				{t.newArrivalsPage.maxPriceLabel}
			</label>
			<div class="mt-2 flex items-center gap-3">
				<input
					id="new-arrivals-max-price"
					type="range"
					min={SLIDER_MIN}
					max={SLIDER_MAX}
					step={SLIDER_STEP}
					bind:value={draftSlider}
					class="h-11 min-w-0 flex-1 accent-brand-700"
				/>
				<span class="shrink-0 text-sm font-semibold text-ink" aria-live="polite">
					{draftPriceDisplay}
				</span>
			</div>
		</div>
	</div>
</FilterDrawer>
