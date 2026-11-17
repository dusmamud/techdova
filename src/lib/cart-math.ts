import { getVariant, variantPrice, type Product } from '#lib/data/products';

export type CartLine = { slug: string; variantId?: string; qty: number };

export type CartTotals = {
	/** Total number of items. */
	count: number;
	/** Sum of current prices. */
	subtotal: number;
	/** Sum of (oldPrice - price) savings for discounted lines. */
	savings: number;
	/** Amount payable (delivery is free in this demo). */
	total: number;
	/** Promo-code discount on the subtotal; present only when a promo is applied. */
	promoDiscount?: number;
};

export function computeTotals(
	lines: CartLine[],
	lookup: (slug: string) => Product | undefined,
	promoPercent = 0
): CartTotals {
	let count = 0;
	let subtotal = 0;
	let savings = 0;
	for (const line of lines) {
		const product = lookup(line.slug);
		if (!product || line.qty <= 0) continue;
		// An unknown variantId falls back to the default variant: the line
		// still prices at the base price instead of disappearing.
		const variant = getVariant(product, line.variantId);
		const unitPrice = variantPrice(product, variant);
		count += line.qty;
		subtotal += unitPrice * line.qty;
		if (product.oldPrice && product.oldPrice > product.price) {
			savings += (product.oldPrice - product.price) * line.qty;
		}
	}
	if (promoPercent > 0) {
		const promoDiscount = Math.round(subtotal * (promoPercent / 100) * 100) / 100;
		return {
			count,
			subtotal,
			savings,
			total: Math.round((subtotal - promoDiscount) * 100) / 100,
			promoDiscount
		};
	}
	return { count, subtotal, savings, total: subtotal };
}

function clampQty(qty: number, maxQty: number): number {
	return Math.max(0, Math.min(maxQty, Math.floor(qty)));
}

/** Lines are keyed by slug + variantId; a missing variantId is the default variant. */
function sameLine(a: CartLine, slug: string, variantId: string | undefined): boolean {
	return a.slug === slug && (a.variantId ?? undefined) === (variantId ?? undefined);
}

function makeLine(slug: string, qty: number, variantId: string | undefined): CartLine {
	return variantId === undefined ? { slug, qty } : { slug, variantId, qty };
}

/**
 * Add qty of a product variant, clamped to available stock. Pure: returns a
 * new array. `maxQty` is the per-variant stock cap (variant stock when a
 * variant is given, else the product stock) — the caller resolves it.
 */
export function addLine(
	lines: CartLine[],
	slug: string,
	qty: number,
	maxQty: number,
	variantId?: string
): CartLine[] {
	const existing = lines.find((l) => sameLine(l, slug, variantId));
	const current = existing?.qty ?? 0;
	const next = clampQty(current + qty, maxQty);
	if (next <= 0) return lines.filter((l) => !sameLine(l, slug, variantId));
	if (existing) {
		return lines.map((l) => (sameLine(l, slug, variantId) ? { ...l, qty: next } : l));
	}
	return [...lines, makeLine(slug, next, variantId)];
}

export function setLineQty(
	lines: CartLine[],
	slug: string,
	qty: number,
	maxQty: number,
	variantId?: string
): CartLine[] {
	const next = clampQty(qty, maxQty);
	if (next <= 0) return lines.filter((l) => !sameLine(l, slug, variantId));
	return lines.map((l) => (sameLine(l, slug, variantId) ? { ...l, qty: next } : l));
}

/**
 * Remove one line, keyed by slug + variantId. A missing variantId targets
 * the default-variant line, matching addLine/setLineQty; variant lines for
 * the same slug are left untouched.
 */
export function removeLine(lines: CartLine[], slug: string, variantId?: string): CartLine[] {
	return lines.filter((l) => !sameLine(l, slug, variantId));
}
