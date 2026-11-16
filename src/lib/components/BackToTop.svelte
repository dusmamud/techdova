<script lang="ts">
	import { browser } from '$app/env';
	import { ArrowUp } from '@lucide/svelte';
	import { compare } from '#lib/stores/compare.svelte';

	let { label }: { label: string } = $props();

	let visible = $state(false);

	// The compare tray is fixed to the bottom of the viewport and spans the
	// full width on small screens, where it would sit under this button
	// (both are bottom-4). Lift the button above the tray while the tray is
	// open so both stay tappable.
	const trayOpen = $derived(compare.count > 0);

	$effect(() => {
		if (!browser) return;
		const onScroll = (): void => {
			visible = window.scrollY > 600;
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
		onclick={scrollToTop}
		aria-label={label}
		class="fixed right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-brand-700 text-white shadow-lg hover:bg-brand-800 motion-safe:transition-colors {trayOpen
			? 'bottom-24'
			: 'bottom-4'}"
	>
		<ArrowUp class="h-5 w-5" aria-hidden="true" />
	</button>
{/if}
