import type { LocalizedString } from '#lib/i18n/index';

/**
 * Fictional demo reviews, shown with a demo notice. They are illustrative
 * content only — never presented as real customer feedback.
 */
export type DemoReview = {
	id: string;
	author: LocalizedString;
	rating: number;
	dateISO: string;
	title: LocalizedString;
	text: LocalizedString;
	helpful: number;
};

export const demoReviews: DemoReview[] = [
	{
		id: 'review-1',
		author: { en: 'Amira B.', fr: 'Amira B.' },
		rating: 5,
		dateISO: '2026-11-08',
		title: { en: 'Exactly as described', fr: 'Exactement comme décrit' },
		text: {
			en: 'The product arrived quickly and well packed, and it works perfectly. The quality matches the description and the photos — I am very happy with this purchase.',
			fr: 'Le produit est arrivé rapidement et bien emballé, et il fonctionne parfaitement. La qualité correspond à la description et aux photos — je suis très satisfaite de cet achat.'
		},
		helpful: 14
	},
	{
		id: 'review-2',
		author: { en: 'Yacine K.', fr: 'Yacine K.' },
		rating: 5,
		dateISO: '2026-11-02',
		title: { en: 'Great value for the price', fr: 'Excellent rapport qualité-prix' },
		text: {
			en: 'I compared several shops before ordering and this was the best price I found. Delivery took two days and the item was sealed and genuine. Highly recommended.',
			fr: 'J’ai comparé plusieurs boutiques avant de commander et c’était le meilleur prix que j’ai trouvé. La livraison a pris deux jours et l’article était scellé et authentique. Je recommande vivement.'
		},
		helpful: 9
	},
	{
		id: 'review-3',
		author: { en: 'Lina M.', fr: 'Lina M.' },
		rating: 4,
		dateISO: '2026-10-27',
		title: { en: 'Very good, with one small caveat', fr: 'Très bien, avec une petite réserve' },
		text: {
			en: 'Overall I am pleased: it does everything I needed and feels well made. My only note is that the setup instructions could be clearer for first-time users.',
			fr: 'Dans l’ensemble, je suis satisfaite : il fait tout ce dont j’avais besoin et semble bien fabriqué. Ma seule remarque est que les instructions d’installation pourraient être plus claires pour les débutants.'
		},
		helpful: 6
	},
	{
		id: 'review-4',
		author: { en: 'Sofiane H.', fr: 'Sofiane H.' },
		rating: 5,
		dateISO: '2026-10-19',
		title: { en: 'Works perfectly every day', fr: 'Fonctionne parfaitement chaque jour' },
		text: {
			en: 'I have used it daily for weeks now and it has been flawless. Battery life is as advertised and the build quality feels premium. I would buy it again.',
			fr: 'Je l’utilise quotidiennement depuis des semaines et il est impeccable. L’autonomie est conforme à l’annonce et la qualité de fabrication semble haut de gamme. Je le rachèterais.'
		},
		helpful: 11
	},
	{
		id: 'review-5',
		author: { en: 'Nadia T.', fr: 'Nadia T.' },
		rating: 4,
		dateISO: '2026-10-11',
		title: { en: 'Good quality, fast delivery', fr: 'Bonne qualité, livraison rapide' },
		text: {
			en: 'Ordered on Monday, delivered on Wednesday. The product itself is solid and easy to use. I took off one star only because I would have liked more colour choices.',
			fr: 'Commandé lundi, livré mercredi. Le produit lui-même est solide et facile à utiliser. J’ai retiré une étoile uniquement parce que j’aurais aimé plus de choix de couleurs.'
		},
		helpful: 4
	},
	{
		id: 'review-6',
		author: { en: 'Karim D.', fr: 'Karim D.' },
		rating: 5,
		dateISO: '2026-10-03',
		title: { en: 'Better than expected', fr: 'Mieux que prévu' },
		text: {
			en: 'I was unsure at first, but this exceeded my expectations. It is comfortable, reliable and a pleasure to use. Customer support also answered my question quickly.',
			fr: 'J’étais sceptique au début, mais cela a dépassé mes attentes. C’est confortable, fiable et agréable à utiliser. Le service client a aussi répondu rapidement à ma question.'
		},
		helpful: 7
	}
];

function hashSlug(slug: string): number {
	let hash = 0;
	for (let i = 0; i < slug.length; i++) {
		hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
	}
	return hash;
}

/** Deterministically pick 3 reviews for a product slug (same input, same output). */
export function getReviewsForProduct(slug: string): DemoReview[] {
	const start = hashSlug(slug) % demoReviews.length;
	const picked: DemoReview[] = [];
	for (let i = 0; i < 3; i++) {
		picked.push(demoReviews[(start + i) % demoReviews.length]);
	}
	return picked;
}

export type RatingBreakdownRow = { stars: number; percent: number };

/**
 * A plausible 5-to-1-star distribution for a displayed average rating.
 * Percents are whole numbers summing to exactly 100 (largest-remainder
 * rounding), and the weighted mean stays within 0.3 of the input rating.
 * `reviewCount` is accepted for API symmetry with the product data; the
 * distribution is derived from the rating alone.
 */
export function getRatingBreakdown(rating: number, reviewCount: number): RatingBreakdownRow[] {
	void reviewCount;
	const clamped = Math.max(1, Math.min(5, rating));
	const weights = [5, 4, 3, 2, 1].map((stars) => {
		const distance = stars - clamped;
		return Math.exp(-(distance * distance) / 0.5);
	});
	const totalWeight = weights.reduce((sum, w) => sum + w, 0);
	const exact = weights.map((w) => (w / totalWeight) * 100);
	const floors = exact.map((value) => Math.floor(value));
	let remainder = 100 - floors.reduce((sum, value) => sum + value, 0);
	const order = exact
		.map((value, index) => ({ index, fraction: value - floors[index] }))
		.sort((a, b) => b.fraction - a.fraction);
	for (const entry of order) {
		if (remainder <= 0) break;
		floors[entry.index] += 1;
		remainder -= 1;
	}
	return [5, 4, 3, 2, 1].map((stars, index) => ({ stars, percent: floors[index] }));
}

/** Toggle an id in a voted-ids list. Pure: returns a new array. */
export function toggleVote(votedIds: string[], id: string): string[] {
	return votedIds.includes(id) ? votedIds.filter((v) => v !== id) : [...votedIds, id];
}
