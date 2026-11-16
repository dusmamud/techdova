<script lang="ts">
	import { onMount } from 'svelte';
	import { CheckCircle2, PackageSearch, ShoppingCart } from '@lucide/svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { getProduct } from '#lib/data/products';
	import { formatDate, formatPrice, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import {
		loadDemoOrders,
		statusFromAge,
		type DemoOrder,
		type OrderStatus
	} from '#lib/orders';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const intlLocale = $derived(t.meta.intlLocale);

	let order = $state<DemoOrder | null>(null);
	let checked = $state(false);

	onMount(() => {
		order = loadDemoOrders()[0] ?? null;
		checked = true;
	});

	const statusLabels: Record<OrderStatus, string> = $derived({
		ordered: t.trackOrder.statusOrdered,
		shipped: t.trackOrder.statusShipped,
		'out-for-delivery': t.trackOrder.statusOutForDelivery,
		delivered: t.trackOrder.statusDelivered
	});

	const status = $derived(order ? statusFromAge(order.placedAtISO, Date.now()) : null);

	function lineName(slug: string): string {
		const product = getProduct(slug);
		return product ? localize(product.name, lang) : slug;
	}
</script>

<Seo
	{lang}
	title={t.meta.orderConfirmationTitle}
	description={t.meta.orderConfirmationDescription}
	path="/order-confirmation"
	noindex
/>

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	{#if checked && order}
		<div class="rounded-3xl bg-brand-50 p-6 text-center sm:p-10" role="status">
			<CheckCircle2 class="mx-auto h-12 w-12 text-brand-700" aria-hidden="true" />
			<h1 class="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">
				{t.cart.checkoutSuccessTitle}
			</h1>
			<p class="mx-auto mt-2 max-w-md leading-relaxed text-neutral-600">
				{interpolate(t.cart.checkoutSuccessText, {
					orderId: order.id,
					total: formatPrice(order.total, intlLocale)
				})}
			</p>
			<p class="mt-2 text-sm text-neutral-500">
				{interpolate(t.orderConfirmation.placedOn, {
					date: formatDate(new Date(order.placedAtISO), intlLocale)
				})}
			</p>
			{#if status}
				<p class="mt-2 text-sm text-neutral-600">
					<span class="font-semibold text-neutral-900">{t.orderConfirmation.statusLabel}:</span>
					{' '}{statusLabels[status]}
				</p>
			{/if}
			<p class="mx-auto mt-2 max-w-md text-sm text-neutral-500">{t.cart.checkoutDemoNote}</p>
		</div>

		<section aria-labelledby="confirmation-items-heading" class="mt-8 rounded-3xl bg-white p-6 ring-1 ring-neutral-200">
			<h2 id="confirmation-items-heading" class="text-lg font-bold text-neutral-900">
				{t.orderConfirmation.itemsTitle}
			</h2>
			<ul class="mt-4 divide-y divide-neutral-100">
				{#each order.lines as line (line.slug)}
					<li class="flex items-baseline justify-between gap-3 py-3 text-sm first:pt-0 last:pb-0">
						<span class="min-w-0 text-neutral-600">
							<span class="font-medium text-neutral-900">{lineName(line.slug)}</span>
							{' '}{interpolate(t.orderConfirmation.lineQty, { qty: line.qty })}
						</span>
						<span class="shrink-0 font-semibold text-neutral-900">
							{formatPrice(line.unitPrice * line.qty, intlLocale)}
						</span>
					</li>
				{/each}
			</ul>
			<p class="mt-4 flex items-baseline justify-between border-t border-neutral-200 pt-4 text-base">
				<span class="font-bold text-neutral-900">{t.cart.total}</span>
				<span class="font-bold text-neutral-900">{formatPrice(order.total, intlLocale)}</span>
			</p>
		</section>

		<div class="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
			<a
				href={localizedPath(lang, '/track-order')}
				class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				<PackageSearch class="h-4 w-4" aria-hidden="true" />
				{t.orderConfirmation.trackOrderLink}
			</a>
			<a
				href={localizedPath(lang, '/shop')}
				class="inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
			>
				{t.cart.continueShopping}
			</a>
		</div>
	{:else if checked}
		<div class="flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center">
			<ShoppingCart class="h-12 w-12 text-brand-700" aria-hidden="true" />
			<h1 class="text-2xl font-bold text-neutral-900">{t.orderConfirmation.emptyTitle}</h1>
			<p class="max-w-md text-neutral-600">{t.orderConfirmation.emptyText}</p>
			<a
				href={localizedPath(lang, '/shop')}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.cart.continueShopping}
			</a>
		</div>
	{/if}
</div>
