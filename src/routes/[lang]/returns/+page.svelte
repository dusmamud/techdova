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

<Seo {lang} title={t.meta.returnsTitle} description={t.meta.returnsDescription} path="/returns" />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
	<Breadcrumbs
		label={t.product.breadcrumbLabel}
		items={[
			{ label: t.nav.home, href: localizedPath(lang, '/') },
			{ label: t.returns.title }
		]}
	/>
	<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl" use:reveal>{t.returns.title}</h1>
	<p class="mt-2 text-sm text-neutral-500">{t.returns.updated}</p>
	<div class="mt-6 space-y-6">
		{#each t.returns.sections as section, i (section.heading)}
			<section use:reveal={{ delay: Math.min(i * 60, 300) }}>
				<h2 class="text-lg font-bold text-neutral-900">{section.heading}</h2>
				<p class="mt-1 leading-relaxed text-neutral-600">{section.body}</p>
			</section>
		{/each}
		<section use:reveal>
			<h2 class="text-lg font-bold text-neutral-900">{t.returns.stepsHeading}</h2>
			<ol class="mt-1 list-decimal space-y-1 pl-5 leading-relaxed text-neutral-600">
				{#each t.returns.steps as step (step)}
					<li>{step}</li>
				{/each}
			</ol>
			<a
				href={localizedPath(lang, '/contact')}
				class="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
			>
				{t.returns.contactLink}
			</a>
		</section>
	</div>
</div>
