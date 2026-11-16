<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import Seo from '#lib/components/Seo.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import { testimonials } from '#lib/data/testimonials';
	import { formatCount, formatDecimal, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const intlLocale = $derived(t.meta.intlLocale);
	const average = $derived(
		testimonials.reduce((sum, item) => sum + item.rating, 0) / testimonials.length
	);
	const aggregate = $derived(
		interpolate(t.testimonialsSection.aggregate, {
			rating: formatDecimal(average, intlLocale),
			count: formatCount(testimonials.length, intlLocale)
		})
	);

	function initials(name: string): string {
		return name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0])
			.join('')
			.toUpperCase();
	}
</script>

<Seo
	{lang}
	title={t.meta.testimonialsTitle}
	description={t.meta.testimonialsDescription}
	path="/testimonials"
/>

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
		{t.testimonialsPage.title}
	</h1>
	<p class="mt-3 max-w-2xl leading-relaxed text-neutral-600">
		{t.testimonialsPage.description}
	</p>
	<p class="mt-2 text-sm text-neutral-500">{t.testimonialsSection.demoNote}</p>
	<p class="mt-4 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
		<Stars
			rating={average}
			label={interpolate(t.productCard.ratingLabel, {
				rating: formatDecimal(average, intlLocale)
			})}
		/>
		{aggregate}
	</p>

	<div class="mt-8 grid gap-5 sm:grid-cols-2">
		{#each testimonials as testimonial (localize(testimonial.name, 'en'))}
			{@const name = localize(testimonial.name, lang)}
			<figure class="flex flex-col gap-4 rounded-3xl bg-white p-6 ring-1 ring-neutral-200">
				<Stars
					rating={testimonial.rating}
					label={interpolate(t.productCard.ratingLabel, {
						rating: formatDecimal(testimonial.rating, intlLocale)
					})}
				/>
				<blockquote class="flex-1 leading-relaxed text-neutral-700">
					“{localize(testimonial.quote, lang)}”
				</blockquote>
				<figcaption class="flex items-center gap-3">
					<span
						aria-hidden="true"
						class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-800"
					>
						{initials(name)}
					</span>
					<span>
						<span class="block text-sm font-semibold text-neutral-900">{name}</span>
						<span class="block text-sm text-neutral-500">
							{localize(testimonial.role, lang)} · {localize(testimonial.city, lang)}
						</span>
					</span>
				</figcaption>
			</figure>
		{/each}
	</div>

	<div class="mt-10 text-center">
		<a
			href={localizedPath(lang, '/shop')}
			class="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
		>
			{t.testimonialsPage.cta}
			<ArrowRight class="h-4 w-4" aria-hidden="true" />
		</a>
	</div>
</div>
