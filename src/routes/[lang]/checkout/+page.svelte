<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import { ShoppingCart } from '@lucide/svelte';
	import CheckoutSteps from '#lib/components/CheckoutSteps.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { formatPrice, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { generateOrderId, orderTotal, saveDemoOrder } from '#lib/orders';
	import { localizedPath } from '#lib/paths';
	import { account } from '#lib/stores/account.svelte';
	import { cart } from '#lib/stores/cart.svelte';
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

	type ErrorField = 'name' | 'email' | 'address' | 'city' | 'postal' | 'cardNumber' | 'expiry' | 'cvc';

	let errors: Partial<Record<ErrorField, string>> = $state({});

	// Prefill contact details from the demo account, if the visitor signed in.
	onMount(() => {
		const profile = account.profile;
		if (profile) {
			if (!name) name = profile.name;
			if (!email) email = profile.email;
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
			qty: line.qty,
			unitPrice: line.product.price
		}));
		saveDemoOrder({
			id: generateOrderId(),
			placedAtISO: new Date().toISOString(),
			name: name.trim(),
			email: email.trim(),
			lines,
			total: orderTotal(lines)
		});
		cart.clear();
		await goto(localizedPath(lang, '/order-confirmation'));
	}

	async function goBack(): Promise<void> {
		showSummary = false;
		step = (step - 1) as 1 | 2 | 3;
		await tick();
		stepHeading?.focus();
	}

	function focusField(id: string): void {
		document.getElementById(id)?.focus();
	}

	const inputClass =
		'w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 text-sm text-neutral-900 placeholder:text-neutral-500';
</script>

