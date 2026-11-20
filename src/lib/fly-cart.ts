/**
 * Fly-to-cart primitive: animates a thumbnail clone from a source element
 * (product image / card) to the header cart target, then pops the cart
 * badge. No Svelte component: callers invoke `flyToCart` from a click
 * handler alongside `cart.add(...)` — the cart update itself never depends
 * on this animation, so no-JS and reduced-motion users lose nothing.
 *
 * CONTRACT for the header (motion worker): the header cart link MUST carry
 * `data-cart-target`. The badge inside it MAY carry `data-cart-badge`; when
 * present the pop restarts on the badge, otherwise on the cart link itself.
 * If no `[data-cart-target]` element exists, the flight is skipped silently.
 *
 * Elevation round 2 (G-02): callers pass the PRODUCT IMAGE element, not
 * the button, so the clone starts as a recognizable product shot; the
 * flight holds opacity >= 0.6 until arrival and shrinks only to 35%, so
 * it stays legible for most of the 600ms. `flyToCart` returns a promise
 * that resolves after landing PLUS a short grace (200ms) so the badge pop
 * is visible before the caller opens the cart drawer — callers must
 * `void flyToCart(...).then(() => cart.openDrawer())` instead of opening
 * the drawer synchronously. When the flight is skipped (reduced motion,
 * no target, element not connected) the promise resolves immediately, so
 * the drawer opens at once exactly as before.
 *
 * Reduced motion: `prefersReducedMotion()` is true → no flight, no pop.
 * SSR: no `document`/`window` access at module scope; every function guards.
 */

export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const FLIGHT_MS = 600;
const LIFT_PX = 120;
const END_SCALE = 0.35;
const END_OPACITY = 0.65;
/** Grace after landing before the promise resolves: the badge pop (300ms)
 *  gets a head start before the cart drawer opens over it. */
const LANDING_GRACE_MS = 200;

/** Restart the pop animation on an element by re-adding the class. */
function retriggerPop(el: HTMLElement): void {
	el.classList.remove('animate-pop');
	// Force a reflow so re-adding the class restarts the animation.
	void el.offsetWidth;
	el.classList.add('animate-pop');
}

export function flyToCart(sourceEl: HTMLElement, imageBase: string): Promise<void> {
	if (typeof document === 'undefined' || typeof window === 'undefined')
		return Promise.resolve();
	if (prefersReducedMotion()) return Promise.resolve();
	if (!sourceEl.isConnected) return Promise.resolve();

	const target = document.querySelector<HTMLElement>('[data-cart-target]');
	if (!target) return Promise.resolve();

	const sourceRect = sourceEl.getBoundingClientRect();
	const targetRect = target.getBoundingClientRect();
	if (sourceRect.width <= 0 || sourceRect.height <= 0) return Promise.resolve();

	const clone = document.createElement('img');
	clone.src = `${imageBase}.jpg`;
	clone.alt = '';
	clone.setAttribute('aria-hidden', 'true');
	clone.style.position = 'fixed';
	clone.style.left = `${sourceRect.left}px`;
	clone.style.top = `${sourceRect.top}px`;
	clone.style.width = `${sourceRect.width}px`;
	clone.style.height = `${sourceRect.height}px`;
	clone.style.objectFit = 'cover';
	clone.style.borderRadius = '1rem';
	clone.style.boxShadow = '0 8px 24px rgb(0 0 0 / 0.25)';
	clone.style.pointerEvents = 'none';
	clone.style.zIndex = '60';
	clone.style.margin = '0';
	clone.style.willChange = 'transform, opacity';
	document.body.appendChild(clone);

	return new Promise<void>((resolve) => {
		const finish = (): void => {
			clone.remove();
			const badge = target.querySelector<HTMLElement>('[data-cart-badge]');
			retriggerPop(badge ?? target);
			window.setTimeout(resolve, LANDING_GRACE_MS);
		};

		// Flight path: a raised curve — the midpoint lifts 120px above the
		// straight line — shrinking to 35% and holding opacity >= 0.6
		// until arrival, so the product stays recognizable for most of
		// the flight.
		const dx =
			targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
		const dy =
			targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);
		try {
			const animation = clone.animate(
				[
					{ transform: 'translate(0px, 0px) scale(1)', opacity: 1 },
					{
						transform: `translate(${dx / 2}px, ${dy / 2 - LIFT_PX}px) scale(0.6)`,
						opacity: 0.9,
						offset: 0.5
					},
					{
						transform: `translate(${dx}px, ${dy}px) scale(${END_SCALE})`,
						opacity: END_OPACITY
					}
				],
				{ duration: FLIGHT_MS, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
			);
			animation.onfinish = finish;
			animation.oncancel = finish;
		} catch {
			finish();
		}
	});
}
