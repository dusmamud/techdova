<script lang="ts">
	import { ArrowLeft, Check, Clock, MapPin, Navigation, Package, Phone } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { SITE_URL } from '#lib/config';
	import { interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const store = $derived(data.store);
	const storeName = $derived(localize(store.name, lang));

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
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: storeName,
				item: `${SITE_URL}/${lang}/stores/${store.slug}`
			}
		]
	});

	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/stores/${store.slug}`,
		url: `${SITE_URL}/${lang}/stores/${store.slug}`,
		name: storeName,
		description: interpolate(t.meta.storeDescription, { store: storeName }),
		inLanguage: lang
	});

	function directionsUrl(address: string): string {
		return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
	}
</script>

<Seo
	{lang}
	title={interpolate(t.meta.storeTitle, { store: storeName })}
	description={interpolate(t.meta.storeDescription, { store: storeName })}
	path="/stores/{store.slug}"
/>
<JsonLd json={breadcrumbJsonLd} />
<JsonLd json={webPageJsonLd} />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.storesPage.title, href: localizedPath(lang, '/stores') },
				{ label: storeName }
			]}
		/>
		<p class="mt-2 text-sm font-medium text-brand-700 dark:text-brand-300">
			{localize(store.city, lang)}
		</p>
		<h1 class="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{storeName}</h1>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
			{t.storePage.demoNote}
		</p>
	</div>

	<div class="mt-8 rounded-3xl bg-surface p-5 ring-1 ring-line sm:p-6" use:reveal>
		<ul class="space-y-4 text-sm text-muted">
			<li class="flex items-start gap-3">
				<MapPin class="mt-0.5 h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
				<span>
					<span class="sr-only">{t.storePage.addressLabel}: </span>
					{localize(store.address, lang)}
				</span>
			</li>
			<li class="flex items-start gap-3">
				<Clock class="mt-0.5 h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
				<span>
					<span class="sr-only">{t.storePage.hoursLabel}: </span>
					{localize(store.hours, lang)}
				</span>
			</li>
			<li class="flex items-start gap-3">
				<Phone class="mt-0.5 h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
				<span>
					<span class="sr-only">{t.storePage.phoneLabel}: </span>
					{store.phone}
				</span>
			</li>
		</ul>
		<a
			href={directionsUrl(localize(store.address, lang))}
			target="_blank"
			rel="noopener"
			aria-label={interpolate(t.storePage.directionsLabel, { name: storeName })}
			class="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
		>
			<Navigation class="h-4 w-4" aria-hidden="true" />
			{t.storePage.directions}
		</a>
	</div>

	<section aria-labelledby="store-services-heading" class="mt-10" use:reveal>
		<h2 id="store-services-heading" class="text-2xl font-bold tracking-tight text-ink">
			{t.storePage.servicesHeading}
		</h2>
		<ul class="mt-4 space-y-3">
			{#each store.services as service (localize(service, lang))}
				<li class="flex items-start gap-3 text-sm leading-relaxed text-muted">
					<Check class="mt-0.5 h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
					<span>{localize(service, lang)}</span>
				</li>
			{/each}
		</ul>
	</section>

	<section
		aria-labelledby="store-pickup-heading"
		class="mt-10 rounded-3xl bg-brand-50 p-5 dark:bg-surface-soft sm:p-6"
		use:reveal
	>
		<h2 id="store-pickup-heading" class="flex items-center gap-2 text-lg font-bold text-ink">
			<Package class="h-5 w-5 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			{t.storePage.pickupTitle}
		</h2>
		<p class="mt-2 text-sm leading-relaxed text-muted">{t.storePage.pickupText}</p>
		<a
			href={localizedPath(lang, '/shop')}
			class="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
		>
			{t.storesPage.shopOnline}
		</a>
	</section>

	<div class="mt-8" use:reveal>
		<a
			href={localizedPath(lang, '/stores')}
			class="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700 dark:text-brand-300 hover:text-brand-800 dark:hover:text-brand-200"
		>
			<ArrowLeft class="h-4 w-4" aria-hidden="true" />
			{t.storePage.backToStores}
		</a>
	</div>
</div>
