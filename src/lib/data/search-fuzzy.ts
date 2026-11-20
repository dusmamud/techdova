import { normalizeSearchTerm } from './search-synonyms';

/** Classic Levenshtein edit distance (pure). */
export function levenshtein(a: string, b: string): number {
	if (a === b) return 0;
	const aLen = a.length;
	const bLen = b.length;
	if (aLen === 0) return bLen;
	if (bLen === 0) return aLen;
	let prev = Array.from({ length: bLen + 1 }, (_, i) => i);
	for (let i = 1; i <= aLen; i++) {
		const curr = [i];
		for (let j = 1; j <= bLen; j++) {
			curr[j] = Math.min(
				prev[j] + 1,
				curr[j - 1] + 1,
				prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
			);
		}
		prev = curr;
	}
	return prev[bLen];
}

/**
 * Max edit distance tolerated for a word: 1 for short words (3–4 chars),
 * 2 for longer words. Shorter words are never corrected — with 1–2
 * letters almost anything is "close", so correcting them would misfire.
 */
export function maxDistanceFor(word: string): number {
	if (word.length < 3) return 0;
	if (word.length <= 4) return 1;
	return 2;
}

/**
 * Correct one query word against a candidate list (already normalized).
 * Returns the closest candidate within tolerance, or null.
 */
export function correctWord(word: string, candidates: readonly string[]): string | null {
	const normalized = normalizeSearchTerm(word);
	if (normalized.length < 3) return null;
	if (candidates.includes(normalized)) return null;
	let best: string | null = null;
	let bestDistance = Number.POSITIVE_INFINITY;
	for (const candidate of candidates) {
		// Cheap pre-filter: words that differ wildly in length cannot be
		// within tolerance (distance >= length difference).
		if (Math.abs(candidate.length - normalized.length) > 2) continue;
		const distance = levenshtein(normalized, candidate);
		if (distance < bestDistance) {
			bestDistance = distance;
			best = candidate;
		}
	}
	if (best !== null && bestDistance <= maxDistanceFor(normalized)) return best;
	return null;
}

/**
 * "Did you mean" for a whole query: correct each mistyped word against
 * the candidate vocabulary and return the corrected query, or null when
 * nothing is close enough. The query itself is never changed by this
 * function — the caller shows the suggestion and applies it on click.
 */
export function suggestCorrection(query: string, candidates: readonly string[]): string | null {
	const words = query.trim().split(/\s+/);
	let changed = false;
	const corrected = words.map((word) => {
		const fix = correctWord(word, candidates);
		if (fix) {
			changed = true;
			return fix;
		}
		return word;
	});
	return changed ? corrected.join(' ') : null;
}
