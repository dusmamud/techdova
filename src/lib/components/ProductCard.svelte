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

	let {
		product,
		lang,
		t,
		compact = false
	}: { product: Product; lang: Locale; t: Dictionary; compact?: boolean } = $props();

	let added = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;
	let quickViewOpen = $state(false);
	// Pop counters: incremented only by this card's own toggle clicks, so the
	// keyed icons pop on interaction — never on initial render. The
	// `animate-pop` class is gated on the counter for the same reason, and
	// app.css disables it entirely under reduced motion.
	let heartPopKey = $state(0);
	let comparePopKey = $state(0);

	const name = $derived(localize(product.name, lang));
	const intlLocale = $derived(t.meta.intlLocale);
	const outOfStock = $derived(product.stock <= 0);
	const wished = $derived(wishlist.has(product.slug));
	const compared = $derived(compare.has(product.slug));

	const ratingLabel = $derived(
		`${interpolate(t.productCard.ratingLabel, { rating: formatDecimal(product.rating, intlLocale) })} — ${interpolate(t.productCard.reviewsLabel, { count: formatCount(product.reviewCount, intlLocale) })}`
	);

	// Compact presentation: automatic below the `sm` breakpoint via responsive
	// classes, and forced at any width with `compact` (dense grids). Base
	// classes are the compact styles; `sm:` overrides restore the full
	// presentation only when compact is not forced. The image keeps its 4:5
	// ratio, the title clamps to 2 lines, and the CTA stays >=44px tall and
	// full-width in both presentations. At most 2 icon buttons overlay the
	// image (wishlist + compare); the QuickView bar is a bottom bar, not an
	// icon button.
	const radius = $derived(compact ? 'rounded-2xl' : 'rounded-2xl sm:rounded-3xl');
	const bodyClass = $derived(compact ? 'gap-1.5 p-3' : 'gap-1.5 p-3 sm:gap-2 sm:p-4');
	const titleClass = $derived(compact ? 'text-sm' : 'text-sm sm:text-base');
	const countClass = $derived(compact ? 'text-xs' : 'text-xs sm:text-sm');
	const priceClass = $derived(compact ? 'text-base' : 'text-base sm:text-lg');
	const oldPriceClass = $derived(compact ? 'text-xs' : 'text-xs sm:text-sm');
	const badgeClass = $derived(
		compact
			? 'left-2 top-2 px-2 py-0.5 text-[11px]'
			: 'left-2 top-2 px-2 py-0.5 text-[11px] sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs'
	);
	const heartClass = $derived(compact ? 'right-2 top-2' : 'right-2 top-2 sm:right-3 sm:top-3');
	const compareClass = $derived(
		compact ? 'right-2 top-[3.75rem]' : 'right-2 top-[3.75rem] sm:right-3 sm:top-16'
	);
	const quickViewClass = $derived(
		compact ? 'inset-x-2 bottom-2' : 'inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3'
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

	function toggleWishlist(): void {
		heartPopKey++;
		wishlist.toggle(product.slug);
	}

	function toggleCompare(): void {
		comparePopKey++;
		const result = compare.toggle(product.slug);
		if (result === 'full') toasts.push(t.product.compareFull);
	}
</script>

<article
	class="group flex h-full flex-col overflow-hidden bg-white ring-1 ring-neutral-200 motion-safe:transition-shadow motion-safe:duration-200 hover:shadow-lg {radius}"
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
					class="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-enter motion-safe:group-hover:scale-[1.03]"
				/>
			</div>
		</a>
		{#if product.badge}
			<span
				class="absolute rounded-full bg-brand-700 font-bold text-white {badgeClass}"
			>
				{product.badge}
			</span>
		{/if}
		<button
			type="button"
			aria-pressed={wished}
			aria-label="{wished ? t.productCard.removeFromWishlist : t.productCard.addToWishlist} ({name})"
			onclick={toggleWishlist}
			class="absolute grid h-11 w-11 place-items-center rounded-full bg-white text-neutral-600 shadow hover:text-rose-600 {heartClass}"
		>
			{#key heartPopKey}
				<Heart
					class="h-5 w-5 {wished ? 'text-rose-600' : ''} {heartPopKey > 0
						? 'animate-pop'
						: ''}"
					fill={wished ? 'currentColor' : 'none'}
					aria-hidden="true"
				/>
			{/key}
		</button>
		<button
			type="button"
			aria-pressed={compared}
			aria-label="{compared ? t.product.compareRemove : t.product.compareAdd} ({name})"
			onclick={toggleCompare}
			class="absolute grid h-11 w-11 place-items-center rounded-full bg-white shadow {compared
				? 'text-brand-700 ring-2 ring-brand-700'
				: 'text-neutral-600 hover:text-brand-700'} {compareClass}"
		>
			{#key comparePopKey}
				<Scale
					class="h-5 w-5 {comparePopKey > 0 ? 'animate-pop' : ''}"
					aria-hidden="true"
				/>
			{/key}
		</button>
		<button
			type="button"
			onclick={() => {
				quickViewOpen = true;
			}}
			aria-label="{t.quickView.label} ({name})"
			class="pointer-events-none absolute flex min-h-11 items-center justify-center gap-2 rounded-full bg-white/95 px-4 text-sm font-semibold text-neutral-900 opacity-0 shadow motion-safe:transition-opacity motion-safe:duration-200 motion-safe:ease-enter hover:bg-white group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 {quickViewClass}"
		>
			<Eye class="h-4 w-4" aria-hidden="true" />
			{t.quickView.label}
		</button>
	</div>

	<div class="flex flex-1 flex-col {bodyClass}">
		<h3 class="line-clamp-2 font-semibold leading-snug text-neutral-900 {titleClass}">
			<a href={productPath(lang, product.slug)} class="hover:text-brand-800">
				{name}
			</a>
		</h3>
		<p class="flex items-center gap-1.5">
			<Stars rating={product.rating} label={ratingLabel} />
			<span class="text-neutral-500 {countClass}" aria-hidden="true">
				({formatCount(product.reviewCount, intlLocale)})
			</span>
		</p>
		<p class="mt-auto flex flex-wrap items-baseline gap-2 pt-1">
			<span class="font-bold text-neutral-900 {priceClass}">
				{formatPrice(product.price, intlLocale)}
			</span>
			{#if product.oldPrice}
				<s class="text-neutral-500 {oldPriceClass}">{formatPrice(product.oldPrice, intlLocale)}</s>
			{/if}
		</p>
		<button
			type="button"
			disabled={outOfStock}
			onclick={addToCart}
			class="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-4 text-sm font-semibold text-white motion-safe:transition-[background-color,transform] motion-safe:duration-200 motion-safe:ease-enter hover:bg-brand-800 motion-safe:active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
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
