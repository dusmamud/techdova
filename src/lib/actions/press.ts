import { animate, press } from 'motion';
import type { ActionReturn } from 'svelte/action';
import { prefersReducedMotion } from '#lib/fly-cart';

/**
 * Springy press feedback (elevation round 2, Motion verdict §4.3 job (a)).
 * Vanilla `press`/`animate` from `motion` — never `motion/react`.
 *
 * - Runs only in the browser, inside this action (never at module scope,
 *   never during prerender); the top-level import alone is inert.
 * - No-ops under `prefers-reduced-motion: reduce` (Motion's vanilla API
 *   has no automatic reduced-motion handling, so the guard mirrors the
 *   existing `prefersReducedMotion()` helper).
 * - CSS transitions can't preserve velocity when a press reverses
 *   mid-animation; the springs below can — that is the only reason this
 *   uses Motion instead of the existing `active:scale-*` utilities.
 * - Cleanup is returned to Svelte, so the gesture detaches on destroy.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { pressSpring } from '#lib/actions/press';
 * </script>
 *
 * <button type="button" use:pressSpring onclick={addToCart}>Add to cart</button>
 * ```
 */
export function pressSpring(node: HTMLElement): ActionReturn {
	if (typeof window === 'undefined' || prefersReducedMotion()) return {};

	const cleanup = press(node, () => {
		animate(
			node,
			{ scale: 0.94 },
			{ type: 'spring', stiffness: 900, damping: 20 }
		);
		return () => {
			animate(
				node,
				{ scale: 1 },
				{ type: 'spring', stiffness: 500, damping: 18 }
			);
		};
	});

	return {
		destroy() {
			cleanup();
		}
	};
}
