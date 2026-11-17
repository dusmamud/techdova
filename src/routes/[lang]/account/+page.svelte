<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Bell, Heart, LogOut, MapPin, Pencil, Plus, ShoppingCart, Trash2, User } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
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
	import { account, type NotificationPreferenceKey } from '#lib/stores/account.svelte';
	import { addresses, type AddressInput } from '#lib/stores/addresses.svelte';
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
		editOpen = false;
		editErrors = {};
		editSaved = false;
	}

	// --- Edit profile (demo: persisted via the account store, local only) ---
	let editOpen = $state(false);
	let editName = $state('');
	let editEmail = $state('');
	let editErrors: { name?: string; email?: string } = $state({});
	let editSaved = $state(false);

	function startEdit(): void {
		if (!profile) return;
		editName = profile.name;
		editEmail = profile.email;
		editErrors = {};
		editSaved = false;
		editOpen = true;
	}

	function cancelEdit(): void {
		editOpen = false;
		editErrors = {};
	}

	function editFieldError(field: ErrorField): string | undefined {
		if (field === 'name') return editName.trim() ? undefined : t.account.requiredError;
		if (!editEmail.trim()) return t.account.requiredError;
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail.trim())
			? undefined
			: t.account.emailError;
	}

	function saveEdit(event: SubmitEvent): void {
		event.preventDefault();
		const next: typeof editErrors = {};
		for (const field of ['name', 'email'] as const) {
			const error = editFieldError(field);
			if (error) next[field] = error;
		}
		editErrors = next;
		if (Object.keys(next).length > 0) return;
		account.updateProfile(editName.trim(), editEmail.trim());
		editOpen = false;
		editSaved = true;
	}

	// --- Notification preferences (demo toggles, persisted in the store) ---
	const notificationEntries: { key: NotificationPreferenceKey; label: string; hint: string }[] =
		$derived([
			{ key: 'orderUpdates', label: t.account.ordersLabel, hint: t.account.ordersHint },
			{ key: 'offers', label: t.account.offersLabel, hint: t.account.offersHint },
			{ key: 'newsletter', label: t.account.newsletterLabel, hint: t.account.newsletterHint }
		]);

	function focusField(id: string): void {
		document.getElementById(id)?.focus();
	}

	// --- Saved addresses (demo CRUD, stored only in this browser) ---
	const savedAddresses = $derived(addresses.addresses);
	let addrFormOpen = $state(false);
	let addrEditingId = $state<string | null>(null);
	let addrName = $state('');
	let addrStreet = $state('');
	let addrCity = $state('');
	let addrPostal = $state('');
	let addrPhone = $state('');
	let addrErrors: { name?: string; street?: string; city?: string; postal?: string } = $state({});
	let addrSubmittedOnce = $state(false);
	let addrShowSummary = $state(false);
	let addrSummaryEl: HTMLDivElement | undefined = $state();

	type AddressErrorField = 'name' | 'street' | 'city' | 'postal';

	const addrFieldMeta: { field: AddressErrorField; id: string; label: string }[] = $derived([
		{ field: 'name', id: 'address-name', label: t.addresses.nameLabel },
		{ field: 'street', id: 'address-street', label: t.addresses.streetLabel },
		{ field: 'city', id: 'address-city', label: t.addresses.cityLabel },
		{ field: 'postal', id: 'address-postal', label: t.addresses.postalLabel }
	]);

	const addrErrorEntries = $derived(addrFieldMeta.filter((meta) => addrErrors[meta.field]));

	function addrValue(field: AddressErrorField): string {
		if (field === 'name') return addrName;
		if (field === 'street') return addrStreet;
		if (field === 'city') return addrCity;
		return addrPostal;
	}

	function addrFieldError(field: AddressErrorField): string | undefined {
		return addrValue(field).trim() ? undefined : t.addresses.requiredError;
	}

	function addrValidateField(field: AddressErrorField): void {
		const error = addrFieldError(field);
		if (error) {
			addrErrors = { ...addrErrors, [field]: error };
		} else {
			const { [field]: _removed, ...rest } = addrErrors;
			addrErrors = rest;
		}
	}

	function addrHandleBlur(field: AddressErrorField): void {
		if (addrSubmittedOnce || addrValue(field).trim()) addrValidateField(field);
	}

	function addrHandleInput(field: AddressErrorField): void {
		if (addrErrors[field]) addrValidateField(field);
	}

	function addrResetForm(): void {
		addrName = '';
		addrStreet = '';
		addrCity = '';
		addrPostal = '';
		addrPhone = '';
		addrErrors = {};
		addrSubmittedOnce = false;
		addrShowSummary = false;
	}

	function addrStartAdd(): void {
		addrResetForm();
		addrEditingId = null;
		addrFormOpen = true;
	}

	function addrStartEdit(id: string): void {
		const found = addresses.addresses.find((address) => address.id === id);
		if (!found) return;
		addrResetForm();
		addrEditingId = id;
		addrName = found.name;
		addrStreet = found.street;
		addrCity = found.city;
		addrPostal = found.postalCode;
		addrPhone = found.phone;
		addrFormOpen = true;
	}

	function addrCancel(): void {
		addrFormOpen = false;
		addrEditingId = null;
		addrResetForm();
	}

	async function addrSubmit(event: SubmitEvent): Promise<void> {
		event.preventDefault();
		addrSubmittedOnce = true;
		const next: typeof addrErrors = {};
		for (const field of ['name', 'street', 'city', 'postal'] as const) {
			const error = addrFieldError(field);
			if (error) next[field] = error;
		}
		addrErrors = next;
		if (Object.keys(next).length > 0) {
			addrShowSummary = true;
			await tick();
			addrSummaryEl?.focus();
			return;
		}
		addrShowSummary = false;
		const input: AddressInput = {
			name: addrName.trim(),
			street: addrStreet.trim(),
			city: addrCity.trim(),
			postalCode: addrPostal.trim(),
			phone: addrPhone.trim()
		};
		if (addrEditingId) {
			addresses.update(addrEditingId, input);
		} else {
			addresses.add(input);
		}
		addrCancel();
	}

	const inputClass =
		'w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm text-ink placeholder:text-muted';
