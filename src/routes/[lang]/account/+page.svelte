<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Heart, LogOut, ShoppingCart, User } from '@lucide/svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { formatDate, formatPrice, interpolate } from '#lib/format';
	import { getDictionary } from '#lib/i18n/index';
	import {
		loadDemoOrders,
		statusFromAge,
		type DemoOrder,
		type OrderStatus
	} from '#lib/orders';
	import { localizedPath } from '#lib/paths';
	import { account } from '#lib/stores/account.svelte';
	import { cart } from '#lib/stores/cart.svelte';
	import { wishlist } from '#lib/stores/wishlist.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const intlLocale = $derived(t.meta.intlLocale);
	const profile = $derived(account.profile);

	let name = $state('');
	let email = $state('');
	let errors: { name?: string; email?: string } = $state({});
	let submittedOnce = $state(false);
	let showSummary = $state(false);
	let summaryEl: HTMLDivElement | undefined = $state();
	let orders = $state<DemoOrder[]>([]);
	let ordersLoaded = $state(false);

	onMount(() => {
		orders = loadDemoOrders();
		ordersLoaded = true;
	});

	const statusLabels: Record<OrderStatus, string> = $derived({
		ordered: t.trackOrder.statusOrdered,
		shipped: t.trackOrder.statusShipped,
		'out-for-delivery': t.trackOrder.statusOutForDelivery,
		delivered: t.trackOrder.statusDelivered
	});

	type ErrorField = 'name' | 'email';

	const fieldMeta: { field: ErrorField; id: string; label: string }[] = $derived([
		{ field: 'name', id: 'account-name', label: t.account.nameLabel },
		{ field: 'email', id: 'account-email', label: t.account.emailLabel }
	]);

	const errorEntries = $derived(fieldMeta.filter((meta) => errors[meta.field]));

	function fieldError(field: ErrorField): string | undefined {
		if (field === 'name') return name.trim() ? undefined : t.account.requiredError;
		if (!email.trim()) return t.account.requiredError;
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? undefined : t.account.emailError;
	}

	function validateField(field: ErrorField): void {
		const error = fieldError(field);
		if (error) {
			errors = { ...errors, [field]: error };
		} else {
			const { [field]: _removed, ...rest } = errors;
			errors = rest;
		}
	}

	function handleBlur(field: ErrorField): void {
		const value = field === 'name' ? name : email;
		if (submittedOnce || value.trim()) validateField(field);
	}

	function handleInput(field: ErrorField): void {
		if (errors[field]) validateField(field);
	}

	async function submit(event: SubmitEvent): Promise<void> {
		event.preventDefault();
		submittedOnce = true;
		const next: typeof errors = {};
		for (const field of ['name', 'email'] as const) {
			const error = fieldError(field);
			if (error) next[field] = error;
		}
		errors = next;
		if (Object.keys(next).length > 0) {
			showSummary = true;
			await tick();
			summaryEl?.focus();
			return;
		}
		showSummary = false;
		account.signIn(name.trim(), email.trim());
	}

	function signOut(): void {
		account.signOut();
		name = '';
		email = '';
		errors = {};
		submittedOnce = false;
		showSummary = false;
	}

	function focusField(id: string): void {
		document.getElementById(id)?.focus();
	}

	const inputClass =
		'w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 text-sm text-neutral-900 placeholder:text-neutral-500';
</script>

