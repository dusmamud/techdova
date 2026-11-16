<script lang="ts">
	import { testimonials } from '#lib/data/testimonials';
	import { formatCount, formatDecimal, interpolate } from '#lib/format';
	import { localize, type Dictionary, type Locale } from '#lib/i18n/index';
	import Stars from './Stars.svelte';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();

	const shown = $derived(testimonials.slice(0, 3));
	const average = $derived(
		testimonials.reduce((sum, item) => sum + item.rating, 0) / testimonials.length
	);
	const intlLocale = $derived(t.meta.intlLocale);
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

<section aria-labelledby="testimonials-heading" class="py-10 sm:py-14">
	<p class="text-sm font-semibold uppercase tracking-wide text-brand-700">
		{t.testimonialsSection.eyebrow}
	</p>
	<h2
		id="testimonials-heading"
		class="mt-2 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
	>
		{t.testimonialsSection.heading}
	</h2>
	<p class="mt-2 text-sm text-neutral-500">{t.testimonialsSection.demoNote}</p>
	<div class="mt-6 grid gap-5 md:grid-cols-3">
		{#each shown as testimonial (localize(testimonial.name, 'en'))}
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
	<p class="mt-6 flex flex-wrap items-center gap-2 text-sm text-neutral-600">
		<Stars
			rating={average}
			label={interpolate(t.productCard.ratingLabel, {
				rating: formatDecimal(average, intlLocale)
			})}
		/>
		{aggregate}
	</p>
</section>
