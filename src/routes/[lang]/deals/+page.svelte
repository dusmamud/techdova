<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import CountdownTimer from '#lib/components/CountdownTimer.svelte';
	import Picture from '#lib/components/Picture.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { DEAL_END_ISO } from '#lib/data/deal';
	import { getDiscountedProducts } from '#lib/data/products';
	import { interpolate } from '#lib/format';
	import { getDictionary } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const deals = getDiscountedProducts();

	const countText = $derived(
		deals.length === 1
			? t.dealsPage.resultOne
			: interpolate(t.dealsPage.results, { count: deals.length })
	);
</script>

<Seo {lang} title={t.meta.dealsTitle} description={t.meta.dealsDescription} path="/deals" />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{t.dealsPage.title}</h1>
	<p class="mt-2 max-w-2xl leading-relaxed text-neutral-600">{t.dealsPage.description}</p>

	<div class="mt-6">
		<p class="text-sm font-semibold text-neutral-900">{t.dealsPage.endsIn}</p>
		<div class="mt-2">
			<CountdownTimer targetIso={DEAL_END_ISO} labels={t.countdown} />
		</div>
	</div>

	{#if deals.length === 0}
		<div class="mt-8 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center">
			<h2 class="text-xl font-bold text-neutral-900">{t.dealsPage.empty}</h2>
			<p class="max-w-sm text-neutral-600">{t.dealsPage.emptyHint}</p>
			<a
				href={localizedPath(lang, '/shop')}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.dealsPage.browseShop}
			</a>
		</div>
	{:else}
		<p role="status" aria-live="polite" class="mt-8 text-sm font-medium text-neutral-600">
			{countText}
		</p>
		<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each deals as product (product.slug)}
				<ProductCard {product} {lang} {t} />
			{/each}
		</div>
	{/if}

	<section
		aria-labelledby="deals-promo-heading"
		class="mt-12 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-100 via-brand-50 to-white ring-1 ring-brand-100"
	>
		<div class="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10">
			<div>
				<p class="text-xs font-bold uppercase tracking-widest text-brand-700">{t.promo.eyebrow}</p>
				<h2
					id="deals-promo-heading"
					class="mt-3 text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl"
				>
					{t.promo.titleA}
					<span class="block text-xl font-semibold text-neutral-700 sm:text-2xl">{t.promo.titleB}</span>
				</h2>
				<p class="mt-3 max-w-md leading-relaxed text-neutral-600">{t.promo.subtitle}</p>
				<a
					href={localizedPath(lang, '/shop')}
					class="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
				>
					{t.promo.cta}
					<ArrowRight class="h-4 w-4" aria-hidden="true" />
				</a>
			</div>
			<div class="relative min-h-[220px] overflow-hidden rounded-3xl sm:min-h-[280px]">
				<Picture
					base="/images/promo-devices"
					alt={t.promo.imageAlt}
					width={2048}
					height={1152}
					loading="lazy"
					decoding="async"
					class="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
		</div>
	</section>
</div>
