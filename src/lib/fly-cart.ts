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
 * Reduced motion: `prefersReducedMotion()` is true → no flight, no pop.
 * SSR: no `document`/`window` access at module scope; every function guards.
 */

export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const FLIGHT_MS = 600;
const LIFT_PX = 120;
const END_SCALE = 0.15;

/** Restart the pop animation on an element by re-adding the class. */
function retriggerPop(el: HTMLElement): void {
	el.classList.remove('animate-pop');
	// Force a reflow so re-adding the class restarts the animation.
	void el.offsetWidth;
	el.classList.add('animate-pop');
}

export function flyToCart(sourceEl: HTMLElement, imageBase: string): void {
	if (typeof document === 'undefined' || typeof window === 'undefined') return;
	if (prefersReducedMotion()) return;
	if (!sourceEl.isConnected) return;

	const target = document.querySelector<HTMLElement>('[data-cart-target]');
	if (!target) return;

	const sourceRect = sourceEl.getBoundingClientRect();
	const targetRect = target.getBoundingClientRect();
	if (sourceRect.width <= 0 || sourceRect.height <= 0) return;

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
	clone.style.pointerEvents = 'none';
	clone.style.zIndex = '60';
	clone.style.margin = '0';
	document.body.appendChild(clone);

	const cleanup = (): void => {
		clone.remove();
		const badge = target.querySelector<HTMLElement>('[data-cart-badge]');
		retriggerPop(badge ?? target);
	};

	// Flight path: a raised curve — the midpoint lifts 120px above the
	// straight line — shrinking to 15% and fading as it reaches the cart.
	const dx = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
	const dy = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);
	try {
		const animation = clone.animate(
			[
				{ transform: 'translate(0px, 0px) scale(1)', opacity: 1 },
				{
					transform: `translate(${dx / 2}px, ${dy / 2 - LIFT_PX}px) scale(0.5)`,
					opacity: 0.9,
					offset: 0.5
				},
				{ transform: `translate(${dx}px, ${dy}px) scale(${END_SCALE})`, opacity: 0.2 }
			],
			{ duration: FLIGHT_MS, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
		);
		animation.onfinish = cleanup;
		animation.oncancel = cleanup;
	} catch {
		cleanup();
	}
}
