<script lang="ts">
	import { Check, Eye, Heart, Scale, ShoppingCart } from '@lucide/svelte';
	import type { Product } from '#lib/data/products';
	import { formatCount, formatDecimal, formatPrice, interpolate } from '#lib/format';
	import { localize, type Dictionary, type Locale } from '#lib/i18n/index';
	import { productPath } from '#lib/paths';
	import { cart } from '#lib/stores/cart.svelte';
	import { compare } from '#lib/stores/compare.svelte';
	import { toasts } from '#lib/stores/toast.svelte';
	import { wishlist } from '#lib/stores/wishlist.svelte';
	import Picture from './Picture.svelte';
	import QuickView from './QuickView.svelte';
	import Stars from './Stars.svelte';

	let { product, lang, t }: { product: Product; lang: Locale; t: Dictionary } = $props();

	let added = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;
	let quickViewOpen = $state(false);

	const name = $derived(localize(product.name, lang));
	const intlLocale = $derived(t.meta.intlLocale);
	const outOfStock = $derived(product.stock <= 0);
	const wished = $derived(wishlist.has(product.slug));
	const compared = $derived(compare.has(product.slug));

	const ratingLabel = $derived(
		`${interpolate(t.productCard.ratingLabel, { rating: formatDecimal(product.rating, intlLocale) })} — ${interpolate(t.productCard.reviewsLabel, { count: formatCount(product.reviewCount, intlLocale) })}`
	);

	function addToCart(): void {
		cart.add(product.slug, 1);
		added = true;
		cart.openDrawer();
		clearTimeout(timer);
		timer = setTimeout(() => {
			added = false;
		}, 1800);
	}

	function toggleCompare(): void {
		const result = compare.toggle(product.slug);
		if (result === 'full') toasts.push(t.product.compareFull);
	}
</script>

<article
	class="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-neutral-200 transition-shadow hover:shadow-lg"
>
	<div class="relative bg-brand-50">
		<a href={productPath(lang, product.slug)} tabindex="-1" aria-hidden="true" class="block">
			<div class="aspect-[4/5]">
				<Picture
					base={product.image}
					alt={localize(product.imageAlt, lang)}
					width={1408}
					height={1760}
					loading="lazy"
					decoding="async"
					class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
				/>
			</div>
		</a>
		{#if product.badge}
			<span
				class="absolute left-3 top-3 rounded-full bg-brand-700 px-2.5 py-1 text-xs font-bold text-white"
			>
				{product.badge}
			</span>
		{/if}
		<button
			type="button"
			aria-pressed={wished}
			aria-label="{wished ? t.productCard.removeFromWishlist : t.productCard.addToWishlist} ({name})"
			onclick={() => wishlist.toggle(product.slug)}
			class="absolute right-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white text-neutral-600 shadow hover:text-rose-600"
		>
			<Heart
				class="h-5 w-5 {wished ? 'text-rose-600' : ''}"
				fill={wished ? 'currentColor' : 'none'}
				aria-hidden="true"
			/>
		</button>
		<button
			type="button"
			aria-pressed={compared}
			aria-label="{compared ? t.product.compareRemove : t.product.compareAdd} ({name})"
			onclick={toggleCompare}
			class="absolute right-3 top-16 grid h-11 w-11 place-items-center rounded-full bg-white shadow {compared
				? 'text-brand-700 ring-2 ring-brand-700'
				: 'text-neutral-600 hover:text-brand-700'}"
		>
			<Scale class="h-5 w-5" aria-hidden="true" />
		</button>
		<button
			type="button"
			onclick={() => {
				quickViewOpen = true;
			}}
			aria-label="{t.quickView.label} ({name})"
			class="pointer-events-none absolute inset-x-3 bottom-3 flex min-h-11 items-center justify-center gap-2 rounded-full bg-white/95 px-4 text-sm font-semibold text-neutral-900 opacity-0 shadow transition-opacity duration-200 hover:bg-white group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100"
		>
			<Eye class="h-4 w-4" aria-hidden="true" />
			{t.quickView.label}
		</button>
	</div>

	<div class="flex flex-1 flex-col gap-2 p-4">
		<h3 class="line-clamp-2 text-base font-semibold leading-snug text-neutral-900">
			<a href={productPath(lang, product.slug)} class="hover:text-brand-800">
				{name}
			</a>
		</h3>
		<p class="flex items-center gap-1.5">
			<Stars rating={product.rating} label={ratingLabel} />
			<span class="text-sm text-neutral-500" aria-hidden="true">
				({formatCount(product.reviewCount, intlLocale)})
			</span>
		</p>
		<p class="mt-auto flex flex-wrap items-baseline gap-2 pt-1">
			<span class="text-lg font-bold text-neutral-900">
				{formatPrice(product.price, intlLocale)}
			</span>
			{#if product.oldPrice}
				<s class="text-sm text-neutral-500">{formatPrice(product.oldPrice, intlLocale)}</s>
			{/if}
		</p>
		<button
			type="button"
			disabled={outOfStock}
			onclick={addToCart}
			class="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
		>
			{#if added}
				<Check class="h-4 w-4" aria-hidden="true" />
				{t.productCard.addedToCart}
			{:else if outOfStock}
				{t.productCard.outOfStock}
			{:else}
				<ShoppingCart class="h-4 w-4" aria-hidden="true" />
				{t.productCard.addToCart}
			{/if}
		</button>
	</div>
	<QuickView
		{product}
		{lang}
		{t}
		open={quickViewOpen}
		onClose={() => {
			quickViewOpen = false;
		}}
	/>
</article>
