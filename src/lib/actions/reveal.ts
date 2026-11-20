import type { ActionReturn } from 'svelte/action';

export type RevealVariant = 'rise' | 'scale' | 'slide';

export type RevealOptions = {
	/**
	 * Stagger delay in ms before the reveal transition starts. Clamped to
	 * 0–300ms. Convention for grids: `delay: Math.min(index * 60, 300)` so
	 * the total stagger never exceeds one reveal duration. Applied as an
	 * inline `transition-delay`, cleared after the reveal finishes.
	 */
	delay?: number;
	/**
	 * Accepted for API stability; the reveal ALWAYS fires exactly once (the
	 * observer unobserves after the first reveal). Passing `once: false`
	 * does not re-hide the node on exit.
	 */
	once?: boolean;
	/**
	 * Entrance shape (elevation round 2, G-15). All variants share the
	 * one 400ms / ease-enter system in app.css — only the starting
	 * transform differs: `rise` (default, fade + 12px rise), `scale`
	 * (fade + 0.96 scale, for tiles/cards), `slide` (fade + 16px slide
	 * from the left, for strips/bands).
	 */
	variant?: RevealVariant;
};

/**
 * Scroll-reveal action: fades + rises the node into view once it enters the
 * viewport (IntersectionObserver, 10% visible). The visible state is driven
 * by the `.reveal` / `.reveal-visible` classes in src/app.css.
 *
 * Safety guarantees (non-negotiable, do not weaken):
 * - The pre-hidden `.reveal` class is added HERE, in the action function,
 *   which runs only in the browser after mount. Prerendered HTML never
 *   contains hidden state, so content is fully visible with JS disabled,
 *   failed, or before hydration.
 * - Under `prefers-reduced-motion: reduce` the action does NOTHING: no
 *   classes, no observer — content shows instantly. (app.css additionally
 *   forces `.reveal` visible under reduced motion as a backstop.)
 * - Without IntersectionObserver support the action does nothing and the
 *   content stays visible; it is never left hidden.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { reveal } from '#lib/actions/reveal';
 * </script>
 *
 * <section use:reveal>
 *   <h2>Always-visible heading, revealed once on scroll</h2>
 * </section>
 *
 * {#each products as product, i (product.slug)}
 *   <div use:reveal={{ delay: Math.min(i * 60, 300) }}>
 *     <ProductCard {product} {lang} {t} />
 *   </div>
 * {/each}
 * ```
 */
export function reveal(
	node: HTMLElement,
	{ delay = 0, once: _once = true, variant = 'rise' }: RevealOptions = {}
): ActionReturn<RevealOptions> {
	// `_once` is intentionally unused: the reveal always fires once.
	void _once;

	if (typeof window === 'undefined') return {};
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return {};
	if (typeof IntersectionObserver === 'undefined') return {};

	const clampedDelay = Math.max(0, Math.min(delay, 300));
	node.classList.add('reveal');
	if (variant !== 'rise') node.classList.add(`reveal--${variant}`);
	if (clampedDelay > 0) node.style.transitionDelay = `${clampedDelay}ms`;

	let clearTimer: ReturnType<typeof setTimeout> | undefined;
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				observer.unobserve(node);
				node.classList.add('reveal-visible');
				// Clear the stagger delay after the transition (400ms reveal
				// duration + delay) so later state changes on the node are
				// not delayed.
				clearTimer = setTimeout(() => {
					node.style.transitionDelay = '';
				}, clampedDelay + 400);
			}
		},
		{ threshold: 0.1 }
	);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
			clearTimeout(clearTimer);
		}
	};
}
