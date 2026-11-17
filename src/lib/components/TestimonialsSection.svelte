<script lang="ts">
	import { reveal } from '#lib/actions/reveal';
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

<section aria-labelledby="testimonials-heading" class="py-8 sm:py-10" use:reveal>
	<p class="text-sm font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
		{t.testimonialsSection.eyebrow}
	</p>
	<h2
		id="testimonials-heading"
		class="mt-2 text-[1.375rem] font-bold tracking-tight text-ink sm:text-2xl lg:text-3xl"
	>
		{t.testimonialsSection.heading}
	</h2>
	<p class="mt-2 text-sm text-muted">{t.testimonialsSection.demoNote}</p>
	<div class="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
		{#each shown as testimonial, i (localize(testimonial.name, 'en'))}
			{@const name = localize(testimonial.name, lang)}
			<figure
				class="card-lift flex flex-col gap-4 rounded-3xl bg-surface p-5 ring-1 ring-line sm:p-6"
				use:reveal={{ delay: Math.min(i * 60, 300) }}
			>
				<Stars
					rating={testimonial.rating}
					label={interpolate(t.productCard.ratingLabel, {
						rating: formatDecimal(testimonial.rating, intlLocale)
					})}
				/>
				<blockquote class="flex-1 leading-relaxed text-ink-soft">
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
						<span class="block text-sm font-semibold text-ink">{name}</span>
						<span class="block text-sm text-muted">
							{localize(testimonial.role, lang)} · {localize(testimonial.city, lang)}
						</span>
					</span>
				</figcaption>
			</figure>
		{/each}
	</div>
	<p class="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted">
		<Stars
			rating={average}
			label={interpolate(t.productCard.ratingLabel, {
				rating: formatDecimal(average, intlLocale)
			})}
		/>
		{aggregate}
	</p>
</section>
