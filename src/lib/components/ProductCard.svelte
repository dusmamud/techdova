<script lang="ts">
	import { Check, Eye, Heart, Scale, ShoppingCart } from '@lucide/svelte';
	import { pressSpring } from '#lib/actions/press';
	import type { Product } from '#lib/data/products';
	import { flyToCart } from '#lib/fly-cart';
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
	// keyed icons animate on interaction — never on initial render. The
	// animation classes are gated on the counter for the same reason, and
	// app.css disables them entirely under reduced motion. The heart uses
	// the spring burst, and only when the toggle ADDS the product (the
	// class is additionally gated on `wished`); the compare icon keeps
	// the plain pop on every toggle.
	let heartPopKey = $state(0);
	let comparePopKey = $state(0);

	const name = $derived(localize(product.name, lang));
	const intlLocale = $derived(t.meta.intlLocale);
	const outOfStock = $derived(product.stock <= 0);
	const wished = $derived(wishlist.has(product.slug));
	const compared = $derived(compare.has(product.slug));
	// Second gallery image for the hover swap, when the catalogue provides
	// one that differs from the primary shot. Defensive: while `images[]`
	// holds only the primary shot (or the same base twice) the card falls
	// back to the zoom-only hover with no extra request.
	const alternateImage = $derived(
		product.images?.[1] && product.images[1] !== product.image ? product.images[1] : undefined
	);
	// Hover-swap deferral (audit finding P-3): the alternate (-2) image
	// must not download on initial load for touch/coarse pointers, where
	// hover never happens. It is rendered only after hover intent on a
	// fine-pointer device: mouseenter/focusin on the card arms it, and
	// the matchMedia guard stops touch taps (which also fire mouseenter)
	// from arming it. Once armed the markup is identical to before —
	// same classes, same opacity swap — so desktop hover behaviour is
	// unchanged apart from the first hover fetching the file.
	let hoverImageArmed = $state(false);

	function armHoverImage(): void {
		if (!hoverImageArmed && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
			hoverImageArmed = true;
		}
	}

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

	function addToCart(sourceEl: HTMLElement): void {
		// Fly-to-cart (elevation round 2, G-02): fly from the card's
		// product image, not the button, and open the drawer only after
		// the flight lands + the badge pop — a safe no-op under reduced
		// motion / without a header target; the cart update below never
		// depends on it.
		const cardImg = sourceEl.closest('article')?.querySelector('img');
		void flyToCart(cardImg ?? sourceEl, product.image).then(() => {
			cart.openDrawer();
		});
		cart.add(product.slug, 1);
		added = true;
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
	class="group flex h-full flex-col overflow-hidden bg-surface ring-1 ring-line motion-safe:transition-shadow motion-safe:duration-200 hover:shadow-lg {radius}"
	onmouseenter={armHoverImage}
	onfocusin={armHoverImage}
>
	<div class="relative bg-brand-50">
		<a href={productPath(lang, product.slug)} tabindex="-1" aria-hidden="true" class="block">
			<div class="relative aspect-[4/5] overflow-hidden">
				<Picture
					base={product.image}
					alt={localize(product.imageAlt, lang)}
					width={1408}
					height={1760}
					loading="lazy"
					decoding="async"
					sizes="(max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 320px"
					class="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-enter motion-safe:group-hover:scale-[1.06]"
				/>
				{#if alternateImage && hoverImageArmed}
					<Picture
						base={alternateImage}
						alt={localize(product.imageAlt, lang)}
						width={1408}
						height={1760}
						loading="lazy"
						decoding="async"
						sizes="(max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 320px"
						class="absolute inset-0 h-full w-full object-cover opacity-0 motion-safe:transition-[opacity,transform] motion-safe:duration-300 motion-safe:ease-enter motion-safe:group-hover:scale-[1.06] group-hover:opacity-100 group-focus-within:opacity-100"
					/>
				{/if}
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
			use:pressSpring
			aria-pressed={wished}
			aria-label="{wished ? t.productCard.removeFromWishlist : t.productCard.addToWishlist} ({name})"
			onclick={toggleWishlist}
			class="absolute grid h-11 w-11 place-items-center rounded-full bg-surface text-muted shadow hover:text-rose-600 {heartClass}"
		>
			{#key heartPopKey}
				<Heart
					class="h-5 w-5 {wished ? 'text-rose-600' : ''} {wished && heartPopKey > 0
						? 'animate-heart-burst'
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
			class="absolute grid h-11 w-11 place-items-center rounded-full bg-surface shadow {compared
				? 'text-brand-700 dark:text-brand-300 ring-2 ring-brand-700'
				: 'text-muted hover:text-brand-700 dark:hover:text-brand-300'} {compareClass}"
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
			class="pointer-events-none absolute flex min-h-11 items-center justify-center gap-2 rounded-full bg-surface/95 px-4 text-sm font-semibold text-ink opacity-0 shadow motion-safe:translate-y-2 motion-safe:transition-[opacity,transform] motion-safe:duration-200 motion-safe:ease-enter hover:bg-surface group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 motion-safe:group-hover:translate-y-0 motion-safe:group-focus-within:translate-y-0 {quickViewClass}"
		>
			<Eye class="h-4 w-4" aria-hidden="true" />
			{t.quickView.label}
		</button>
	</div>

	<div class="flex flex-1 flex-col {bodyClass}">
		<h3 class="line-clamp-2 font-semibold leading-snug text-ink {titleClass}">
			<a href={productPath(lang, product.slug)} class="hover:text-brand-800 dark:hover:text-brand-200">
				{name}
			</a>
		</h3>
		<p class="flex items-center gap-1.5">
			<Stars rating={product.rating} label={ratingLabel} />
			<span class="text-muted {countClass}" aria-hidden="true">
				({formatCount(product.reviewCount, intlLocale)})
			</span>
		</p>
		<p class="mt-auto flex flex-wrap items-baseline gap-2 pt-1">
			<span class="font-bold text-ink {priceClass}">
				{formatPrice(product.price, intlLocale)}
			</span>
			{#if product.oldPrice}
				<s class="text-muted {oldPriceClass}">{formatPrice(product.oldPrice, intlLocale)}</s>
			{/if}
		</p>
		<button
			type="button"
			use:pressSpring
			disabled={outOfStock}
			onclick={(event) => addToCart(event.currentTarget)}
			class="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-4 text-sm font-semibold text-white motion-safe:transition-[background-color,transform] motion-safe:duration-200 motion-safe:ease-enter hover:bg-brand-800 motion-safe:active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
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
