<script lang="ts">
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { SITE_URL } from '#lib/config';
	import { getDictionary } from '#lib/i18n/index';
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
				name: t.nav.home,
				item: `${SITE_URL}/${lang}`
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: t.payment.title,
				item: `${SITE_URL}/${lang}/payment`
			}
		]
	});

	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/payment`,
		url: `${SITE_URL}/${lang}/payment`,
		name: t.payment.title,
		description: t.meta.paymentDescription,
		inLanguage: lang
	});
</script>

<Seo {lang} title={t.meta.paymentTitle} description={t.meta.paymentDescription} path="/payment" />
<JsonLd json={breadcrumbJsonLd} />
<JsonLd json={webPageJsonLd} />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
	<Breadcrumbs
		label={t.product.breadcrumbLabel}
		items={[
			{ label: t.nav.home, href: localizedPath(lang, '/') },
			{ label: t.payment.title }
		]}
	/>
	<h1 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl" use:reveal>{t.payment.title}</h1>
	<p class="mt-2 text-sm text-muted">{t.payment.updated}</p>
	<p role="note" class="mt-6 rounded-2xl bg-brand-50 px-4 py-3 text-sm leading-relaxed text-brand-900 dark:bg-surface-soft dark:text-brand-200" use:reveal>
		{t.payment.demoNote}
	</p>
	<div class="mt-6 space-y-6">
		{#each t.payment.sections as section, i (section.heading)}
			<section use:reveal={{ delay: Math.min(i * 60, 300) }}>
				<h2 class="text-lg font-bold text-ink">{section.heading}</h2>
				<p class="mt-1 leading-relaxed text-muted">{section.body}</p>
			</section>
		{/each}
	</div>
</div>
