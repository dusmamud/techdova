<script lang="ts">
	import { ArrowLeft, ArrowRight, Gift, RotateCcw } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { SITE_URL } from '#lib/config';
	import { products, type Product } from '#lib/data/products';
	import { interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
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
				name: t.giftFinderPage.title,
				item: `${SITE_URL}/${lang}/gift-finder`
			}
		]
	});

	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/gift-finder`,
		url: `${SITE_URL}/${lang}/gift-finder`,
		name: t.giftFinderPage.title,
		description: t.meta.giftFinderDescription,
		inLanguage: lang
	});

	// Scoring is aligned by option index with the dictionary questions
	// (t.giftFinderPage.questions). Q0 recipient and Q4 occasion are
	// context only and do not score. Q1 budget caps the price, Q2 interest
	// picks a category, Q3 tech level nudges the category, Q5 brand filters,
	// Q6 priority picks the "why" reason and nudges the category.
	const BUDGET_CAPS = [200, 500, 1000, Number.POSITIVE_INFINITY];
	const INTEREST_CATEGORIES = [
		'audio',
		'gaming',
		'smartwatches',
		'computers',
		'smartphones',
		'accessories'
	] as const;
	const PRIORITY_CATEGORIES = ['smartwatches', 'smartphones', 'audio', 'computers'] as const;
	const PRIORITY_KEYS = ['battery', 'camera', 'sound', 'screen'] as const;

	const totalQuestions = $derived(t.giftFinderPage.questions.length);
	let step = $state(0); // 0 = intro, 1..total = question, total+1 = results
	let answers = $state<number[]>(Array(7).fill(-1));

	const currentAnswer = $derived(step >= 1 && step <= totalQuestions ? answers[step - 1] : -1);

	function scoreProduct(product: Product): number {
		let score = 0;
		const interestCategory = INTEREST_CATEGORIES[answers[2] ?? 5];
		if (product.category === interestCategory) score += 3;
		const priorityCategory = PRIORITY_CATEGORIES[answers[6] ?? 0];
		if (product.category === priorityCategory) score += 1;
		if (answers[3] === 0 && (product.category === 'accessories' || product.category === 'audio'))
			score += 1;
		if (answers[3] === 2 && (product.category === 'computers' || product.category === 'smartphones'))
			score += 1;
		if (answers[5] === 0 && product.brand === 'Apple') score += 2;
		if (answers[5] === 1 && product.brand === 'Samsung') score += 2;
		return score;
	}

	const recommendations = $derived.by(() => {
		const cap = BUDGET_CAPS[answers[1] ?? 3] ?? Number.POSITIVE_INFINITY;
		const brand = answers[5] === 0 ? 'Apple' : answers[5] === 1 ? 'Samsung' : null;
		return products
			.filter((p) => p.price <= cap && (!brand || p.brand === brand))
			.map((p) => ({ product: p, score: scoreProduct(p) }))
			.sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
			.slice(0, 5)
			.map((entry) => entry.product);
	});

	const whyLines = $derived.by(() => {
		const lines: string[] = [];
		const interestLabel = t.giftFinderPage.questions[2]?.options[answers[2] ?? 5];
		if (interestLabel)
			lines.push(interpolate(t.giftFinderPage.whyTemplates.interest, { interest: interestLabel }));
		const priorityKey = PRIORITY_KEYS[answers[6] ?? 0];
		if (priorityKey === 'battery') lines.push(t.giftFinderPage.whyTemplates.battery);
		if (priorityKey === 'camera') lines.push(t.giftFinderPage.whyTemplates.camera);
		if (priorityKey === 'sound') lines.push(t.giftFinderPage.whyTemplates.sound);
		if (priorityKey === 'screen') lines.push(t.giftFinderPage.whyTemplates.screen);
		if (answers[5] === 0)
			lines.push(interpolate(t.giftFinderPage.whyTemplates.brand, { brand: 'Apple' }));
		if (answers[5] === 1)
			lines.push(interpolate(t.giftFinderPage.whyTemplates.brand, { brand: 'Samsung' }));
		const budgetLabel = t.giftFinderPage.questions[1]?.options[answers[1] ?? 3];
		if (budgetLabel && answers[1] !== 3)
			lines.push(interpolate(t.giftFinderPage.whyTemplates.budget, { budget: budgetLabel }));
		return lines.slice(0, 3);
	});

	function choose(optionIndex: number): void {
		if (step < 1 || step > totalQuestions) return;
		answers[step - 1] = optionIndex;
	}

	function next(): void {
		if (currentAnswer < 0) return;
		step = Math.min(step + 1, totalQuestions + 1);
	}

	function back(): void {
		step = Math.max(step - 1, 0);
	}

	function restart(): void {
		answers = Array(7).fill(-1);
		step = 0;
	}
</script>

<Seo {lang} title={t.meta.giftFinderTitle} description={t.meta.giftFinderDescription} path="/gift-finder" />
<JsonLd json={breadcrumbJsonLd} />
<JsonLd json={webPageJsonLd} />

<div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.giftFinderPage.title }
			]}
		/>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			{t.giftFinderPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.giftFinderPage.description}</p>
	</div>

	{#if step === 0}
		<div
			class="mt-8 rounded-3xl bg-brand-50 p-6 text-center dark:bg-surface-soft sm:p-10"
			use:reveal
		>
			<Gift class="mx-auto h-10 w-10 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			<h2 class="mt-4 text-2xl font-bold text-ink">{t.giftFinderPage.startTitle}</h2>
			<p class="mx-auto mt-2 max-w-md leading-relaxed text-muted">{t.giftFinderPage.startText}</p>
			<button
				type="button"
				onclick={() => {
					step = 1;
				}}
				class="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.giftFinderPage.startButton}
				<ArrowRight class="h-4 w-4" aria-hidden="true" />
			</button>
		</div>
	{:else if step >= 1 && step <= totalQuestions}
		{@const question = t.giftFinderPage.questions[step - 1]}
		<div class="mt-8" use:reveal>
			<p class="text-sm font-semibold text-brand-700 dark:text-brand-300">
				{interpolate(t.giftFinderPage.questionLabel, { current: step, total: totalQuestions })}
			</p>
			<div
				class="mt-2 h-2 overflow-hidden rounded-full bg-brand-50 dark:bg-surface-soft"
				role="progressbar"
				aria-valuenow={step}
				aria-valuemin={1}
				aria-valuemax={totalQuestions}
				aria-label={interpolate(t.giftFinderPage.questionLabel, {
					current: step,
					total: totalQuestions
				})}
			>
				<div
					class="h-full rounded-full bg-brand-700 transition-[width] duration-300"
					style="width: {(step / totalQuestions) * 100}%"
				></div>
			</div>
			<fieldset class="mt-6">
				<legend class="text-xl font-bold text-ink sm:text-2xl">{question.question}</legend>
				<div class="mt-4 grid gap-3 sm:grid-cols-2">
					{#each question.options as option, i (option)}
						<button
							type="button"
							aria-pressed={currentAnswer === i}
							onclick={() => choose(i)}
							class="min-h-12 rounded-2xl px-4 py-3 text-left text-sm font-medium ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft aria-pressed:bg-brand-700 aria-pressed:text-white aria-pressed:ring-brand-700"
						>
							{option}
						</button>
					{/each}
				</div>
			</fieldset>
			<div class="mt-6 flex gap-3">
				<button
					type="button"
					onclick={back}
					class="inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft"
				>
					<ArrowLeft class="h-4 w-4" aria-hidden="true" />
					{t.giftFinderPage.backButton}
				</button>
				<button
					type="button"
					disabled={currentAnswer < 0}
					onclick={next}
					class="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
				>
					{step === totalQuestions
						? t.giftFinderPage.seeResultsButton
						: t.giftFinderPage.nextButton}
					<ArrowRight class="h-4 w-4" aria-hidden="true" />
				</button>
			</div>
		</div>
	{:else}
		<div class="mt-8" use:reveal>
			<h2 class="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
				{t.giftFinderPage.resultsTitle}
			</h2>
			<p class="mt-2 max-w-2xl leading-relaxed text-muted">
				{t.giftFinderPage.resultsDescription}
			</p>
			{#if recommendations.length === 0}
				<div
					class="mt-6 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center dark:bg-surface-soft"
				>
					<h3 class="text-xl font-bold text-ink">{t.giftFinderPage.resultsEmpty}</h3>
					<p class="max-w-sm text-muted">{t.giftFinderPage.resultsEmptyHint}</p>
					<button
						type="button"
						onclick={restart}
						class="mt-2 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
					>
						<RotateCcw class="h-4 w-4" aria-hidden="true" />
						{t.giftFinderPage.retakeButton}
					</button>
				</div>
			{:else}
				<div class="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
					{#each recommendations as product (product.slug)}
						<div class="flex flex-col gap-3">
							<ProductCard {product} {lang} {t} />
							<div class="rounded-2xl bg-brand-50 p-4 dark:bg-surface-soft">
								<p class="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-300">
									{t.giftFinderPage.whyLabel}
								</p>
								<ul class="mt-2 space-y-1 text-sm leading-relaxed text-muted">
									{#each whyLines as line (line)}
										<li>{line}</li>
									{/each}
								</ul>
							</div>
						</div>
					{/each}
				</div>
				<div class="mt-8 text-center">
					<button
						type="button"
						onclick={restart}
						class="inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft"
					>
						<RotateCcw class="h-4 w-4" aria-hidden="true" />
						{t.giftFinderPage.retakeButton}
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>
