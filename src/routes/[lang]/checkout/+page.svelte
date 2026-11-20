<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import { ChevronDown, ShoppingCart } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import CheckoutSteps from '#lib/components/CheckoutSteps.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { CHECKOUT_STORAGE_KEY } from '#lib/config';
	import { formatPrice, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { variantPrice } from '#lib/data/products';
	import { generateOrderId, saveDemoOrder } from '#lib/orders';
	import { localizedPath } from '#lib/paths';
	import { account } from '#lib/stores/account.svelte';
	import { cart } from '#lib/stores/cart.svelte';
	import { giftOptions } from '#lib/stores/gift-options.svelte';
	import { warranty, warrantyTotalFor } from '#lib/stores/warranty.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const intlLocale = $derived(t.meta.intlLocale);

	let step = $state<1 | 2 | 3>(1);
	let name = $state('');
	let email = $state('');
	let address = $state('');
	let city = $state('');
	let postal = $state('');
	let country = $state('DZ');
	let delivery = $state<'standard' | 'express'>('standard');
	let payment = $state<'card' | 'cod' | 'bnpl'>('card');
	let cardNumber = $state('');
	let expiry = $state('');
	let cvc = $state('');
	let submittedOnce = $state(false);
	let showSummary = $state(false);
	let summaryEl: HTMLDivElement | undefined = $state();
	let stepHeading: HTMLHeadingElement | undefined = $state();
	// Presentational only (responsive layout): whether the sticky order
	// summary is expanded on mobile. Never persisted; unrelated to the
	// `showSummary` error-summary flag above.
	let responsiveOrderSummaryOpen = $state(false);

	type ErrorField = 'name' | 'email' | 'address' | 'city' | 'postal' | 'cardNumber' | 'expiry' | 'cvc';

	let errors: Partial<Record<ErrorField, string>> = $state({});

	// Checkout draft persistence (sessionStorage, demo only): contact and
	// shipping fields survive step changes, refreshes and back-navigation
	// within the tab. Card fields (cardNumber, expiry, cvc) are NEVER
	// persisted — they stay in memory only.
	type CheckoutDraft = {
		step: 1 | 2 | 3;
		name: string;
		email: string;
		address: string;
		city: string;
		postal: string;
		country: string;
		delivery: 'standard' | 'express';
		payment: 'card' | 'cod' | 'bnpl';
	};

	let draftRestored = $state(false);

	function restoreDraft(): void {
		if (!browser) return;
		try {
			const raw = sessionStorage.getItem(CHECKOUT_STORAGE_KEY);
			if (!raw) return;
			const parsed: unknown = JSON.parse(raw);
			if (typeof parsed !== 'object' || parsed === null) return;
			const draft = parsed as Partial<CheckoutDraft>;
			if (draft.step === 1 || draft.step === 2 || draft.step === 3) step = draft.step;
			if (typeof draft.name === 'string') name = draft.name;
			if (typeof draft.email === 'string') email = draft.email;
			if (typeof draft.address === 'string') address = draft.address;
			if (typeof draft.city === 'string') city = draft.city;
			if (typeof draft.postal === 'string') postal = draft.postal;
			if (typeof draft.country === 'string') country = draft.country;
			if (draft.delivery === 'standard' || draft.delivery === 'express') {
				delivery = draft.delivery;
			}
			if (draft.payment === 'card' || draft.payment === 'cod' || draft.payment === 'bnpl') {
				payment = draft.payment;
			}
		} catch {
			// Corrupt or unavailable storage: start with a blank form.
		}
	}

	// Prefill contact details from the demo account, if the visitor signed in.
	// The saved draft is restored first, so it wins; the profile only fills
	// fields the draft left blank.
	onMount(() => {
		restoreDraft();
		const profile = account.profile;
		if (profile) {
			if (!name) name = profile.name;
			if (!email) email = profile.email;
		}
		draftRestored = true;
	});

	// Save the draft on every change, but only after the saved draft has
	// been restored — otherwise the first run would overwrite it with blanks.
	$effect(() => {
		if (!browser || !draftRestored) return;
		const draft: CheckoutDraft = {
			step,
			name,
			email,
			address,
			city,
			postal,
			country,
			delivery,
			payment
		};
		try {
			sessionStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(draft));
		} catch {
			// Storage unavailable: checkout still works for this page view.
		}
	});

	const countries = $derived([
		{ value: 'DZ', label: t.checkout.countryAlgeria },
		{ value: 'FR', label: t.checkout.countryFrance },
		{ value: 'TN', label: t.checkout.countryTunisia },
		{ value: 'MA', label: t.checkout.countryMorocco }
	]);

	const deliveryOptions = $derived([
		{ value: 'standard' as const, label: t.checkout.deliveryStandard, hint: t.checkout.deliveryStandardHint },
		{ value: 'express' as const, label: t.checkout.deliveryExpress, hint: t.checkout.deliveryExpressHint }
	]);

	const paymentOptions = $derived([
		{ value: 'card' as const, label: t.checkout.paymentCard, hint: t.checkout.paymentCardHint },
		{ value: 'cod' as const, label: t.checkout.paymentCod, hint: t.checkout.paymentCodHint },
		{ value: 'bnpl' as const, label: t.checkout.paymentBnpl, hint: t.checkout.paymentBnplHint }
	]);

	// Completed-step summaries (M10): the values entered in earlier
	// steps, reviewable at a glance, with an edit button back to the step.
	const warrantyTotal = $derived(warrantyTotalFor(cart.detailed));
	const grandTotal = $derived(cart.totals.total + warrantyTotal);
	const countryLabel = $derived(
		countries.find((option) => option.value === country)?.label ?? country
	);
	const deliveryLabel = $derived(
		deliveryOptions.find((option) => option.value === delivery)?.label ?? delivery
	);
	const paymentLabel = $derived(
		paymentOptions.find((option) => option.value === payment)?.label ?? payment
	);

	const fieldMeta: Record<1 | 2 | 3, { field: ErrorField; id: string; label: string }[]> = $derived({
		1: [
			{ field: 'name', id: 'checkout-name', label: t.checkout.nameLabel },
			{ field: 'email', id: 'checkout-email', label: t.checkout.emailLabel }
		],
		2: [
			{ field: 'address', id: 'checkout-address', label: t.checkout.addressLabel },
			{ field: 'city', id: 'checkout-city', label: t.checkout.cityLabel },
			{ field: 'postal', id: 'checkout-postal', label: t.checkout.postalLabel }
		],
		3: [
			{ field: 'cardNumber', id: 'checkout-card-number', label: t.checkout.cardNumberLabel },
			{ field: 'expiry', id: 'checkout-expiry', label: t.checkout.expiryLabel },
			{ field: 'cvc', id: 'checkout-cvc', label: t.checkout.cvcLabel }
		]
	});

	const errorEntries = $derived(fieldMeta[step].filter((meta) => errors[meta.field]));

	function fieldError(field: ErrorField): string | undefined {
		switch (field) {
			case 'name':
				return name.trim() ? undefined : t.checkout.requiredError;
			case 'email': {
				if (!email.trim()) return t.checkout.requiredError;
				return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
					? undefined
					: t.checkout.emailError;
			}
			case 'address':
				return address.trim() ? undefined : t.checkout.requiredError;
			case 'city':
				return city.trim() ? undefined : t.checkout.requiredError;
			case 'postal':
				return postal.trim() ? undefined : t.checkout.requiredError;
			case 'cardNumber': {
				if (payment !== 'card') return undefined;
				const digits = cardNumber.replaceAll(/\D/g, '');
				return digits.length >= 12 ? undefined : t.checkout.cardNumberError;
			}
			case 'expiry': {
				if (payment !== 'card') return undefined;
				return /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.trim()) ? undefined : t.checkout.expiryError;
			}
			case 'cvc': {
				if (payment !== 'card') return undefined;
				return /^\d{3,4}$/.test(cvc.trim()) ? undefined : t.checkout.cvcError;
			}
		}
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

	function fieldValue(field: ErrorField): string {
		switch (field) {
			case 'name':
				return name;
			case 'email':
				return email;
			case 'address':
				return address;
			case 'city':
				return city;
			case 'postal':
				return postal;
			case 'cardNumber':
				return cardNumber;
			case 'expiry':
				return expiry;
			case 'cvc':
				return cvc;
		}
	}

	function handleBlur(field: ErrorField): void {
		if (submittedOnce || fieldValue(field).trim()) validateField(field);
	}

	function handleInput(field: ErrorField): void {
		if (errors[field]) validateField(field);
	}

	function validateStep(current: 1 | 2 | 3): boolean {
		const next = { ...errors };
		let valid = true;
		for (const meta of fieldMeta[current]) {
			const error = fieldError(meta.field);
			if (error) {
				next[meta.field] = error;
				valid = false;
			} else {
				delete next[meta.field];
			}
		}
		errors = next;
		return valid;
	}

	function handlePaymentChange(): void {
		if (payment !== 'card') {
			const { cardNumber: _n, expiry: _e, cvc: _c, ...rest } = errors;
			errors = rest;
		}
	}

	async function submit(event: SubmitEvent): Promise<void> {
		event.preventDefault();
		submittedOnce = true;
		if (!validateStep(step)) {
			showSummary = true;
			await tick();
			summaryEl?.focus();
			return;
		}
		showSummary = false;
		if (step < 3) {
			step = (step + 1) as 1 | 2 | 3;
			await tick();
			stepHeading?.focus();
			return;
		}
		const lines = cart.detailed.map((line) => ({
			slug: line.product.slug,
			variantId: line.variant?.id,
			qty: line.qty,
			unitPrice: variantPrice(line.product, line.variant)
		}));
		// The snapshot total is what the shopper saw: grandTotal is the
		// post-promo cart total plus any extended warranty. Promo fields
		// are recorded only when a promo is applied; read them before
		// cart.clear() below.
		const promoDiscount = cart.totals.promoDiscount ?? 0;
		saveDemoOrder({
			id: generateOrderId(),
			placedAtISO: new Date().toISOString(),
			name: name.trim(),
			email: email.trim(),
			lines,
			total: grandTotal,
			...(warrantyTotal > 0 ? { warrantyTotal } : {}),
			...(giftOptions.active
				? {
						gift: {
							message: giftOptions.message.trim(),
							sendAsGift: giftOptions.sendAsGift
						}
					}
				: {}),
			...(cart.appliedPromo
				? { promoCode: cart.appliedPromo.code, promoDiscount }
				: {})
		});
		cart.clear();
		warranty.clear();
		giftOptions.clear();
		try {
			sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
		} catch {
			// Storage unavailable: nothing to clear.
		}
		await goto(localizedPath(lang, '/order-confirmation'));
	}

	async function goBack(): Promise<void> {
		showSummary = false;
		step = (step - 1) as 1 | 2 | 3;
		await tick();
		stepHeading?.focus();
	}

	// Jump back to a completed step from its summary card.
	async function editStep(target: 1 | 2 | 3): Promise<void> {
		showSummary = false;
		step = target;
		await tick();
		stepHeading?.focus();
	}

	function focusField(id: string): void {
		document.getElementById(id)?.focus();
	}

	const inputClass =
		'w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm text-ink placeholder:text-muted';
