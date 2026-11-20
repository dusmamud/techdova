import type { ActionReturn } from 'svelte/action';

export type CountUpOptions = {
	/** Final numeric value to count up to. */
	target: number;
	/** Fraction digits in the formatted output (default 0). */
	decimals?: number;
	/** Text appended after the number, e.g. '/5' (default ''). */
	suffix?: string;
	/** Intl locale for the number format (default: the runtime locale). */
	locale?: string;
	/** Animation duration in ms (default 900). */
	durationMs?: number;
};

/**
 * Number count-up (elevation round 2, G-09): animates the node's text from
 * 0 to `target` with an ease-out cubic once it scrolls into view
 * (IntersectionObserver, 50% visible, fires once). One tiny action reusing
 * the reveal observer pattern — no library, no extra dependency.
 *
 * Safety guarantees (same as the reveal action):
 * - The prerendered HTML already contains the final value, so content is
 *   correct with JS disabled, failed, or before hydration; the action
 *   only rewrites the text after the node is observed in the browser.
 * - Under `prefers-reduced-motion: reduce` the action does nothing (the
 *   final value stays) and installs no observer.
 * - Without IntersectionObserver support the final value stays.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { countUp } from '#lib/actions/count-up';
 * </script>
 *
 * <dd use:countUp={{ target: 4.8, decimals: 1, suffix: '/5', locale: 'fr-FR' }}>
 *   4,8/5
 * </dd>
 * ```
 */
export function countUp(
	node: HTMLElement,
	{ target, decimals = 0, suffix = '', locale, durationMs = 900 }: CountUpOptions
): ActionReturn<CountUpOptions> {
	const format = (value: number): string =>
		new Intl.NumberFormat(locale, {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals
		}).format(value) + suffix;
	const finalText = format(target);

	if (typeof window === 'undefined') return {};
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.textContent = finalText;
		return {};
	}
	if (typeof IntersectionObserver === 'undefined') {
		node.textContent = finalText;
		return {};
	}

	let raf = 0;
	let started = false;
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting || started) continue;
				started = true;
				observer.unobserve(node);
				const start = performance.now();
				const tick = (now: number): void => {
					const progress = Math.min(1, (now - start) / durationMs);
					const eased = 1 - Math.pow(1 - progress, 3);
					node.textContent = format(target * eased);
					if (progress < 1) raf = requestAnimationFrame(tick);
					else node.textContent = finalText;
				};
				raf = requestAnimationFrame(tick);
			}
		},
		{ threshold: 0.5 }
	);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
			cancelAnimationFrame(raf);
		}
	};
}
