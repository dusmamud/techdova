import { browser } from '$app/env';
import { COMPARE_STORAGE_KEY } from '#lib/config';
import { COMPARE_MAX, toggleCompareList, type CompareToggleResult } from '#lib/compare';
import { getProduct } from '#lib/data/products';

/** Compare-tray state (max 4 products) persisted to localStorage. */
class CompareStore {
	slugs = $state<string[]>([]);

	constructor() {
		if (browser) this.load();
	}

	get count(): number {
		return this.slugs.length;
	}

	has(slug: string): boolean {
		return this.slugs.includes(slug);
	}

	toggle(slug: string): CompareToggleResult {
		const { list, result } = toggleCompareList(this.slugs, slug, COMPARE_MAX);
		this.slugs = list;
		this.save();
		return result;
	}

	remove(slug: string): void {
		this.slugs = this.slugs.filter((s) => s !== slug);
		this.save();
	}

	clear(): void {
		this.slugs = [];
		this.save();
	}

	private load(): void {
		try {
			const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
			if (!raw) return;
			const parsed: unknown = JSON.parse(raw);
			if (!Array.isArray(parsed)) return;
			this.slugs = parsed
				.filter((s): s is string => typeof s === 'string' && getProduct(s) !== undefined)
				.slice(0, COMPARE_MAX);
		} catch {
			this.slugs = [];
		}
	}

	private save(): void {
		if (!browser) return;
		try {
			localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(this.slugs));
		} catch {
			// Storage unavailable: compare still works for this session.
		}
	}
}

export const compare = new CompareStore();
