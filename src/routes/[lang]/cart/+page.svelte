<script lang="ts">
	import { CheckCircle2, Minus, Plus, ShoppingCart, Trash2 } from '@lucide/svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { formatPrice, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath, productPath } from '#lib/paths';
	import { cart } from '#lib/stores/cart.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const intlLocale = $derived(t.meta.intlLocale);

	let order = $state<{ id: string; total: string } | null>(null);

	function checkout(): void {
		const id = `TD-${Date.now().toString(36).toUpperCase()}`;
		order = { id, total: formatPrice(cart.totals.total, intlLocale) };
		cart.clear();
	}
</script>

<Seo {lang} title={t.meta.cartTitle} description={t.meta.cartDescription} path="/cart" />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{t.cart.title}</h1>

	{#if order}
		<div class="mt-8 rounded-3xl bg-brand-50 p-6 text-center sm:p-10" role="status">
			<CheckCircle2 class="mx-auto h-12 w-12 text-brand-700" aria-hidden="true" />
			<h2 class="mt-3 text-2xl font-bold text-neutral-900">{t.cart.checkoutSuccessTitle}</h2>
			<p class="mx-auto mt-2 max-w-md leading-relaxed text-neutral-600">
				{interpolate(t.cart.checkoutSuccessText, { orderId: order.id, total: order.total })}
			</p>
			<p class="mx-auto mt-2 max-w-md text-sm text-neutral-500">{t.cart.checkoutDemoNote}</p>
			<div class="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
				<a
					href={localizedPath(lang, '/shop')}
					class="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
				>
					{t.cart.continueShopping}
				</a>
				<button
					type="button"
					onclick={() => {
						order = null;
					}}
					class="inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
				>
					{t.cart.checkoutAgain}
				</button>
			</div>
		</div>
	{:else if cart.detailed.length === 0}
		<div class="mt-8 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center">
			<ShoppingCart class="h-12 w-12 text-brand-700" aria-hidden="true" />
			<h2 class="text-xl font-bold text-neutral-900">{t.cart.empty}</h2>
			<p class="max-w-sm text-neutral-600">{t.cart.emptyHint}</p>
			<a
				href={localizedPath(lang, '/shop')}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.cart.continueShopping}
			</a>
		</div>
	{:else}
		<p class="mt-2 text-sm text-neutral-600" role="status">
			{cart.count === 1 ? t.cart.itemOne : interpolate(t.cart.itemsLabel, { count: cart.count })}
		</p>
		<div class="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
			<div>
				<ul class="divide-y divide-neutral-200 rounded-3xl bg-white ring-1 ring-neutral-200">
					{#each cart.detailed as line (line.product.slug)}
						{@const name = localize(line.product.name, lang)}
						<li class="flex gap-4 p-4 sm:p-5">
							<a
								href={productPath(lang, line.product.slug)}
								tabindex="-1"
								aria-hidden="true"
								class="shrink-0"
							>
								<img
									src={line.product.image}
									alt={localize(line.product.imageAlt, lang)}
									width="1408"
									height="1760"
									loading="lazy"
									decoding="async"
									class="h-24 w-24 shrink-0 rounded-2xl bg-brand-50 object-cover"
								/>
							</a>
							<div class="min-w-0 flex-1">
								<a
									href={productPath(lang, line.product.slug)}
									class="line-clamp-2 font-semibold text-neutral-900 hover:text-brand-800"
								>
									{name}
								</a>
								<p class="mt-0.5 text-sm text-neutral-500">
									{formatPrice(line.product.price, intlLocale)}
								</p>
								<div class="mt-3 flex items-center gap-1">
									<button
										type="button"
										onclick={() => cart.setQty(line.product.slug, line.qty - 1)}
										aria-label="{t.cart.quantityLabel.replace('{name}', name)}: {line.qty - 1}"
										class="grid h-11 w-11 place-items-center rounded-full ring-1 ring-neutral-300 hover:bg-neutral-50"
									>
										<Minus class="h-4 w-4" aria-hidden="true" />
									</button>
									<span class="w-8 text-center text-sm font-semibold" role="status">
										{line.qty}
									</span>
									<button
										type="button"
										onclick={() => cart.setQty(line.product.slug, line.qty + 1)}
										disabled={line.qty >= line.product.stock}
										aria-label="{t.cart.quantityLabel.replace('{name}', name)}: {line.qty + 1}"
										class="grid h-11 w-11 place-items-center rounded-full ring-1 ring-neutral-300 hover:bg-neutral-50 disabled:opacity-40"
									>
										<Plus class="h-4 w-4" aria-hidden="true" />
									</button>
									<button
										type="button"
										onclick={() => cart.remove(line.product.slug)}
										aria-label={interpolate(t.cart.remove, { name })}
										class="ml-2 grid h-11 w-11 place-items-center rounded-full text-neutral-500 hover:bg-red-50 hover:text-red-600"
									>
										<Trash2 class="h-4 w-4" aria-hidden="true" />
									</button>
								</div>
							</div>
							<p class="shrink-0 font-bold text-neutral-900">
								{formatPrice(line.product.price * line.qty, intlLocale)}
							</p>
						</li>
					{/each}
				</ul>
				<button
					type="button"
					onclick={() => cart.clear()}
					class="mt-4 inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-red-600 ring-1 ring-red-200 hover:bg-red-50"
				>
					{t.cart.clearCart}
				</button>
			</div>

			<aside aria-label={t.cart.total} class="h-fit rounded-3xl bg-white p-6 ring-1 ring-neutral-200">
				<dl class="space-y-3 text-sm">
					<div class="flex items-baseline justify-between">
						<dt class="text-neutral-600">{t.cart.subtotal}</dt>
						<dd class="font-semibold text-neutral-900">
							{formatPrice(cart.totals.subtotal, intlLocale)}
						</dd>
					</div>
					{#if cart.totals.savings > 0}
						<div class="flex items-baseline justify-between">
							<dt class="text-neutral-600">{t.cart.savings}</dt>
							<dd class="font-semibold text-brand-700">
								{formatPrice(cart.totals.savings, intlLocale)}
							</dd>
						</div>
					{/if}
					<div class="flex items-baseline justify-between">
						<dt class="text-neutral-600">{t.cart.shipping}</dt>
						<dd class="font-semibold text-neutral-900">{t.cart.shippingFree}</dd>
					</div>
					<div class="flex items-baseline justify-between border-t border-neutral-200 pt-3 text-base">
						<dt class="font-bold text-neutral-900">{t.cart.total}</dt>
						<dd class="font-bold text-neutral-900">{formatPrice(cart.totals.total, intlLocale)}</dd>
					</div>
				</dl>
				<button
					type="button"
					onclick={checkout}
					class="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
				>
					{t.cart.checkout}
				</button>
				<p class="mt-3 text-center text-xs text-neutral-500">{t.cart.checkoutDemoNote}</p>
			</aside>
		</div>
	{/if}
</div>
