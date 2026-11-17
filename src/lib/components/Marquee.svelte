<script lang="ts">
	import type { Dictionary, Locale } from '#lib/i18n/index';

	let { t }: { lang: Locale; t: Dictionary } = $props();

	// Interleave offers and brand names so the strip alternates promise /
	// brand: offer, brand, offer, brand… The track below renders this list
	// twice (second copy aria-hidden) so the -50% marquee loop is seamless.
	const items = $derived.by(() => {
		const merged: string[] = [];
		const longest = Math.max(t.marquee.offers.length, t.marquee.brands.length);
		for (let i = 0; i < longest; i++) {
			if (i < t.marquee.offers.length) merged.push(t.marquee.offers[i]);
			if (i < t.marquee.brands.length) merged.push(t.marquee.brands[i]);
		}
		return merged;
	});
</script>

<div class="overflow-hidden border-y border-line bg-surface-soft py-3">
	<p class="sr-only">{t.marquee.label}</p>
	<div
		class="flex w-max animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-8 motion-reduce:gap-y-1 motion-reduce:px-4"
	>
		{#each [0, 1] as copy (copy)}
			<ul
				class="flex shrink-0 items-center gap-8 pr-8 {copy === 1
					? 'motion-reduce:hidden'
					: 'motion-reduce:contents'}"
				aria-hidden={copy === 1}
			>
				{#each items as item (item)}
					<li class="flex shrink-0 items-center gap-8 whitespace-nowrap">
						<span class="text-sm font-semibold text-ink-soft">{item}</span>
						<span class="text-brand-600" aria-hidden="true">•</span>
					</li>
				{/each}
			</ul>
		{/each}
	</div>
</div>
