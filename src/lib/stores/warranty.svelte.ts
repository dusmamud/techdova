import { browser } from '$app/env';
import { variantPrice, type Product, type ProductVariant } from '#lib/data/products';

/**
 * Extended-warranty upsell (demo only, localStorage). One warranty per
 * product slug, priced at 10% of the product's current unit price. No
 * real coverage is sold — the warranty is only listed as an order line
 * in the cart and at checkout.
 */
const WARRANTY_STORAGE_KEY = 'techdova-warranties';

/** 1-year extended warranty price: 10% of the unit price, to the cent. */
export function warrantyPrice(unitPrice: number): number {
	return Math.round(unitPrice * 0.1 * 100) / 100;
}

export type WarrantyLine = { product: Product; variant: ProductVariant | undefined; qty: number };

/** Total warranty cost for the given cart lines (only lines with a warranty). */
export function warrantyTotalFor(lines: WarrantyLine[]): number {
	let total = 0;
	for (const line of lines) {
		if (!warranty.has(line.product.slug)) continue;
		total += warrantyPrice(variantPrice(line.product, line.variant)) * line.qty;
	}
	return Math.round(total * 100) / 100;
}

class WarrantyStore {
	slugs = $state<string[]>([]);

	constructor() {
		if (browser) this.load();
	}

	has(slug: string): boolean {
		return this.slugs.includes(slug);
	}

	toggle(slug: string): void {
		this.slugs = this.has(slug)
			? this.slugs.filter((s) => s !== slug)
			: [...this.slugs, slug];
		this.save();
	}

	remove(slug: string): void {
		if (!this.has(slug)) return;
		this.slugs = this.slugs.filter((s) => s !== slug);
		this.save();
	}

	clear(): void {
		this.slugs = [];
		this.save();
	}

	private load(): void {
		try {
			const raw = localStorage.getItem(WARRANTY_STORAGE_KEY);
			if (!raw) return;
			const parsed: unknown = JSON.parse(raw);
			if (Array.isArray(parsed)) {
				this.slugs = parsed.filter((v): v is string => typeof v === 'string');
			}
		} catch {
			this.slugs = [];
		}
	}

	private save(): void {
		if (!browser) return;
		try {
			localStorage.setItem(WARRANTY_STORAGE_KEY, JSON.stringify(this.slugs));
		} catch {
			// Storage unavailable: warranties still apply for this session.
		}
	}
}

export const warranty = new WarrantyStore();
