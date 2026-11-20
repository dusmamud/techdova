<script lang="ts">
	import { ArrowLeftRight, ShoppingCart, X } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Picture from '#lib/components/Picture.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import { getCategory } from '#lib/data/categories';
	import { getProduct, variantPrice, type Product } from '#lib/data/products';
	import { formatCount, formatDecimal, formatPrice, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath, productPath, shopPath } from '#lib/paths';
	import { cart } from '#lib/stores/cart.svelte';
	import { compare } from '#lib/stores/compare.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const intlLocale = $derived(t.meta.intlLocale);

	// Highlight-differences toggle: default off, no persistence. Local
	// component state only — nothing about the compare list changes.
	let highlightDifferences = $state(false);

	// Store-driven like the cart page: the compare list loads from
	// localStorage in the browser, so SSR/prerender shows the empty state.
	const compared = $derived(
		compare.slugs.flatMap((slug) => {
			const product = getProduct(slug);
			return product ? [product] : [];
		})
	);

	// Union of spec labels across the compared products, in first-seen order.
	// Keyed by the English label (stable across locales); displayed localized.
	const specRows = $derived(
		[
			...new Map(
				compared.flatMap((product) =>
					product.specs.map(
						(spec) => [localize(spec.label, 'en'), localize(spec.label, lang)] as const
					)
				)
			).entries()
		].map(([key, label]) => ({ key, label }))
	);

	function specValue(product: Product, key: string): string | null {
		const spec = product.specs.find((s) => localize(s.label, 'en') === key);
		return spec ? localize(spec.value, lang) : null;
	}

	// Spec keys whose values differ across the compared products. A missing
	// value counts as different from a present one; a single product never
	// differs from itself, so nothing highlights with one product.
	const differingKeys = $derived(
		new Set(
			specRows
				.filter((row) => new Set(compared.map((p) => specValue(p, row.key))).size > 1)
				.map((row) => row.key)
		)
	);

	function stockText(product: Product): string {
		if (product.stock <= 0) return t.product.outOfStock;
		if (product.stock <= 5) return interpolate(t.product.lowStock, { count: product.stock });
		return t.product.inStock;
	}

	// Additive variant note only: the compare store stays slug-keyed and
	// add-to-cart keeps the default variant (same decision as the wishlist).
	// "From" is the cheapest variant price; null when a product has no variants.
	function variantsNote(product: Product): string | null {
		const variants = product.variants ?? [];
		if (variants.length === 0) return null;
		const fromPrice = Math.min(...variants.map((variant) => variantPrice(product, variant)));
		return interpolate(t.product.variantsNote, {
			count: variants.length,
			price: formatPrice(fromPrice, intlLocale)
		});
	}

	function ratingLabel(product: Product): string {
		return `${interpolate(t.product.ratingLabel, { rating: formatDecimal(product.rating, intlLocale) })} — ${interpolate(t.product.reviewsLabel, { count: formatCount(product.reviewCount, intlLocale) })}`;
	}

	// Compare-table scroll hint (elevation round 2, G-12): the lg+ table
	// is wider than a phone/tablet viewport and scrolls inside its
	// container. The fade edge (below) shows only while there is more
	// table to the right, and the scroller is keyboard-focusable with a
	// label so keyboard users can discover the scroll too. The first
	// (label) column is already sticky — this only adds the affordance.
	let compareScroller: HTMLDivElement | undefined = $state();
	let compareCanScrollRight = $state(false);

	function updateCompareScrollHint(): void {
		const el = compareScroller;
		if (!el) return;
		compareCanScrollRight = el.scrollWidth - el.clientWidth - el.scrollLeft > 4;
	}

	$effect(() => {
		void compared.length;
		const el = compareScroller;
		if (!el) return;
		updateCompareScrollHint();
		window.addEventListener('resize', updateCompareScrollHint);
		return () => window.removeEventListener('resize', updateCompareScrollHint);
	});
</script>

<Seo
	{lang}
	title={t.meta.compareTitle}
	description={t.meta.compareDescription}
	path="/compare"
	noindex
