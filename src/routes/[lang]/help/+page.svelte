<script lang="ts">
	import { ArrowRight, CircleHelp, CreditCard, MessageCircle, Package, Truck, Undo2 } from '@lucide/svelte';
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
				name: t.helpPage.title,
				item: `${SITE_URL}/${lang}/help`
			}
		]
	});

	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/help`,
		url: `${SITE_URL}/${lang}/help`,
		name: t.helpPage.title,
		description: t.meta.helpDescription,
		inLanguage: lang
	});

	const topicPaths = ['/faq', '/shipping', '/returns', '/payment', '/track-order', '/contact'];
	const topicIcons = [CircleHelp, Truck, Undo2, CreditCard, Package, MessageCircle];

	const topics = $derived(
		t.helpPage.topics.map((topic, i) => ({
			...topic,
			path: topicPaths[i] ?? '/faq',
			icon: topicIcons[i] ?? CircleHelp
		}))
	);
</script>

<Seo {lang} title={t.meta.helpTitle} description={t.meta.helpDescription} path="/help" />
<JsonLd json={breadcrumbJsonLd} />
<JsonLd json={webPageJsonLd} />

<div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.helpPage.title }
			]}
		/>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			{t.helpPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.helpPage.description}</p>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
			{t.helpPage.demoNote}
		</p>
	</div>

	<section aria-labelledby="help-topics-heading" class="mt-8" use:reveal>
		<h2 id="help-topics-heading" class="text-xl font-bold text-ink">
			{t.helpPage.topicsTitle}
		</h2>
		<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each topics as topic, i (topic.path)}
				{@const Icon = topic.icon}
				<a
					href={localizedPath(lang, topic.path)}
					class="group flex flex-col rounded-3xl bg-surface p-5 ring-1 ring-line hover:shadow-lg"
					use:reveal={{ delay: Math.min(i * 60, 300) }}
				>
					<span class="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-700">
						<Icon class="h-5 w-5" aria-hidden="true" />
					</span>
					<h3 class="mt-3 font-semibold text-ink group-hover:text-brand-800 dark:group-hover:text-brand-200 dark:hover:text-brand-200">
						{topic.title}
					</h3>
					<p class="mt-1 flex-1 text-sm leading-relaxed text-muted">
						{topic.description}
					</p>
					<span
						class="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 dark:text-brand-300"
					>
						{t.helpPage.topicLink}
						<ArrowRight class="h-4 w-4" aria-hidden="true" />
					</span>
				</a>
			{/each}
		</div>
	</section>

	<section aria-labelledby="help-popular-heading" class="mt-10" use:reveal>
		<h2 id="help-popular-heading" class="text-xl font-bold text-ink">
			{t.helpPage.popularTitle}
		</h2>
		<p class="mt-1 leading-relaxed text-muted">{t.helpPage.popularIntro}</p>
		<div class="mt-4 space-y-3">
			{#each t.helpPage.popular as item, i (item.question)}
				<article
					class="rounded-3xl bg-surface p-5 ring-1 ring-line"
					use:reveal={{ delay: Math.min(i * 60, 300) }}
				>
					<h3 class="font-semibold text-ink">
						<a
							href={localizedPath(lang, '/faq')}
							class="hover:text-brand-800 dark:hover:text-brand-200"
						>
							{item.question}
						</a>
					</h3>
					<p class="mt-1 text-sm leading-relaxed text-muted">{item.answer}</p>
				</article>
			{/each}
		</div>
		<a
			href={localizedPath(lang, '/faq')}
			class="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
		>
			{t.helpPage.faqLink}
			<ArrowRight class="h-4 w-4" aria-hidden="true" />
		</a>
	</section>

	<section
		aria-labelledby="help-contact-heading"
		class="mt-10 rounded-3xl bg-brand-50 p-6 text-center sm:p-8 dark:bg-surface-soft"
		use:reveal
	>
		<h2 id="help-contact-heading" class="text-xl font-bold text-ink">
			{t.helpPage.contactTitle}
		</h2>
		<p class="mx-auto mt-1 max-w-md text-sm leading-relaxed text-muted">
			{t.helpPage.contactText}
		</p>
		<a
			href={localizedPath(lang, '/contact')}
			class="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
		>
			<MessageCircle class="h-4 w-4" aria-hidden="true" />
			{t.helpPage.contactLink}
		</a>
	</section>
</div>
