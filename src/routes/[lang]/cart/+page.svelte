<script lang="ts">
	import { Minus, Plus, ShoppingCart, Trash2, X } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Picture from '#lib/components/Picture.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { formatPrice, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { variantPrice } from '#lib/data/products';
	import { localizedPath, productPath } from '#lib/paths';
	import { cart } from '#lib/stores/cart.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const intlLocale = $derived(t.meta.intlLocale);

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
</script>

<Seo {lang} title={t.meta.cartTitle} description={t.meta.cartDescription} path="/cart" />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<h1 class="text-[1.75rem] font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
			{t.cart.title}
		</h1>
	</div>

	{#if cart.detailed.length === 0}
		<div class="mt-8 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center dark:bg-surface-soft">
			<ShoppingCart class="h-12 w-12 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			<h2 class="text-xl font-bold text-ink">{t.cart.empty}</h2>
			<p class="max-w-sm text-muted">{t.cart.emptyHint}</p>
			<a
				href={localizedPath(lang, '/shop')}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.cart.continueShopping}
			</a>
		</div>
	{:else}
		<p class="mt-2 text-sm text-muted" role="status">
			{cart.count === 1 ? t.cart.itemOne : interpolate(t.cart.itemsLabel, { count: cart.count })}
		</p>
		<div class="mt-6 grid gap-6 lg:grid-cols-[1fr_380px] lg:gap-8" use:reveal>
			<div>
				<ul class="divide-y divide-line rounded-3xl bg-surface ring-1 ring-line">
					{#each cart.detailed as line (line.product.slug + ':' + (line.variant?.id ?? ''))}
						{@const name = localize(line.product.name, lang)}
						{@const unitPrice = variantPrice(line.product, line.variant)}
						{@const stock = line.variant?.stock ?? line.product.stock}
						<li class="flex gap-3 p-3 sm:gap-4 sm:p-5">
							<a
								href={productPath(lang, line.product.slug)}
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
									class="h-20 w-20 shrink-0 rounded-2xl bg-brand-50 object-cover sm:h-24 sm:w-24"
								/>
							</a>
							<div class="min-w-0 flex-1">
								<a
									href={productPath(lang, line.product.slug)}
									class="line-clamp-2 text-sm font-semibold text-ink hover:text-brand-800 dark:hover:text-brand-200 sm:text-base"
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
								<div class="mt-3 flex items-center gap-1">
									<button
										type="button"
										onclick={() => cart.setQty(line.product.slug, line.qty - 1, line.variant?.id)}
										aria-label="{t.cart.quantityLabel.replace('{name}', name)}: {line.qty - 1}"
										class="grid h-11 w-11 place-items-center rounded-full ring-1 ring-line hover:bg-surface-soft"
									>
										<Minus class="h-4 w-4" aria-hidden="true" />
									</button>
									<span class="w-8 text-center text-sm font-semibold" role="status">
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
									<button
										type="button"
										onclick={() => cart.remove(line.product.slug, line.variant?.id)}
										aria-label={interpolate(t.cart.remove, { name })}
										class="ml-2 grid h-11 w-11 place-items-center rounded-full text-muted hover:bg-red-50 dark:hover:bg-red-950/60 hover:text-red-600 dark:hover:text-red-400"
									>
										<Trash2 class="h-4 w-4" aria-hidden="true" />
									</button>
								</div>
							</div>
							<p class="shrink-0 text-sm font-bold text-ink sm:text-base">
								{formatPrice(unitPrice * line.qty, intlLocale)}
							</p>
						</li>
					{/each}
				</ul>
				<button
					type="button"
					onclick={() => cart.clear()}
					class="mt-4 inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-red-600 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-900 hover:bg-red-50 dark:hover:bg-red-950/60"
				>
					{t.cart.clearCart}
				</button>
			</div>

			<aside aria-label={t.cart.total} class="h-fit rounded-3xl bg-surface p-4 ring-1 ring-line sm:p-6">
				<dl class="space-y-3 text-sm">
					<div class="flex items-baseline justify-between">
						<dt class="text-muted">{t.cart.subtotal}</dt>
						<dd class="font-semibold text-ink">
							{formatPrice(cart.totals.subtotal, intlLocale)}
						</dd>
					</div>
					{#if cart.totals.savings > 0}
						<div class="flex items-baseline justify-between">
							<dt class="text-muted">{t.cart.savings}</dt>
							<dd class="font-semibold text-brand-700 dark:text-brand-300">
								{formatPrice(cart.totals.savings, intlLocale)}
							</dd>
						</div>
					{/if}
					{#if cart.appliedPromo && promoDiscount > 0}
						<div class="flex items-baseline justify-between">
							<dt class="text-muted">
								{interpolate(t.cart.promoDiscount, { code: cart.appliedPromo.code })}
							</dt>
							<dd class="font-semibold text-brand-700 dark:text-brand-300">
								−{formatPrice(promoDiscount, intlLocale)}
							</dd>
						</div>
					{/if}
					<div class="flex items-baseline justify-between">
						<dt class="text-muted">{t.cart.shipping}</dt>
						<dd class="font-semibold text-ink">{t.cart.shippingFree}</dd>
					</div>
					<div class="flex items-baseline justify-between border-t border-line pt-3 text-base">
						<dt class="font-bold text-ink">{t.cart.total}</dt>
						<dd class="font-bold text-ink">{formatPrice(cart.totals.total, intlLocale)}</dd>
					</div>
				</dl>
				{#if cart.appliedPromo}
					<p class="mt-4 flex flex-wrap items-center gap-2">
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
					<form onsubmit={applyPromo} novalidate class="mt-4">
						<label for="cart-promo" class="mb-1 block text-sm font-semibold text-ink">
							{t.cart.promoLabel}
						</label>
						<div class="flex gap-2">
							<input
								id="cart-promo"
								name="promo"
								type="text"
								bind:value={promoInput}
								placeholder={t.cart.promoPlaceholder}
								autocomplete="off"
								autocapitalize="characters"
								spellcheck="false"
								aria-invalid={promoError ? 'true' : undefined}
								aria-describedby={promoError ? 'cart-promo-error' : undefined}
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
							<p id="cart-promo-error" role="alert" class="mt-1 text-sm text-red-600 dark:text-red-400">
								{t.cart.promoError}
							</p>
						{/if}
						<p class="mt-1 text-xs text-muted">{t.cart.promoHint}</p>
					</form>
				{/if}
				<a
					href={localizedPath(lang, '/checkout')}
					class="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
				>
					{t.cart.checkout}
				</a>
				<p class="mt-3 text-center text-xs text-muted">{t.cart.checkoutDemoNote}</p>
			</aside>
		</div>
	{/if}
</div>