<Seo {lang} title={t.meta.checkoutTitle} description={t.meta.checkoutDescription} path="/checkout" />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{t.checkout.title}</h1>

	{#if cart.detailed.length === 0}
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
		<div class="mt-6 rounded-3xl bg-brand-50 p-4 sm:p-5">
			<p class="text-sm font-semibold text-neutral-900">{t.checkout.guestNote}</p>
			<p class="mt-1 text-sm text-neutral-600">{t.checkout.demoNote}</p>
		</div>

		<div class="mt-8">
			<CheckoutSteps current={step} labels={t.checkoutSteps} />
		</div>

		<div class="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
			<form onsubmit={submit} novalidate class="space-y-4">
				{#if showSummary && errorEntries.length > 0}
					<div
						bind:this={summaryEl}
						tabindex="-1"
						role="alert"
						class="rounded-2xl bg-red-50 p-4 ring-1 ring-red-200 focus:outline-2 focus:outline-offset-2 focus:outline-red-600"
					>
						<p class="text-sm font-semibold text-red-800">{t.checkout.errorSummary}</p>
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

				{#if step === 1}
					<h2 bind:this={stepHeading} tabindex="-1" class="text-xl font-bold text-neutral-900 focus:outline-none">
						{t.checkoutSteps.contact}
					</h2>
					<div>
						<label for="checkout-name" class="mb-1 block text-sm font-medium text-neutral-700">
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
							<p id="checkout-name-error" class="mt-1 text-sm text-red-600">{errors.name}</p>
						{/if}
					</div>
					<div>
						<label for="checkout-email" class="mb-1 block text-sm font-medium text-neutral-700">
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
							<p id="checkout-email-error" class="mt-1 text-sm text-red-600">{errors.email}</p>
						{/if}
					</div>
				{:else if step === 2}
					<h2 bind:this={stepHeading} tabindex="-1" class="text-xl font-bold text-neutral-900 focus:outline-none">
						{t.checkoutSteps.shipping}
					</h2>
					<div>
						<label for="checkout-address" class="mb-1 block text-sm font-medium text-neutral-700">
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
							<p id="checkout-address-error" class="mt-1 text-sm text-red-600">{errors.address}</p>
						{/if}
					</div>
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<label for="checkout-city" class="mb-1 block text-sm font-medium text-neutral-700">
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
								<p id="checkout-city-error" class="mt-1 text-sm text-red-600">{errors.city}</p>
							{/if}
						</div>
						<div>
							<label for="checkout-postal" class="mb-1 block text-sm font-medium text-neutral-700">
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
								<p id="checkout-postal-error" class="mt-1 text-sm text-red-600">{errors.postal}</p>
							{/if}
						</div>
					</div>
					<div>
						<label for="checkout-country" class="mb-1 block text-sm font-medium text-neutral-700">
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
						<legend class="mb-2 text-sm font-medium text-neutral-700">{t.checkout.deliveryLegend}</legend>
						<div class="space-y-2">
							{#each deliveryOptions as option (option.value)}
								<label
									for="delivery-{option.value}"
									class="flex cursor-pointer items-start gap-3 rounded-2xl p-4 ring-1 ring-neutral-200 hover:ring-brand-300 has-[input:checked]:bg-brand-50 has-[input:checked]:ring-2 has-[input:checked]:ring-brand-700"
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
										<span class="block text-sm font-semibold text-neutral-900">{option.label}</span>
										<span class="mt-0.5 block text-sm text-neutral-600">{option.hint}</span>
									</span>
								</label>
							{/each}
						</div>
					</fieldset>
				{:else}
					<h2 bind:this={stepHeading} tabindex="-1" class="text-xl font-bold text-neutral-900 focus:outline-none">
						{t.checkoutSteps.payment}
					</h2>
					<fieldset>
						<legend class="mb-2 text-sm font-medium text-neutral-700">{t.checkout.paymentLegend}</legend>
						<div class="space-y-2">
							{#each paymentOptions as option (option.value)}
								<label
									for="payment-{option.value}"
									class="flex cursor-pointer items-start gap-3 rounded-2xl p-4 ring-1 ring-neutral-200 hover:ring-brand-300 has-[input:checked]:bg-brand-50 has-[input:checked]:ring-2 has-[input:checked]:ring-brand-700"
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
										<span class="block text-sm font-semibold text-neutral-900">{option.label}</span>
										<span class="mt-0.5 block text-sm text-neutral-600">{option.hint}</span>
									</span>
								</label>
							{/each}
						</div>
					</fieldset>
					{#if payment === 'card'}
						<p class="rounded-2xl bg-brand-50 p-4 text-sm text-neutral-600">{t.checkout.cardDemoNote}</p>
						<div>
							<label for="checkout-card-number" class="mb-1 block text-sm font-medium text-neutral-700">
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
								<p id="checkout-card-number-error" class="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
							{/if}
						</div>
						<div class="grid gap-4 sm:grid-cols-2">
							<div>
								<label for="checkout-expiry" class="mb-1 block text-sm font-medium text-neutral-700">
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
									<p id="checkout-expiry-error" class="mt-1 text-sm text-red-600">{errors.expiry}</p>
								{/if}
							</div>
							<div>
								<label for="checkout-cvc" class="mb-1 block text-sm font-medium text-neutral-700">
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
									<p id="checkout-cvc-error" class="mt-1 text-sm text-red-600">{errors.cvc}</p>
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
							class="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
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

			<aside aria-label={t.checkout.summaryTitle} class="h-fit rounded-3xl bg-white p-6 ring-1 ring-neutral-200">
				<h2 class="text-lg font-bold text-neutral-900">{t.checkout.summaryTitle}</h2>
				<ul class="mt-4 space-y-3 border-b border-neutral-200 pb-4">
					{#each cart.detailed as line (line.product.slug)}
						<li class="flex items-baseline justify-between gap-3 text-sm">
							<span class="min-w-0 text-neutral-600">
								<span class="font-medium text-neutral-900">{localize(line.product.name, lang)}</span>
								{' '}{interpolate(t.checkout.lineQty, { qty: line.qty })}
							</span>
							<span class="shrink-0 font-semibold text-neutral-900">
								{formatPrice(line.product.price * line.qty, intlLocale)}
							</span>
						</li>
					{/each}
				</ul>
				<dl class="mt-4 space-y-3 text-sm">
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
				<p class="mt-4 text-xs text-neutral-500">{t.checkout.demoNote}</p>
			</aside>
		</div>
	{/if}
</div>
