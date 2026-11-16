<script lang="ts">
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { getDictionary } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
</script>

<Seo {lang} title={t.meta.paymentTitle} description={t.meta.paymentDescription} path="/payment" />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
	<Breadcrumbs
		label={t.product.breadcrumbLabel}
		items={[
			{ label: t.nav.home, href: localizedPath(lang, '/') },
			{ label: t.payment.title }
		]}
	/>
	<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl" use:reveal>{t.payment.title}</h1>
	<p class="mt-2 text-sm text-neutral-500">{t.payment.updated}</p>
	<p role="note" class="mt-6 rounded-2xl bg-brand-50 px-4 py-3 text-sm leading-relaxed text-brand-900" use:reveal>
		{t.payment.demoNote}
	</p>
	<div class="mt-6 space-y-6">
		{#each t.payment.sections as section, i (section.heading)}
			<section use:reveal={{ delay: Math.min(i * 60, 300) }}>
				<h2 class="text-lg font-bold text-neutral-900">{section.heading}</h2>
				<p class="mt-1 leading-relaxed text-neutral-600">{section.body}</p>
			</section>
		{/each}
	</div>
</div>
