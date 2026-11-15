import { browser } from '$app/env';
import { WISHLIST_STORAGE_KEY } from '#lib/config';
import { getProduct } from '#lib/data/products';

/** Wishlist (heart) state persisted to localStorage. */
class WishlistStore {
	slugs = $state<string[]>([]);

	constructor() {
		if (browser) this.load();
	}

	has(slug: string): boolean {
		return this.slugs.includes(slug);
	}

	toggle(slug: string): void {
		if (this.has(slug)) {
			this.slugs = this.slugs.filter((s) => s !== slug);
		} else {
			this.slugs = [...this.slugs, slug];
		}
		this.save();
	}

	private load(): void {
		try {
			const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
			if (!raw) return;
			const parsed: unknown = JSON.parse(raw);
			if (!Array.isArray(parsed)) return;
			this.slugs = parsed.filter(
				(s): s is string => typeof s === 'string' && getProduct(s) !== undefined
			);
		} catch {
			this.slugs = [];
		}
	}

	private save(): void {
		if (!browser) return;
		try {
			localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this.slugs));
		} catch {
			// Storage unavailable: wishlist still works for this session.
		}
	}
}

export const wishlist = new WishlistStore();
