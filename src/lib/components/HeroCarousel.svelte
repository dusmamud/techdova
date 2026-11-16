<script lang="ts">
	import { browser } from '$app/env';
	import { ArrowRight, ChevronLeft, ChevronRight, Headphones, ShieldCheck, Sparkles, Truck } from '@lucide/svelte';
	import { interpolate } from '#lib/format';
	import type { Dictionary, Locale } from '#lib/i18n/index';
	import { localizedPath, shopPath } from '#lib/paths';
	import Picture from './Picture.svelte';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();

	const slideImages = [
		{ src: '/images/hero-main', width: 2048, height: 1152 },
		{ src: '/images/hero-audio', width: 1920, height: 1280 },
		{ src: '/images/hero-gaming', width: 1920, height: 1280 }
	];
	const slideTargets = $derived([
		localizedPath(lang, '/shop'),
		shopPath(lang, 'audio'),
		shopPath(lang, 'gaming')
	]);
	const trustIcons = [Truck, ShieldCheck, Headphones];

	let active = $state(0);
	let paused = $state(false);
	let reduceMotion = $state(false);

	const total = $derived(t.hero.slides.length);

	function goTo(index: number): void {
		active = (index + total) % total;
	}

	function next(): void {
		goTo(active + 1);
	}

	function previous(): void {
		goTo(active - 1);
	}

	$effect(() => {
		if (!browser) return;
		reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	$effect(() => {
		if (!browser || paused || reduceMotion) return;
		// Track `active` so the timer restarts after manual navigation.
		void active;
		const id = setInterval(next, 6000);
		return () => clearInterval(id);
	});

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			previous();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			next();
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions: carousel region pauses auto-advance on hover/focus and supports arrow keys from its controls -->
<section
	aria-roledescription="carousel"
	aria-label={t.hero.carouselLabel}
	onkeydown={handleKeydown}
	onmouseenter={() => {
		paused = true;
	}}
	onmouseleave={() => {
		paused = false;
	}}
	onfocusin={() => {
		paused = true;
	}}
	onfocusout={() => {
		paused = false;
	}}
	class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-50 via-brand-50/70 to-white ring-1 ring-brand-100"
>
	<div class="relative">
		<div class="grid">
		{#each t.hero.slides as slide, i (i)}
			{@const image = slideImages[i]}
			<div
				class="col-start-1 row-start-1 transition-opacity duration-500 {i === active
					? 'opacity-100'
					: 'pointer-events-none opacity-0'}"
				role="group"
				aria-roledescription="slide"
				aria-label={interpolate(t.hero.slideLabel, { n: i + 1, total })}
				aria-hidden={i !== active}
			>
				<div class="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10 lg:pl-16">
					<div>
						<p
							class="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-800 ring-1 ring-brand-200"
						>
							<Sparkles class="h-3.5 w-3.5" aria-hidden="true" />
							{slide.badge}
						</p>
						<svelte:element
							this={i === 0 ? 'h1' : 'h2'}
							class="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl"
						>
							{slide.titleA}
							<span class="block text-brand-700">{slide.titleB}</span>
						</svelte:element>
						<p class="mt-4 max-w-md text-base leading-relaxed text-neutral-600">
							{slide.subtitle}
						</p>
						<a
							href={slideTargets[i]}
							tabindex={i === active ? undefined : -1}
							class="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-800 px-6 text-sm font-semibold text-white hover:bg-brand-900"
						>
							{slide.cta}
							<ArrowRight class="h-4 w-4" aria-hidden="true" />
						</a>
					</div>
					<div class="relative min-h-[220px] overflow-hidden rounded-3xl sm:min-h-[280px] lg:min-h-[380px]">
						<Picture
							base={image.src}
							alt={slide.imageAlt}
							width={image.width}
							height={image.height}
							loading={i === 0 ? 'eager' : 'lazy'}
							fetchPriority={i === 0 ? 'high' : undefined}
							decoding="async"
							class="absolute inset-0 h-full w-full object-cover"
						/>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<button
		type="button"
		onclick={previous}
		aria-label={t.hero.previous}
		class="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-neutral-800 shadow-lg ring-1 ring-neutral-200 hover:bg-brand-50 sm:grid"
	>
		<ChevronLeft class="h-5 w-5" aria-hidden="true" />
	</button>
	<button
		type="button"
		onclick={next}
		aria-label={t.hero.next}
		class="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-neutral-800 shadow-lg ring-1 ring-neutral-200 hover:bg-brand-50 sm:grid"
	>
		<ChevronRight class="h-5 w-5" aria-hidden="true" />
	</button>
	</div>

	<div class="flex justify-center gap-1 pb-1">
		{#each t.hero.slides as _, i (i)}
			<button
				type="button"
				onclick={() => goTo(i)}
				aria-label={interpolate(t.hero.goToSlide, { n: i + 1 })}
				aria-current={i === active ? 'true' : undefined}
				class="grid h-11 w-11 place-items-center"
			>
				<span
					class="h-2 rounded-full transition-all {i === active ? 'w-6 bg-brand-700' : 'w-2 bg-brand-300'}"
				></span>
			</button>
		{/each}
	</div>

	<div class="grid gap-4 border-t border-brand-100 px-6 py-5 sm:grid-cols-3 sm:px-8 lg:px-10">
		{#each t.hero.trust as item, i (i)}
			{@const TrustIcon = trustIcons[i]}
			<div class="flex items-start gap-3">
				<TrustIcon class="mt-0.5 h-6 w-6 shrink-0 text-brand-700" aria-hidden="true" />
				<div>
					<p class="text-sm font-semibold text-neutral-900">{item.title}</p>
					<p class="text-xs text-neutral-600">{item.subtitle}</p>
				</div>
			</div>
		{/each}
	</div>
</section>
