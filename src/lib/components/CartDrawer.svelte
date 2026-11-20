<script lang="ts">
	import { browser } from '$app/env';
	import { Gift, Minus, Plus, ShoppingCart, Trash2, X } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';
	import { formatPrice, interpolate } from '#lib/format';
	import { localize, type Dictionary, type Locale } from '#lib/i18n/index';
	import { variantPrice } from '#lib/data/products';
	import { localizedPath, productPath } from '#lib/paths';
	import { cart } from '#lib/stores/cart.svelte';
	import { giftOptions } from '#lib/stores/gift-options.svelte';
	import { warranty, warrantyPrice, warrantyTotalFor } from '#lib/stores/warranty.svelte';
	import Picture from './Picture.svelte';
	import WarrantyUpsell from './WarrantyUpsell.svelte';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();

	let closeButton: HTMLButtonElement | undefined = $state();
	const intlLocale = $derived(t.meta.intlLocale);
	const warrantyTotal = $derived(warrantyTotalFor(cart.detailed));
	const grandTotal = $derived(cart.totals.total + warrantyTotal);

	let promoInput = $state('');
	let promoError = $state(false);
	const promoDiscount = $derived(cart.totals.promoDiscount ?? 0);

	function applyPromo(event: SubmitEvent): void {
		event.preventDefault();
		if (cart.applyPromo(promoInput)) {
			promoInput = '';
			promoError = false;
		} else {
			promoError = true;
		}
	}

	$effect(() => {
		if (!browser) return;
		if (cart.drawerOpen) {
			closeButton?.focus();
			const previous = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = previous;
			};
		}
	});

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape' && cart.drawerOpen) cart.closeDrawer();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if cart.drawerOpen}
	<div class="fixed inset-0 z-50">
		<button
			type="button"
			aria-label={t.nav.close}
			onclick={() => cart.closeDrawer()}
			class="absolute inset-0 h-full w-full cursor-default bg-black/50"
			transition:fade={{ duration: 200 }}
		></button>
		<div
			role="dialog"
			aria-modal="true"
			aria-label={t.cartDrawer.title}
			class="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl"
			transition:fly={{ x: 320, duration: 250 }}
		>
			<div class="flex items-center justify-between border-b border-line px-5 py-4">
				<h2 class="text-lg font-bold text-ink">
					{t.cartDrawer.title}
					{#if cart.count > 0}
						<span class="ml-1 text-sm font-medium text-muted">
							({interpolate(t.cart.itemsLabel, { count: cart.count })})
						</span>
					{/if}
				</h2>
				<button
					type="button"
					bind:this={closeButton}
					onclick={() => cart.closeDrawer()}
					aria-label={t.nav.close}
					class="grid h-11 w-11 place-items-center rounded-full text-ink-soft hover:bg-surface-soft"
				>
					<X class="h-5 w-5" aria-hidden="true" />
				</button>
			</div>

			{#if cart.detailed.length === 0}
				<div class="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
					<ShoppingCart class="h-10 w-10 text-neutral-300" aria-hidden="true" />
					<p class="text-muted">{t.cartDrawer.empty}</p>
					<a
						href={localizedPath(lang, '/shop')}
						onclick={() => cart.closeDrawer()}
						class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
					>
						{t.cart.continueShopping}
					</a>
				</div>
			{:else}
				<ul class="flex-1 divide-y divide-line overflow-y-auto px-5">
					{#each cart.detailed as line (line.product.slug + ':' + (line.variant?.id ?? ''))}
						{@const name = localize(line.product.name, lang)}
						{@const unitPrice = variantPrice(line.product, line.variant)}
						{@const stock = line.variant?.stock ?? line.product.stock}
						<li class="flex gap-3 py-4">
							<a
								href={productPath(lang, line.product.slug)}
								onclick={() => cart.closeDrawer()}
								tabindex="-1"
								aria-hidden="true"
								class="shrink-0"
							>
								<Picture
									base={line.variant?.image ?? line.product.image}
									alt={localize(line.product.imageAlt, lang)}
									width={1408}
									height={1760}
									loading="lazy"
									decoding="async"
									sizes="80px"
									class="h-20 w-20 shrink-0 rounded-2xl bg-brand-50 object-cover"
								/>
							</a>
							<div class="min-w-0 flex-1">
								<a
									href={productPath(lang, line.product.slug)}
									onclick={() => cart.closeDrawer()}
									class="line-clamp-2 text-sm font-semibold text-ink hover:text-brand-800 dark:hover:text-brand-200"
								>
									{name}
								</a>
								{#if line.variant}
									<p class="mt-0.5 text-sm text-muted">
										{localize(line.variant.label, lang)}
									</p>
								{/if}
								<p class="mt-0.5 text-sm text-muted">
									{formatPrice(unitPrice, intlLocale)}
								</p>
								<div class="mt-2 flex items-center gap-1">
									<button
										type="button"
										onclick={() => cart.setQty(line.product.slug, line.qty - 1, line.variant?.id)}
										aria-label="{t.cart.quantityLabel.replace('{name}', name)}: {line.qty - 1}"
										class="grid h-11 w-11 place-items-center rounded-full ring-1 ring-line hover:bg-surface-soft"
									>
										<Minus class="h-4 w-4" aria-hidden="true" />
									</button>
									<span
										class="w-8 text-center text-sm font-semibold"
										aria-label={interpolate(t.cart.quantityLabel, { name })}
										role="status"
									>
										{line.qty}
									</span>
									<button
										type="button"
										onclick={() => cart.setQty(line.product.slug, line.qty + 1, line.variant?.id)}
										disabled={line.qty >= stock}
										aria-label="{t.cart.quantityLabel.replace('{name}', name)}: {line.qty + 1}"
										class="grid h-11 w-11 place-items-center rounded-full ring-1 ring-line hover:bg-surface-soft disabled:opacity-40"
									>
										<Plus class="h-4 w-4" aria-hidden="true" />
									</button>
									<span class="ml-auto text-sm font-bold text-ink">
										{formatPrice(unitPrice * line.qty, intlLocale)}
									</span>
								</div>
								<div class="mt-2">
									{#if warranty.has(line.product.slug)}
										<p class="text-sm">
											<span class="font-semibold text-brand-800 dark:text-brand-200">
												{t.warrantyUpsell.inCart} — {formatPrice(
													warrantyPrice(unitPrice) * line.qty,
													intlLocale
												)}
											</span>
											<button
												type="button"
												onclick={() => warranty.toggle(line.product.slug)}
												class="ml-2 inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-ink-soft ring-1 ring-line hover:bg-surface-soft"
											>
												{t.warrantyUpsell.removeButton}
											</button>
										</p>
									{:else}
										<WarrantyUpsell {lang} {t} product={line.product} {unitPrice} compact />
									{/if}
								</div>
							</div>
							<button
								type="button"
								onclick={() => cart.remove(line.product.slug, line.variant?.id)}
								aria-label={interpolate(t.cart.remove, { name })}
								class="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400"
							>
								<Trash2 class="h-4 w-4" aria-hidden="true" />
							</button>
						</li>
					{/each}
				</ul>
				<div class="border-t border-line px-5 py-4">
					{#if giftOptions.active}
						<div
							class="mb-3 rounded-2xl bg-brand-50 p-3 dark:bg-surface-soft"
							data-testid="gift-line"
						>
							<p class="flex items-center gap-2 text-sm font-semibold text-ink">
								<Gift class="h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
								{t.giftOptions.cartTitle} — {t.giftOptions.cartFree}
							</p>
							{#if giftOptions.message.trim()}
								<p class="mt-1 text-sm text-muted">
									{interpolate(t.giftOptions.cartMessage, { message: giftOptions.message.trim() })}
								</p>
							{/if}
							{#if giftOptions.sendAsGift}
								<p class="mt-1 text-sm text-muted">{t.giftOptions.cartSendAsGift}</p>
							{/if}
						</div>
					{/if}
					<p class="flex items-baseline justify-between text-sm">
						<span class="text-muted">{t.cartDrawer.subtotal}</span>
						<span class="text-base font-bold text-ink">
							{formatPrice(cart.totals.subtotal, intlLocale)}
						</span>
					</p>
					{#if cart.totals.savings > 0}
						<p class="mt-1 flex items-baseline justify-between text-sm">
							<span class="text-muted">{t.cart.savings}</span>
							<span class="font-semibold text-brand-700 dark:text-brand-300">
								{formatPrice(cart.totals.savings, intlLocale)}
							</span>
						</p>
					{/if}
					{#if cart.appliedPromo && promoDiscount > 0}
						<p class="mt-1 flex items-baseline justify-between text-sm">
							<span class="text-muted">
								{interpolate(t.cart.promoDiscount, { code: cart.appliedPromo.code })}
							</span>
							<span class="font-semibold text-brand-700 dark:text-brand-300">
								−{formatPrice(promoDiscount, intlLocale)}
							</span>
						</p>
						<p class="mt-1 flex items-baseline justify-between text-sm">
							<span class="text-muted">{t.cart.total}</span>
							<span class="text-base font-bold text-ink">
								{formatPrice(cart.totals.total, intlLocale)}
							</span>
						</p>
					{/if}
					{#if warrantyTotal > 0}
						<p class="mt-1 flex items-baseline justify-between text-sm">
							<span class="text-muted">{t.cart.warrantyTotal}</span>
							<span class="font-semibold text-ink">
								{formatPrice(warrantyTotal, intlLocale)}
							</span>
						</p>
						<p class="mt-1 flex items-baseline justify-between text-sm">
							<span class="text-muted">{t.cart.total}</span>
							<span class="text-base font-bold text-ink">
								{formatPrice(grandTotal, intlLocale)}
							</span>
						</p>
					{/if}
					{#if cart.appliedPromo}
						<p class="mt-3 flex flex-wrap items-center gap-2">
							<span
								class="inline-flex items-center rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800 ring-1 ring-brand-200"
							>
								{interpolate(t.cart.promoApplied, {
									code: cart.appliedPromo.code,
									label: localize(cart.appliedPromo.label, lang)
								})}
							</span>
							<button
								type="button"
								onclick={() => cart.removePromo()}
								aria-label={interpolate(t.cart.promoRemove, { code: cart.appliedPromo.code })}
								class="grid h-11 w-11 place-items-center rounded-full text-muted hover:bg-surface-soft hover:text-ink"
							>
								<X class="h-4 w-4" aria-hidden="true" />
							</button>
						</p>
					{:else}
						<form onsubmit={applyPromo} novalidate class="mt-3">
							<label for="drawer-promo" class="mb-1 block text-sm font-semibold text-ink">
								{t.cart.promoLabel}
							</label>
							<div class="flex gap-2">
								<input
									id="drawer-promo"
									name="promo"
									type="text"
									bind:value={promoInput}
									placeholder={t.cart.promoPlaceholder}
									autocomplete="off"
									autocapitalize="characters"
									spellcheck="false"
									aria-invalid={promoError ? 'true' : undefined}
									aria-describedby={promoError ? 'drawer-promo-error' : undefined}
									class="h-12 min-w-0 flex-1 rounded-2xl bg-surface px-4 text-sm text-ink ring-1 ring-line placeholder:text-muted"
								/>
								<button
									type="submit"
									class="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800"
								>
									{t.cart.promoApply}
								</button>
							</div>
							{#if promoError}
								<p id="drawer-promo-error" role="alert" class="mt-1 text-sm text-red-600 dark:text-red-400">
									{t.cart.promoError}
								</p>
							{/if}
							<p class="mt-1 text-xs text-muted">{t.cart.promoHint}</p>
						</form>
					{/if}
					<div class="mt-4 grid grid-cols-2 gap-2">
						<a
							href={localizedPath(lang, '/cart')}
							onclick={() => cart.closeDrawer()}
							class="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
						>
							{t.cartDrawer.viewCart}
						</a>
						<a
							href={localizedPath(lang, '/checkout')}
							onclick={() => cart.closeDrawer()}
							class="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800"
						>
							{t.cartDrawer.checkout}
						</a>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
