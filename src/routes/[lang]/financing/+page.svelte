<script lang="ts">
	import { Calculator, CreditCard } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { formatPrice, interpolate } from '#lib/format';
	import { getDictionary } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const intlLocale = $derived(t.meta.intlLocale);

	const MONTH_VALUES = [3, 6, 12, 24];
	const MIN_PRICE = 100;
	const MAX_PRICE = 5000;

	let price = $state(999);
	let monthsIndex = $state(1);

	const months = $derived(MONTH_VALUES[monthsIndex] ?? 6);
	const monthly = $derived(price / months);

	const inputClass =
		'w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm text-ink placeholder:text-muted';
</script>

<Seo
	{lang}
	title={t.meta.financingTitle}
	description={t.meta.financingDescription}
	path="/financing"
/>

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.financingPage.title }
			]}
		/>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			{t.financingPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.financingPage.description}</p>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
			{t.financingPage.demoNote}
		</p>
	</div>

	<section
		aria-labelledby="financing-calculator-heading"
		class="mt-8 rounded-3xl bg-surface p-6 ring-1 ring-line"
		use:reveal
	>
		<h2
			id="financing-calculator-heading"
			class="flex items-center gap-2 text-xl font-bold text-ink"
		>
			<Calculator class="h-5 w-5 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			{t.financingPage.calculatorTitle}
		</h2>

		<div class="mt-5">
			<div class="flex flex-wrap items-baseline justify-between gap-2">
				<label for="financing-price" class="text-sm font-medium text-ink-soft">
					{t.financingPage.priceLabel}
				</label>
				<output for="financing-price" class="text-lg font-bold text-ink">
					{formatPrice(price, intlLocale)}
				</output>
			</div>
			<input
				id="financing-price"
				type="range"
				min={MIN_PRICE}
				max={MAX_PRICE}
				step="50"
				bind:value={price}
				class="mt-2 h-11 w-full accent-brand-700"
			/>
		</div>

		<div class="mt-4">
			<label for="financing-months" class="mb-1 block text-sm font-medium text-ink-soft">
				{t.financingPage.monthsLabel}
			</label>
			<select
				id="financing-months"
				bind:value={monthsIndex}
				class="{inputClass} min-h-12"
			>
				{#each t.financingPage.months as label, i (i)}
					<option value={i}>{label}</option>
				{/each}
			</select>
		</div>

		<div
			role="status"
			aria-live="polite"
			class="mt-6 rounded-2xl bg-brand-50 p-5 text-center dark:bg-surface-soft"
		>
			<p class="text-sm font-medium text-muted">{t.financingPage.monthlyLabel}</p>
			<p class="mt-1 text-2xl font-bold text-brand-800 dark:text-brand-200">
				{interpolate(t.financingPage.monthlyText, {
					amount: formatPrice(monthly, intlLocale)
				})}
			</p>
			<p class="mt-2 text-sm text-muted">
				{t.financingPage.totalLabel}:{' '}
				{interpolate(t.financingPage.totalText, { amount: formatPrice(price, intlLocale) })}
			</p>
		</div>
		<p class="mt-3 text-sm leading-relaxed text-muted">{t.financingPage.calculatorNote}</p>
	</section>

	<section aria-labelledby="financing-bnpl-heading" class="mt-8" use:reveal>
		<h2 id="financing-bnpl-heading" class="flex items-center gap-2 text-xl font-bold text-ink">
			<CreditCard class="h-5 w-5 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			{t.financingPage.bnplTitle}
		</h2>
		<p class="mt-2 leading-relaxed text-muted">{t.financingPage.bnplText}</p>
	</section>

	<section aria-labelledby="financing-steps-heading" class="mt-8" use:reveal>
		<h2 id="financing-steps-heading" class="text-xl font-bold text-ink">
			{t.financingPage.stepsTitle}
		</h2>
		<ol class="mt-4 space-y-3">
			{#each t.financingPage.steps as step, i (i)}
				<li class="flex items-start gap-3 rounded-3xl bg-surface p-5 ring-1 ring-line">
					<span
						class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white"
						aria-hidden="true"
					>
						{i + 1}
					</span>
					<p class="pt-1 leading-relaxed text-muted">{step}</p>
				</li>
			{/each}
		</ol>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
			{t.financingPage.disclaimer}
		</p>
	</section>
</div>
