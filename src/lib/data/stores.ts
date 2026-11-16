import type { LocalizedString } from '#lib/i18n/index';

/**
 * Fictional demo stores for the store locator. Addresses, hours and phone
 * numbers are placeholders in the same style as CONTACT_PHONE in
 * #lib/config — no real shop exists at these locations (the stores page
 * says so). Localized fields follow the products/categories pattern:
 * typed per locale, so a missing translation is a type error.
 */
export type Store = {
	id: string;
	/** City slug, used as the client-side filter value. */
	citySlug: string;
	city: LocalizedString;
	name: LocalizedString;
	address: LocalizedString;
	hours: LocalizedString;
	/** Demo phone number (placeholder style, never a real number). */
	phone: string;
};

export const stores: Store[] = [
	{
		id: 'algiers-centre',
		citySlug: 'algiers',
		city: { en: 'Algiers', fr: 'Alger' },
		name: { en: 'TechDova Algiers Centre', fr: 'TechDova Alger Centre' },
		address: {
			en: '12 Rue Didouche Mourad, Algiers 16000, Algeria',
			fr: '12 rue Didouche Mourad, Alger 16000, Algérie'
		},
		hours: {
			en: 'Saturday – Thursday: 9:00 – 19:00 · Friday: closed',
			fr: 'Samedi – jeudi : 9h00 – 19h00 · Vendredi : fermé'
		},
		phone: '+213 21 00 00 01'
	},
	{
		id: 'oran-front-de-mer',
		citySlug: 'oran',
		city: { en: 'Oran', fr: 'Oran' },
		name: { en: 'TechDova Oran Front de Mer', fr: 'TechDova Oran Front de Mer' },
		address: {
			en: '24 Boulevard de la Soummam, Oran 31000, Algeria',
			fr: '24 boulevard de la Soummam, Oran 31000, Algérie'
		},
		hours: {
			en: 'Saturday – Thursday: 9:00 – 20:00 · Friday: closed',
			fr: 'Samedi – jeudi : 9h00 – 20h00 · Vendredi : fermé'
		},
		phone: '+213 41 00 00 02'
	},
	{
		id: 'constantine-centre',
		citySlug: 'constantine',
		city: { en: 'Constantine', fr: 'Constantine' },
		name: { en: 'TechDova Constantine Centre', fr: 'TechDova Constantine Centre' },
		address: {
			en: '8 Rue Larbi Ben M’Hidi, Constantine 25000, Algeria',
			fr: '8 rue Larbi Ben M’Hidi, Constantine 25000, Algérie'
		},
		hours: {
			en: 'Saturday – Thursday: 9:00 – 19:00 · Friday: closed',
			fr: 'Samedi – jeudi : 9h00 – 19h00 · Vendredi : fermé'
		},
		phone: '+213 31 00 00 03'
	}
];

/** Cities in store order, for the city filter. */
export function getStoreCities(): { slug: string; name: LocalizedString }[] {
	const seen = new Map<string, LocalizedString>();
	for (const store of stores) {
		if (!seen.has(store.citySlug)) seen.set(store.citySlug, store.city);
	}
	return [...seen.entries()].map(([slug, name]) => ({ slug, name }));
}
