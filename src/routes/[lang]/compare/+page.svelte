<script lang="ts">
	import { ArrowLeftRight, ShoppingCart, X } from '@lucide/svelte';
	import Picture from '#lib/components/Picture.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import { getCategory } from '#lib/data/categories';
	import { getProduct, type Product } from '#lib/data/products';
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

	function stockText(product: Product): string {
		if (product.stock <= 0) return t.product.outOfStock;
		if (product.stock <= 5) return interpolate(t.product.lowStock, { count: product.stock });
		return t.product.inStock;
	}

	function ratingLabel(product: Product): string {
		return `${interpolate(t.product.ratingLabel, { rating: formatDecimal(product.rating, intlLocale) })} — ${interpolate(t.product.reviewsLabel, { count: formatCount(product.reviewCount, intlLocale) })}`;
	}
</script>

<Seo
	{lang}
	title={t.meta.compareTitle}
	description={t.meta.compareDescription}
	path="/compare"
/>

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
		{t.comparePage.title}
	</h1>
	<p class="mt-2 max-w-2xl leading-relaxed text-neutral-600">{t.comparePage.description}</p>

	{#if compared.length === 0}
		<div class="mt-8 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center">
			<ArrowLeftRight class="h-12 w-12 text-brand-700" aria-hidden="true" />
			<h2 class="text-xl font-bold text-neutral-900">{t.comparePage.empty}</h2>
			<p class="max-w-sm text-neutral-600">{t.comparePage.emptyHint}</p>
			<a
				href={localizedPath(lang, '/shop')}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.comparePage.browseShop}
			</a>
		</div>
	{:else}
		<div class="mt-4 flex flex-wrap items-center justify-between gap-3">
			<p class="text-sm font-medium text-neutral-600" role="status">
				{interpolate(t.comparePage.comparing, { count: compared.length })}
			</p>
			<button
				type="button"
				onclick={() => compare.clear()}
				class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
			>
				{t.comparePage.clearAll}
			</button>
		</div>

		<div class="mt-6 overflow-x-auto rounded-3xl bg-white ring-1 ring-neutral-200">
			<table class="w-full min-w-[38rem] border-collapse">
				<caption class="sr-only">{t.comparePage.tableLabel}</caption>
				<thead>
					<tr class="border-b border-neutral-200">
						<th scope="col" class="sticky left-0 z-10 w-32 bg-white p-4 text-left align-top">
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
											class="h-full w-full object-cover"
										/>
									</div>
								</a>
								<a
									href={productPath(lang, product.slug)}
									class="mt-3 line-clamp-2 block font-semibold leading-snug text-neutral-900 hover:text-brand-800"
								>
									{name}
								</a>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody class="divide-y divide-neutral-100 text-sm">
					<tr>
						<th scope="row" class="sticky left-0 z-10 bg-white p-4 text-left font-medium text-neutral-500">
							{t.comparePage.rowPrice}
						</th>
						{#each compared as product (product.slug)}
							<td class="p-4 align-top">
								<p class="text-base font-bold text-neutral-900">
									{formatPrice(product.price, intlLocale)}
								</p>
								{#if product.oldPrice}
									<p>
										<s class="text-neutral-500">{formatPrice(product.oldPrice, intlLocale)}</s>
									</p>
								{/if}
							</td>
						{/each}
					</tr>
					<tr>
						<th scope="row" class="sticky left-0 z-10 bg-white p-4 text-left font-medium text-neutral-500">
							{t.comparePage.rowRating}
						</th>
						{#each compared as product (product.slug)}
							<td class="p-4 align-top">
								<p class="flex flex-wrap items-center gap-1.5">
									<Stars rating={product.rating} label={ratingLabel(product)} />
									<span class="text-neutral-500" aria-hidden="true">
										({formatCount(product.reviewCount, intlLocale)})
									</span>
								</p>
							</td>
						{/each}
					</tr>
					<tr>
						<th scope="row" class="sticky left-0 z-10 bg-white p-4 text-left font-medium text-neutral-500">
							{t.comparePage.rowCategory}
						</th>
						{#each compared as product (product.slug)}
							<td class="p-4 align-top">
								<a
									href={shopPath(lang, product.category)}
									class="inline-flex min-h-11 items-center font-medium text-brand-700 hover:text-brand-800"
								>
									{localize(getCategory(product.category).name, lang)}
								</a>
							</td>
						{/each}
					</tr>
					<tr>
						<th scope="row" class="sticky left-0 z-10 bg-white p-4 text-left font-medium text-neutral-500">
							{t.comparePage.rowStock}
						</th>
						{#each compared as product (product.slug)}
							<td class="p-4 align-top">
								<p
									class="flex items-center gap-2 font-semibold {product.stock <= 0
										? 'text-red-600'
										: 'text-brand-700'}"
								>
									<span
										class="h-2.5 w-2.5 shrink-0 rounded-full {product.stock <= 0
											? 'bg-red-500'
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
					{#each specRows as row (row.key)}
						<tr>
							<th scope="row" class="sticky left-0 z-10 bg-white p-4 text-left font-medium text-neutral-500">
								{row.label}
							</th>
							{#each compared as product (product.slug)}
								{@const value = specValue(product, row.key)}
								<td class="p-4 align-top font-medium text-neutral-900">
									{value ?? '—'}
								</td>
							{/each}
						</tr>
					{/each}
					<tr>
						<th scope="row" class="sticky left-0 z-10 bg-white p-4 text-left font-medium text-neutral-500">
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
										class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
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
										class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-neutral-600 ring-1 ring-neutral-300 hover:bg-red-50 hover:text-red-600"
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
	{/if}
</div>
