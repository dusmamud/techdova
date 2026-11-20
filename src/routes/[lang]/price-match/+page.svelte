<script lang="ts">
	import { BadgeCheck, Mail } from '@lucide/svelte';
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
				name: t.priceMatchPage.title,
				item: `${SITE_URL}/${lang}/price-match`
			}
		]
	});

	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/price-match`,
		url: `${SITE_URL}/${lang}/price-match`,
		name: t.priceMatchPage.title,
		description: t.meta.priceMatchDescription,
		inLanguage: lang
	});
</script>

<Seo {lang} title={t.meta.priceMatchTitle} description={t.meta.priceMatchDescription} path="/price-match" />
<JsonLd json={breadcrumbJsonLd} />
<JsonLd json={webPageJsonLd} />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.priceMatchPage.title }
			]}
		/>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			{t.priceMatchPage.title}
		</h1>
		<p class="mt-2 leading-relaxed text-muted">{t.priceMatchPage.description}</p>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm leading-relaxed text-muted dark:bg-surface-soft">
			{t.priceMatchPage.intro}
		</p>
	</div>

	<section aria-labelledby="price-match-how-heading" class="mt-10" use:reveal>
		<h2 id="price-match-how-heading" class="text-2xl font-bold tracking-tight text-ink">
			{t.priceMatchPage.howTitle}
		</h2>
		<ol class="mt-6 space-y-5">
			{#each t.priceMatchPage.steps as step, i (step.title)}
				<li class="flex gap-4" use:reveal={{ delay: Math.min(i * 60, 300) }}>
					<span
						class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white"
						aria-hidden="true"
					>
						{i + 1}
					</span>
					<div>
						<h3 class="font-semibold text-ink">{step.title}</h3>
						<p class="mt-1 text-sm leading-relaxed text-muted">{step.text}</p>
					</div>
				</li>
			{/each}
		</ol>
	</section>

	<section aria-labelledby="price-match-terms-heading" class="mt-10" use:reveal>
		<h2 id="price-match-terms-heading" class="text-2xl font-bold tracking-tight text-ink">
			{t.priceMatchPage.termsTitle}
		</h2>
		<ul class="mt-4 space-y-3">
			{#each t.priceMatchPage.terms as term (term)}
				<li class="flex items-start gap-3 text-sm leading-relaxed text-muted">
					<BadgeCheck class="mt-0.5 h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
					<span>{term}</span>
				</li>
			{/each}
		</ul>
		<p class="mt-6 text-sm leading-relaxed text-muted">{t.priceMatchPage.note}</p>
		<a
			href={localizedPath(lang, '/contact')}
			class="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
		>
			<Mail class="h-4 w-4" aria-hidden="true" />
			{t.nav.contact}
		</a>
	</section>
</div>
