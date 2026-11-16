<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import { getDictionary } from '#lib/i18n/index';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
</script>

<Seo {lang} title={t.meta.paymentTitle} description={t.meta.paymentDescription} path="/payment" />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
	<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{t.payment.title}</h1>
	<p class="mt-2 text-sm text-neutral-500">{t.payment.updated}</p>
	<p role="note" class="mt-6 rounded-2xl bg-brand-50 px-4 py-3 text-sm leading-relaxed text-brand-900">
		{t.payment.demoNote}
	</p>
	<div class="mt-6 space-y-6">
		{#each t.payment.sections as section (section.heading)}
			<section>
				<h2 class="text-lg font-bold text-neutral-900">{section.heading}</h2>
				<p class="mt-1 leading-relaxed text-neutral-600">{section.body}</p>
			</section>
		{/each}
	</div>
</div>
