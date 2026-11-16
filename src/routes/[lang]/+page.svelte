<script lang="ts">
	import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, Headphones, ShieldCheck, Truck } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import CountdownTimer from '#lib/components/CountdownTimer.svelte';
	import HeroCarousel from '#lib/components/HeroCarousel.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import NewsletterForm from '#lib/components/NewsletterForm.svelte';
	import Picture from '#lib/components/Picture.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import RecentlyViewed from '#lib/components/RecentlyViewed.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import TestimonialsSection from '#lib/components/TestimonialsSection.svelte';
	import { SITE_NAME, SITE_URL } from '#lib/config';
	import { categories } from '#lib/data/categories';
	import { DEAL_END_ISO } from '#lib/data/deal';
	import { getDiscountedProducts, getFeaturedProducts, getNewProducts } from '#lib/data/products';
	import { formatCount, formatDecimal, formatPrice, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath, productPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const featured = getFeaturedProducts();
	const newProducts = getNewProducts();
	const deal = getDiscountedProducts()[0];
	const intlLocale = $derived(t.meta.intlLocale);
	const dealRatingLabel = $derived(
		deal
			? `${interpolate(t.productCard.ratingLabel, { rating: formatDecimal(deal.rating, intlLocale) })} — ${interpolate(t.productCard.reviewsLabel, { count: formatCount(deal.reviewCount, intlLocale) })}`
			: ''
	);

	let scroller: HTMLDivElement | undefined = $state();
	const trustIcons = [BadgeCheck, Truck, ShieldCheck, Headphones];

	function scrollBestSellers(direction: 1 | -1): void {
		// Scroll exactly one viewport of cards so snap alignment stays clean
		// (two whole cards at sm/md; nothing to scroll once all four fit).
		if (scroller) scroller.scrollBy({ left: direction * scroller.clientWidth, behavior: 'smooth' });
	}

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'OnlineStore',
				name: SITE_NAME,
				url: SITE_URL,
				logo: `${SITE_URL}/favicon.svg`,
				slogan: t.footer.tagline
			},
			{
				'@type': 'WebSite',
				name: SITE_NAME,
				url: `${SITE_URL}/${lang}`,
				inLanguage: lang,
				potentialAction: {
					'@type': 'SearchAction',
					target: `${SITE_URL}/${lang}/search?q={query}`,
					'query-input': 'required name=query'
				}
			}
		]
	});
</script>

<Seo {lang} title={t.meta.homeTitle} description={t.meta.homeDescription} path="/" />
<JsonLd json={structuredData} />

