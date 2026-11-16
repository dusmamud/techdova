<script lang="ts">
	import { browser } from '$app/env';
	import { ArrowRight, ChevronLeft, ChevronRight, Headphones, Pause, Play, ShieldCheck, Sparkles, Truck } from '@lucide/svelte';
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
	// Two independent pause sources: transient hover/focus pause, and the
	// sticky pause/play button. Either one stops autoplay; mouseleave must
	// never resume a user-paused carousel.
	let hoverPaused = $state(false);
	let userPaused = $state(false);
	// Read at init (browser-only) so the pause control is never rendered for
	// reduced-motion users — autoplay is already off for them.
	let reduceMotion = $state(
		browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);

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
		if (!browser || hoverPaused || userPaused || reduceMotion) return;
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

	// Swipe: a horizontal swipe past 40px changes slide. No preventDefault
	// anywhere, so vertical scrolling is never hijacked, and swipes
	// dominated by vertical movement are ignored.
	let touchStartX: number | null = null;
	let touchStartY: number | null = null;

	function handleTouchStart(event: TouchEvent): void {
		const touch = event.touches[0];
		touchStartX = touch.clientX;
		touchStartY = touch.clientY;
	}

	function handleTouchEnd(event: TouchEvent): void {
		if (touchStartX === null || touchStartY === null) return;
		const touch = event.changedTouches[0];
		const dx = touch.clientX - touchStartX;
		const dy = touch.clientY - touchStartY;
		touchStartX = null;
		touchStartY = null;
		if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
			if (dx < 0) next();
			else previous();
		}
	}

	function handleTouchCancel(): void {
		touchStartX = null;
		touchStartY = null;
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions: carousel region pauses auto-advance on hover/focus, supports arrow keys from its controls, and swipe gestures -->
<section
	aria-roledescription="carousel"
	aria-label={t.hero.carouselLabel}
	onkeydown={handleKeydown}
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	ontouchcancel={handleTouchCancel}
	onmouseenter={() => {
		hoverPaused = true;
	}}
	onmouseleave={() => {
		hoverPaused = false;
	}}
	onfocusin={() => {
		hoverPaused = true;
	}}
	onfocusout={() => {
		hoverPaused = false;
	}}
	class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-50 via-brand-50/70 to-white ring-1 ring-brand-100"
>
	<div class="relative">
		<div class="grid">
		{#each t.hero.slides as slide, i (i)}
			{@const image = slideImages[i]}
			<div
				class="col-start-1 row-start-1 motion-safe:transition-opacity motion-safe:duration-400 motion-safe:ease-enter {i === active
					? 'opacity-100'
					: 'pointer-events-none opacity-0'}"
				role="group"
				aria-roledescription="slide"
				aria-label={interpolate(t.hero.slideLabel, { n: i + 1, total })}
				aria-hidden={i !== active}
			>
				<div class="grid items-center gap-5 p-5 sm:gap-6 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10 lg:pl-16">
					<div>
						<p
							class="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-brand-800 ring-1 ring-brand-200"
						>
							<Sparkles class="h-3.5 w-3.5" aria-hidden="true" />
							{slide.badge}
						</p>
						<svelte:element
							this={i === 0 ? 'h1' : 'h2'}
							class="mt-3 text-3xl font-bold leading-[1.05] tracking-tight text-neutral-900 sm:mt-4 sm:text-4xl lg:text-5xl"
						>
							{slide.titleA}
							<span class="block text-brand-700">{slide.titleB}</span>
						</svelte:element>
						<p class="mt-3 max-w-md text-sm leading-relaxed text-neutral-600 sm:mt-4 sm:text-base">
							{slide.subtitle}
						</p>
						<a
							href={slideTargets[i]}
							tabindex={i === active ? undefined : -1}
							class="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-800 px-6 text-sm font-semibold text-white hover:bg-brand-900 sm:mt-6"
						>
							{slide.cta}
							<ArrowRight class="h-4 w-4" aria-hidden="true" />
						</a>
					</div>
					<div class="relative aspect-[16/10] overflow-hidden rounded-3xl sm:aspect-[21/9] lg:aspect-[4/3] lg:min-h-[380px]">
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

	<div class="flex justify-center gap-0.5 px-4 pb-2 pt-1">
		{#each t.hero.slides as _, i (i)}
			<button
				type="button"
				onclick={() => goTo(i)}
				aria-label={interpolate(t.hero.goToSlide, { n: i + 1 })}
				aria-current={i === active ? 'true' : undefined}
				class="grid h-11 w-11 place-items-center"
			>
				<span
					class="h-2 rounded-full motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-enter {i === active ? 'w-6 bg-brand-700' : 'w-2 bg-brand-300'}"
				></span>
			</button>
		{/each}
		{#if !reduceMotion}
			<button
				type="button"
				onclick={() => {
					userPaused = !userPaused;
				}}
				aria-label={userPaused ? t.hero.play : t.hero.pause}
				aria-pressed={userPaused}
				class="grid h-11 w-11 place-items-center rounded-full bg-white text-neutral-800 shadow-lg ring-1 ring-neutral-200 hover:bg-brand-50"
			>
				{#if userPaused}
					<Play class="h-5 w-5" aria-hidden="true" />
				{:else}
					<Pause class="h-5 w-5" aria-hidden="true" />
				{/if}
			</button>
		{/if}
	</div>

	<div class="grid grid-cols-3 gap-3 border-t border-brand-100 px-4 py-4 sm:gap-4 sm:px-8 sm:py-5 lg:px-10">
		{#each t.hero.trust as item, i (i)}
			{@const TrustIcon = trustIcons[i]}
			<div class="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
				<TrustIcon class="h-5 w-5 shrink-0 text-brand-700 sm:mt-0.5 sm:h-6 sm:w-6" aria-hidden="true" />
				<div class="min-w-0">
					<p class="text-xs font-semibold leading-snug text-neutral-900 sm:text-sm">{item.title}</p>
					<p class="text-[11px] leading-snug text-neutral-600 sm:text-xs">{item.subtitle}</p>
				</div>
			</div>
		{/each}
	</div>
</section>
