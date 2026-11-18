<script lang="ts">
	import { tick } from 'svelte';
	import { CheckCircle2, Gift } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { SITE_URL } from '#lib/config';
	import { formatPrice, interpolate } from '#lib/format';
	import { getDictionary } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));

	const breadcrumbJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: t.product.breadcrumbHome,
				item: `${SITE_URL}/${lang}`
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: t.giftCardsPage.title,
				item: `${SITE_URL}/${lang}/gift-cards`
			}
		]
	});

	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/gift-cards`,
		url: `${SITE_URL}/${lang}/gift-cards`,
		name: t.giftCardsPage.title,
		description: t.meta.giftCardsDescription,
		inLanguage: lang
	});
	const intlLocale = $derived(t.meta.intlLocale);

	const PRESET_AMOUNTS = [1000, 2500, 5000, 10000];
	const MIN_AMOUNT = 500;
	const MAX_AMOUNT = 50000;

	// --- Gift-card form (demo: nothing is created, sent or charged) ---
	let selectedPreset = $state(2500);
	let customAmount = $state('');
	let recipientName = $state('');
	let recipientEmail = $state('');
	let senderName = $state('');
	let message = $state('');
	let errors: {
		recipientName?: string;
		recipientEmail?: string;
		senderName?: string;
		amount?: string;
	} = $state({});
	let submittedOnce = $state(false);
	let showSummary = $state(false);
	let summaryEl: HTMLDivElement | undefined = $state();

	type GiftCardPreview = {
		amount: number;
		recipientName: string;
		senderName: string;
		message: string;
		code: string;
	};
	let preview = $state<GiftCardPreview | null>(null);

	// A typed custom amount wins over the selected preset.
	const effectiveAmount = $derived.by(() => {
		const raw = customAmount.trim();
		if (!raw) return selectedPreset;
		const parsed = Number(raw);
		return Number.isFinite(parsed) ? parsed : Number.NaN;
	});

	type ErrorField = 'recipientName' | 'recipientEmail' | 'senderName' | 'amount';

	const fieldMeta: { field: ErrorField; id: string; label: string }[] = $derived([
		{ field: 'amount', id: 'gift-amount-1000', label: t.giftCardsPage.amountLabel },
		{ field: 'recipientName', id: 'gift-recipient-name', label: t.giftCardsPage.recipientNameLabel },
		{ field: 'recipientEmail', id: 'gift-recipient-email', label: t.giftCardsPage.recipientEmailLabel },
		{ field: 'senderName', id: 'gift-sender-name', label: t.giftCardsPage.senderNameLabel }
	]);

	const errorEntries = $derived(fieldMeta.filter((meta) => errors[meta.field]));

	function fieldError(field: ErrorField): string | undefined {
		if (field === 'recipientName') {
			return recipientName.trim() ? undefined : t.giftCardsPage.requiredError;
		}
		if (field === 'senderName') {
			return senderName.trim() ? undefined : t.giftCardsPage.requiredError;
		}
		if (field === 'recipientEmail') {
			if (!recipientEmail.trim()) return t.giftCardsPage.requiredError;
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim())
				? undefined
				: t.giftCardsPage.emailError;
		}
		const amount = effectiveAmount;
		return Number.isInteger(amount) && amount >= MIN_AMOUNT && amount <= MAX_AMOUNT
			? undefined
			: t.giftCardsPage.amountError;
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
		const value =
			field === 'recipientName'
				? recipientName
				: field === 'recipientEmail'
					? recipientEmail
					: field === 'senderName'
						? senderName
						: customAmount;
		if (submittedOnce || value.trim()) validateField(field);
	}

	function handleInput(field: ErrorField): void {
		if (errors[field]) validateField(field);
	}

	async function submit(event: SubmitEvent): Promise<void> {
		event.preventDefault();
		submittedOnce = true;
		const next: typeof errors = {};
		for (const field of ['amount', 'recipientName', 'recipientEmail', 'senderName'] as const) {
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
		const amount = effectiveAmount;
		preview = {
			amount,
			recipientName: recipientName.trim(),
			senderName: senderName.trim(),
			message: message.trim(),
			code: `DEMO-${amount}`
		};
	}

	function focusField(id: string): void {
		document.getElementById(id)?.focus();
	}

	function reset(): void {
		selectedPreset = 2500;
		customAmount = '';
		recipientName = '';
		recipientEmail = '';
		senderName = '';
		message = '';
		errors = {};
		preview = null;
		submittedOnce = false;
		showSummary = false;
	}

	// --- Demo balance check (local-only: any DEMO-<digits> code shows a fictional balance) ---
	let balanceCode = $state('');
	let balanceError: string | undefined = $state(undefined);
	let balanceResult = $state<{ code: string; amount: number } | null>(null);
	let balanceNotFound = $state<string | null>(null);

	function checkBalance(event: SubmitEvent): void {
		event.preventDefault();
		const code = balanceCode.trim().toUpperCase();
		balanceResult = null;
		balanceNotFound = null;
		if (!code) {
			balanceError = t.giftCardsPage.balanceCodeError;
			return;
		}
		balanceError = undefined;
		const match = /^DEMO-(\d+)$/.exec(code);
		if (match) {
			balanceResult = { code, amount: Number(match[1]) };
		} else {
			balanceNotFound = code;
		}
	}

	const inputClass =
		'w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm text-ink placeholder:text-muted';
</script>

<Seo
	{lang}
	title={t.meta.giftCardsTitle}
	description={t.meta.giftCardsDescription}
	path="/gift-cards"
/>
<JsonLd json={breadcrumbJsonLd} />
<JsonLd json={webPageJsonLd} />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.giftCardsPage.title }
			]}
		/>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			{t.giftCardsPage.title}
		</h1>
		<p class="mt-2 leading-relaxed text-muted">{t.giftCardsPage.description}</p>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
			{t.giftCardsPage.demoNote}
		</p>
	</div>

	{#if preview}
		<div class="mt-8" role="status" use:reveal>
			<div class="overflow-hidden rounded-3xl bg-brand-950 p-6 text-white sm:p-8">
				<div class="flex items-center gap-2 text-brand-300">
					<Gift class="h-5 w-5" aria-hidden="true" />
					<p class="text-xs font-bold uppercase tracking-widest">{t.giftCardsPage.previewTitle}</p>
				</div>
				<p class="mt-4 text-4xl font-bold tracking-tight">
					{formatPrice(preview.amount, intlLocale)}
				</p>
				<p class="mt-3 font-semibold">
					{interpolate(t.giftCardsPage.previewTo, { name: preview.recipientName })}
				</p>
				<p class="text-sm text-white/70">
					{interpolate(t.giftCardsPage.previewFrom, { name: preview.senderName })}
				</p>
				{#if preview.message}
					<p class="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-white/80">
						{preview.message}
					</p>
				{/if}
				<p class="mt-4 font-mono text-sm tracking-wider text-brand-300">{preview.code}</p>
			</div>
			<p class="mt-3 text-sm text-muted">{t.giftCardsPage.previewText}</p>
			<p class="mt-1 text-sm text-muted">
				{interpolate(t.giftCardsPage.previewCodeHint, { code: preview.code })}
			</p>
			<button
				type="button"
				onclick={reset}
				class="mt-5 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.giftCardsPage.sendAnother}
			</button>
		</div>
	{:else}
		<form
			onsubmit={submit}
			novalidate
			class="mt-8 space-y-5 rounded-3xl bg-surface p-6 ring-1 ring-line"
			use:reveal
		>
			{#if showSummary && errorEntries.length > 0}
				<div
					bind:this={summaryEl}
					tabindex="-1"
					role="alert"
					class="rounded-2xl bg-red-50 dark:bg-red-950/60 p-4 ring-1 ring-red-200 dark:ring-red-900 focus:outline-2 focus:outline-offset-2 focus:outline-red-600"
				>
					<p class="text-sm font-semibold text-red-800 dark:text-red-200">{t.giftCardsPage.errorSummary}</p>
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

			<div
				role="group"
				aria-labelledby="gift-amount-label"
				aria-describedby={errors.amount ? 'gift-amount-error' : undefined}
			>
				<p id="gift-amount-label" class="mb-2 text-sm font-medium text-ink-soft">
					{t.giftCardsPage.amountLabel}
				</p>
				<div class="flex flex-wrap gap-2">
					{#each PRESET_AMOUNTS as amount (amount)}
						<label
							class="inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 text-sm font-semibold ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft has-checked:bg-brand-700 has-checked:text-white has-checked:ring-brand-700 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand-700"
						>
							<input
								type="radio"
								name="gift-amount"
								id="gift-amount-{amount}"
								value={amount}
								checked={customAmount.trim() === '' && selectedPreset === amount}
								onchange={() => {
									selectedPreset = amount;
									customAmount = '';
									handleInput('amount');
								}}
								class="sr-only"
							/>
							{formatPrice(amount, intlLocale)}
						</label>
					{/each}
				</div>
				<label
					for="gift-custom-amount"
					class="mb-1 mt-4 block text-sm font-medium text-ink-soft"
				>
					{t.giftCardsPage.customAmountLabel}
				</label>
				<input
					id="gift-custom-amount"
					name="customAmount"
					type="number"
					min={MIN_AMOUNT}
					max={MAX_AMOUNT}
					step="1"
					inputmode="numeric"
					bind:value={customAmount}
					onblur={() => handleBlur('amount')}
					oninput={() => handleInput('amount')}
					placeholder={t.giftCardsPage.customAmountPlaceholder}
					aria-invalid={errors.amount ? 'true' : undefined}
					aria-describedby={errors.amount ? 'gift-amount-error' : undefined}
					class="{inputClass} min-h-12"
				/>
				{#if errors.amount}
					<p id="gift-amount-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
				{/if}
			</div>

			<div>
				<label for="gift-recipient-name" class="mb-1 block text-sm font-medium text-ink-soft">
					{t.giftCardsPage.recipientNameLabel}
				</label>
				<input
					id="gift-recipient-name"
					name="recipientName"
					type="text"
					bind:value={recipientName}
					onblur={() => handleBlur('recipientName')}
					oninput={() => handleInput('recipientName')}
					placeholder={t.giftCardsPage.recipientNamePlaceholder}
					autocomplete="off"
					aria-invalid={errors.recipientName ? 'true' : undefined}
					aria-describedby={errors.recipientName ? 'gift-recipient-name-error' : undefined}
					class="{inputClass} min-h-12"
				/>
				{#if errors.recipientName}
					<p id="gift-recipient-name-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
						{errors.recipientName}
					</p>
				{/if}
			</div>

			<div>
				<label for="gift-recipient-email" class="mb-1 block text-sm font-medium text-ink-soft">
					{t.giftCardsPage.recipientEmailLabel}
				</label>
				<input
					id="gift-recipient-email"
					name="recipientEmail"
					type="email"
					bind:value={recipientEmail}
					onblur={() => handleBlur('recipientEmail')}
					oninput={() => handleInput('recipientEmail')}
					placeholder={t.giftCardsPage.recipientEmailPlaceholder}
					autocomplete="off"
					aria-invalid={errors.recipientEmail ? 'true' : undefined}
					aria-describedby={errors.recipientEmail ? 'gift-recipient-email-error' : undefined}
					class="{inputClass} min-h-12"
				/>
				{#if errors.recipientEmail}
					<p id="gift-recipient-email-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
						{errors.recipientEmail}
					</p>
				{/if}
			</div>

			<div>
				<label for="gift-sender-name" class="mb-1 block text-sm font-medium text-ink-soft">
					{t.giftCardsPage.senderNameLabel}
				</label>
				<input
					id="gift-sender-name"
					name="senderName"
					type="text"
					bind:value={senderName}
					onblur={() => handleBlur('senderName')}
					oninput={() => handleInput('senderName')}
					placeholder={t.giftCardsPage.senderNamePlaceholder}
					autocomplete="name"
					aria-invalid={errors.senderName ? 'true' : undefined}
					aria-describedby={errors.senderName ? 'gift-sender-name-error' : undefined}
					class="{inputClass} min-h-12"
				/>
				{#if errors.senderName}
					<p id="gift-sender-name-error" class="mt-1 text-sm text-red-600 dark:text-red-400">
						{errors.senderName}
					</p>
				{/if}
			</div>

			<div>
				<label for="gift-message" class="mb-1 block text-sm font-medium text-ink-soft">
					{t.giftCardsPage.messageLabel}
				</label>
				<textarea
					id="gift-message"
					name="message"
					rows="3"
					bind:value={message}
					placeholder={t.giftCardsPage.messagePlaceholder}
					class={inputClass}
				></textarea>
			</div>

			<button
				type="submit"
				class="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				<Gift class="h-4 w-4" aria-hidden="true" />
				{t.giftCardsPage.previewButton}
			</button>
		</form>
	{/if}

	<section
		aria-labelledby="gift-balance-heading"
		class="mt-10 rounded-3xl bg-surface p-6 ring-1 ring-line"
		use:reveal
	>
		<h2 id="gift-balance-heading" class="text-xl font-bold text-ink">
			{t.giftCardsPage.balanceTitle}
		</h2>
		<p class="mt-1 text-sm leading-relaxed text-muted">
			{t.giftCardsPage.balanceDescription}
		</p>
		<form onsubmit={checkBalance} novalidate class="mt-4 space-y-3">
			<div>
				<label for="gift-balance-code" class="mb-1 block text-sm font-medium text-ink-soft">
					{t.giftCardsPage.balanceCodeLabel}
				</label>
				<input
					id="gift-balance-code"
					name="balanceCode"
					type="text"
					bind:value={balanceCode}
					oninput={() => {
						balanceError = undefined;
					}}
					placeholder={t.giftCardsPage.balanceCodePlaceholder}
					autocomplete="off"
					autocapitalize="characters"
					spellcheck="false"
					aria-invalid={balanceError ? 'true' : undefined}
					aria-describedby={balanceError ? 'gift-balance-code-error' : undefined}
					class="{inputClass} min-h-12 font-mono uppercase"
				/>
				{#if balanceError}
					<p id="gift-balance-code-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{balanceError}</p>
				{/if}
			</div>
			<button
				type="submit"
				class="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
			>
				{t.giftCardsPage.balanceButton}
			</button>
		</form>
		<div aria-live="polite">
			{#if balanceResult}
				<p class="mt-4 flex items-start gap-2 rounded-2xl bg-brand-50 p-4 text-sm text-ink-soft dark:bg-surface-soft">
					<CheckCircle2 class="mt-0.5 h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
					<span>
						{interpolate(t.giftCardsPage.balanceFound, {
							code: balanceResult.code,
							amount: formatPrice(balanceResult.amount, intlLocale)
						})}
					</span>
				</p>
			{:else if balanceNotFound}
				<p class="mt-4 rounded-2xl bg-red-50 dark:bg-red-950/60 p-4 text-sm text-red-700 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-900">
					{interpolate(t.giftCardsPage.balanceNotFound, { code: balanceNotFound })}
				</p>
			{/if}
		</div>
	</section>

	<section aria-labelledby="gift-how-heading" class="mt-10" use:reveal>
		<h2 id="gift-how-heading" class="text-xl font-bold text-ink">
			{t.giftCardsPage.howTitle}
		</h2>
		<ol class="mt-4 space-y-3">
			{#each t.giftCardsPage.howSteps as step, i (i)}
				<li class="flex gap-3 rounded-3xl bg-surface p-4 ring-1 ring-line">
					<span
						class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white"
						aria-hidden="true"
					>
						{i + 1}
					</span>
					<p class="text-sm leading-relaxed text-muted">{step}</p>
				</li>
			{/each}
		</ol>
	</section>
</div>