</script>

<Seo {lang} title={t.meta.checkoutTitle} description={t.meta.checkoutDescription} path="/checkout" noindex />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<h1 class="text-[1.75rem] font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">
			{t.checkout.title}
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
		<div class="mt-6 rounded-3xl bg-brand-50 p-4 sm:p-5 dark:bg-surface-soft">
			<p class="text-sm font-semibold text-ink">{t.checkout.guestNote}</p>
			<p class="mt-1 text-sm text-muted">{t.checkout.demoNote}</p>
		</div>

		<div class="mt-6 sm:mt-8">
			<CheckoutSteps current={step} labels={t.checkoutSteps} />
		</div>

		{#if step > 1}
			<div class="mt-6 space-y-3" data-testid="checkout-step-summaries">
				<section
					aria-label={t.checkoutSteps.contact}
					class="rounded-3xl bg-surface p-5 ring-1 ring-line"
					data-testid="step-summary-1"
				>
					<div class="flex flex-wrap items-start justify-between gap-3">
						<div class="min-w-0">
							<h2 class="text-base font-bold text-ink">{t.checkoutSteps.contact}</h2>
							<p class="mt-1 text-sm text-muted">{name}</p>
							<p class="text-sm text-muted">{email}</p>
						</div>
						<button
							type="button"
							onclick={() => editStep(1)}
							class="inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
						>
							{interpolate(t.checkout.summaryEditLabel, { step: t.checkoutSteps.contact })}
						</button>
					</div>
				</section>
				{#if step > 2}
					<section
						aria-label={t.checkoutSteps.shipping}
						class="rounded-3xl bg-surface p-5 ring-1 ring-line"
						data-testid="step-summary-2"
					>
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div class="min-w-0">
								<h2 class="text-base font-bold text-ink">{t.checkoutSteps.shipping}</h2>
								<p class="mt-1 text-sm text-muted">
									{address}, {city} {postal}, {countryLabel}
								</p>
								<p class="text-sm text-muted">{deliveryLabel}</p>
							</div>
							<button
								type="button"
								onclick={() => editStep(2)}
								class="inline-flex min-h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
							>
								{interpolate(t.checkout.summaryEditLabel, { step: t.checkoutSteps.shipping })}
							</button>
						</div>
					</section>
				{/if}
			</div>
		{/if}

		<div class="mt-6 grid gap-6 sm:mt-8 lg:grid-cols-[1fr_380px] lg:gap-8">
			<form onsubmit={submit} novalidate class="space-y-4">
				{#if showSummary && errorEntries.length > 0}
					<div
						bind:this={summaryEl}
						tabindex="-1"
						role="alert"
						class="rounded-2xl bg-red-50 dark:bg-red-950/60 p-4 ring-1 ring-red-200 dark:ring-red-900 focus:outline-2 focus:outline-offset-2 focus:outline-red-600"
					>
						<p class="text-sm font-semibold text-red-800 dark:text-red-200">{t.checkout.errorSummary}</p>
						<ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
							{#each errorEntries as entry (entry.field)}
								<li>
									<a
										href="#{entry.id}"
										onclick={(event) => {
											event.preventDefault();
											focusField(entry.id);
										}}
										class="text-red-700 dark:text-red-300 underline hover:text-red-800 dark:hover:text-red-200"
									>
										{entry.label}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				{#if step === 1}
					<h2 bind:this={stepHeading} tabindex="-1" class="text-xl font-bold text-ink focus:outline-none">
						{t.checkoutSteps.contact}
					</h2>
					<div>
						<label for="checkout-name" class="mb-1 block text-sm font-medium text-ink-soft">
							{t.checkout.nameLabel}
						</label>
						<input
							id="checkout-name"
							name="name"
							type="text"
							bind:value={name}
							onblur={() => handleBlur('name')}
							oninput={() => handleInput('name')}
							placeholder={t.checkout.namePlaceholder}
							autocomplete="name"
							aria-invalid={errors.name ? 'true' : undefined}
							aria-describedby={errors.name ? 'checkout-name-error' : undefined}
							class="{inputClass} min-h-12"
						/>
						{#if errors.name}
							<p id="checkout-name-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
						{/if}
					</div>
					<div>
						<label for="checkout-email" class="mb-1 block text-sm font-medium text-ink-soft">
							{t.checkout.emailLabel}
						</label>
						<input
							id="checkout-email"
							name="email"
							type="email"
							bind:value={email}
							onblur={() => handleBlur('email')}
							oninput={() => handleInput('email')}
							placeholder={t.checkout.emailPlaceholder}
							autocomplete="email"
							aria-invalid={errors.email ? 'true' : undefined}
							aria-describedby={errors.email ? 'checkout-email-error' : undefined}
							class="{inputClass} min-h-12"
						/>
						{#if errors.email}
							<p id="checkout-email-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
						{/if}
					</div>
				{:else if step === 2}
					<h2 bind:this={stepHeading} tabindex="-1" class="text-xl font-bold text-ink focus:outline-none">
						{t.checkoutSteps.shipping}
					</h2>
					<div>
						<label for="checkout-address" class="mb-1 block text-sm font-medium text-ink-soft">
							{t.checkout.addressLabel}
						</label>
						<input
							id="checkout-address"
							name="address"
							type="text"
							bind:value={address}
							onblur={() => handleBlur('address')}
							oninput={() => handleInput('address')}
							placeholder={t.checkout.addressPlaceholder}
							autocomplete="street-address"
							aria-invalid={errors.address ? 'true' : undefined}
							aria-describedby={errors.address ? 'checkout-address-error' : undefined}
							class="{inputClass} min-h-12"
						/>
						{#if errors.address}
							<p id="checkout-address-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
						{/if}
					</div>
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<label for="checkout-city" class="mb-1 block text-sm font-medium text-ink-soft">
								{t.checkout.cityLabel}
							</label>
							<input
								id="checkout-city"
								name="city"
								type="text"
								bind:value={city}
								onblur={() => handleBlur('city')}
								oninput={() => handleInput('city')}
								placeholder={t.checkout.cityPlaceholder}
								autocomplete="address-level2"
								aria-invalid={errors.city ? 'true' : undefined}
								aria-describedby={errors.city ? 'checkout-city-error' : undefined}
								class="{inputClass} min-h-12"
							/>
							{#if errors.city}
								<p id="checkout-city-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.city}</p>
							{/if}
						</div>
						<div>
							<label for="checkout-postal" class="mb-1 block text-sm font-medium text-ink-soft">
								{t.checkout.postalLabel}
							</label>
							<input
								id="checkout-postal"
								name="postal"
								type="text"
								inputmode="numeric"
								bind:value={postal}
								onblur={() => handleBlur('postal')}
								oninput={() => handleInput('postal')}
								placeholder={t.checkout.postalPlaceholder}
								autocomplete="postal-code"
								aria-invalid={errors.postal ? 'true' : undefined}
								aria-describedby={errors.postal ? 'checkout-postal-error' : undefined}
								class="{inputClass} min-h-12"
							/>
							{#if errors.postal}
								<p id="checkout-postal-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.postal}</p>
							{/if}
						</div>
					</div>
					<div>
						<label for="checkout-country" class="mb-1 block text-sm font-medium text-ink-soft">
							{t.checkout.countryLabel}
						</label>
						<select
							id="checkout-country"
							name="country"
							bind:value={country}
							autocomplete="country-name"
							class="{inputClass} min-h-12"
						>
							{#each countries as option (option.value)}
								<option value={option.value}>{option.label}</option>
							{/each}
						</select>
					</div>
					<fieldset>
						<legend class="mb-2 text-sm font-medium text-ink-soft">{t.checkout.deliveryLegend}</legend>
						<div class="space-y-2">
							{#each deliveryOptions as option (option.value)}
								<label
									for="delivery-{option.value}"
									class="flex cursor-pointer items-start gap-3 rounded-2xl p-4 ring-1 ring-line hover:ring-brand-300 has-[input:checked]:bg-brand-50 dark:has-[input:checked]:bg-surface-soft has-[input:checked]:ring-2 has-[input:checked]:ring-brand-700"
								>
									<input
										id="delivery-{option.value}"
										type="radio"
										name="delivery"
										value={option.value}
										bind:group={delivery}
										class="mt-0.5 h-5 w-5 shrink-0 accent-brand-700"
									/>
									<span>
										<span class="block text-sm font-semibold text-ink">{option.label}</span>
										<span class="mt-0.5 block text-sm text-muted">{option.hint}</span>
									</span>
								</label>
							{/each}
						</div>
					</fieldset>
				{:else}
					<h2 bind:this={stepHeading} tabindex="-1" class="text-xl font-bold text-ink focus:outline-none">
						{t.checkoutSteps.payment}
					</h2>
					<fieldset>
						<legend class="mb-2 text-sm font-medium text-ink-soft">{t.checkout.paymentLegend}</legend>
						<div class="space-y-2">
							{#each paymentOptions as option (option.value)}
								<label
									for="payment-{option.value}"
									class="flex cursor-pointer items-start gap-3 rounded-2xl p-4 ring-1 ring-line hover:ring-brand-300 has-[input:checked]:bg-brand-50 dark:has-[input:checked]:bg-surface-soft has-[input:checked]:ring-2 has-[input:checked]:ring-brand-700"
								>
									<input
										id="payment-{option.value}"
										type="radio"
										name="payment"
										value={option.value}
										bind:group={payment}
										onchange={handlePaymentChange}
										class="mt-0.5 h-5 w-5 shrink-0 accent-brand-700"
									/>
									<span>
										<span class="block text-sm font-semibold text-ink">{option.label}</span>
										<span class="mt-0.5 block text-sm text-muted">{option.hint}</span>
									</span>
								</label>
							{/each}
						</div>
					</fieldset>
					{#if payment === 'card'}
						<p class="rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">{t.checkout.cardDemoNote}</p>
						<div>
							<label for="checkout-card-number" class="mb-1 block text-sm font-medium text-ink-soft">
								{t.checkout.cardNumberLabel}
							</label>
							<input
								id="checkout-card-number"
								name="cardNumber"
								type="text"
								inputmode="numeric"
								bind:value={cardNumber}
								onblur={() => handleBlur('cardNumber')}
								oninput={() => handleInput('cardNumber')}
								placeholder={t.checkout.cardNumberPlaceholder}
								autocomplete="off"
								aria-invalid={errors.cardNumber ? 'true' : undefined}
								aria-describedby={errors.cardNumber ? 'checkout-card-number-error' : undefined}
								class="{inputClass} min-h-12"
							/>
							{#if errors.cardNumber}
								<p id="checkout-card-number-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cardNumber}</p>
							{/if}
						</div>
						<div class="grid gap-4 sm:grid-cols-2">
							<div>
								<label for="checkout-expiry" class="mb-1 block text-sm font-medium text-ink-soft">
									{t.checkout.expiryLabel}
								</label>
								<input
									id="checkout-expiry"
									name="expiry"
									type="text"
									inputmode="numeric"
									bind:value={expiry}
									onblur={() => handleBlur('expiry')}
									oninput={() => handleInput('expiry')}
									placeholder={t.checkout.expiryPlaceholder}
									autocomplete="off"
									aria-invalid={errors.expiry ? 'true' : undefined}
									aria-describedby={errors.expiry ? 'checkout-expiry-error' : undefined}
									class="{inputClass} min-h-12"
								/>
								{#if errors.expiry}
									<p id="checkout-expiry-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expiry}</p>
								{/if}
							</div>
							<div>
								<label for="checkout-cvc" class="mb-1 block text-sm font-medium text-ink-soft">
									{t.checkout.cvcLabel}
								</label>
								<input
									id="checkout-cvc"
									name="cvc"
									type="text"
									inputmode="numeric"
									bind:value={cvc}
									onblur={() => handleBlur('cvc')}
									oninput={() => handleInput('cvc')}
									placeholder={t.checkout.cvcPlaceholder}
									autocomplete="off"
									aria-invalid={errors.cvc ? 'true' : undefined}
									aria-describedby={errors.cvc ? 'checkout-cvc-error' : undefined}
									class="{inputClass} min-h-12"
								/>
								{#if errors.cvc}
									<p id="checkout-cvc-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cvc}</p>
								{/if}
							</div>
						</div>
					{/if}
				{/if}

				<div class="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-between">
					{#if step > 1}
						<button
							type="button"
							onclick={goBack}
							class="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
						>
							{t.checkout.back}
						</button>
					{:else}
						<span></span>
					{/if}
					<button
						type="submit"
						class="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
					>
						{step === 3 ? t.checkout.placeOrder : t.checkout.continue}
					</button>
				</div>
			</form>

			<aside
				aria-label={t.checkout.summaryTitle}
				class="order-first h-fit rounded-3xl bg-surface ring-1 ring-line max-lg:sticky max-lg:top-28 max-lg:z-30 max-lg:max-h-[calc(100dvh-7.5rem)] max-lg:overflow-y-auto lg:order-none lg:sticky lg:top-[7.5rem] lg:self-start"
			>
				<button
					type="button"
					aria-expanded={responsiveOrderSummaryOpen}
					aria-controls="checkout-order-summary"
					onclick={() => {
						responsiveOrderSummaryOpen = !responsiveOrderSummaryOpen;
					}}
					class="flex min-h-12 w-full items-center justify-between gap-3 px-4 py-2 text-left sm:px-5 lg:hidden"
				>
					<span class="min-w-0 truncate text-base font-bold text-ink">
						{t.checkout.summaryTitle}
					</span>
					<span class="flex shrink-0 items-center gap-2">
						<span class="text-base font-bold text-ink">
							{formatPrice(grandTotal, intlLocale)}
						</span>
						<ChevronDown
							class="h-5 w-5 shrink-0 text-muted transition-transform duration-200 {responsiveOrderSummaryOpen
								? 'rotate-180'
								: ''}"
							aria-hidden="true"
						/>
					</span>
				</button>
				<div
					id="checkout-order-summary"
					class="px-4 pb-4 pt-2 sm:px-5 sm:pb-5 lg:p-6 {responsiveOrderSummaryOpen
						? ''
						: 'max-lg:hidden'}"
				>
					<h2 class="hidden text-lg font-bold text-ink lg:block">
						{t.checkout.summaryTitle}
					</h2>
					<ul class="space-y-3 border-b border-line pb-4 lg:mt-4">
						{#each cart.detailed as line (line.product.slug + ':' + (line.variant?.id ?? ''))}
							<li class="flex items-baseline justify-between gap-3 text-sm">
								<span class="min-w-0 text-muted">
									<span class="font-medium text-ink">{localize(line.product.name, lang)}</span>
									{#if line.variant}
										{' '}({localize(line.variant.label, lang)})
									{/if}
									{' '}{interpolate(t.checkout.lineQty, { qty: line.qty })}
								</span>
								<span class="shrink-0 font-semibold text-ink">
									{formatPrice(variantPrice(line.product, line.variant) * line.qty, intlLocale)}
								</span>
							</li>
						{/each}
					</ul>
					{#if giftOptions.active}
						<div
							class="mt-4 rounded-2xl bg-brand-50 p-4 dark:bg-surface-soft"
							data-testid="gift-line"
						>
							<p class="text-sm font-semibold text-ink">
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
					<dl class="mt-4 space-y-3 text-sm">
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
						{#if cart.appliedPromo && (cart.totals.promoDiscount ?? 0) > 0}
							<div class="flex items-baseline justify-between">
								<dt class="text-muted">
									{interpolate(t.cart.promoDiscount, { code: cart.appliedPromo.code })}
								</dt>
								<dd class="font-semibold text-brand-700 dark:text-brand-300">
									−{formatPrice(cart.totals.promoDiscount ?? 0, intlLocale)}
								</dd>
							</div>
						{/if}
						{#if warrantyTotal > 0}
							<div class="flex items-baseline justify-between">
								<dt class="text-muted">{t.cart.warrantyTotal}</dt>
								<dd class="font-semibold text-ink">
									{formatPrice(warrantyTotal, intlLocale)}
								</dd>
							</div>
						{/if}
						<div class="flex items-baseline justify-between">
							<dt class="text-muted">{t.cart.shipping}</dt>
							<dd class="font-semibold text-ink">{t.cart.shippingFree}</dd>
						</div>
						<div class="flex items-baseline justify-between border-t border-line pt-3 text-base">
							<dt class="font-bold text-ink">{t.cart.total}</dt>
							<dd class="font-bold text-ink">{formatPrice(grandTotal, intlLocale)}</dd>
						</div>
					</dl>
					<p class="mt-4 text-xs text-muted">{t.checkout.demoNote}</p>
				</div>
			</aside>
		</div>
	{/if}
</div>
