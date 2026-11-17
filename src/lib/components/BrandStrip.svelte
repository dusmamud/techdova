<script lang="ts">
	import { reveal } from '#lib/actions/reveal';
	import { getBrands, getProductsByBrand } from '#lib/data/products';
	import { formatCount, interpolate } from '#lib/format';
	import type { Dictionary, Locale } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();

	const brands = getBrands();
	const intlLocale = $derived(t.meta.intlLocale);

	function countLabel(count: number): string {
		if (count === 1) return t.brandsSection.oneProduct;
		return interpolate(t.brandsSection.manyProducts, { count: formatCount(count, intlLocale) });
	}
</script>

<section aria-labelledby="brands-heading" use:reveal>
	<p
		class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-300"
	>
		<span class="h-px w-6 bg-brand-700" aria-hidden="true"></span>
		{t.brandsSection.eyebrow}
	</p>
	<h2
		id="brands-heading"
		class="mt-2 text-[1.375rem] font-bold tracking-tight text-ink sm:text-2xl lg:text-3xl"
	>
		{t.brandsSection.heading}
	</h2>
	<div class="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
		{#each brands as brand, i (brand)}
			{@const count = getProductsByBrand(brand).length}
			<a
				href={localizedPath(lang, '/shop') + '?brand=' + encodeURIComponent(brand)}
				use:reveal={{ delay: Math.min(i * 60, 300) }}
				class="flex min-h-[6.5rem] flex-col items-center justify-center gap-1 rounded-[1.75rem] bg-surface-soft px-4 py-6 text-center ring-1 ring-line transition-shadow hover:bg-brand-50 hover:shadow-md hover:ring-brand-200 dark:hover:bg-surface-strong sm:min-h-[7.5rem]"
			>
				<span class="text-lg font-bold tracking-tight text-ink sm:text-xl">{brand}</span>
				<span class="text-xs text-muted sm:text-sm">{countLabel(count)}</span>
			</a>
		{/each}
	</div>
</section>
