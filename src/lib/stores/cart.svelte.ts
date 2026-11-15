import { browser } from '$app/env';
import { CART_STORAGE_KEY } from '#lib/config';
import { getProduct, type Product } from '#lib/data/products';
import {
	addLine,
	computeTotals,
	removeLine,
	setLineQty,
	type CartLine,
	type CartTotals
} from '#lib/cart-math';

export type DetailedLine = { product: Product; qty: number };

export type CartAnnouncement = { id: number; kind: 'added' | 'removed'; slug: string };

/** Cart state (Svelte 5 runes) persisted to localStorage. Demo only: nothing is sent anywhere. */
class CartStore {
	lines = $state<CartLine[]>([]);
	drawerOpen = $state(false);
	/** Last add/remove event, consumed by the aria-live region. Null until the first change. */
	announcement = $state<CartAnnouncement | null>(null);

	private announcementId = 0;

	constructor() {
		if (browser) this.load();
	}

	get totals(): CartTotals {
		return computeTotals(this.lines, getProduct);
	}

	get count(): number {
		return this.totals.count;
	}

	get detailed(): DetailedLine[] {
		return this.lines.flatMap((line) => {
			const product = getProduct(line.slug);
			return product ? [{ product, qty: line.qty }] : [];
		});
	}

	add(slug: string, qty = 1): void {
		const product = getProduct(slug);
		if (!product || product.stock <= 0) return;
		this.lines = addLine(this.lines, slug, qty, product.stock);
		this.save();
		this.announcement = { id: ++this.announcementId, kind: 'added', slug };
	}

	setQty(slug: string, qty: number): void {
		const product = getProduct(slug);
		if (!product) return;
		this.lines = setLineQty(this.lines, slug, qty, product.stock);
		this.save();
	}

	remove(slug: string): void {
		this.lines = removeLine(this.lines, slug);
		this.save();
		this.announcement = { id: ++this.announcementId, kind: 'removed', slug };
	}

	clear(): void {
		this.lines = [];
		this.save();
	}

	openDrawer(): void {
		this.drawerOpen = true;
	}

	closeDrawer(): void {
		this.drawerOpen = false;
	}

	private load(): void {
		try {
			const raw = localStorage.getItem(CART_STORAGE_KEY);
			if (!raw) return;
			const parsed: unknown = JSON.parse(raw);
			if (!Array.isArray(parsed)) return;
			const valid: CartLine[] = [];
			for (const entry of parsed) {
				if (typeof entry !== 'object' || entry === null) continue;
				const { slug, qty } = entry as { slug?: unknown; qty?: unknown };
				if (typeof slug !== 'string' || typeof qty !== 'number') continue;
				const product = getProduct(slug);
				if (!product || product.stock <= 0) continue;
				valid.push({ slug, qty: Math.max(1, Math.min(product.stock, Math.floor(qty))) });
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
}

export const cart = new CartStore();
