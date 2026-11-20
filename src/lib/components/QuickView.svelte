<script lang="ts">
	import { browser } from '$app/env';
	import { Check, ShoppingCart, X } from '@lucide/svelte';
	import { getDefaultVariant, getVariant, variantPrice, type Product } from '#lib/data/products';
	import { flyToCart } from '#lib/fly-cart';
	import { formatCount, formatDecimal, formatPrice, interpolate } from '#lib/format';
	import { localize, type Dictionary, type Locale } from '#lib/i18n/index';
	import { productPath } from '#lib/paths';
	import { cart } from '#lib/stores/cart.svelte';
	import { toasts } from '#lib/stores/toast.svelte';
	import Picture from './Picture.svelte';
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
	const variants = $derived(product.variants ?? []);
	// Explicit variant choice; resets whenever a different product is shown.
	let selectedVariantId = $state<string | undefined>(undefined);
	$effect(() => {
		void product.slug;
		selectedVariantId = undefined;
	});
	// Default: the base-priced variant, so QuickView matches card prices
	// (variants[0] is the cheaper 128 GB option on the phones).
	const selectedVariant = $derived(getVariant(product, selectedVariantId) ?? getDefaultVariant(product));
	const displayPrice = $derived(variantPrice(product, selectedVariant));
	const variantStock = $derived(selectedVariant?.stock ?? product.stock);
	const outOfStock = $derived(variantStock <= 0);
	const displayImage = $derived(selectedVariant?.image ?? product.image);

	const ratingLabel = $derived(
		`${interpolate(t.productCard.ratingLabel, { rating: formatDecimal(product.rating, intlLocale) })} — ${interpolate(t.productCard.reviewsLabel, { count: formatCount(product.reviewCount, intlLocale) })}`
	);

	let added = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;
	let closeButton: HTMLButtonElement | undefined = $state();
	let opener: HTMLElement | null = null;
	// Elevation round 2, G-02: the fly-to-cart source is the product
	// image inside this wrapper, not the ATC button.
	let imageWrap: HTMLDivElement | undefined = $state();

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

	function addToCart(event: MouseEvent): void {
		const source = event.currentTarget;
		const quickViewImg = imageWrap?.querySelector('img');
		if (quickViewImg) void flyToCart(quickViewImg, displayImage);
		else if (source instanceof HTMLElement) void flyToCart(source, displayImage);
		cart.add(product.slug, 1, selectedVariant?.id);
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
			class="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-surface shadow-2xl"
		>
			<button
				type="button"
				bind:this={closeButton}
				onclick={onClose}
				aria-label={t.nav.close}
				class="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-surface text-ink-soft shadow hover:bg-surface-soft"
			>
				<X class="h-5 w-5" aria-hidden="true" />
			</button>
			<div class="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
				<div bind:this={imageWrap} class="overflow-hidden rounded-2xl bg-brand-50">
					<div class="aspect-[4/5]">
						<Picture
							base={displayImage}
							alt={localize(product.imageAlt, lang)}
							width={1408}
							height={1760}
							loading="lazy"
							decoding="async"
							sizes="(max-width: 639px) 100vw, 360px"
							class="h-full w-full object-cover"
						/>
					</div>
				</div>
				<div class="flex flex-col">
					<h2 class="pr-10 text-2xl font-bold tracking-tight text-ink">{name}</h2>
					<p class="mt-2 flex items-center gap-1.5">
						<Stars rating={product.rating} label={ratingLabel} />
						<span class="text-sm text-muted" aria-hidden="true">
							({formatCount(product.reviewCount, intlLocale)})
						</span>
					</p>
					<p class="mt-3 flex flex-wrap items-baseline gap-2">
						<span class="text-2xl font-bold text-ink">
							{formatPrice(displayPrice, intlLocale)}
						</span>
						{#if product.oldPrice && displayPrice === product.price}
							<s class="text-base text-muted">
								{formatPrice(product.oldPrice, intlLocale)}
							</s>
						{/if}
					</p>
					<p class="mt-3 leading-relaxed text-muted">
						{localize(product.shortDescription, lang)}
					</p>
					{#if variants.length > 0}
						<div class="mt-4">
							<p class="text-sm font-semibold text-ink" id="quickview-variant-label">
								{variants[0].kind === 'color'
									? t.product.variantColorLabel
									: t.product.variantStorageLabel}
								<span class="font-normal text-muted">
									— {localize(selectedVariant?.label ?? variants[0].label, lang)}
								</span>
							</p>
							<div
								class="mt-2 flex flex-wrap gap-2"
								role="group"
								aria-labelledby="quickview-variant-label"
							>
								{#each variants as variant (variant.id)}
									{@const isSelected = selectedVariant?.id === variant.id}
									{@const isOos = variant.stock <= 0}
									<button
										type="button"
										disabled={isOos}
										aria-pressed={isSelected}
										aria-label={localize(variant.label, lang) +
											(isOos ? ` ${t.product.variantOutOfStockSuffix}` : '')}
										onclick={() => {
											selectedVariantId = variant.id;
										}}
										class="inline-flex min-h-11 items-center gap-2 rounded-full border px-3 py-2 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-50 {isSelected
											? 'border-brand-700 bg-brand-50 font-semibold text-brand-800 dark:bg-surface-soft dark:text-brand-200'
											: 'border-line text-ink-soft hover:border-brand-300'}"
									>
										{#if variant.kind === 'color' && variant.swatch}
											<span
												class="inline-block size-4 shrink-0 rounded-full ring-1 ring-black/10"
												style="background-color: {variant.swatch}"
												aria-hidden="true"
											></span>
										{/if}
										{localize(variant.label, lang)}
										{#if variant.priceDelta !== 0}
											<span class="text-xs text-muted">
												({variant.priceDelta > 0 ? '+' : ''}{formatPrice(
													variant.priceDelta,
													intlLocale
												)})
											</span>
										{/if}
										{#if isOos}
											<span class="text-xs">{t.product.variantOutOfStockSuffix}</span>
										{/if}
									</button>
								{/each}
							</div>
							<p aria-live="polite" class="sr-only">
								{interpolate(t.product.variantSelected, {
									label: localize(selectedVariant?.label ?? variants[0].label, lang)
								})}
							</p>
						</div>
					{/if}
					<div class="mt-auto flex flex-col gap-3 pt-6">
						<button
							type="button"
							disabled={outOfStock}
							onclick={addToCart}
							class="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
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
							class="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-brand-700 dark:text-brand-300 ring-1 ring-line hover:bg-surface-soft"
						>
							{t.quickView.viewDetails}
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
