import { browser } from '$app/env';
import { RECENTLY_VIEWED_STORAGE_KEY } from '#lib/config';
import { getProduct } from '#lib/data/products';

export const RECENTLY_VIEWED_MAX = 8;

/** Record a view: most-recent-first, deduped, capped. Pure. */
export function recordViewed(list: string[], slug: string, max = RECENTLY_VIEWED_MAX): string[] {
	return [slug, ...list.filter((s) => s !== slug)].slice(0, max);
}

/** Load the viewed history, dropping slugs that are not real products. */
export function loadRecentlyViewed(): string[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(
			(s): s is string => typeof s === 'string' && getProduct(s) !== undefined
		);
	} catch {
		return [];
	}
}

export function saveRecentlyViewed(list: string[]): void {
	if (!browser) return;
	try {
		localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(list));
	} catch {
		// Storage unavailable: history still works for this session's caller.
	}
}
