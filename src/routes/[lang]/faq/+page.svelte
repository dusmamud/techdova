<script lang="ts">
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import FaqAccordion from '#lib/components/FaqAccordion.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { getDictionary } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: t.faq.items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: { '@type': 'Answer', text: item.answer }
		}))
	});
</script>

<Seo {lang} title={t.meta.faqTitle} description={t.meta.faqDescription} path="/faq" />
<JsonLd json={structuredData} />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
	<Breadcrumbs
		label={t.product.breadcrumbLabel}
		items={[
			{ label: t.nav.home, href: localizedPath(lang, '/') },
			{ label: t.faq.title }
		]}
	/>
	<h1 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl" use:reveal>{t.faq.title}</h1>
	<p class="mt-2 leading-relaxed text-muted">{t.faq.intro}</p>
	<div class="mt-6" use:reveal>
		<FaqAccordion items={t.faq.items} />
	</div>
	<p class="mt-8 leading-relaxed text-muted" use:reveal>
		{t.faq.contactPrompt}{' '}
		<a
			href={localizedPath(lang, '/contact')}
			class="inline-flex min-h-11 items-center font-semibold text-brand-700 dark:text-brand-300 underline underline-offset-2 hover:text-brand-800 dark:hover:text-brand-200"
		>
			{t.faq.contactLink}
		</a>
	</p>
</div>
