<script lang="ts">
	import { onMount } from 'svelte';
	import { PackageSearch, ShoppingCart } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Seo from '#lib/components/Seo.svelte';
	import { getProduct, getVariant } from '#lib/data/products';
	import { formatDate, formatPrice, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import {
		loadDemoOrders,
		statusFromAge,
		type DemoOrder,
		type OrderStatus
	} from '#lib/orders';
	import { localizedPath } from '#lib/paths';
	import { account } from '#lib/stores/account.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const intlLocale = $derived(t.meta.intlLocale);

	let order = $state<DemoOrder | null>(null);
	let checked = $state(false);

	// Demo account creation (H8): one-password step, localStorage only.
	// The password is validated locally and never stored or sent anywhere
	// — the demo account keeps name + email only, like the account page.
	let password = $state('');
	let confirmPassword = $state('');
	let passwordError = $state('');
	let accountCreated = $state(false);

	function createAccount(event: SubmitEvent): void {
		event.preventDefault();
		if (password.length < 8) {
			passwordError = t.orderConfirmation.passwordError;
			return;
		}
		if (password !== confirmPassword) {
			passwordError = t.orderConfirmation.passwordMismatch;
			return;
		}
		passwordError = '';
		if (order) account.signIn(order.name, order.email);
		password = '';
		confirmPassword = '';
		accountCreated = true;
	}

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

	function lineVariantLabel(slug: string, variantId: string | undefined): string | undefined {
		const product = getProduct(slug);
		const variant = product ? getVariant(product, variantId) : undefined;
		return variant ? localize(variant.label, lang) : undefined;
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
		<div class="rounded-3xl bg-brand-50 p-6 text-center sm:p-10 dark:bg-surface-soft" role="status" use:reveal>
			<!-- Animated success check: the path draws itself via
				animate-check-draw. pathLength normalises the path to 100
				units, so stroke-dasharray and --check-length are exactly
				the path length. No confetti. Under reduced motion the
				animation is disabled and the full check shows at once. -->
			<svg
				class="mx-auto h-16 w-16 animate-fade-up"
				viewBox="0 0 96 96"
				fill="none"
				aria-hidden="true"
			>
				<circle
					cx="48"
					cy="48"
					r="42"
					stroke-width="6"
					class="stroke-brand-200 dark:stroke-brand-800"
				/>
				<path
					d="M30 49 L43 62 L68 34"
					pathLength="100"
					stroke-dasharray="100"
					style="--check-length: 100"
					stroke-width="7"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="animate-check-draw stroke-brand-700 dark:stroke-brand-300"
				/>
			</svg>
			<h1 class="mt-3 text-2xl font-bold text-ink sm:text-3xl">
				{t.cart.checkoutSuccessTitle}
			</h1>
			<p class="mx-auto mt-2 max-w-md leading-relaxed text-muted">
				{interpolate(t.cart.checkoutSuccessText, {
					orderId: order.id,
					total: formatPrice(order.total, intlLocale)
				})}
			</p>
			<p class="mt-2 text-sm text-muted">
				{interpolate(t.orderConfirmation.placedOn, {
					date: formatDate(new Date(order.placedAtISO), intlLocale)
				})}
			</p>
			{#if status}
				<p class="mt-2 text-sm text-muted">
					<span class="font-semibold text-ink">{t.orderConfirmation.statusLabel}:</span>
					{' '}{statusLabels[status]}
				</p>
			{/if}
			<p class="mx-auto mt-2 max-w-md text-sm text-muted">{t.cart.checkoutDemoNote}</p>
		</div>

		<section aria-labelledby="confirmation-items-heading" class="mt-8 rounded-3xl bg-surface p-6 ring-1 ring-line" use:reveal>
			<h2 id="confirmation-items-heading" class="text-lg font-bold text-ink">
				{t.orderConfirmation.itemsTitle}
			</h2>
			<ul class="mt-4 divide-y divide-line">
				{#each order.lines as line (line.slug + ':' + (line.variantId ?? ''))}
					{@const variantLabel = lineVariantLabel(line.slug, line.variantId)}
					<li class="flex items-baseline justify-between gap-3 py-3 text-sm first:pt-0 last:pb-0">
						<span class="min-w-0 text-muted">
							<span class="font-medium text-ink">{lineName(line.slug)}</span>
							{#if variantLabel}
								{' '}({variantLabel})
							{/if}
							{' '}{interpolate(t.orderConfirmation.lineQty, { qty: line.qty })}
						</span>
						<span class="shrink-0 font-semibold text-ink">
							{formatPrice(line.unitPrice * line.qty, intlLocale)}
						</span>
					</li>
				{/each}
			</ul>
			{#if order.warrantyTotal}
				<p class="mt-4 flex items-baseline justify-between text-sm">
					<span class="text-muted">{t.cart.warrantyTotal}</span>
					<span class="font-semibold text-ink">{formatPrice(order.warrantyTotal, intlLocale)}</span>
				</p>
			{/if}
			<p class="mt-4 flex items-baseline justify-between border-t border-line pt-4 text-base">
				<span class="font-bold text-ink">{t.cart.total}</span>
				<span class="font-bold text-ink">{formatPrice(order.total, intlLocale)}</span>
			</p>
		</section>

		{#if order.gift}
			<section
				aria-label={t.giftOptions.cartTitle}
				class="mt-8 rounded-3xl bg-surface p-6 ring-1 ring-line"
				data-testid="gift-line"
				use:reveal
			>
				<h2 class="text-lg font-bold text-ink">{t.giftOptions.cartTitle}</h2>
				{#if order.gift.message.trim()}
					<p class="mt-2 text-sm text-muted">
						{interpolate(t.giftOptions.cartMessage, { message: order.gift.message.trim() })}
					</p>
				{/if}
				{#if order.gift.sendAsGift}
					<p class="mt-1 text-sm text-muted">{t.giftOptions.cartSendAsGift}</p>
				{/if}
				{#if !order.gift.message.trim() && !order.gift.sendAsGift}
					<p class="mt-2 text-sm text-muted">{t.giftOptions.wrapHint}</p>
				{/if}
			</section>
		{/if}

		<section
			aria-labelledby="create-account-heading"
			class="mt-8 rounded-3xl bg-surface p-6 ring-1 ring-line"
			data-testid="create-account"
			use:reveal
		>
			<h2 id="create-account-heading" class="text-lg font-bold text-ink">
				{t.orderConfirmation.createAccountTitle}
			</h2>
			{#if accountCreated}
				<p role="status" class="mt-2 text-sm font-medium text-brand-800 dark:text-brand-200">
					{t.orderConfirmation.createAccountSuccess}
				</p>
			{:else if account.profile}
				<p class="mt-2 text-sm text-muted">
					{interpolate(t.orderConfirmation.alreadySignedIn, { email: account.profile.email })}
				</p>
			{:else}
				<p class="mt-2 text-sm leading-relaxed text-muted">
					{t.orderConfirmation.createAccountText}
				</p>
				<p class="mt-2 text-sm text-muted">{t.orderConfirmation.createAccountDemoNote}</p>
				<form onsubmit={createAccount} novalidate class="mt-4 space-y-4">
					<div>
						<label for="create-account-password" class="mb-1 block text-sm font-medium text-ink-soft">
							{t.orderConfirmation.passwordLabel}
						</label>
						<input
							id="create-account-password"
							name="password"
							type="password"
							bind:value={password}
							placeholder={t.orderConfirmation.passwordPlaceholder}
							autocomplete="new-password"
							aria-invalid={passwordError ? 'true' : undefined}
							aria-describedby={passwordError ? 'create-account-password-error' : undefined}
							class="h-12 w-full rounded-2xl bg-surface px-4 text-sm text-ink ring-1 ring-line placeholder:text-muted"
						/>
					</div>
					<div>
						<label
							for="create-account-confirm-password"
							class="mb-1 block text-sm font-medium text-ink-soft"
						>
							{t.orderConfirmation.confirmPasswordLabel}
						</label>
						<input
							id="create-account-confirm-password"
							name="confirmPassword"
							type="password"
							bind:value={confirmPassword}
							placeholder={t.orderConfirmation.passwordPlaceholder}
							autocomplete="new-password"
							aria-invalid={passwordError ? 'true' : undefined}
							aria-describedby={passwordError ? 'create-account-password-error' : undefined}
							class="h-12 w-full rounded-2xl bg-surface px-4 text-sm text-ink ring-1 ring-line placeholder:text-muted"
						/>
					</div>
					{#if passwordError}
						<p id="create-account-password-error" role="alert" class="text-sm text-red-600 dark:text-red-400">
							{passwordError}
						</p>
					{/if}
					<button
						type="submit"
						class="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
					>
						{t.orderConfirmation.createAccountButton}
					</button>
				</form>
			{/if}
		</section>

		<div class="mt-8 flex flex-col justify-center gap-2 sm:flex-row" use:reveal>
			<a
				href="{localizedPath(lang, '/track-order')}?code={encodeURIComponent(order.id)}"
				class="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				<PackageSearch class="h-4 w-4" aria-hidden="true" />
				{t.orderConfirmation.trackOrderLink}
			</a>
			<a
				href={localizedPath(lang, '/shop')}
				class="inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
			>
				{t.cart.continueShopping}
			</a>
		</div>
	{:else if checked}
		<div class="flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center dark:bg-surface-soft" use:reveal>
			<ShoppingCart class="h-12 w-12 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			<h1 class="text-2xl font-bold text-ink">{t.orderConfirmation.emptyTitle}</h1>
			<p class="max-w-md text-muted">{t.orderConfirmation.emptyText}</p>
			<a
				href={localizedPath(lang, '/shop')}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.cart.continueShopping}
			</a>
		</div>
	{/if}
</div>
