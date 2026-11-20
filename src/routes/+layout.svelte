<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import '../app.css';

	let { children } = $props();

	// Page transitions (elevation round 2, G-06): same-document View
	// Transitions API, 0KB — the official SvelteKit `onNavigate` pattern.
	// 200ms cross-fade (see the ::view-transition-* rules in app.css).
	// Disabled under prefers-reduced-motion and on browsers without
	// document.startViewTransition (instant fallback, no error).
	// No cross-document `@view-transition { navigation: auto }` opt-in:
	// Firefox support for it is still incomplete.
	onNavigate((navigation) => {
		if (typeof document === 'undefined') return;
		if (!('startViewTransition' in document)) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		return new Promise<void>((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

{@render children()}
