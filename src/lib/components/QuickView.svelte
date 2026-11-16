<script lang="ts">
	import { browser } from '$app/env';
	import { Check, ShoppingCart, X } from '@lucide/svelte';
	import type { Product } from '#lib/data/products';
	import { formatCount, formatDecimal, formatPrice, interpolate } from '#lib/format';
	import { localize, type Dictionary, type Locale } from '#lib/i18n/index';
	import { productPath } from '#lib/paths';
	import { cart } from '#lib/stores/cart.svelte';
	import { toasts } from '#lib/stores/toast.svelte';
	import Stars from './Stars.svelte';

	let {
		product,
		lang,
		t,
		open,
		onClose
	}: {
		product: Product;
		lang: Locale;
		t: Dictionary;
		open: boolean;
		onClose: () => void;
	} = $props();

	const name = $derived(localize(product.name, lang));
	const intlLocale = $derived(t.meta.intlLocale);
	const outOfStock = $derived(product.stock <= 0);

	const ratingLabel = $derived(
		`${interpolate(t.productCard.ratingLabel, { rating: formatDecimal(product.rating, intlLocale) })} — ${interpolate(t.productCard.reviewsLabel, { count: formatCount(product.reviewCount, intlLocale) })}`
	);

	let added = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;
	let closeButton: HTMLButtonElement | undefined = $state();
	let opener: HTMLElement | null = null;

	$effect(() => {
		if (!browser) return;
		if (open) {
			opener = document.activeElement as HTMLElement | null;
			closeButton?.focus();
			const previous = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = previous;
				opener?.focus();
			};
		}
	});

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape' && open) onClose();
	}

	function addToCart(): void {
		cart.add(product.slug, 1);
		added = true;
		toasts.push(interpolate(t.live.addedToCart, { name }));
		clearTimeout(timer);
		timer = setTimeout(() => {
			added = false;
		}, 1800);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button
			type="button"
			aria-label={t.nav.close}
			onclick={onClose}
			class="absolute inset-0 h-full w-full cursor-default bg-black/50"
		></button>
		<div
			role="dialog"
			aria-modal="true"
			aria-label={name}
			class="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
		>
			<button
				type="button"
				bind:this={closeButton}
				onclick={onClose}
				aria-label={t.nav.close}
				class="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-neutral-700 shadow hover:bg-neutral-100"
			>
				<X class="h-5 w-5" aria-hidden="true" />
			</button>
			<div class="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
				<div class="overflow-hidden rounded-2xl bg-brand-50">
					<div class="aspect-[4/5]">
						<img
							src={product.image}
							alt={localize(product.imageAlt, lang)}
							width="1408"
							height="1760"
							loading="lazy"
							decoding="async"
							class="h-full w-full object-cover"
						/>
					</div>
				</div>
				<div class="flex flex-col">
					<h2 class="pr-10 text-2xl font-bold tracking-tight text-neutral-900">{name}</h2>
					<p class="mt-2 flex items-center gap-1.5">
						<Stars rating={product.rating} label={ratingLabel} />
						<span class="text-sm text-neutral-500" aria-hidden="true">
							({formatCount(product.reviewCount, intlLocale)})
						</span>
					</p>
					<p class="mt-3 flex flex-wrap items-baseline gap-2">
						<span class="text-2xl font-bold text-neutral-900">
							{formatPrice(product.price, intlLocale)}
						</span>
						{#if product.oldPrice}
							<s class="text-base text-neutral-500">
								{formatPrice(product.oldPrice, intlLocale)}
							</s>
						{/if}
					</p>
					<p class="mt-3 leading-relaxed text-neutral-600">
						{localize(product.shortDescription, lang)}
					</p>
					<div class="mt-auto flex flex-col gap-3 pt-6">
						<button
							type="button"
							disabled={outOfStock}
							onclick={addToCart}
							class="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
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
						<a
							href={productPath(lang, product.slug)}
							class="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-brand-700 ring-1 ring-neutral-300 hover:bg-neutral-50"
						>
							{t.quickView.viewDetails}
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
