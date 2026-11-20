<script lang="ts">
	import { ArrowRight, BadgeCheck, GraduationCap } from '@lucide/svelte';
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
				name: t.studentPage.title,
				item: `${SITE_URL}/${lang}/student`
			}
		]
	});

	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/student`,
		url: `${SITE_URL}/${lang}/student`,
		name: t.studentPage.title,
		description: t.meta.studentDescription,
		inLanguage: lang
	});
</script>

<Seo {lang} title={t.meta.studentTitle} description={t.meta.studentDescription} path="/student" />
<JsonLd json={breadcrumbJsonLd} />
<JsonLd json={webPageJsonLd} />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.studentPage.title }
			]}
		/>
		<div class="mt-2 flex items-center gap-3">
			<span class="grid h-12 w-12 place-items-center rounded-2xl bg-brand-700 text-white">
				<GraduationCap class="h-6 w-6" aria-hidden="true" />
			</span>
			<h1 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t.studentPage.title}</h1>
		</div>
		<p class="mt-3 leading-relaxed text-muted">{t.studentPage.description}</p>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm leading-relaxed text-muted dark:bg-surface-soft">
			{t.studentPage.intro}
		</p>
		<p class="mt-4 inline-flex rounded-full bg-brand-700 px-4 py-2 text-sm font-bold text-white">
			{t.studentPage.discountLabel}
		</p>
	</div>

	<section aria-labelledby="student-eligibility-heading" class="mt-10" use:reveal>
		<h2 id="student-eligibility-heading" class="text-2xl font-bold tracking-tight text-ink">
			{t.studentPage.eligibilityTitle}
		</h2>
		<ul class="mt-4 space-y-3">
			{#each t.studentPage.eligibility as item (item)}
				<li class="flex items-start gap-3 text-sm leading-relaxed text-muted">
					<BadgeCheck class="mt-0.5 h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
					<span>{item}</span>
				</li>
			{/each}
		</ul>
	</section>

	<section aria-labelledby="student-how-heading" class="mt-10" use:reveal>
		<h2 id="student-how-heading" class="text-2xl font-bold tracking-tight text-ink">
			{t.studentPage.howTitle}
		</h2>
		<ol class="mt-6 space-y-5">
			{#each t.studentPage.steps as step, i (step.title)}
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
		<p class="mt-6 text-sm leading-relaxed text-muted">{t.studentPage.note}</p>
		<a
			href={localizedPath(lang, '/shop')}
			class="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
		>
			{t.studentPage.shopButton}
			<ArrowRight class="h-4 w-4" aria-hidden="true" />
		</a>
	</section>
</div>