<Seo {lang} title={t.meta.accountTitle} description={t.meta.accountDescription} path="/account" />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{t.account.title}</h1>
	<p class="mt-2 max-w-2xl leading-relaxed text-neutral-600">{t.account.description}</p>
	<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-neutral-600">{t.account.demoNote}</p>

	{#if !profile}
		<form
			onsubmit={submit}
			novalidate
			class="mt-8 space-y-4 rounded-3xl bg-white p-6 ring-1 ring-neutral-200"
		>
			<h2 class="text-xl font-bold text-neutral-900">{t.account.signInTitle}</h2>
			{#if showSummary && errorEntries.length > 0}
				<div
					bind:this={summaryEl}
					tabindex="-1"
					role="alert"
					class="rounded-2xl bg-red-50 p-4 ring-1 ring-red-200 focus:outline-2 focus:outline-offset-2 focus:outline-red-600"
				>
					<p class="text-sm font-semibold text-red-800">{t.account.errorSummary}</p>
					<ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
						{#each errorEntries as entry (entry.field)}
							<li>
								<a
									href="#{entry.id}"
									onclick={(event) => {
										event.preventDefault();
										focusField(entry.id);
									}}
									class="text-red-700 underline hover:text-red-800"
								>
									{entry.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
			<div>
				<label for="account-name" class="mb-1 block text-sm font-medium text-neutral-700">
					{t.account.nameLabel}
				</label>
				<input
					id="account-name"
					name="name"
					type="text"
					bind:value={name}
					onblur={() => handleBlur('name')}
					oninput={() => handleInput('name')}
					placeholder={t.account.namePlaceholder}
					autocomplete="name"
					aria-invalid={errors.name ? 'true' : undefined}
					aria-describedby={errors.name ? 'account-name-error' : undefined}
					class="{inputClass} min-h-12"
				/>
				{#if errors.name}
					<p id="account-name-error" class="mt-1 text-sm text-red-600">{errors.name}</p>
				{/if}
			</div>
			<div>
				<label for="account-email" class="mb-1 block text-sm font-medium text-neutral-700">
					{t.account.emailLabel}
				</label>
				<input
					id="account-email"
					name="email"
					type="email"
					bind:value={email}
					onblur={() => handleBlur('email')}
					oninput={() => handleInput('email')}
					placeholder={t.account.emailPlaceholder}
					autocomplete="email"
					aria-invalid={errors.email ? 'true' : undefined}
					aria-describedby={errors.email ? 'account-email-error' : undefined}
					class="{inputClass} min-h-12"
				/>
				{#if errors.email}
					<p id="account-email-error" class="mt-1 text-sm text-red-600">{errors.email}</p>
				{/if}
			</div>
			<button
				type="submit"
				class="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				<User class="h-4 w-4" aria-hidden="true" />
				{t.account.signInButton}
			</button>
		</form>
	{:else}
		<div class="mt-8 rounded-3xl bg-brand-50 p-6">
			<h2 class="text-xl font-bold text-neutral-900">
				{interpolate(t.account.greeting, { name: profile.name })}
			</h2>
			<p class="mt-1 text-sm text-neutral-600">
				{interpolate(t.account.signedInAs, { email: profile.email })}
			</p>
			<button
				type="button"
				onclick={signOut}
				class="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-neutral-700 ring-1 ring-neutral-300 hover:bg-neutral-50"
			>
				<LogOut class="h-4 w-4" aria-hidden="true" />
				{t.account.signOut}
			</button>
		</div>

		{#if ordersLoaded}
			<section aria-labelledby="account-orders-heading" class="mt-8">
				<h2 id="account-orders-heading" class="text-xl font-bold text-neutral-900">
					{t.account.ordersTitle}
				</h2>
				{#if orders.length === 0}
					<div class="mt-4 rounded-3xl bg-white p-6 text-center ring-1 ring-neutral-200">
						<p class="font-semibold text-neutral-900">{t.account.ordersEmpty}</p>
						<p class="mt-1 text-sm text-neutral-600">{t.account.ordersEmptyHint}</p>
						<a
							href={localizedPath(lang, '/shop')}
							class="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
						>
							{t.cart.continueShopping}
						</a>
					</div>
				{:else}
					<ul class="mt-4 space-y-3">
						{#each orders as order (order.id)}
							<li class="rounded-3xl bg-white p-5 ring-1 ring-neutral-200">
								<div class="flex flex-wrap items-center justify-between gap-2">
									<p class="font-bold text-neutral-900">{order.id}</p>
									<span
										class="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800"
									>
										{statusLabels[statusFromAge(order.placedAtISO, Date.now())]}
									</span>
								</div>
								<p class="mt-1 text-sm text-neutral-500">
									{interpolate(t.account.placedOn, {
										date: formatDate(new Date(order.placedAtISO), intlLocale)
									})}
								</p>
								<div class="mt-3 flex items-center justify-between gap-3">
									<p class="text-sm">
										<span class="text-neutral-600">{t.cart.total}:</span>
										<span class="font-bold text-neutral-900">
											{' '}{formatPrice(order.total, intlLocale)}
										</span>
									</p>
									<a
										href={localizedPath(lang, '/track-order')}
										class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
									>
										{t.account.trackLink}
									</a>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		{/if}

		<section aria-labelledby="account-shortcuts-heading" class="mt-8">
			<h2 id="account-shortcuts-heading" class="text-xl font-bold text-neutral-900">
				{t.account.shortcutsTitle}
			</h2>
			<div class="mt-4 grid gap-4 sm:grid-cols-2">
				<div class="rounded-3xl bg-white p-5 ring-1 ring-neutral-200">
					<ShoppingCart class="h-6 w-6 text-brand-700" aria-hidden="true" />
					<h3 class="mt-3 font-semibold text-neutral-900">{t.account.cartShortcut}</h3>
					<p class="mt-1 text-sm text-neutral-600">
						{#if cart.count === 0}
							{t.cart.empty}
						{:else if cart.count === 1}
							{t.cart.itemOne}
						{:else}
							{interpolate(t.cart.itemsLabel, { count: cart.count })}
						{/if}
					</p>
					<a
						href={localizedPath(lang, '/cart')}
						class="mt-3 inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
					>
						{t.cartDrawer.viewCart}
					</a>
				</div>
				<div class="rounded-3xl bg-white p-5 ring-1 ring-neutral-200">
					<Heart class="h-6 w-6 text-brand-700" aria-hidden="true" />
					<h3 class="mt-3 font-semibold text-neutral-900">{t.account.wishlistShortcut}</h3>
					<p class="mt-1 text-sm text-neutral-600">
						{#if wishlist.slugs.length === 0}
							{t.account.wishlistEmpty}
						{:else}
							{interpolate(t.account.wishlistCount, { count: wishlist.slugs.length })}
						{/if}
					</p>
					<a
						href={localizedPath(lang, '/wishlist')}
						class="mt-3 inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
					>
						{t.nav.wishlist}
					</a>
				</div>
			</div>
		</section>
	{/if}
</div>
