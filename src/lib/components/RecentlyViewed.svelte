<script lang="ts">
	import { browser } from '$app/env';
	import { getProduct, type Product } from '#lib/data/products';
	import type { Dictionary, Locale } from '#lib/i18n/index';
	import { loadRecentlyViewed } from '#lib/recently-viewed';
	import ProductCard from './ProductCard.svelte';

	let {
		lang,
		t,
		excludeSlug
	}: { lang: Locale; t: Dictionary; excludeSlug?: string } = $props();

	let mounted = $state(false);
	let viewed = $state<Product[]>([]);

	$effect(() => {
		if (!browser) return;
		mounted = true;
		viewed = loadRecentlyViewed()
			.filter((slug) => slug !== excludeSlug)
			.flatMap((slug) => {
				const product = getProduct(slug);
				return product ? [product] : [];
			})
			.slice(0, 4);
	});
</script>

{#if mounted && viewed.length > 0}
	<section aria-labelledby="recently-viewed-heading">
		<h2
			id="recently-viewed-heading"
			class="text-2xl font-bold tracking-tight text-neutral-900"
		>
			{t.recentlyViewed.heading}
		</h2>
		<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each viewed as product (product.slug)}
				<ProductCard {product} {lang} {t} />
			{/each}
		</div>
	</section>
{/if}
