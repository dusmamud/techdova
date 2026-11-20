<script lang="ts">
	import { ShieldCheck } from '@lucide/svelte';
	import { formatPrice, interpolate } from '#lib/format';
	import type { Dictionary, Locale } from '#lib/i18n/index';
	import { warranty, warrantyPrice } from '#lib/stores/warranty.svelte';
	import type { Product } from '#lib/data/products';

	let {
		lang,
		t,
		product,
		unitPrice,
		compact = false
	}: {
		lang: Locale;
		t: Dictionary;
		product: Product;
		unitPrice: number;
		compact?: boolean;
	} = $props();

	const intlLocale = $derived(t.meta.intlLocale);
	const price = $derived(warrantyPrice(unitPrice));
	const added = $derived(warranty.has(product.slug));
</script>

<div
	class="rounded-3xl bg-surface p-4 ring-1 ring-line {compact ? '' : 'sm:p-5'}"
	data-testid="warranty-upsell"
>
	<p class="flex items-center gap-2 text-sm font-bold text-ink">
		<ShieldCheck class="h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
		{t.warrantyUpsell.title}
	</p>
	{#if !compact}
		<p class="mt-1 text-sm text-muted">
			{interpolate(t.warrantyUpsell.text, { price: formatPrice(price, intlLocale) })}
		</p>
	{/if}
	{#if added}
		<p role="status" class="mt-2 text-sm font-semibold text-brand-800 dark:text-brand-200">
			{t.warrantyUpsell.addedLabel} — {formatPrice(price, intlLocale)}
		</p>
		<button
			type="button"
			onclick={() => warranty.toggle(product.slug)}
			class="mt-2 inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-ink-soft ring-1 ring-line hover:bg-surface-soft"
		>
			{t.warrantyUpsell.removeButton}
		</button>
	{:else}
		<button
			type="button"
			onclick={() => warranty.toggle(product.slug)}
			class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800"
		>
			{interpolate(t.warrantyUpsell.addButton, { price: formatPrice(price, intlLocale) })}
		</button>
	{/if}
	<p class="mt-2 text-xs text-muted">{t.warrantyUpsell.cartNote}</p>
</div>
