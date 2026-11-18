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
				name: t.shipping.title,
				item: `${SITE_URL}/${lang}/shipping`
			}
		]
	});

	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/shipping`,
		url: `${SITE_URL}/${lang}/shipping`,
		name: t.shipping.title,
		description: t.meta.shippingDescription,
		inLanguage: lang
	});
</script>

<Seo {lang} title={t.meta.shippingTitle} description={t.meta.shippingDescription} path="/shipping" />
<JsonLd json={breadcrumbJsonLd} />
<JsonLd json={webPageJsonLd} />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
	<Breadcrumbs
		label={t.product.breadcrumbLabel}
		items={[
			{ label: t.nav.home, href: localizedPath(lang, '/') },
			{ label: t.shipping.title }
		]}
	/>
	<h1 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl" use:reveal>{t.shipping.title}</h1>
	<p class="mt-2 text-sm text-muted">{t.shipping.updated}</p>
	<div class="mt-6 space-y-6">
		{#each t.shipping.sections as section, i (section.heading)}
			<section use:reveal={{ delay: Math.min(i * 60, 300) }}>
				<h2 class="text-lg font-bold text-ink">{section.heading}</h2>
				<p class="mt-1 leading-relaxed text-muted">{section.body}</p>
				{#if i === 1}
					<ul class="mt-3 list-disc space-y-1 pl-5 leading-relaxed text-muted">
						{#each t.shipping.regions as region (region)}
							<li>{region}</li>
						{/each}
					</ul>
				{/if}
				{#if i === 2}
					<a
						href={localizedPath(lang, '/track-order')}
						class="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-700 dark:text-brand-300 underline underline-offset-2 hover:text-brand-800 dark:hover:text-brand-200"
					>
						{t.shipping.trackOrderLink}
					</a>
				{/if}
			</section>
		{/each}
	</div>
</div>
