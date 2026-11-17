import type { LocalizedString } from '#lib/i18n/index';

/**
 * Demo promo codes. `percent` is the percentage discount on the cart
 * subtotal. Codes are matched case-insensitively with surrounding
 * whitespace ignored; there is no backend, so these are the only codes
 * that exist. Demo-honest: the discount shown is always the discount
 * applied by computeTotals.
 */
export type PromoCode = {
	code: string;
	percent: number;
	label: LocalizedString;
};

export const promoCodes: PromoCode[] = [
	{
		code: 'TECHDOVA10',
		percent: 10,
		label: { en: '10% off your order', fr: '10 % de réduction sur votre commande' }
	},
	{
		code: 'WELCOME15',
		percent: 15,
		label: { en: '15% off for new customers', fr: '15 % de réduction pour les nouveaux clients' }
	},
	{
		code: 'SAVE20',
		percent: 20,
		label: { en: '20% off your order', fr: '20 % de réduction sur votre commande' }
	}
];

/** Find a promo by user input, or undefined for unknown/empty codes. */
export function getPromoCode(input: string): PromoCode | undefined {
	const normalized = input.trim().toUpperCase();
	if (!normalized) return undefined;
	return promoCodes.find((promo) => promo.code === normalized);
}