/>

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<h1 class="text-[1.75rem] font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
			{t.comparePage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.comparePage.description}</p>
	</div>

	{#if compared.length === 0}
		<div class="mt-8 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center dark:bg-surface-soft">
			<ArrowLeftRight class="h-12 w-12 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			<h2 class="text-xl font-bold text-ink">{t.comparePage.empty}</h2>
			<p class="max-w-sm text-muted">{t.comparePage.emptyHint}</p>
			<a
				href={localizedPath(lang, '/shop')}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.comparePage.browseShop}
			</a>
		</div>
	{:else}
		<div class="mt-4 flex flex-wrap items-center justify-between gap-3">
			<p class="text-sm font-medium text-muted" role="status">
				{interpolate(t.comparePage.comparing, { count: compared.length })}
			</p>
			<div class="flex flex-wrap items-center gap-2">
				<button
					type="button"
					aria-pressed={highlightDifferences}
					onclick={() => {
						highlightDifferences = !highlightDifferences;
					}}
					class="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-ink-soft ring-1 ring-line hover:bg-surface-soft"
				>
					<span
						aria-hidden="true"
						class="relative h-6 w-11 shrink-0 rounded-full motion-safe:transition-colors {highlightDifferences
							? 'bg-brand-700'
							: 'bg-line'}"
					>
						<span
							class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow motion-safe:transition-transform {highlightDifferences
								? 'translate-x-[1.375rem]'
								: 'translate-x-0.5'}"
						></span>
					</span>
					{t.comparePage.highlightDifferences}
				</button>
				<button
					type="button"
					onclick={() => compare.clear()}
					class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-red-600 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-900 hover:bg-red-50 dark:hover:bg-red-950/60"
				>
					{t.comparePage.clearAll}
				</button>
			</div>
		</div>

		<!-- Stacked per-product cards below lg: the table would squeeze to
			illegibility on phones. The full comparison table renders at lg+. -->
		<div class="mt-6 space-y-4 lg:hidden">
			{#each compared as product, i (product.slug)}
				{@const name = localize(product.name, lang)}
				{@const note = variantsNote(product)}
				<article
					class="rounded-3xl bg-surface p-4 ring-1 ring-line sm:p-5"
					use:reveal={{ delay: Math.min(i * 60, 300) }}
				>
					<div class="flex gap-4">
						<a
							href={productPath(lang, product.slug)}
							class="block w-20 shrink-0 overflow-hidden rounded-2xl bg-brand-50 sm:w-24"
						>
							<div class="aspect-[4/5]">
								<Picture
									base={product.image}
									alt={localize(product.imageAlt, lang)}
									width={1408}
									height={1760}
									loading="lazy"
									decoding="async"
									sizes="(max-width: 639px) 80px, 96px"
									class="h-full w-full object-cover"
								/>
							</div>
						</a>
						<div class="min-w-0 flex-1">
							<h2 class="line-clamp-2 font-semibold leading-snug text-ink">
								<a href={productPath(lang, product.slug)} class="hover:text-brand-800 dark:hover:text-brand-200">
									{name}
								</a>
							</h2>
							<p class="mt-1 flex flex-wrap items-baseline gap-2">
								<span class="text-base font-bold text-ink">
									{formatPrice(product.price, intlLocale)}
								</span>
								{#if product.oldPrice}
									<s class="text-sm text-muted">
										{formatPrice(product.oldPrice, intlLocale)}
									</s>
								{/if}
							</p>
							<p class="mt-1 flex flex-wrap items-center gap-1.5">
								<Stars rating={product.rating} label={ratingLabel(product)} />
								<span class="text-sm text-muted" aria-hidden="true">
									({formatCount(product.reviewCount, intlLocale)})
								</span>
							</p>
							<p
								class="mt-1 flex items-center gap-2 text-sm font-semibold {product.stock <= 0
									? 'text-red-600 dark:text-red-400'
									: 'text-brand-700 dark:text-brand-300'}"
							>
								<span
									class="h-2.5 w-2.5 shrink-0 rounded-full {product.stock <= 0
										? 'bg-red-50 dark:bg-red-950/600'
										: product.stock <= 5
											? 'bg-amber-500'
											: 'bg-brand-600'}"
									aria-hidden="true"
								></span>
								{stockText(product)}
							</p>
						</div>
					</div>
					<dl class="mt-4 divide-y divide-line border-t border-line text-sm">
						<div class="flex items-baseline justify-between gap-4 py-2.5">
							<dt class="shrink-0 font-medium text-muted">{t.comparePage.rowCategory}</dt>
							<dd class="min-w-0 text-right">
								<a
									href={shopPath(lang, product.category)}
									class="font-medium text-brand-700 dark:text-brand-300 hover:text-brand-800 dark:hover:text-brand-200"
								>
									{localize(getCategory(product.category).name, lang)}
								</a>
							</dd>
						</div>
						{#if note}
							<div class="flex items-baseline justify-between gap-4 py-2.5">
								<dt class="shrink-0 font-medium text-muted">{t.product.variantsLabel}</dt>
								<dd class="min-w-0 text-right font-medium text-ink">
									{note}
								</dd>
							</div>
						{/if}
						{#each specRows as row (row.key)}
							{@const value = specValue(product, row.key)}
							<div
								class="flex items-baseline justify-between gap-4 py-2.5 {highlightDifferences &&
								differingKeys.has(row.key)
									? 'bg-brand-50 dark:bg-surface-strong'
									: ''}"
							>
								<dt class="shrink-0 font-medium text-muted">{row.label}</dt>
								<dd class="min-w-0 text-right font-medium text-ink">
									{value ?? '—'}
								</dd>
							</div>
						{/each}
					</dl>
					<div class="mt-4 flex flex-col gap-2 sm:flex-row">
						<button
							type="button"
							disabled={product.stock <= 0}
							onclick={() => cart.add(product.slug, 1)}
							class="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
						>
							{#if product.stock <= 0}
								{t.productCard.outOfStock}
							{:else}
								<ShoppingCart class="h-4 w-4" aria-hidden="true" />
								{t.productCard.addToCart}
							{/if}
						</button>
						<button
							type="button"
							onclick={() => compare.remove(product.slug)}
							class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-muted ring-1 ring-line hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400"
						>
							<X class="h-4 w-4" aria-hidden="true" />
							{interpolate(t.comparePage.remove, { name })}
						</button>
					</div>
				</article>
			{/each}
		</div>

		<div class="relative mt-6 hidden lg:block">
			<!-- svelte-ignore a11y_no_noninteractive_tabindex: scrollable region — WAI guidance is that a scrollable region must be keyboard-focusable so keyboard users can scroll it; the table inside is not otherwise reachable by keyboard. -->
			<div
				bind:this={compareScroller}
				onscroll={updateCompareScrollHint}
				tabindex="0"
				role="region"
				aria-label={t.comparePage.tableLabel}
				class="overflow-x-auto rounded-3xl bg-surface ring-1 ring-line"
			>
				<table class="w-full min-w-[38rem] border-collapse">
				<caption class="sr-only">{t.comparePage.tableLabel}</caption>
				<thead>
					<tr class="border-b border-line">
						<th scope="col" class="sticky left-0 z-10 w-32 bg-surface p-4 text-left align-top">
							<span class="sr-only">{t.comparePage.rowProduct}</span>
						</th>
						{#each compared as product (product.slug)}
							{@const name = localize(product.name, lang)}
							<th scope="col" class="min-w-44 p-4 text-left align-top font-normal">
								<a
									href={productPath(lang, product.slug)}
									class="block overflow-hidden rounded-2xl bg-brand-50"
								>
									<div class="aspect-[4/5]">
										<Picture
											base={product.image}
											alt={localize(product.imageAlt, lang)}
											width={1408}
											height={1760}
											loading="lazy"
											decoding="async"
											sizes="320px"
											class="h-full w-full object-cover"
										/>
									</div>
								</a>
								<a
									href={productPath(lang, product.slug)}
									class="mt-3 line-clamp-2 block font-semibold leading-snug text-ink hover:text-brand-800 dark:hover:text-brand-200"
								>
									{name}
								</a>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-line text-sm">
					<tr>
						<th scope="row" class="sticky left-0 z-10 bg-surface p-4 text-left font-medium text-muted">
							{t.comparePage.rowPrice}
						</th>
						{#each compared as product (product.slug)}
							<td class="p-4 align-top">
								<p class="text-base font-bold text-ink">
									{formatPrice(product.price, intlLocale)}
								</p>
								{#if product.oldPrice}
									<p>
										<s class="text-muted">{formatPrice(product.oldPrice, intlLocale)}</s>
									</p>
								{/if}
							</td>
						{/each}
					</tr>
					<tr>
						<th scope="row" class="sticky left-0 z-10 bg-surface p-4 text-left font-medium text-muted">
							{t.comparePage.rowRating}
						</th>
						{#each compared as product (product.slug)}
							<td class="p-4 align-top">
								<p class="flex flex-wrap items-center gap-1.5">
									<Stars rating={product.rating} label={ratingLabel(product)} />
									<span class="text-muted" aria-hidden="true">
										({formatCount(product.reviewCount, intlLocale)})
									</span>
								</p>
							</td>
						{/each}
					</tr>
					<tr>
						<th scope="row" class="sticky left-0 z-10 bg-surface p-4 text-left font-medium text-muted">
							{t.comparePage.rowCategory}
						</th>
						{#each compared as product (product.slug)}
							<td class="p-4 align-top">
								<a
									href={shopPath(lang, product.category)}
									class="inline-flex min-h-11 items-center font-medium text-brand-700 dark:text-brand-300 hover:text-brand-800 dark:hover:text-brand-200"
								>
									{localize(getCategory(product.category).name, lang)}
								</a>
							</td>
						{/each}
					</tr>
					<tr>
						<th scope="row" class="sticky left-0 z-10 bg-surface p-4 text-left font-medium text-muted">
							{t.comparePage.rowStock}
						</th>
						{#each compared as product (product.slug)}
							<td class="p-4 align-top">
								<p
									class="flex items-center gap-2 font-semibold {product.stock <= 0
										? 'text-red-600 dark:text-red-400'
										: 'text-brand-700 dark:text-brand-300'}"
								>
									<span
										class="h-2.5 w-2.5 shrink-0 rounded-full {product.stock <= 0
											? 'bg-red-50 dark:bg-red-950/600'
											: product.stock <= 5
												? 'bg-amber-500'
												: 'bg-brand-600'}"
										aria-hidden="true"
									></span>
									{stockText(product)}
								</p>
							</td>
						{/each}
					</tr>
					<tr>
						<th scope="row" class="sticky left-0 z-10 bg-surface p-4 text-left font-medium text-muted">
							{t.product.variantsLabel}
						</th>
						{#each compared as product (product.slug)}
							<td class="p-4 align-top font-medium text-ink">
								{variantsNote(product) ?? '—'}
							</td>
						{/each}
					</tr>
					{#each specRows as row (row.key)}
						<tr
							class={highlightDifferences && differingKeys.has(row.key)
								? 'bg-brand-50 dark:bg-surface-strong'
								: ''}
						>
							<th
								scope="row"
								class="sticky left-0 z-10 p-4 text-left font-medium text-muted {highlightDifferences &&
								differingKeys.has(row.key)
									? 'bg-brand-50 dark:bg-surface-strong'
									: 'bg-surface'}"
							>
								{row.label}
							</th>
							{#each compared as product (product.slug)}
								{@const value = specValue(product, row.key)}
								<td class="p-4 align-top font-medium text-ink">
									{value ?? '—'}
								</td>
							{/each}
						</tr>
					{/each}
					<tr>
						<th scope="row" class="sticky left-0 z-10 bg-surface p-4 text-left font-medium text-muted">
							{t.comparePage.rowActions}
						</th>
						{#each compared as product (product.slug)}
							{@const name = localize(product.name, lang)}
							<td class="p-4 align-top">
								<div class="flex flex-col gap-2">
									<button
										type="button"
										disabled={product.stock <= 0}
										onclick={() => cart.add(product.slug, 1)}
										class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
									>
										{#if product.stock <= 0}
											{t.productCard.outOfStock}
										{:else}
											<ShoppingCart class="h-4 w-4" aria-hidden="true" />
											{t.productCard.addToCart}
										{/if}
									</button>
									<button
										type="button"
										onclick={() => compare.remove(product.slug)}
										class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-muted ring-1 ring-line hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400"
									>
										<X class="h-4 w-4" aria-hidden="true" />
										{interpolate(t.comparePage.remove, { name })}
									</button>
								</div>
							</td>
						{/each}
					</tr>
				</tbody>
			</table>
			</div>
			{#if compareCanScrollRight}
				<div
					aria-hidden="true"
					class="pointer-events-none absolute inset-y-0 right-0 w-16 rounded-r-3xl bg-gradient-to-l from-surface via-surface/70 to-transparent"
				></div>
			{/if}
		</div>
	{/if}
</div>
