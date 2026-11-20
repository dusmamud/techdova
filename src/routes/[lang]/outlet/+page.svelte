<script lang="ts">
	import { ArrowRight, BadgePercent } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import Picture from '#lib/components/Picture.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import { SITE_URL } from '#lib/config';
	import { outletConditions, outletItems, outletSaving, type OutletCondition } from '#lib/data/e2-outlet';
	import { formatCount, formatDecimal, formatPrice, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath, productPath } from '#lib/paths';
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
				name: t.outletPage.title,
				item: `${SITE_URL}/${lang}/outlet`
			}
		]
	});

	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/outlet`,
		url: `${SITE_URL}/${lang}/outlet`,
		name: t.outletPage.title,
		description: t.meta.outletDescription,
		inLanguage: lang
	});

	const intlLocale = $derived(t.meta.intlLocale);
	let selectedCondition = $state<OutletCondition | null>(null);

	const visibleItems = $derived(
		selectedCondition
			? outletItems.filter((item) => item.condition === selectedCondition)
			: outletItems
	);

	const countText = $derived(
		visibleItems.length === 1
			? t.outletPage.resultOne
			: interpolate(t.outletPage.results, { count: visibleItems.length })
	);

	function conditionLabel(condition: OutletCondition): string {
		if (condition === 'open-box') return t.outletPage.conditionOpenBox;
		if (condition === 'refurbished') return t.outletPage.conditionRefurbished;
		return t.outletPage.conditionClearance;
	}

	function conditionExplainer(condition: OutletCondition): string {
		if (condition === 'open-box') return t.outletPage.whatIsOpenBox;
		if (condition === 'refurbished') return t.outletPage.whatIsRefurbished;
		return t.outletPage.whatIsClearance;
	}
</script>

<Seo {lang} title={t.meta.outletTitle} description={t.meta.outletDescription} path="/outlet" />
<JsonLd json={breadcrumbJsonLd} />
<JsonLd json={webPageJsonLd} />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.outletPage.title }
			]}
		/>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			{t.outletPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.outletPage.description}</p>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
			{t.outletPage.demoNote}
		</p>
	</div>

	<div class="mt-8" use:reveal>
		<div class="flex flex-wrap gap-2" role="group" aria-label={t.outletPage.title}>
			<button
				type="button"
				aria-pressed={selectedCondition === null}
				onclick={() => {
					selectedCondition = null;
				}}
				class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft aria-pressed:bg-brand-700 aria-pressed:text-white aria-pressed:ring-brand-700"
			>
				{t.outletPage.filterAll}
			</button>
			{#each outletConditions as condition (condition)}
				<button
					type="button"
					aria-pressed={selectedCondition === condition}
					onclick={() => {
						selectedCondition = condition;
					}}
					class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft aria-pressed:bg-brand-700 aria-pressed:text-white aria-pressed:ring-brand-700"
				>
					{conditionLabel(condition)}
				</button>
			{/each}
		</div>
		<p role="status" aria-live="polite" class="mt-4 text-sm font-medium text-muted">
			{countText}
		</p>
	</div>

	<div class="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
		{#each visibleItems as item, i (item.product.slug + item.condition)}
			<article
				class="flex h-full flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-line sm:rounded-3xl"
				use:reveal={{ delay: Math.min(i * 60, 300) }}
			>
				<div class="relative bg-brand-50">
					<a href={productPath(lang, item.product.slug)} tabindex="-1" aria-hidden="true" class="block">
						<div class="relative aspect-[4/5] overflow-hidden">
							<Picture
								base={item.product.image}
								alt={localize(item.product.imageAlt, lang)}
								width={1408}
								height={1760}
								loading="lazy"
								decoding="async"
								sizes="(max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 320px"
								class="h-full w-full object-cover"
							/>
						</div>
					</a>
					<span
						class="absolute left-2 top-2 rounded-full bg-brand-700 px-2.5 py-1 text-xs font-bold text-white sm:left-3 sm:top-3"
					>
						{localize(item.conditionLabel, lang)}
					</span>
				</div>
				<div class="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-4">
					<h2 class="line-clamp-2 text-sm font-semibold leading-snug text-ink sm:text-base">
						<a
							href={productPath(lang, item.product.slug)}
							class="hover:text-brand-800 dark:hover:text-brand-200"
						>
							{localize(item.product.name, lang)}
						</a>
					</h2>
					<p class="flex items-center gap-1.5">
						<Stars
							rating={item.product.rating}
							label="{interpolate(t.productCard.ratingLabel, {
								rating: formatDecimal(item.product.rating, intlLocale)
							})} — {interpolate(t.productCard.reviewsLabel, {
								count: formatCount(item.product.reviewCount, intlLocale)
							})}"
						/>
						<span class="text-xs text-muted sm:text-sm" aria-hidden="true">
							({formatCount(item.product.reviewCount, intlLocale)})
						</span>
					</p>
					<p class="text-xs leading-relaxed text-muted sm:text-sm">
						{localize(item.conditionNote, lang)}
					</p>
					<p class="mt-auto flex flex-wrap items-baseline gap-2 pt-1">
						<span class="text-base font-bold text-ink sm:text-lg">
							{formatPrice(item.outletPrice, intlLocale)}
						</span>
						<s class="text-xs text-muted sm:text-sm">
							{formatPrice(item.product.price, intlLocale)}
						</s>
						<span
							class="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-surface-soft dark:text-brand-300"
						>
							<BadgePercent class="h-3.5 w-3.5" aria-hidden="true" />
							{interpolate(t.outletPage.saveLabel, {
								amount: formatPrice(outletSaving(item), intlLocale)
							})}
						</span>
					</p>
					<p class="text-xs text-muted">
						{t.outletPage.outletPriceLabel} · {t.outletPage.cataloguePriceLabel}:
						{formatPrice(item.product.price, intlLocale)}
					</p>
					<a
						href={productPath(lang, item.product.slug)}
						class="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800"
					>
						{t.outletPage.viewProduct}
						<ArrowRight class="h-4 w-4" aria-hidden="true" />
					</a>
				</div>
			</article>
		{/each}
	</div>

	<section aria-labelledby="outlet-conditions-heading" class="mt-12" use:reveal>
		<h2 id="outlet-conditions-heading" class="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
			{t.outletPage.whatIsTitle}
		</h2>
		<div class="mt-6 grid gap-5 sm:grid-cols-3">
			{#each outletConditions as condition (condition)}
				<div class="rounded-3xl bg-brand-50 p-5 dark:bg-surface-soft">
					<h3 class="font-semibold text-ink">{conditionLabel(condition)}</h3>
					<p class="mt-1 text-sm leading-relaxed text-muted">{conditionExplainer(condition)}</p>
				</div>
			{/each}
		</div>
	</section>
</div>
