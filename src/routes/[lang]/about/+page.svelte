<script lang="ts">
	import { ArrowRight, BadgeCheck, Headphones, Tag, Truck } from '@lucide/svelte';
	import Picture from '#lib/components/Picture.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { getDictionary } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const valueIcons = [BadgeCheck, Tag, Truck, Headphones];
</script>

<Seo {lang} title={t.meta.aboutTitle} description={t.meta.aboutDescription} path="/about" />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<section aria-labelledby="about-heading" class="grid items-center gap-8 lg:grid-cols-2">
		<div>
			<p class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-700">
				<span class="h-px w-6 bg-brand-700" aria-hidden="true"></span>
				{t.about.storyEyebrow}
			</p>
			<h1 id="about-heading" class="mt-3 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
				{t.about.storyTitle}
			</h1>
			<p class="mt-4 leading-relaxed text-neutral-600">{t.about.storyText1}</p>
			<p class="mt-3 leading-relaxed text-neutral-600">{t.about.storyText2}</p>
		</div>
		<div class="relative min-h-[260px] overflow-hidden rounded-[2rem] sm:min-h-[320px]">
			<Picture
				base="/images/promo-devices"
				alt={t.promo.imageAlt}
				width={2048}
				height={1152}
				loading="lazy"
				decoding="async"
				class="absolute inset-0 h-full w-full object-cover"
			/>
		</div>
	</section>

	<section aria-labelledby="values-heading" class="mt-14">
		<p class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-700">
			<span class="h-px w-6 bg-brand-700" aria-hidden="true"></span>
			{t.about.valuesEyebrow}
		</p>
		<h2 id="values-heading" class="mt-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
			{t.about.valuesTitle}
		</h2>
		<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each t.about.values as value, i (i)}
				{@const ValueIcon = valueIcons[i]}
				<div class="rounded-3xl bg-brand-50 p-5">
					<ValueIcon class="h-7 w-7 text-brand-700" aria-hidden="true" />
					<h3 class="mt-3 font-semibold text-neutral-900">{value.title}</h3>
					<p class="mt-1 text-sm leading-relaxed text-neutral-600">{value.text}</p>
				</div>
			{/each}
		</div>
	</section>

	<section aria-label={t.about.stats.map((s) => s.label).join(', ')} class="mt-14">
		<dl class="grid grid-cols-2 gap-6 rounded-3xl bg-brand-950 px-6 py-8 text-center text-white lg:grid-cols-4">
			{#each t.about.stats as stat (stat.label)}
				<div class="flex flex-col">
					<dt class="order-2 mt-1 text-sm text-white/70">{stat.label}</dt>
					<dd class="order-1 text-3xl font-bold">{stat.value}</dd>
				</div>
			{/each}
		</dl>
	</section>

	<section aria-labelledby="cta-heading" class="mt-14 overflow-hidden rounded-[2rem] bg-brand-800 px-6 py-10 text-center sm:px-10">
		<h2 id="cta-heading" class="text-2xl font-bold tracking-tight text-white sm:text-3xl">
			{t.about.ctaTitle}
		</h2>
		<p class="mx-auto mt-2 max-w-md text-brand-100">{t.about.ctaText}</p>
		<a
			href={localizedPath(lang, '/shop')}
			class="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-brand-800 hover:bg-brand-50"
		>
			{t.about.ctaButton}
			<ArrowRight class="h-4 w-4" aria-hidden="true" />
		</a>
	</section>
</div>