</script>

<Seo {lang} title={t.meta.accountTitle} description={t.meta.accountDescription} path="/account" />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<Breadcrumbs
		label={t.product.breadcrumbLabel}
		items={[
			{ label: t.nav.home, href: localizedPath(lang, '/') },
			{ label: t.account.title }
		]}
	/>
	<h1 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl" use:reveal>{t.account.title}</h1>
	<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.account.description}</p>
	<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">{t.account.demoNote}</p>

	{#if !profile}
		<form
			onsubmit={submit}
			novalidate
			class="mt-8 space-y-4 rounded-3xl bg-surface p-6 ring-1 ring-line"
			use:reveal
		>
			<h2 class="text-xl font-bold text-ink">{t.account.signInTitle}</h2>
			{#if showSummary && errorEntries.length > 0}
				<div
					bind:this={summaryEl}
					tabindex="-1"
					role="alert"
					class="rounded-2xl bg-red-50 dark:bg-red-950/60 p-4 ring-1 ring-red-200 dark:ring-red-900 focus:outline-2 focus:outline-offset-2 focus:outline-red-600"
				>
					<p class="text-sm font-semibold text-red-800 dark:text-red-200">{t.account.errorSummary}</p>
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
			<div>
				<label for="account-name" class="mb-1 block text-sm font-medium text-ink-soft">
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
					<p id="account-name-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
				{/if}
			</div>
			<div>
				<label for="account-email" class="mb-1 block text-sm font-medium text-ink-soft">
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
					<p id="account-email-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
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
		<div class="mt-8 rounded-3xl bg-brand-50 p-6 dark:bg-surface-soft" use:reveal>
			<h2 class="text-xl font-bold text-ink">
				{interpolate(t.account.greeting, { name: profile.name })}
			</h2>
			<p class="mt-1 text-sm text-muted">
				{interpolate(t.account.signedInAs, { email: profile.email })}
			</p>
			<button
				type="button"
				onclick={signOut}
				class="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-5 text-sm font-semibold text-ink-soft ring-1 ring-line hover:bg-surface-soft"
			>
				<LogOut class="h-4 w-4" aria-hidden="true" />
				{t.account.signOut}
			</button>
		</div>

		{#if editSaved}
			<p role="status" class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm font-medium text-ink dark:bg-surface-soft">
				{t.account.savedMessage}
			</p>
		{/if}

		<section aria-labelledby="account-edit-heading" class="mt-8" use:reveal>
			<h2 id="account-edit-heading" class="text-xl font-bold text-ink">{t.account.editTitle}</h2>
			<p class="mt-1 text-sm leading-relaxed text-muted">{t.account.editDescription}</p>
			{#if editOpen}
				<form
					onsubmit={saveEdit}
					novalidate
					class="mt-4 space-y-4 rounded-3xl bg-surface p-6 ring-1 ring-line"
				>
					<div>
						<label for="profile-edit-name" class="mb-1 block text-sm font-medium text-ink-soft">
							{t.account.nameLabel}
						</label>
						<input
							id="profile-edit-name"
							name="profileName"
							type="text"
							bind:value={editName}
							placeholder={t.account.namePlaceholder}
							autocomplete="name"
							aria-invalid={editErrors.name ? 'true' : undefined}
							aria-describedby={editErrors.name ? 'profile-edit-name-error' : undefined}
							class="{inputClass} min-h-12"
						/>
						{#if editErrors.name}
							<p id="profile-edit-name-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{editErrors.name}</p>
						{/if}
					</div>
					<div>
						<label for="profile-edit-email" class="mb-1 block text-sm font-medium text-ink-soft">
							{t.account.emailLabel}
						</label>
						<input
							id="profile-edit-email"
							name="profileEmail"
							type="email"
							bind:value={editEmail}
							placeholder={t.account.emailPlaceholder}
							autocomplete="email"
							aria-invalid={editErrors.email ? 'true' : undefined}
							aria-describedby={editErrors.email ? 'profile-edit-email-error' : undefined}
							class="{inputClass} min-h-12"
						/>
						{#if editErrors.email}
							<p id="profile-edit-email-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
								{editErrors.email}
							</p>
						{/if}
					</div>
					<div class="flex flex-wrap gap-2">
						<button
							type="submit"
							class="inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
						>
							{t.account.saveButton}
						</button>
						<button
							type="button"
							onclick={cancelEdit}
							class="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-ink-soft ring-1 ring-line hover:bg-surface-soft"
						>
							{t.account.cancelButton}
						</button>
					</div>
				</form>
			{:else}
				<button
					type="button"
					onclick={startEdit}
					class="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50 dark:text-brand-200"
				>
					<Pencil class="h-4 w-4" aria-hidden="true" />
					{t.account.editButton}
				</button>
			{/if}
		</section>

		<section aria-labelledby="account-notifications-heading" class="mt-8" use:reveal>
			<h2 id="account-notifications-heading" class="flex items-center gap-2 text-xl font-bold text-ink">
				<Bell class="h-5 w-5 text-brand-700 dark:text-brand-300" aria-hidden="true" />
				{t.account.notificationsTitle}
			</h2>
			<p class="mt-1 text-sm leading-relaxed text-muted">{t.account.notificationsDescription}</p>
			<div class="mt-4 space-y-3">
				{#each notificationEntries as entry (entry.key)}
					<label
						class="flex cursor-pointer items-start gap-3 rounded-3xl bg-surface p-5 ring-1 ring-line"
					>
						<input
							type="checkbox"
							checked={account.preferences[entry.key]}
							onchange={(event) => account.setPreference(entry.key, event.currentTarget.checked)}
							class="mt-0.5 h-5 w-5 shrink-0 accent-brand-700"
						/>
						<span>
							<span class="block font-semibold text-ink">{entry.label}</span>
							<span class="block text-sm leading-relaxed text-muted">{entry.hint}</span>
						</span>
					</label>
				{/each}
			</div>
		</section>

		{#if ordersLoaded}
			<section aria-labelledby="account-orders-heading" class="mt-8" use:reveal>
				<h2 id="account-orders-heading" class="text-xl font-bold text-ink">
					{t.account.ordersTitle}
				</h2>
				{#if orders.length === 0}
					<div class="mt-4 rounded-3xl bg-surface p-6 text-center ring-1 ring-line">
						<p class="font-semibold text-ink">{t.account.ordersEmpty}</p>
						<p class="mt-1 text-sm text-muted">{t.account.ordersEmptyHint}</p>
						<a
							href={localizedPath(lang, '/shop')}
							class="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
						>
							{t.cart.continueShopping}
						</a>
					</div>
				{:else}
					<ul class="mt-4 space-y-3">
						{#each orders as order, i (order.id)}
							<li
								class="rounded-3xl bg-surface p-5 ring-1 ring-line"
								use:reveal={{ delay: Math.min(i * 60, 300) }}
							>
								<div class="flex flex-wrap items-center justify-between gap-2">
									<p class="font-bold text-ink">{order.id}</p>
									<span
										class="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800"
									>
										{statusLabels[statusFromAge(order.placedAtISO, Date.now())]}
									</span>
								</div>
								<p class="mt-1 text-sm text-muted">
									{interpolate(t.account.placedOn, {
										date: formatDate(new Date(order.placedAtISO), intlLocale)
									})}
								</p>
								<div class="mt-3 flex items-center justify-between gap-3">
									<p class="text-sm">
										<span class="text-muted">{t.cart.total}:</span>
										<span class="font-bold text-ink">
											{' '}{formatPrice(order.total, intlLocale)}
										</span>
									</p>
									<a
										href="{localizedPath(lang, '/track-order')}?code={encodeURIComponent(order.id)}"
										class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
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

		<section aria-labelledby="account-addresses-heading" class="mt-8" use:reveal>
			<div class="flex flex-wrap items-center justify-between gap-3">
				<h2 id="account-addresses-heading" class="text-xl font-bold text-ink">
					{t.addresses.title}
				</h2>
				{#if !addrFormOpen}
					<button
						type="button"
						onclick={addrStartAdd}
						class="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
					>
						<Plus class="h-4 w-4" aria-hidden="true" />
						{t.addresses.addButton}
					</button>
				{/if}
			</div>
			<p class="mt-1 text-sm leading-relaxed text-muted">{t.addresses.description}</p>
			<p class="mt-3 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
				{t.addresses.demoNote}
			</p>

			{#if addrFormOpen}
				<form
					onsubmit={addrSubmit}
					novalidate
					class="mt-4 space-y-4 rounded-3xl bg-surface p-6 ring-1 ring-line"
				>
					<h3 class="text-lg font-bold text-ink">
						{addrEditingId ? t.addresses.formTitleEdit : t.addresses.formTitleAdd}
					</h3>
					{#if addrShowSummary && addrErrorEntries.length > 0}
						<div
							bind:this={addrSummaryEl}
							tabindex="-1"
							role="alert"
							class="rounded-2xl bg-red-50 dark:bg-red-950/60 p-4 ring-1 ring-red-200 dark:ring-red-900 focus:outline-2 focus:outline-offset-2 focus:outline-red-600"
						>
							<p class="text-sm font-semibold text-red-800 dark:text-red-200">{t.addresses.errorSummary}</p>
							<ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
								{#each addrErrorEntries as entry (entry.field)}
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
					<div>
						<label for="address-name" class="mb-1 block text-sm font-medium text-ink-soft">
							{t.addresses.nameLabel}
						</label>
						<input
							id="address-name"
							name="addressName"
							type="text"
							bind:value={addrName}
							onblur={() => addrHandleBlur('name')}
							oninput={() => addrHandleInput('name')}
							placeholder={t.addresses.namePlaceholder}
							autocomplete="name"
							aria-invalid={addrErrors.name ? 'true' : undefined}
							aria-describedby={addrErrors.name ? 'address-name-error' : undefined}
							class="{inputClass} min-h-12"
						/>
						{#if addrErrors.name}
							<p id="address-name-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{addrErrors.name}</p>
						{/if}
					</div>
					<div>
						<label for="address-street" class="mb-1 block text-sm font-medium text-ink-soft">
							{t.addresses.streetLabel}
						</label>
						<input
							id="address-street"
							name="addressStreet"
							type="text"
							bind:value={addrStreet}
							onblur={() => addrHandleBlur('street')}
							oninput={() => addrHandleInput('street')}
							placeholder={t.addresses.streetPlaceholder}
							autocomplete="street-address"
							aria-invalid={addrErrors.street ? 'true' : undefined}
							aria-describedby={addrErrors.street ? 'address-street-error' : undefined}
							class="{inputClass} min-h-12"
						/>
						{#if addrErrors.street}
							<p id="address-street-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
								{addrErrors.street}
							</p>
						{/if}
					</div>
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<label for="address-city" class="mb-1 block text-sm font-medium text-ink-soft">
								{t.addresses.cityLabel}
							</label>
							<input
								id="address-city"
								name="addressCity"
								type="text"
								bind:value={addrCity}
								onblur={() => addrHandleBlur('city')}
								oninput={() => addrHandleInput('city')}
								placeholder={t.addresses.cityPlaceholder}
								autocomplete="address-level2"
								aria-invalid={addrErrors.city ? 'true' : undefined}
								aria-describedby={addrErrors.city ? 'address-city-error' : undefined}
								class="{inputClass} min-h-12"
							/>
							{#if addrErrors.city}
								<p id="address-city-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
									{addrErrors.city}
								</p>
							{/if}
						</div>
						<div>
							<label for="address-postal" class="mb-1 block text-sm font-medium text-ink-soft">
								{t.addresses.postalLabel}
							</label>
							<input
								id="address-postal"
								name="addressPostal"
								type="text"
								bind:value={addrPostal}
								onblur={() => addrHandleBlur('postal')}
								oninput={() => addrHandleInput('postal')}
								placeholder={t.addresses.postalPlaceholder}
								autocomplete="postal-code"
								aria-invalid={addrErrors.postal ? 'true' : undefined}
								aria-describedby={addrErrors.postal ? 'address-postal-error' : undefined}
								class="{inputClass} min-h-12"
							/>
							{#if addrErrors.postal}
								<p id="address-postal-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
									{addrErrors.postal}
								</p>
							{/if}
						</div>
					</div>
					<div>
						<label for="address-phone" class="mb-1 block text-sm font-medium text-ink-soft">
							{t.addresses.phoneLabel}
						</label>
						<input
							id="address-phone"
							name="addressPhone"
							type="tel"
							bind:value={addrPhone}
							placeholder={t.addresses.phonePlaceholder}
							autocomplete="tel"
							class="{inputClass} min-h-12"
						/>
					</div>
					<div class="flex flex-wrap gap-2">
						<button
							type="submit"
							class="inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
						>
							{t.addresses.saveButton}
						</button>
						<button
							type="button"
							onclick={addrCancel}
							class="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-ink-soft ring-1 ring-line hover:bg-surface-soft"
						>
							{t.addresses.cancelButton}
						</button>
					</div>
				</form>
			{:else if savedAddresses.length === 0}
				<div class="mt-4 rounded-3xl bg-surface p-6 text-center ring-1 ring-line">
					<MapPin class="mx-auto h-8 w-8 text-brand-700 dark:text-brand-300" aria-hidden="true" />
					<p class="mt-2 font-semibold text-ink">{t.addresses.empty}</p>
					<p class="mt-1 text-sm text-muted">{t.addresses.emptyHint}</p>
				</div>
			{:else}
				<ul class="mt-4 space-y-3">
					{#each savedAddresses as address (address.id)}
						<li class="rounded-3xl bg-surface p-5 ring-1 ring-line">
							<div class="flex items-start gap-3">
								<MapPin class="mt-0.5 h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
								<div class="min-w-0 flex-1">
									<p class="font-semibold text-ink">{address.name}</p>
									<p class="mt-0.5 text-sm text-muted">{address.street}</p>
									<p class="text-sm text-muted">{address.city} {address.postalCode}</p>
									{#if address.phone}
										<p class="text-sm text-muted">{address.phone}</p>
									{/if}
								</div>
							</div>
							<div class="mt-4 flex flex-wrap gap-2">
								<button
									type="button"
									onclick={() => addrStartEdit(address.id)}
									aria-label={interpolate(t.addresses.editLabel, { name: address.name })}
									class="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
								>
									<Pencil class="h-4 w-4" aria-hidden="true" />
									{t.addresses.editButton}
								</button>
								<button
									type="button"
									onclick={() => addresses.remove(address.id)}
									aria-label={interpolate(t.addresses.deleteLabel, { name: address.name })}
									class="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-red-700 dark:text-red-300 ring-1 ring-red-300 dark:ring-red-800 hover:bg-red-50 dark:hover:bg-red-950/60"
								>
									<Trash2 class="h-4 w-4" aria-hidden="true" />
									{t.addresses.deleteButton}
								</button>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</section>

		<section aria-labelledby="account-shortcuts-heading" class="mt-8" use:reveal>
			<h2 id="account-shortcuts-heading" class="text-xl font-bold text-ink">
				{t.account.shortcutsTitle}
			</h2>
			<div class="mt-4 grid gap-4 sm:grid-cols-2">
				<div class="card-lift rounded-3xl bg-surface p-5 ring-1 ring-line">
					<ShoppingCart class="h-6 w-6 text-brand-700 dark:text-brand-300" aria-hidden="true" />
					<h3 class="mt-3 font-semibold text-ink">{t.account.cartShortcut}</h3>
					<p class="mt-1 text-sm text-muted">
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
						class="mt-3 inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
					>
						{t.cartDrawer.viewCart}
					</a>
				</div>
				<div class="card-lift rounded-3xl bg-surface p-5 ring-1 ring-line">
					<Heart class="h-6 w-6 text-brand-700 dark:text-brand-300" aria-hidden="true" />
					<h3 class="mt-3 font-semibold text-ink">{t.account.wishlistShortcut}</h3>
					<p class="mt-1 text-sm text-muted">
						{#if wishlist.slugs.length === 0}
							{t.account.wishlistEmpty}
						{:else}
							{interpolate(t.account.wishlistCount, { count: wishlist.slugs.length })}
						{/if}
					</p>
					<a
						href={localizedPath(lang, '/wishlist')}
						class="mt-3 inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
					>
						{t.nav.wishlist}
					</a>
				</div>
			</div>
		</section>
	{/if}
</div>