<div class="mx-auto max-w-7xl space-y-10 px-4 py-6 sm:space-y-12 sm:px-6 lg:space-y-16 lg:px-8 lg:py-8">
	<HeroCarousel {lang} {t} />

	<section aria-labelledby="categories-heading" use:reveal>
		<p class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-700">
			<span class="h-px w-6 bg-brand-700" aria-hidden="true"></span>
			{t.categoriesSection.eyebrow}
		</p>
		<div class="mt-2 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
			<h2 id="categories-heading" class="text-[1.375rem] font-bold tracking-tight text-neutral-900 sm:text-2xl lg:text-3xl">
				{t.categoriesSection.heading}
			</h2>
			<a
				href={localizedPath(lang, '/shop')}
				class="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
			>
				{t.categoriesSection.viewAll}
				<ArrowRight class="h-4 w-4" aria-hidden="true" />
			</a>
		</div>
		<div class="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
			{#each categories as category (category.slug)}
				<a href={localizedPath(lang, `/category/${category.slug}`)} class="group block text-center">
					<span class="block aspect-square overflow-hidden rounded-3xl bg-brand-50">
						<Picture
							base={category.image}
							alt={localize(category.imageAlt, lang)}
							width={1600}
							height={1600}
							loading="lazy"
							decoding="async"
							class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					</span>
					<span class="mt-3 block text-sm font-medium text-neutral-800 group-hover:text-brand-800">
						{localize(category.name, lang)}
					</span>
				</a>
			{/each}
		</div>
	</section>

	<section aria-labelledby="best-sellers-heading" use:reveal>
		<p class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-700">
			<span class="h-px w-6 bg-brand-700" aria-hidden="true"></span>
			{t.bestSellers.eyebrow}
		</p>
		<div class="mt-2 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
			<h2 id="best-sellers-heading" class="text-[1.375rem] font-bold tracking-tight text-neutral-900 sm:text-2xl lg:text-3xl">
				{t.bestSellers.heading}
			</h2>
			<div class="flex shrink-0 items-center gap-2">
				<a
					href={localizedPath(lang, '/shop')}
					class="hidden min-h-11 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800 sm:inline-flex"
				>
					{t.bestSellers.viewAll}
					<ArrowRight class="h-4 w-4" aria-hidden="true" />
				</a>
				<button
					type="button"
					onclick={() => scrollBestSellers(-1)}
					aria-label={t.bestSellers.previous}
					class="hidden h-11 w-11 place-items-center rounded-full text-neutral-700 ring-1 ring-neutral-300 hover:bg-brand-50 sm:grid lg:hidden"
				>
					<ChevronLeft class="h-5 w-5" aria-hidden="true" />
				</button>
				<button
					type="button"
					onclick={() => scrollBestSellers(1)}
					aria-label={t.bestSellers.next}
					class="hidden h-11 w-11 place-items-center rounded-full text-neutral-700 ring-1 ring-neutral-300 hover:bg-brand-50 sm:grid lg:hidden"
				>
					<ChevronRight class="h-5 w-5" aria-hidden="true" />
				</button>
			</div>
		</div>
		<div
			bind:this={scroller}
			class="contain-paint mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:flex sm:snap-x sm:snap-mandatory sm:gap-5 sm:overflow-x-auto sm:pb-2 sm:[-ms-overflow-style:none] sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden"
		>
			{#each featured as product, i (product.slug)}
				<div
					class="min-w-0 sm:w-auto sm:shrink-0 sm:basis-[calc((100%-1.25rem)/2)] sm:snap-start lg:basis-[calc((100%-3.75rem)/4)]"
					use:reveal={{ delay: Math.min(i * 60, 300) }}
				>
					<ProductCard {product} {lang} {t} />
				</div>
			{/each}
		</div>
	</section>

	<section aria-labelledby="new-arrivals-heading" use:reveal>
		<p class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-700">
			<span class="h-px w-6 bg-brand-700" aria-hidden="true"></span>
			{t.newArrivals.eyebrow}
		</p>
		<div class="mt-2 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
			<h2 id="new-arrivals-heading" class="text-[1.375rem] font-bold tracking-tight text-neutral-900 sm:text-2xl lg:text-3xl">
				{t.newArrivals.heading}
			</h2>
			<a
				href={localizedPath(lang, '/shop')}
				class="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
			>
				{t.newArrivals.viewAll}
				<ArrowRight class="h-4 w-4" aria-hidden="true" />
			</a>
		</div>
		<div class="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-5 lg:grid-cols-4">
			{#each newProducts as product (product.slug)}
				<ProductCard {product} {lang} {t} />
			{/each}
		</div>
	</section>

	{#if deal}
		<section
			aria-labelledby="deal-heading"
			class="overflow-hidden rounded-[2rem] bg-brand-50 ring-1 ring-brand-100"
			use:reveal
		>
			<div class="grid items-center gap-5 p-5 sm:gap-6 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10">
				<div>
					<p class="text-xs font-bold uppercase tracking-widest text-brand-700">
						{t.dealOfDay.eyebrow}
					</p>
					<h2
						id="deal-heading"
						class="mt-3 text-[1.625rem] font-bold leading-tight tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl"
					>
						{t.dealOfDay.heading}
					</h2>
					<p class="mt-4 text-sm font-semibold text-neutral-900">{t.dealOfDay.endsLabel}</p>
					<div class="mt-2">
						<CountdownTimer targetIso={DEAL_END_ISO} labels={t.countdown} />
					</div>
					<a
						href={localizedPath(lang, '/deals')}
						class="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
					>
						{t.dealOfDay.viewAll}
						<ArrowRight class="h-4 w-4" aria-hidden="true" />
					</a>
				</div>
				<a
					href={productPath(lang, deal.slug)}
					class="group flex items-center gap-3 rounded-3xl bg-white p-3 ring-1 ring-neutral-200 transition-shadow hover:shadow-lg sm:gap-5 sm:p-5"
				>
					<span class="block w-20 shrink-0 overflow-hidden rounded-2xl bg-brand-50 sm:w-28 lg:w-36">
						<span class="block aspect-[4/5]">
							<Picture
								base={deal.image}
								alt={localize(deal.imageAlt, lang)}
								width={1408}
								height={1760}
								loading="lazy"
								decoding="async"
								class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
							/>
						</span>
					</span>
					<span class="min-w-0">
						{#if deal.badge}
							<span
								class="inline-block rounded-full bg-brand-700 px-2.5 py-1 text-xs font-bold text-white"
							>
								{deal.badge}
							</span>
						{/if}
						<span class="mt-2 block truncate text-base font-bold text-neutral-900 group-hover:text-brand-800 sm:text-lg">
							{localize(deal.name, lang)}
						</span>
						<span class="mt-1 flex items-center gap-1.5">
							<Stars rating={deal.rating} label={dealRatingLabel} />
							<span class="text-sm text-neutral-500" aria-hidden="true">
								({formatCount(deal.reviewCount, intlLocale)})
							</span>
						</span>
						<span class="mt-2 flex flex-wrap items-baseline gap-2">
							<span class="text-xl font-bold text-neutral-900">
								{formatPrice(deal.price, intlLocale)}
							</span>
							{#if deal.oldPrice}
								<s class="text-sm text-neutral-500">
									{formatPrice(deal.oldPrice, intlLocale)}
								</s>
							{/if}
						</span>
					</span>
				</a>
			</div>
		</section>
	{/if}

	<section
		aria-labelledby="promo-heading"
		class="overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-100 via-brand-50 to-white ring-1 ring-brand-100"
		use:reveal
	>
		<div class="grid items-center gap-5 p-5 sm:gap-6 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10">
			<div>
				<p class="text-xs font-bold uppercase tracking-widest text-brand-700">{t.promo.eyebrow}</p>
				<h2
					id="promo-heading"
					class="mt-3 text-[1.625rem] font-bold leading-tight tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl"
				>
					{t.promo.titleA}
					<span class="block text-lg font-semibold text-neutral-700 sm:text-xl lg:text-2xl">{t.promo.titleB}</span>
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

	<TestimonialsSection {lang} {t} />

	<section aria-labelledby="brand-story-heading" use:reveal>
		<div class="grid items-center gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-10">
			<div class="overflow-hidden rounded-3xl">
				<Picture
					base="/images/hero-main"
					alt={t.brandStory.imageAlt}
					width={2048}
					height={1152}
					loading="lazy"
					decoding="async"
					class="aspect-[16/9] w-full object-cover"
				/>
			</div>
			<div>
				<p class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-700">
					<span class="h-px w-6 bg-brand-700" aria-hidden="true"></span>
					{t.brandStory.eyebrow}
				</p>
				<h2
					id="brand-story-heading"
					class="mt-2 text-[1.375rem] font-bold tracking-tight text-neutral-900 sm:text-2xl lg:text-3xl"
				>
					{t.brandStory.heading}
				</h2>
				<p class="mt-3 leading-relaxed text-neutral-600">{t.brandStory.text}</p>
				<a
					href={localizedPath(lang, '/about')}
					class="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
				>
					{t.brandStory.cta}
					<ArrowRight class="h-4 w-4" aria-hidden="true" />
				</a>
			</div>
		</div>
	</section>

	<RecentlyViewed {lang} {t} />

	<section
		aria-labelledby="newsletter-band-heading"
		class="overflow-hidden rounded-[2rem] bg-brand-800 px-5 py-8 sm:px-8 sm:py-10 lg:px-10"
		use:reveal
	>
		<div class="grid items-center gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-10">
			<div>
				<h2
					id="newsletter-band-heading"
					class="text-[1.375rem] font-bold tracking-tight text-white sm:text-2xl lg:text-3xl"
				>
					{t.newsletterBand.title}
				</h2>
				<p class="mt-2 leading-relaxed text-white/80">{t.newsletterBand.text}</p>
			</div>
			<NewsletterForm {t} idPrefix="newsletter-home" />
		</div>
	</section>

	<!-- Trust row: presentational grouping, not a landmark. -->
	<div use:reveal>
		<div class="grid grid-cols-2 gap-4 rounded-3xl bg-brand-50 px-5 py-5 sm:gap-6 sm:px-6 sm:py-6 lg:grid-cols-4">
			{#each t.trust.items as item, i (i)}
				{@const TrustIcon = trustIcons[i]}
				<div class="flex items-start gap-2.5 sm:gap-3">
					<TrustIcon class="mt-0.5 h-5 w-5 shrink-0 text-brand-700 sm:h-6 sm:w-6" aria-hidden="true" />
					<div>
						<p class="text-sm font-semibold text-neutral-900">{item.title}</p>
						<p class="text-xs text-neutral-600">{item.subtitle}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
