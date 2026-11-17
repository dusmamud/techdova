<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Picture from '#lib/components/Picture.svelte';
	import { getCategory } from '#lib/data/categories';
	import type { Dictionary, Locale } from '#lib/i18n/index';
	import { localize } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();

	// One large spotlight tile + three small tiles. Images reuse existing
	// category/promo artwork (AVIF/WebP/JPG waterfall via Picture); no new
	// images were generated for this section.
	const tiles = $derived([
		{
			title: t.bentoSection.spotlightTitle,
			text: t.bentoSection.spotlightText,
			href: localizedPath(lang, '/category/gaming'),
			image: '/images/category-gaming',
			imageAlt: localize(getCategory('gaming').imageAlt, lang),
			width: 1600,
			height: 1600,
			large: true
		},
		{
			title: t.bentoSection.dealsTitle,
			text: t.bentoSection.dealsText,
			href: localizedPath(lang, '/deals'),
			image: '/images/promo-devices',
			imageAlt: t.promo.imageAlt,
			width: 2048,
			height: 1152,
			large: false
		},
		{
			title: t.bentoSection.newTitle,
			text: t.bentoSection.newText,
			href: localizedPath(lang, '/new-arrivals'),
			image: '/images/category-smartphones',
			imageAlt: localize(getCategory('smartphones').imageAlt, lang),
			width: 1600,
			height: 1600,
			large: false
		},
		{
			title: t.bentoSection.giftTitle,
			text: t.bentoSection.giftText,
			href: localizedPath(lang, '/gift-cards'),
			image: '/images/category-accessories',
			imageAlt: localize(getCategory('accessories').imageAlt, lang),
			width: 1600,
			height: 1600,
			large: false
		}
	]);
</script>

<section aria-labelledby="bento-heading" use:reveal>
	<p
		class="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-300"
	>
		<span class="h-px w-6 bg-brand-700" aria-hidden="true"></span>
		{t.bentoSection.eyebrow}
	</p>
	<h2
		id="bento-heading"
		class="mt-2 text-[1.375rem] font-bold tracking-tight text-ink sm:text-2xl lg:text-3xl"
	>
		{t.bentoSection.heading}
	</h2>
	<div class="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
		{#each tiles as tile, i (tile.href)}
			<a
				href={tile.href}
				use:reveal={{ delay: Math.min(i * 60, 300) }}
				class="group relative block min-h-[220px] overflow-hidden rounded-[2rem] {tile.large
					? 'sm:col-span-2 sm:min-h-[280px] lg:col-span-1 lg:row-span-2 lg:min-h-[420px]'
					: ''} {i === 3 ? 'sm:col-span-2 lg:col-span-2' : ''}"
			>
				<Picture
					base={tile.image}
					alt={tile.imageAlt}
					width={tile.width}
					height={tile.height}
					loading="lazy"
					decoding="async"
					class="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>
				<span
					aria-hidden="true"
					class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/5"
				></span>
				<span class="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-5 sm:p-6">
					<span
						class="text-lg font-bold leading-tight text-white {tile.large
							? 'sm:text-2xl lg:text-[1.75rem]'
							: 'sm:text-xl'}"
					>
						{tile.title}
					</span>
					<span class="line-clamp-2 text-sm leading-relaxed text-white/85">{tile.text}</span>
					<span class="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
						{t.bentoSection.explore}
						<ArrowRight
							class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
							aria-hidden="true"
						/>
					</span>
				</span>
			</a>
		{/each}
	</div>
</section>
