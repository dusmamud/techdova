<script lang="ts">
	import { ArrowRight, Recycle } from '@lucide/svelte';
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

	// Demo estimate table, aligned by index with the dictionary label
	// arrays (deviceTypes, conditions, ages). Values are fictional DA
	// amounts; the estimate runs entirely in the browser.
	const BASE_VALUES = [400, 600, 250, 150, 100, 300];
	const CONDITION_MULTIPLIERS = [1.0, 0.8, 0.55, 0.3];
	const AGE_MULTIPLIERS = [1.0, 0.8, 0.6, 0.4];

	let deviceIndex = $state(0);
	let conditionIndex = $state(1);
	let ageIndex = $state(1);

	const estimate = $derived.by(() => {
		const base = BASE_VALUES[deviceIndex] ?? 0;
		const condition = CONDITION_MULTIPLIERS[conditionIndex] ?? 0;
		const age = AGE_MULTIPLIERS[ageIndex] ?? 0;
		return Math.round((base * condition * age) / 10) * 10;
	});

	const inputClass =
		'w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm text-ink placeholder:text-muted';
</script>

<Seo {lang} title={t.meta.tradeInTitle} description={t.meta.tradeInDescription} path="/trade-in" />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.tradeInPage.title }
			]}
		/>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			{t.tradeInPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.tradeInPage.description}</p>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
			{t.tradeInPage.demoNote}
		</p>
	</div>

	<div class="mt-8 rounded-3xl bg-surface p-6 ring-1 ring-line" use:reveal>
		<div class="grid gap-5 sm:grid-cols-2">
			<div>
				<label for="tradein-device" class="mb-1 block text-sm font-medium text-ink-soft">
					{t.tradeInPage.categoryLabel}
				</label>
				<select
					id="tradein-device"
					bind:value={deviceIndex}
					class="{inputClass} min-h-12"
				>
					{#each t.tradeInPage.deviceTypes as device, i (i)}
						<option value={i}>{device}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="tradein-age" class="mb-1 block text-sm font-medium text-ink-soft">
					{t.tradeInPage.ageLabel}
				</label>
				<select id="tradein-age" bind:value={ageIndex} class="{inputClass} min-h-12">
					{#each t.tradeInPage.ages as age, i (i)}
						<option value={i}>{age}</option>
					{/each}
				</select>
			</div>
		</div>

		<fieldset class="mt-5">
			<legend class="mb-2 text-sm font-medium text-ink-soft">{t.tradeInPage.conditionLabel}</legend>
			<div class="grid gap-2 sm:grid-cols-2">
				{#each t.tradeInPage.conditions as condition, i (i)}
					<label
						class="flex cursor-pointer items-start gap-3 rounded-2xl px-4 py-3 ring-1 ring-line hover:bg-surface-soft has-checked:bg-brand-50 has-checked:ring-brand-700 dark:has-checked:bg-surface-soft"
					>
						<input
							type="radio"
							name="tradein-condition"
							value={i}
							bind:group={conditionIndex}
							class="mt-1 h-4 w-4 shrink-0 accent-brand-700"
						/>
						<span>
							<span class="block text-sm font-semibold text-ink">{condition}</span>
							<span class="block text-sm text-muted">{t.tradeInPage.conditionHints[i]}</span>
						</span>
					</label>
				{/each}
			</div>
		</fieldset>

		<div
			role="status"
			aria-live="polite"
			class="mt-6 rounded-2xl bg-brand-50 p-5 text-center dark:bg-surface-soft"
		>
			<h2 class="flex items-center justify-center gap-2 text-lg font-bold text-ink">
				<Recycle class="h-5 w-5 text-brand-700 dark:text-brand-300" aria-hidden="true" />
				{t.tradeInPage.estimateTitle}
			</h2>
			<p class="mt-2 text-2xl font-bold text-brand-800 dark:text-brand-200">
				{interpolate(t.tradeInPage.estimateText, {
					amount: formatPrice(estimate, intlLocale)
				})}
			</p>
			<p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
				{t.tradeInPage.estimateHint}
			</p>
		</div>
	</div>

	<section aria-labelledby="tradein-how-heading" class="mt-8" use:reveal>
		<h2 id="tradein-how-heading" class="text-xl font-bold text-ink">{t.tradeInPage.howTitle}</h2>
		<p class="mt-1 leading-relaxed text-muted">{t.tradeInPage.howText}</p>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
			{t.tradeInPage.disclaimer}
		</p>
	</section>

	<section
		aria-labelledby="tradein-cta-heading"
		class="mt-8 rounded-3xl bg-brand-50 p-6 text-center sm:p-8 dark:bg-surface-soft"
		use:reveal
	>
		<h2 id="tradein-cta-heading" class="text-xl font-bold text-ink">{t.tradeInPage.ctaTitle}</h2>
		<p class="mx-auto mt-1 max-w-md text-sm leading-relaxed text-muted">{t.tradeInPage.ctaText}</p>
		<a
			href={localizedPath(lang, '/contact')}
			class="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
		>
			{t.tradeInPage.ctaLink}
			<ArrowRight class="h-4 w-4" aria-hidden="true" />
		</a>
	</section>
</div>
