<script lang="ts">
	import { Clock, MapPin, Navigation, Phone, Store } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { SITE_URL } from '#lib/config';
	import { getStoreCities, stores } from '#lib/data/stores';
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
				name: t.storesPage.title,
				item: `${SITE_URL}/${lang}/stores`
			}
		]
	});

	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/stores`,
		url: `${SITE_URL}/${lang}/stores`,
		name: t.storesPage.title,
		description: t.meta.storesDescription,
		inLanguage: lang
	});
	const cities = getStoreCities();

	// Client-side city filter only — no query params, so prerendering is
	// unaffected and the full list is in the prerendered HTML.
	let selectedCity = $state<string | null>(null);

	const visibleStores = $derived(
		selectedCity ? stores.filter((store) => store.citySlug === selectedCity) : stores
	);

	const countText = $derived(
		visibleStores.length === 1
			? t.storesPage.resultOne
			: interpolate(t.storesPage.results, { count: visibleStores.length })
	);

	function directionsUrl(address: string): string {
		return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
	}
</script>

<Seo {lang} title={t.meta.storesTitle} description={t.meta.storesDescription} path="/stores" />
<JsonLd json={breadcrumbJsonLd} />
<JsonLd json={webPageJsonLd} />

<div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.storesPage.title }
			]}
		/>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			{t.storesPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.storesPage.description}</p>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
			{t.storesPage.demoNote}
		</p>
	</div>

	<div class="mt-8" use:reveal>
		<div
			class="flex flex-wrap gap-2"
			role="group"
			aria-label={t.storesPage.filterLabel}
		>
			<button
				type="button"
				aria-pressed={selectedCity === null}
				onclick={() => {
					selectedCity = null;
				}}
				class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft aria-pressed:bg-brand-700 aria-pressed:text-white aria-pressed:ring-brand-700"
			>
				{t.storesPage.allCities}
			</button>
			{#each cities as city (city.slug)}
				<button
					type="button"
					aria-pressed={selectedCity === city.slug}
					onclick={() => {
						selectedCity = city.slug;
					}}
					class="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-medium ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft aria-pressed:bg-brand-700 aria-pressed:text-white aria-pressed:ring-brand-700"
				>
					{localize(city.name, lang)}
				</button>
			{/each}
		</div>
		<p role="status" aria-live="polite" class="mt-4 text-sm font-medium text-muted">
			{countText}
		</p>
	</div>

	{#if visibleStores.length === 0}
		<div
			class="mt-6 flex flex-col items-center gap-3 rounded-3xl bg-brand-50 px-6 py-14 text-center dark:bg-surface-soft"
			use:reveal
		>
			<Store class="h-10 w-10 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			<h2 class="text-xl font-bold text-ink">{t.storesPage.noResults}</h2>
			<a
				href={localizedPath(lang, '/shop')}
				class="mt-2 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.storesPage.shopOnline}
			</a>
		</div>
	{:else}
		<ul class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each visibleStores as store, i (store.id)}
				<li
					class="flex flex-col rounded-3xl bg-surface p-5 ring-1 ring-line"
					use:reveal={{ delay: Math.min(i * 60, 300) }}
				>
					<h2 class="text-lg font-bold text-ink">{localize(store.name, lang)}</h2>
					<p class="mt-1 text-sm font-medium text-brand-700 dark:text-brand-300">{localize(store.city, lang)}</p>
					<ul class="mt-4 space-y-3 text-sm text-muted">
						<li class="flex items-start gap-3">
							<MapPin class="mt-0.5 h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
							<span>{localize(store.address, lang)}</span>
						</li>
						<li class="flex items-start gap-3">
							<Clock class="mt-0.5 h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
							<span>
								<span class="sr-only">{t.storesPage.hoursLabel}: </span>
								{localize(store.hours, lang)}
							</span>
						</li>
						<li class="flex items-start gap-3">
							<Phone class="mt-0.5 h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
							<span>
								<span class="sr-only">{t.storesPage.phoneLabel}: </span>
								{store.phone}
							</span>
						</li>
					</ul>
					<a
						href={directionsUrl(localize(store.address, lang))}
						target="_blank"
						rel="noopener"
						aria-label={interpolate(t.storesPage.directionsLabel, {
							name: localize(store.name, lang)
						})}
						class="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
					>
						<Navigation class="h-4 w-4" aria-hidden="true" />
						{t.storesPage.directions}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>
