<script lang="ts">
	import { browser } from '$app/env';
	import { Minus, Plus, ShoppingCart, Trash2, X } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';
	import { formatPrice, interpolate } from '#lib/format';
	import { localize, type Dictionary, type Locale } from '#lib/i18n/index';
	import { localizedPath, productPath } from '#lib/paths';
	import { cart } from '#lib/stores/cart.svelte';
	import Picture from './Picture.svelte';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();

	let closeButton: HTMLButtonElement | undefined = $state();
	const intlLocale = $derived(t.meta.intlLocale);

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
			class="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
			transition:fly={{ x: 320, duration: 250 }}
		>
			<div class="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
				<h2 class="text-lg font-bold text-neutral-900">
					{t.cartDrawer.title}
					{#if cart.count > 0}
						<span class="ml-1 text-sm font-medium text-neutral-500">
							({interpolate(t.cart.itemsLabel, { count: cart.count })})
						</span>
					{/if}
				</h2>
				<button
					type="button"
					bind:this={closeButton}
					onclick={() => cart.closeDrawer()}
					aria-label={t.nav.close}
					class="grid h-11 w-11 place-items-center rounded-full text-neutral-700 hover:bg-neutral-100"
				>
					<X class="h-5 w-5" aria-hidden="true" />
				</button>
			</div>

			{#if cart.detailed.length === 0}
				<div class="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
					<ShoppingCart class="h-10 w-10 text-neutral-300" aria-hidden="true" />
					<p class="text-neutral-600">{t.cartDrawer.empty}</p>
					<a
						href={localizedPath(lang, '/shop')}
						onclick={() => cart.closeDrawer()}
						class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
					>
						{t.cart.continueShopping}
					</a>
				</div>
			{:else}
				<ul class="flex-1 divide-y divide-neutral-100 overflow-y-auto px-5">
					{#each cart.detailed as line (line.product.slug)}
						{@const name = localize(line.product.name, lang)}
						<li class="flex gap-3 py-4">
							<a
								href={productPath(lang, line.product.slug)}
								onclick={() => cart.closeDrawer()}
								tabindex="-1"
								aria-hidden="true"
								class="shrink-0"
							>
								<Picture
									base={line.product.image}
									alt={localize(line.product.imageAlt, lang)}
									width={1408}
									height={1760}
									loading="lazy"
									decoding="async"
									class="h-20 w-20 shrink-0 rounded-2xl bg-brand-50 object-cover"
								/>
							</a>
							<div class="min-w-0 flex-1">
								<a
									href={productPath(lang, line.product.slug)}
									onclick={() => cart.closeDrawer()}
									class="line-clamp-2 text-sm font-semibold text-neutral-900 hover:text-brand-800"
								>
									{name}
								</a>
								<p class="mt-0.5 text-sm text-neutral-500">
									{formatPrice(line.product.price, intlLocale)}
								</p>
								<div class="mt-2 flex items-center gap-1">
									<button
										type="button"
										onclick={() => cart.setQty(line.product.slug, line.qty - 1)}
										aria-label="{t.cart.quantityLabel.replace('{name}', name)}: {line.qty - 1}"
										class="grid h-11 w-11 place-items-center rounded-full ring-1 ring-neutral-200 hover:bg-neutral-50"
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
										onclick={() => cart.setQty(line.product.slug, line.qty + 1)}
										disabled={line.qty >= line.product.stock}
										aria-label="{t.cart.quantityLabel.replace('{name}', name)}: {line.qty + 1}"
										class="grid h-11 w-11 place-items-center rounded-full ring-1 ring-neutral-200 hover:bg-neutral-50 disabled:opacity-40"
									>
										<Plus class="h-4 w-4" aria-hidden="true" />
									</button>
									<span class="ml-auto text-sm font-bold text-neutral-900">
										{formatPrice(line.product.price * line.qty, intlLocale)}
									</span>
								</div>
							</div>
							<button
								type="button"
								onclick={() => cart.remove(line.product.slug)}
								aria-label={interpolate(t.cart.remove, { name })}
								class="grid h-11 w-11 shrink-0 place-items-center rounded-full text-neutral-500 hover:bg-red-50 hover:text-red-600"
							>
								<Trash2 class="h-4 w-4" aria-hidden="true" />
							</button>
						</li>
					{/each}
				</ul>
				<div class="border-t border-neutral-200 px-5 py-4">
					<p class="flex items-baseline justify-between text-sm">
						<span class="text-neutral-600">{t.cartDrawer.subtotal}</span>
						<span class="text-base font-bold text-neutral-900">
							{formatPrice(cart.totals.subtotal, intlLocale)}
						</span>
					</p>
					{#if cart.totals.savings > 0}
						<p class="mt-1 flex items-baseline justify-between text-sm">
							<span class="text-neutral-600">{t.cart.savings}</span>
							<span class="font-semibold text-brand-700">
								{formatPrice(cart.totals.savings, intlLocale)}
							</span>
						</p>
					{/if}
					<div class="mt-4 grid grid-cols-2 gap-2">
						<a
							href={localizedPath(lang, '/cart')}
							onclick={() => cart.closeDrawer()}
							class="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
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
