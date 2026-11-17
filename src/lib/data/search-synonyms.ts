import type { CategorySlug } from './categories';

/**
 * Locale-agnostic search synonyms: a generic word shoppers type maps to the
 * catalogue categories it means. Keys are normalized (lowercase, accents
 * stripped) so French terms match without a locale parameter. Only generic
 * category words are mapped — brand and product names already match the
 * product text literally, so mapping them would over-match.
 */
const synonymMap: Record<string, CategorySlug[]> = {
	// Smartphones
	phone: ['smartphones'],
	phones: ['smartphones'],
	smartphone: ['smartphones'],
	smartphones: ['smartphones'],
	mobile: ['smartphones'],
	mobiles: ['smartphones'],
	telephone: ['smartphones'],
	telephones: ['smartphones'],
	// "portable" is ambiguous in French (téléphone / ordinateur portable).
	portable: ['smartphones', 'computers'],
	portables: ['smartphones', 'computers'],
	// Computers
	laptop: ['computers'],
	laptops: ['computers'],
	computer: ['computers'],
	computers: ['computers'],
	notebook: ['computers'],
	notebooks: ['computers'],
	ultrabook: ['computers'],
	pc: ['computers'],
	ordinateur: ['computers'],
	ordinateurs: ['computers'],
	// Audio
	earbud: ['audio'],
	earbuds: ['audio'],
	earphone: ['audio'],
	earphones: ['audio'],
	headphone: ['audio'],
	headphones: ['audio'],
	headset: ['audio'],
	headsets: ['audio'],
	ecouteur: ['audio'],
	ecouteurs: ['audio'],
	casque: ['audio'],
	casques: ['audio'],
	// Smartwatches
	watch: ['smartwatches'],
	watches: ['smartwatches'],
	smartwatch: ['smartwatches'],
	smartwatches: ['smartwatches'],
	montre: ['smartwatches'],
	montres: ['smartwatches'],
	// Gaming
	console: ['gaming'],
	consoles: ['gaming'],
	controller: ['gaming'],
	controllers: ['gaming'],
	game: ['gaming'],
	games: ['gaming'],
	gaming: ['gaming'],
	manette: ['gaming'],
	manettes: ['gaming'],
	jeu: ['gaming'],
	jeux: ['gaming'],
	// Accessories
	charger: ['accessories'],
	chargers: ['accessories'],
	chargeur: ['accessories'],
	chargeurs: ['accessories'],
	cable: ['accessories'],
	cables: ['accessories'],
	hub: ['accessories'],
	hubs: ['accessories'],
	adapter: ['accessories'],
	adapters: ['accessories'],
	adaptateur: ['accessories'],
	accessory: ['accessories'],
	accessories: ['accessories'],
	accessoire: ['accessories'],
	accessoires: ['accessories']
};

/** Normalize a query word for synonym lookup: lowercase, accents stripped. */
export function normalizeSearchTerm(term: string): string {
	return term
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}

/** Categories a query word means via the synonym map, or [] when it has none. */
export function getSynonymCategories(term: string): CategorySlug[] {
	return synonymMap[normalizeSearchTerm(term)] ?? [];
}
