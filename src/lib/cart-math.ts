import type { Product } from '#lib/data/products';

export type CartLine = { slug: string; qty: number };

export type CartTotals = {
	/** Total number of items. */
	count: number;
	/** Sum of current prices. */
	subtotal: number;
	/** Sum of (oldPrice - price) savings for discounted lines. */
	savings: number;
	/** Amount payable (delivery is free in this demo). */
	total: number;
};

export function computeTotals(
	lines: CartLine[],
	lookup: (slug: string) => Product | undefined
): CartTotals {
	let count = 0;
	let subtotal = 0;
	let savings = 0;
	for (const line of lines) {
		const product = lookup(line.slug);
		if (!product || line.qty <= 0) continue;
		count += line.qty;
		subtotal += product.price * line.qty;
		if (product.oldPrice && product.oldPrice > product.price) {
			savings += (product.oldPrice - product.price) * line.qty;
		}
	}
	return { count, subtotal, savings, total: subtotal };
}

function clampQty(qty: number, maxQty: number): number {
	return Math.max(0, Math.min(maxQty, Math.floor(qty)));
}

/** Add qty of a product, clamped to available stock. Pure: returns a new array. */
export function addLine(lines: CartLine[], slug: string, qty: number, maxQty: number): CartLine[] {
	const existing = lines.find((l) => l.slug === slug);
	const current = existing?.qty ?? 0;
	const next = clampQty(current + qty, maxQty);
	if (next <= 0) return lines.filter((l) => l.slug !== slug);
	if (existing) return lines.map((l) => (l.slug === slug ? { ...l, qty: next } : l));
	return [...lines, { slug, qty: next }];
}

export function setLineQty(lines: CartLine[], slug: string, qty: number, maxQty: number): CartLine[] {
	const next = clampQty(qty, maxQty);
	if (next <= 0) return lines.filter((l) => l.slug !== slug);
	return lines.map((l) => (l.slug === slug ? { ...l, qty: next } : l));
}

export function removeLine(lines: CartLine[], slug: string): CartLine[] {
	return lines.filter((l) => l.slug !== slug);
}
