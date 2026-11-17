import { browser } from '$app/env';
import { CART_STORAGE_KEY, PROMO_STORAGE_KEY } from '#lib/config';
import { getPromoCode, type PromoCode } from '#lib/data/promo-codes';
import { getProduct, getVariant, type Product, type ProductVariant } from '#lib/data/products';
import {
	addLine,
	computeTotals,
	removeLine,
	setLineQty,
	type CartLine,
	type CartTotals
} from '#lib/cart-math';

export type DetailedLine = { product: Product; variant: ProductVariant | undefined; qty: number };

export type CartAnnouncement = { id: number; kind: 'added' | 'removed'; slug: string };

/** Cart state (Svelte 5 runes) persisted to localStorage. Demo only: nothing is sent anywhere. */
class CartStore {
	lines = $state<CartLine[]>([]);
	drawerOpen = $state(false);
	/** Applied promo code, persisted separately so it survives reloads. */
	appliedPromo = $state<PromoCode | undefined>(undefined);
	/** Last add/remove event, consumed by the aria-live region. Null until the first change. */
	announcement = $state<CartAnnouncement | null>(null);

	private announcementId = 0;

	constructor() {
		if (browser) this.load();
	}

	get totals(): CartTotals {
		return computeTotals(this.lines, getProduct, this.appliedPromo?.percent ?? 0);
	}

	get count(): number {
		return this.totals.count;
	}

	get detailed(): DetailedLine[] {
		return this.lines.flatMap((line) => {
			const product = getProduct(line.slug);
			if (!product) return [];
			return [{ product, variant: getVariant(product, line.variantId), qty: line.qty }];
		});
	}

	add(slug: string, qty = 1, variantId?: string): void {
		const product = getProduct(slug);
		if (!product) return;
		const variant = getVariant(product, variantId);
		const stock = variant?.stock ?? product.stock;
		if (stock <= 0) return;
		this.lines = addLine(this.lines, slug, qty, stock, variant?.id);
		this.save();
		this.announcement = { id: ++this.announcementId, kind: 'added', slug };
	}

	setQty(slug: string, qty: number, variantId?: string): void {
		const product = getProduct(slug);
		if (!product) return;
		const variant = getVariant(product, variantId);
		this.lines = setLineQty(this.lines, slug, qty, variant?.stock ?? product.stock, variant?.id);
		this.save();
	}

	remove(slug: string, variantId?: string): void {
		const product = getProduct(slug);
		const variant = product ? getVariant(product, variantId) : undefined;
		this.lines = removeLine(this.lines, slug, variant?.id);
		this.save();
		this.announcement = { id: ++this.announcementId, kind: 'removed', slug };
	}

	clear(): void {
		this.lines = [];
		this.appliedPromo = undefined;
		this.save();
		this.savePromo();
	}

	/** Apply a promo code from user input; returns false for unknown codes. */
	applyPromo(input: string): boolean {
		const promo = getPromoCode(input);
		if (!promo) return false;
		this.appliedPromo = promo;
		this.savePromo();
		return true;
	}

	removePromo(): void {
		this.appliedPromo = undefined;
		this.savePromo();
	}

	openDrawer(): void {
		this.drawerOpen = true;
	}

	closeDrawer(): void {
		this.drawerOpen = false;
	}

	private load(): void {
		try {
			const rawPromo = localStorage.getItem(PROMO_STORAGE_KEY);
			// An unknown stored code (e.g. from an older demo build) is
			// ignored rather than applied, so totals stay honest.
			this.appliedPromo = rawPromo ? getPromoCode(rawPromo) : undefined;
		} catch {
			this.appliedPromo = undefined;
		}
		try {
			const raw = localStorage.getItem(CART_STORAGE_KEY);
			if (!raw) return;
			const parsed: unknown = JSON.parse(raw);
			if (!Array.isArray(parsed)) return;
			const valid: CartLine[] = [];
			for (const entry of parsed) {
				if (typeof entry !== 'object' || entry === null) continue;
				const { slug, qty, variantId } = entry as {
					slug?: unknown;
					qty?: unknown;
					variantId?: unknown;
				};
				if (typeof slug !== 'string' || typeof qty !== 'number') continue;
				const product = getProduct(slug);
				if (!product) continue;
				// Legacy lines have no variantId: they load as the default
				// variant (no data loss). An unknown variantId also falls
				// back to the default variant instead of dropping the line.
				const variant =
					typeof variantId === 'string' ? getVariant(product, variantId) : undefined;
				const stock = variant?.stock ?? product.stock;
				if (stock <= 0) continue;
				const capped = Math.max(1, Math.min(stock, Math.floor(qty)));
				const existing = valid.find(
					(l) => l.slug === slug && (l.variantId ?? undefined) === variant?.id
				);
				if (existing) {
					existing.qty = Math.min(stock, existing.qty + capped);
				} else if (variant) {
					valid.push({ slug, variantId: variant.id, qty: capped });
				} else {
					valid.push({ slug, qty: capped });
				}
			}
			this.lines = valid;
		} catch {
			this.lines = [];
		}
	}

	private save(): void {
		if (!browser) return;
		try {
			localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.lines));
		} catch {
			// Storage full or unavailable: cart still works for this session.
		}
	}

	private savePromo(): void {
		if (!browser) return;
		try {
			if (this.appliedPromo) {
				localStorage.setItem(PROMO_STORAGE_KEY, this.appliedPromo.code);
			} else {
				localStorage.removeItem(PROMO_STORAGE_KEY);
			}
		} catch {
			// Storage full or unavailable: promo still applies for this session.
		}
	}
}

export const cart = new CartStore();
