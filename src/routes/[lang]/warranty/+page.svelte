<script lang="ts">
	import { ArrowRight, CheckCircle2, ShieldCheck, XCircle } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { formatPrice } from '#lib/format';
	import { getDictionary } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const intlLocale = $derived(t.meta.intlLocale);

	// Demo yearly prices per device, aligned by index with the dictionary
	// plans array. 0 means the plan is the included manufacturer warranty.
	const PLAN_PRICES = [0, 149, 299];
</script>

<Seo {lang} title={t.meta.warrantyTitle} description={t.meta.warrantyDescription} path="/warranty" />

<div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.warrantyPage.title }
			]}
		/>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			{t.warrantyPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.warrantyPage.description}</p>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
			{t.warrantyPage.demoNote}
		</p>
	</div>

	<section aria-labelledby="warranty-included-heading" class="mt-8" use:reveal>
		<h2 id="warranty-included-heading" class="flex items-center gap-2 text-xl font-bold text-ink">
			<ShieldCheck class="h-5 w-5 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			{t.warrantyPage.includedTitle}
		</h2>
		<p class="mt-2 max-w-3xl leading-relaxed text-muted">{t.warrantyPage.includedText}</p>
	</section>

	<section aria-labelledby="warranty-plans-heading" class="mt-10" use:reveal>
		<h2 id="warranty-plans-heading" class="text-xl font-bold text-ink">{t.warrantyPage.plansTitle}</h2>
		<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each t.warrantyPage.plans as plan, i (plan.name)}
				{@const price = PLAN_PRICES[i] ?? 0}
				<article
					class="flex flex-col rounded-3xl bg-surface p-5 ring-1 ring-line"
					use:reveal={{ delay: Math.min(i * 60, 300) }}
				>
					<h3 class="text-lg font-bold text-ink">{plan.name}</h3>
					<p class="text-sm font-medium text-muted">{plan.duration}</p>
					<p class="mt-3 text-2xl font-bold text-brand-800 dark:text-brand-200">
						{#if price === 0}
							{t.warrantyPage.includedLabel}
						{:else}
							{formatPrice(price, intlLocale)}
							<span class="text-sm font-medium text-muted"> / {t.warrantyPage.perYear}</span>
						{/if}
					</p>
					<p class="mt-2 text-sm leading-relaxed text-muted">{plan.description}</p>
					<ul class="mt-4 flex-1 space-y-2 text-sm leading-relaxed text-muted">
						{#each plan.features as feature (feature)}
							<li class="flex items-start gap-2">
								<CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
								<span>{feature}</span>
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
		<p class="mt-3 text-sm text-muted">{t.warrantyPage.planNote}</p>
	</section>

	<section aria-labelledby="warranty-excluded-heading" class="mt-10" use:reveal>
		<h2 id="warranty-excluded-heading" class="text-xl font-bold text-ink">
			{t.warrantyPage.notCoveredTitle}
		</h2>
		<ul class="mt-4 space-y-2">
			{#each t.warrantyPage.notCovered as item (item)}
				<li class="flex items-start gap-2 leading-relaxed text-muted">
					<XCircle class="mt-1 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" aria-hidden="true" />
					<span>{item}</span>
				</li>
			{/each}
		</ul>
	</section>

	<section
		aria-labelledby="warranty-cta-heading"
		class="mt-10 rounded-3xl bg-brand-50 p-6 text-center sm:p-8 dark:bg-surface-soft"
		use:reveal
	>
		<h2 id="warranty-cta-heading" class="text-xl font-bold text-ink">{t.warrantyPage.ctaTitle}</h2>
		<p class="mx-auto mt-1 max-w-md text-sm leading-relaxed text-muted">{t.warrantyPage.ctaText}</p>
		<div class="mt-5 flex flex-wrap justify-center gap-2">
			<a
				href={localizedPath(lang, '/help')}
				class="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.warrantyPage.helpLink}
				<ArrowRight class="h-4 w-4" aria-hidden="true" />
			</a>
			<a
				href={localizedPath(lang, '/contact')}
				class="inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50 dark:text-brand-200"
			>
				{t.warrantyPage.contactLink}
			</a>
		</div>
	</section>
</div>
