<script lang="ts">
	import { browser } from '$app/env';
	import { ArrowUp } from '@lucide/svelte';
	import { fly } from 'svelte/transition';
	import { pressSpring } from '#lib/actions/press';
	import { compare } from '#lib/stores/compare.svelte';
	import { cookieBanner } from '#lib/stores/cookie-banner.svelte';

	let { label }: { label: string } = $props();

	let visible = $state(false);

	// The compare tray is fixed to the bottom of the viewport and spans the
	// full width on small screens, where it would sit under this button
	// (both are bottom-4). Lift the button above the tray while the tray is
	// open so both stay tappable. Likewise lift above the cookie banner
	// while it is visible (16px gap in both cases).
	const trayOpen = $derived(compare.count > 0);
	const bannerLift = $derived(cookieBanner.height > 0 ? cookieBanner.height + 16 : 0);
	// Desktop: the old offset (16px above banner/tray). Mobile (G-01):
	// the chat FAB moved to bottom-left, so this button stacks ABOVE it
	// on the same side — chat FAB is 56px tall at bottom `bannerLift +
	// 80` (160 with the tray), so this button sits at `bannerLift + 152`
	// (232 with the tray), 16px clear of the chat FAB and clear of the
	// sticky mobile ATC bar (~76px tall) on the PDP. The two offsets live
	// in CSS vars; app.css picks the right one per width (see
	// `.back-to-top-fab`). Both fold in the safe-area inset.
	const desktopBottom = $derived(bannerLift + (trayOpen ? 80 : 0));
	const mobileBottom = $derived(bannerLift + (trayOpen ? 232 : 152));

	// Scroll-aware auto-hide (G-01): the button appears only after 600px
	// AND while scrolling up (or at rest after scrolling up). While the
	// user scrolls down through a product grid it hides, so it never
	// covers a CTA mid-scroll — the exact defect in the audit.
	let lastScrollY = $state(0);

	$effect(() => {
		if (!browser) return;
		const onScroll = (): void => {
			const y = window.scrollY;
			const scrollingDown = y > lastScrollY + 4;
			lastScrollY = y;
			visible = y > 600 && !scrollingDown;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function scrollToTop(): void {
		if (!browser) return;
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
	}
</script>

{#if visible}
	<button
		type="button"
		data-testid="back-to-top"
		use:pressSpring
		onclick={scrollToTop}
		aria-label={label}
		transition:fly={{ y: 8, duration: 200 }}
		class="back-to-top-fab fixed left-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-brand-700 text-white shadow-lg hover:bg-brand-800 motion-safe:transition-colors sm:left-auto sm:right-4"
		style="--btt-bottom-mobile: calc({mobileBottom}px + env(safe-area-inset-bottom, 0px)); --btt-bottom-desktop: calc({desktopBottom}px + env(safe-area-inset-bottom, 0px));"
	>
		<ArrowUp class="h-5 w-5" aria-hidden="true" />
	</button>
{/if}
