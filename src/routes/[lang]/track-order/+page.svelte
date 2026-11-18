<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Check, PackageSearch } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Seo from '#lib/components/Seo.svelte';
	import { getProduct, getVariant } from '#lib/data/products';
	import { formatDate, formatPrice, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import {
		ORDER_STATUS_STEPS,
		findDemoOrder,
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

	let code = $state('');
	let email = $state('');
	let codeError = $state<string | undefined>(undefined);
	let emailError = $state<string | undefined>(undefined);
	let result = $state<{ code: string; order: DemoOrder | null; status: OrderStatus } | null>(null);
	let resultHeading: HTMLHeadingElement | undefined = $state();
	let codeInput: HTMLInputElement | undefined = $state();

	const statusLabels: Record<OrderStatus, string> = $derived({
		ordered: t.trackOrder.statusOrdered,
		shipped: t.trackOrder.statusShipped,
		'out-for-delivery': t.trackOrder.statusOutForDelivery,
		delivered: t.trackOrder.statusDelivered
	});

	const currentIndex = $derived(result ? ORDER_STATUS_STEPS.indexOf(result.status) : -1);

	function stepState(index: number): string {
		if (index < currentIndex) return t.trackOrder.stepCompleted;
		if (index === currentIndex) return t.trackOrder.stepCurrent;
		return t.trackOrder.stepUpcoming;
	}

	function lineName(slug: string): string {
		const product = getProduct(slug);
		return product ? localize(product.name, lang) : slug;
	}

	function lineVariantLabel(slug: string, variantId: string | undefined): string | undefined {
		const product = getProduct(slug);
		const variant = product ? getVariant(product, variantId) : undefined;
		return variant ? localize(variant.label, lang) : undefined;
	}

	async function lookup(): Promise<void> {
		const normalized = code.replaceAll(/\s/g, '').toUpperCase();
		const order = findDemoOrder(normalized) ?? null;
		result = {
			code: normalized,
			order,
			status: order ? statusFromAge(order.placedAtISO, Date.now()) : 'shipped'
		};
		await tick();
		resultHeading?.focus();
	}

	async function submit(event: SubmitEvent): Promise<void> {
		event.preventDefault();
		const normalized = code.replaceAll(/\s/g, '').toUpperCase();
		codeError = normalized ? undefined : t.trackOrder.requiredError;
		emailError =
			email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
				? t.trackOrder.emailError
				: undefined;
		if (codeError || emailError) return;
		await lookup();
	}

	// Deep link (?code=...): the query string is unavailable during
	// prerendering, so read it only on the client, after mount. A code in
	// the URL prefills the input and runs the lookup immediately; an empty
	// or missing code leaves the manual form untouched, and an unknown code
	// shows the existing not-found state via lookup().
	onMount(() => {
		const linked = new URLSearchParams(window.location.search).get('code');
		if (linked?.trim()) {
			code = linked;
			void lookup();
		}
	});

	function trackAnother(): void {
		result = null;
		code = '';
		email = '';
		codeError = undefined;
		emailError = undefined;
		codeInput?.focus();
	}

	const inputClass =
		'w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm text-ink placeholder:text-muted';
</script>

<Seo {lang} title={t.meta.trackOrderTitle} description={t.meta.trackOrderDescription} path="/track-order" noindex />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<h1 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl" use:reveal>{t.trackOrder.title}</h1>
	<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.trackOrder.description}</p>

	{#if !result}
		<form onsubmit={submit} novalidate class="mt-8 space-y-4 rounded-3xl bg-surface p-6 ring-1 ring-line" use:reveal>
			<div>
				<label for="track-code" class="mb-1 block text-sm font-medium text-ink-soft">
					{t.trackOrder.orderCodeLabel}
				</label>
				<input
					id="track-code"
					name="code"
					type="text"
					bind:this={codeInput}
					bind:value={code}
					oninput={() => {
						if (codeError) codeError = undefined;
					}}
					placeholder={t.trackOrder.orderCodePlaceholder}
					autocomplete="off"
					autocapitalize="characters"
					aria-invalid={codeError ? 'true' : undefined}
					aria-describedby={codeError ? 'track-code-error track-code-hint' : 'track-code-hint'}
					class="{inputClass} min-h-12"
				/>
				<p id="track-code-hint" class="mt-1 text-sm text-muted">{t.trackOrder.codeHint}</p>
				{#if codeError}
					<p id="track-code-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{codeError}</p>
				{/if}
			</div>
			<div>
				<label for="track-email" class="mb-1 block text-sm font-medium text-ink-soft">
					{t.trackOrder.emailLabel}
				</label>
				<input
					id="track-email"
					name="email"
					type="email"
					bind:value={email}
					oninput={() => {
						if (emailError) emailError = undefined;
					}}
					placeholder={t.trackOrder.emailPlaceholder}
					autocomplete="email"
					aria-invalid={emailError ? 'true' : undefined}
					aria-describedby={emailError ? 'track-email-error' : undefined}
					class="{inputClass} min-h-12"
				/>
				{#if emailError}
					<p id="track-email-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>
				{/if}
			</div>
			<button
				type="submit"
				class="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				<PackageSearch class="h-4 w-4" aria-hidden="true" />
				{t.trackOrder.submit}
			</button>
		</form>
	{:else}
		<div class="mt-8 rounded-3xl bg-surface p-6 ring-1 ring-line" use:reveal>
			<h2 bind:this={resultHeading} tabindex="-1" class="text-xl font-bold text-ink focus:outline-none">
				{interpolate(t.trackOrder.orderHeading, { orderId: result.code })}
			</h2>
			{#if result.order}
				<p class="mt-1 text-sm text-muted">
					{interpolate(t.trackOrder.placedOn, {
						date: formatDate(new Date(result.order.placedAtISO), intlLocale)
					})}
				</p>
			{:else}
				<p class="mt-2 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">{t.trackOrder.demoNote}</p>
			{/if}
			<p class="mt-4 text-sm text-muted">
				<span class="font-semibold text-ink">{t.trackOrder.statusLabel}:</span>
				{' '}{statusLabels[result.status]}
			</p>

			<ol aria-label={t.trackOrder.timelineLabel} class="mt-6">
				{#each ORDER_STATUS_STEPS as stepStatus, i (stepStatus)}
					{@const done = i < currentIndex}
					{@const isCurrent = i === currentIndex}
					<li class="relative flex gap-4 pb-6 last:pb-0">
						{#if i < ORDER_STATUS_STEPS.length - 1}
							<span
								aria-hidden="true"
								class="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 {i < currentIndex
									? 'bg-brand-700'
									: 'bg-line'}"
							></span>
						{/if}
						<span
							aria-hidden="true"
							class="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold {done || isCurrent
								? 'bg-brand-700 text-white'
								: 'bg-surface-soft text-muted ring-1 ring-line'}"
						>
							{#if done}
								<Check class="h-5 w-5" aria-hidden="true" />
							{:else}
								{i + 1}
							{/if}
						</span>
						<span class="flex min-h-10 flex-col justify-center">
							<span class="font-semibold {isCurrent ? 'text-ink' : 'text-muted'}">
								{statusLabels[stepStatus]}
							</span>
							<span class="sr-only">{stepState(i)}</span>
						</span>
					</li>
				{/each}
			</ol>

			{#if result.order}
				<section aria-labelledby="track-items-heading" class="mt-6 border-t border-line pt-6">
					<h3 id="track-items-heading" class="text-base font-bold text-ink">
						{t.trackOrder.itemsTitle}
					</h3>
					<ul class="mt-3 divide-y divide-line">
						{#each result.order.lines as line (line.slug + ':' + (line.variantId ?? ''))}
							{@const variantLabel = lineVariantLabel(line.slug, line.variantId)}
							<li class="flex items-baseline justify-between gap-3 py-3 text-sm first:pt-0 last:pb-0">
								<span class="min-w-0 text-muted">
									<span class="font-medium text-ink">{lineName(line.slug)}</span>
									{#if variantLabel}
										{' '}({variantLabel})
									{/if}
									{' '}{interpolate(t.trackOrder.lineQty, { qty: line.qty })}
								</span>
								<span class="shrink-0 font-semibold text-ink">
									{formatPrice(line.unitPrice * line.qty, intlLocale)}
								</span>
							</li>
						{/each}
					</ul>
					<p class="mt-4 flex items-baseline justify-between border-t border-line pt-4 text-base">
						<span class="font-bold text-ink">{t.cart.total}</span>
						<span class="font-bold text-ink">
							{formatPrice(result.order.total, intlLocale)}
						</span>
					</p>
				</section>
			{/if}

			<div class="mt-6 flex flex-col gap-2 sm:flex-row">
				<button
					type="button"
					onclick={trackAnother}
					class="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
				>
					{t.trackOrder.trackAnother}
				</button>
				<a
					href={localizedPath(lang, '/shop')}
					class="inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
				>
					{t.cart.continueShopping}
				</a>
			</div>
		</div>
	{/if}
</div>
