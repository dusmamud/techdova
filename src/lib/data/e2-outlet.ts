import type { LocalizedString } from '#lib/i18n/index';
import { getProduct, type Product } from './products';

/**
 * Outlet (clearance / open-box / refurbished) demo listings. Each entry
 * reuses a catalogue product and states its condition honestly: an
 * open-box item was returned unopened or barely used, a refurbished item
 * was checked and restored by the demo service team, a clearance item is
 * simply the last of a line being cleared at a lower price. Outlet prices
 * are fictional demo prices below the catalogue price; no fake scarcity
 * copy ("only 1 left") is used anywhere. The outlet card links to the
 * product page — the demo cart always charges the catalogue price, and
 * the outlet page says so.
 */
export type OutletCondition = 'open-box' | 'refurbished' | 'clearance';

export type OutletItem = {
	product: Product;
	condition: OutletCondition;
	conditionLabel: LocalizedString;
	conditionNote: LocalizedString;
	/** Fictional demo outlet price (below product.price). */
	outletPrice: number;
};

const items: {
	slug: string;
	condition: OutletCondition;
	conditionLabel: LocalizedString;
	conditionNote: LocalizedString;
	outletPrice: number;
}[] = [
	{
		slug: 'iphone-15-pro',
		condition: 'open-box',
		conditionLabel: { en: 'Open-box', fr: 'Boîte ouverte' },
		conditionNote: {
			en: 'Returned within 14 days, box opened, device as new and fully checked.',
			fr: 'Retourné sous 14 jours, boîte ouverte, appareil comme neuf et entièrement vérifié.'
		},
		outletPrice: 849
	},
	{
		slug: 'galaxy-s24',
		condition: 'refurbished',
		conditionLabel: { en: 'Refurbished', fr: 'Reconditionné' },
		conditionNote: {
			en: 'Checked, cleaned and restored by our demo service team, with a 6-month demo warranty.',
			fr: 'Vérifié, nettoyé et restauré par notre équipe de service démo, avec une garantie démo de 6 mois.'
		},
		outletPrice: 749
	},
	{
		slug: 'macbook-air-m2',
		condition: 'open-box',
		conditionLabel: { en: 'Open-box', fr: 'Boîte ouverte' },
		conditionNote: {
			en: 'Returned within 14 days, box opened, device as new and fully checked.',
			fr: 'Retourné sous 14 jours, boîte ouverte, appareil comme neuf et entièrement vérifié.'
		},
		outletPrice: 1099
	},
	{
		slug: 'dell-xps-13',
		condition: 'clearance',
		conditionLabel: { en: 'Clearance', fr: 'Déstockage' },
		conditionNote: {
			en: 'Last units of this configuration, sold at a lower price while the line is cleared.',
			fr: 'Dernières unités de cette configuration, vendues moins cher pendant le déstockage.'
		},
		outletPrice: 1299
	},
	{
		slug: 'airpods-pro',
		condition: 'refurbished',
		conditionLabel: { en: 'Refurbished', fr: 'Reconditionné' },
		conditionNote: {
			en: 'Checked, cleaned and restored by our demo service team, with new ear tips included.',
			fr: 'Vérifié, nettoyé et restauré par notre équipe de service démo, avec des embouts neufs inclus.'
		},
		outletPrice: 499
	},
	{
		slug: 'sony-wh1000xm5',
		condition: 'open-box',
		conditionLabel: { en: 'Open-box', fr: 'Boîte ouverte' },
		conditionNote: {
			en: 'Returned within 14 days, box opened, device as new and fully checked.',
			fr: 'Retourné sous 14 jours, boîte ouverte, appareil comme neuf et entièrement vérifié.'
		},
		outletPrice: 629
	},
	{
		slug: 'galaxy-watch-6',
		condition: 'clearance',
		conditionLabel: { en: 'Clearance', fr: 'Déstockage' },
		conditionNote: {
			en: 'Last units of this configuration, sold at a lower price while the line is cleared.',
			fr: 'Dernières unités de cette configuration, vendues moins cher pendant le déstockage.'
		},
		outletPrice: 549
	},
	{
		slug: 'apple-watch-9',
		condition: 'refurbished',
		conditionLabel: { en: 'Refurbished', fr: 'Reconditionné' },
		conditionNote: {
			en: 'Checked, cleaned and restored by our demo service team, with a 6-month demo warranty.',
			fr: 'Vérifié, nettoyé et restauré par notre équipe de service démo, avec une garantie démo de 6 mois.'
		},
		outletPrice: 649
	},
	{
		slug: 'dualsense-controller',
		condition: 'clearance',
		conditionLabel: { en: 'Clearance', fr: 'Déstockage' },
		conditionNote: {
			en: 'Last units of this configuration, sold at a lower price while the line is cleared.',
			fr: 'Dernières unités de cette configuration, vendues moins cher pendant le déstockage.'
		},
		outletPrice: 149
	},
	{
		slug: 'nintendo-switch',
		condition: 'open-box',
		conditionLabel: { en: 'Open-box', fr: 'Boîte ouverte' },
		conditionNote: {
			en: 'Returned within 14 days, box opened, device as new and fully checked.',
			fr: 'Retourné sous 14 jours, boîte ouverte, appareil comme neuf et entièrement vérifié.'
		},
		outletPrice: 949
	}
];

export const outletItems: OutletItem[] = items.map((item) => {
	const product = getProduct(item.slug);
	if (!product) throw new Error(`Unknown outlet product: ${item.slug}`);
	return { ...item, product };
});

export const outletConditions: OutletCondition[] = ['open-box', 'refurbished', 'clearance'];

/** Demo saving versus the catalogue price, in DA. */
export function outletSaving(item: OutletItem): number {
	return item.product.price - item.outletPrice;
}
