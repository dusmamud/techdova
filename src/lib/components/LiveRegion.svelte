<script lang="ts">
	import { getProduct } from '#lib/data/products';
	import { interpolate } from '#lib/format';
	import { localize, type Dictionary, type Locale } from '#lib/i18n/index';
	import { cart } from '#lib/stores/cart.svelte';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();

	// One persistent polite live region, present in the DOM from page load.
	// Screen readers announce add/remove events with the product name; the
	// region is never created and filled in the same tick.
	let message = $state('');

	$effect(() => {
		const event = cart.announcement;
		if (!event) return;
		const product = getProduct(event.slug);
		if (!product) return;
		message = interpolate(
			event.kind === 'added' ? t.live.addedToCart : t.live.removedFromCart,
			{ name: localize(product.name, lang) }
		);
	});
</script>

<div role="status" aria-live="polite" class="sr-only">{message}</div>
