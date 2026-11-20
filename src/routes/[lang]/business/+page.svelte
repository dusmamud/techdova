<script lang="ts">
	import { ArrowRight, Briefcase, Check } from '@lucide/svelte';
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
				name: t.product.breadcrumbHome,
				item: `${SITE_URL}/${lang}`
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: t.businessPage.title,
				item: `${SITE_URL}/${lang}/business`
			}
		]
	});

	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/business`,
		url: `${SITE_URL}/${lang}/business`,
		name: t.businessPage.title,
		description: t.meta.businessDescription,
		inLanguage: lang
	});
</script>

<Seo {lang} title={t.meta.businessTitle} description={t.meta.businessDescription} path="/business" />
<JsonLd json={breadcrumbJsonLd} />
<JsonLd json={webPageJsonLd} />

<div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.businessPage.title }
			]}
		/>
		<div class="mt-2 flex items-center gap-3">
			<span class="grid h-12 w-12 place-items-center rounded-2xl bg-brand-700 text-white">
				<Briefcase class="h-6 w-6" aria-hidden="true" />
			</span>
			<h1 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t.businessPage.title}</h1>
		</div>
		<p class="mt-3 max-w-2xl leading-relaxed text-muted">{t.businessPage.description}</p>
		<p class="mt-4 max-w-2xl rounded-2xl bg-brand-50 p-4 text-sm leading-relaxed text-muted dark:bg-surface-soft">
			{t.businessPage.intro}
		</p>
	</div>

	<section aria-labelledby="business-benefits-heading" class="mt-10" use:reveal>
		<h2 id="business-benefits-heading" class="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
			{t.businessPage.benefitsTitle}
		</h2>
		<div class="mt-6 grid gap-5 sm:grid-cols-2">
			{#each t.businessPage.benefits as benefit, i (benefit.title)}
				<div
					class="rounded-3xl bg-surface p-5 ring-1 ring-line"
					use:reveal={{ delay: Math.min(i * 60, 300) }}
				>
					<Check class="h-6 w-6 text-brand-700 dark:text-brand-300" aria-hidden="true" />
					<h3 class="mt-3 font-semibold text-ink">{benefit.title}</h3>
					<p class="mt-1 text-sm leading-relaxed text-muted">{benefit.text}</p>
				</div>
			{/each}
		</div>
	</section>

	<section aria-labelledby="business-tiers-heading" class="mt-10" use:reveal>
		<h2 id="business-tiers-heading" class="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
			{t.businessPage.tiersTitle}
		</h2>
		<ul class="mt-4 space-y-3">
			{#each t.businessPage.tiers as tier (tier)}
				<li class="flex items-start gap-3 rounded-2xl bg-brand-50 p-4 text-sm leading-relaxed text-muted dark:bg-surface-soft">
					<Check class="mt-0.5 h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
					<span>{tier}</span>
				</li>
			{/each}
		</ul>
	</section>

	<section
		aria-labelledby="business-contact-heading"
		class="mt-10 overflow-hidden rounded-[2rem] bg-brand-800 px-6 py-10 text-center sm:px-10"
		use:reveal
	>
		<h2 id="business-contact-heading" class="text-2xl font-bold tracking-tight text-white sm:text-3xl">
			{t.businessPage.contactTitle}
		</h2>
		<p class="mx-auto mt-2 max-w-md text-brand-100">{t.businessPage.contactText}</p>
		<a
			href={localizedPath(lang, '/contact')}
			class="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-brand-800 hover:bg-brand-50"
		>
			{t.businessPage.contactButton}
			<ArrowRight class="h-4 w-4" aria-hidden="true" />
		</a>
		<p class="mx-auto mt-4 max-w-md text-sm text-brand-100/80">{t.businessPage.note}</p>
	</section>
</div>
