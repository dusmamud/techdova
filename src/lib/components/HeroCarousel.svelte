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
	class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-50 via-brand-50/70 to-white ring-1 ring-brand-100 dark:from-surface-strong dark:via-surface-soft dark:to-surface"
>
	<div class="relative">
		<div class="grid">
		{#each t.hero.slides as slide, i (i)}
			{@const image = slideImages[i]}
			<div
				class="col-start-1 row-start-1 motion-safe:transition-[opacity,transform] motion-safe:duration-500 motion-safe:ease-enter {i === active
					? 'z-[1] translate-x-0 opacity-100'
					: i > active
						? 'pointer-events-none translate-x-10 opacity-0'
						: 'pointer-events-none -translate-x-10 opacity-0'}"
				role="group"
				aria-roledescription="slide"
				aria-label={interpolate(t.hero.slideLabel, { n: i + 1, total })}
				aria-hidden={i !== active}
			>
				<div class="grid gap-5 p-5 sm:gap-6 sm:p-8 lg:grid-cols-[1fr_1.15fr] lg:gap-0 lg:p-0">
					<div class="lg:flex lg:flex-col lg:justify-center lg:py-12 lg:pl-[4.75rem] lg:pr-8">
						<p
							class="inline-flex animate-fade-up items-center gap-1.5 self-start rounded-full bg-surface px-3 py-1.5 text-xs font-semibold text-brand-800 dark:text-brand-200 ring-1 ring-brand-200"
						>
							<Sparkles class="h-3.5 w-3.5" aria-hidden="true" />
							{slide.badge}
						</p>
						<svelte:element
							this={i === 0 ? 'h1' : 'h2'}
							class="mt-3 animate-fade-up text-4xl font-bold leading-[1.02] tracking-tight text-ink [animation-delay:75ms] sm:mt-4 sm:text-5xl lg:text-[3.5rem]"
						>
							{slide.titleA}
							<span class="block text-brand-700 dark:text-brand-300">{slide.titleB}</span>
						</svelte:element>
						<p
							class="mt-3 max-w-md animate-fade-up text-sm leading-relaxed text-muted [animation-delay:150ms] sm:mt-4 sm:text-base"
						>
							{slide.subtitle}
						</p>
						<a
							href={slideTargets[i]}
							tabindex={i === active ? undefined : -1}
							class="group mt-5 inline-flex animate-fade-up min-h-12 items-center gap-2 self-start rounded-full bg-brand-800 px-6 text-sm font-semibold text-white shadow-sm [animation-delay:225ms] hover:bg-brand-900 motion-safe:transition-colors motion-safe:duration-200 sm:mt-6"
						>
							{slide.cta}
							<ArrowRight
								class="h-4 w-4 motion-safe:transition-transform motion-safe:duration-200 group-hover:translate-x-0.5"
								aria-hidden="true"
							/>
						</a>
						<ul
							class="mt-6 grid animate-fade-up grid-cols-3 gap-3 border-t border-brand-100 pt-5 [animation-delay:300ms] dark:border-line sm:gap-4"
						>
							{#each t.hero.trust as item, j (j)}
								{@const TrustIcon = trustIcons[j]}
								<li class="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:gap-2">
									<TrustIcon
										class="h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300 sm:mt-0.5"
										aria-hidden="true"
									/>
									<div class="min-w-0">
										<p class="text-[11px] font-semibold leading-snug text-ink sm:text-xs">
											{item.title}
										</p>
										<p class="text-[11px] leading-snug text-muted">{item.subtitle}</p>
									</div>
								</li>
							{/each}
						</ul>
					</div>
					<div
						class="relative aspect-[16/10] animate-fade-up overflow-hidden rounded-3xl [animation-delay:300ms] sm:aspect-[21/9] lg:aspect-auto lg:min-h-[440px] lg:rounded-none"
					>
						<Picture
							base={image.src}
							alt={slide.imageAlt}
							width={image.width}
							height={image.height}
							loading={i === 0 ? 'eager' : 'lazy'}
							fetchPriority={i === 0 ? 'high' : undefined}
							decoding="async"
							sizes="(max-width: 1023px) 100vw, 680px"
							class="absolute inset-0 h-full w-full object-cover {i === active
								? 'animate-ken-burns'
								: ''}"
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
		class="absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-surface text-ink-soft shadow-lg ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft lg:grid"
	>
		<ChevronLeft class="h-5 w-5" aria-hidden="true" />
	</button>
	<button
		type="button"
		onclick={next}
		aria-label={t.hero.next}
		class="absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-surface text-ink-soft shadow-lg ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft lg:grid"
	>
		<ChevronRight class="h-5 w-5" aria-hidden="true" />
	</button>
	</div>

	<div
		role="group"
		aria-label={t.hero.dotsLabel}
		class="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-surface/85 py-1 pl-1.5 pr-1 shadow-md ring-1 ring-line backdrop-blur-sm"
	>
		{#each t.hero.slides as _, i (i)}
			<button
				type="button"
				onclick={() => goTo(i)}
				aria-label={interpolate(t.hero.goToSlide, { n: i + 1 })}
				aria-current={i === active ? 'true' : undefined}
				class="grid h-10 w-10 place-items-center rounded-full"
			>
				<span
					class="relative h-2 overflow-hidden rounded-full motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-enter {i === active
						? reduceMotion
							? 'w-6 bg-brand-700 dark:bg-brand-300'
							: 'w-7 bg-brand-200 dark:bg-white/25'
						: 'w-2 bg-brand-300/80 dark:bg-brand-400/60'}"
				>
					{#if i === active && !reduceMotion}
						<span
							class="absolute inset-0 origin-left animate-dot-progress rounded-full bg-brand-700 dark:bg-brand-300"
							style:animation-play-state={hoverPaused || userPaused ? 'paused' : 'running'}
						></span>
					{/if}
				</span>
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
				class="grid h-10 w-10 place-items-center rounded-full text-ink-soft hover:bg-brand-50 dark:hover:bg-surface-soft"
			>
				{#if userPaused}
					<Play class="h-4 w-4" aria-hidden="true" />
				{:else}
					<Pause class="h-4 w-4" aria-hidden="true" />
				{/if}
			</button>
		{/if}
	</div>
</section>
