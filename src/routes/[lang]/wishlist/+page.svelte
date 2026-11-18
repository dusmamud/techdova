<script lang="ts">
	import { Heart, ShoppingCart, Trash2 } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { getProduct } from '#lib/data/products';
	import { interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import { cart } from '#lib/stores/cart.svelte';
	import { wishlist } from '#lib/stores/wishlist.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));

	// Store-driven like the cart page: the wishlist loads from localStorage in
	// the browser, so SSR/prerender shows the empty state until hydration.
	const wished = $derived(
		wishlist.slugs.flatMap((slug) => {
			const product = getProduct(slug);
			return product ? [product] : [];
		})
	);

	// Grid re-render animation key: the wishlist contents, so adding or
	// removing an item replays `animate-grid-in` on a synchronously swapped grid.
	const gridSignature = $derived(wishlist.slugs.join(','));

	const countText = $derived(
		wished.length === 1
			? t.wishlistPage.countOne
			: interpolate(t.wishlistPage.count, { count: wished.length })
	);

	function moveToCart(slug: string): void {
		// Deliberate: the wishlist stores slugs only, so moving to cart adds
		// the default variant (no variantId). Shoppers pick a variant on the
		// product page or in the cart.
		cart.add(slug, 1);
		// The store has no remove(): toggle() drops a slug known to be present.
		wishlist.toggle(slug);
	}
</script>

<Seo
	{lang}
	title={t.meta.wishlistTitle}
	description={t.meta.wishlistDescription}
	path="/wishlist"
	noindex
/>

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<h1 class="text-[1.75rem] font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
			{t.wishlistPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.wishlistPage.description}</p>
	</div>

	{#if wished.length === 0}
		<div class="mt-8 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center dark:bg-surface-soft">
			<Heart class="h-12 w-12 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			<h2 class="text-xl font-bold text-ink">{t.wishlistPage.empty}</h2>
			<p class="max-w-sm text-muted">{t.wishlistPage.emptyHint}</p>
			<a
				href={localizedPath(lang, '/shop')}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.wishlistPage.browseShop}
			</a>
		</div>
	{:else}
		<h2 class="sr-only">{t.wishlistPage.savedHeading}</h2>
		<p class="mt-4 text-sm font-medium text-muted" role="status">{countText}</p>
		{#key gridSignature}
			<div class="mt-6 grid animate-grid-in grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
				{#each wished as product, i (product.slug)}
					{@const name = localize(product.name, lang)}
					<div
						class="flex min-w-0 flex-col gap-2"
						use:reveal={{ delay: Math.min(i * 60, 300) }}
					>
					<ProductCard {product} {lang} {t} />
					<div class="flex gap-2">
						<button
							type="button"
							disabled={product.stock <= 0}
							onclick={() => moveToCart(product.slug)}
							aria-label={interpolate(t.wishlistPage.moveToCartLabel, { name })}
							class="inline-flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-700 px-2 text-center text-xs font-semibold leading-tight text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted sm:gap-2 sm:px-4 sm:text-sm"
						>
							<ShoppingCart class="h-4 w-4 shrink-0" aria-hidden="true" />
							{t.wishlistPage.moveToCart}
						</button>
						<button
							type="button"
							onclick={() => wishlist.toggle(product.slug)}
							aria-label={interpolate(t.wishlistPage.remove, { name })}
							class="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted ring-1 ring-line hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400"
						>
							<Trash2 class="h-4 w-4" aria-hidden="true" />
						</button>
					</div>
				</div>
			{/each}
			</div>
		{/key}
	{/if}
</div>
