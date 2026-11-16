/** Pure compare-list helper (the store owns persistence + slug validation). */

export const COMPARE_MAX = 4;

export type CompareToggleResult = 'added' | 'removed' | 'full';

/**
 * Toggle a slug in a compare list capped at `max`. Pure: returns a new list
 * and the outcome ('full' leaves the list unchanged).
 */
export function toggleCompareList(
	list: string[],
	slug: string,
	max = COMPARE_MAX
): { list: string[]; result: CompareToggleResult } {
	if (list.includes(slug)) {
		return { list: list.filter((s) => s !== slug), result: 'removed' };
	}
	if (list.length >= max) {
		return { list, result: 'full' };
	}
	return { list: [...list, slug], result: 'added' };
}
