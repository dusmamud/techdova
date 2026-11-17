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

<Seo
	{lang}
	title={t.meta.accessibilityTitle}
	description={t.meta.accessibilityDescription}
	path="/accessibility"
/>

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
	<Breadcrumbs
		label={t.product.breadcrumbLabel}
		items={[
			{ label: t.nav.home, href: localizedPath(lang, '/') },
			{ label: t.accessibility.title }
		]}
	/>
	<h1 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl" use:reveal>
		{t.accessibility.title}
	</h1>
	<p class="mt-2 text-sm text-muted">{t.accessibility.updated}</p>
	<div class="mt-6 space-y-6">
		{#each t.accessibility.sections as section, i (section.heading)}
			<section use:reveal={{ delay: Math.min(i * 60, 300) }}>
				<h2 class="text-lg font-bold text-ink">{section.heading}</h2>
				<p class="mt-1 leading-relaxed text-muted">{section.body}</p>
				{#if i === 2}
					<a
						href={localizedPath(lang, '/contact')}
						class="mt-3 inline-flex min-h-11 items-center font-semibold text-brand-700 dark:text-brand-300 underline underline-offset-2 hover:text-brand-800 dark:hover:text-brand-200"
					>
						{t.accessibility.contactLink}
					</a>
				{/if}
			</section>
			{#if i === 0}
				<section use:reveal={{ delay: 60 }}>
					<h2 class="text-lg font-bold text-ink">{t.accessibility.featuresHeading}</h2>
					<ul class="mt-1 list-disc space-y-1 pl-5 leading-relaxed text-muted">
						{#each t.accessibility.features as feature (feature)}
							<li>{feature}</li>
						{/each}
					</ul>
				</section>
			{/if}
		{/each}
	</div>
</div>
