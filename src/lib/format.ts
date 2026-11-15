/**
 * Locale-aware formatting helpers. Prices are stored as plain DZD numbers and
 * rendered with Intl number formatting plus the "DA" suffix, exactly as in the
 * reference design (e.g. "999,00 DA" in French, "999.00 DA" in English).
 */
export function formatPrice(amount: number, intlLocale: string): string {
	const formatted = new Intl.NumberFormat(intlLocale, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount);
	return `${formatted} DA`;
}

export function formatCount(value: number, intlLocale: string): string {
	return new Intl.NumberFormat(intlLocale).format(value);
}

export function formatDecimal(value: number, intlLocale: string, digits = 1): string {
	return new Intl.NumberFormat(intlLocale, {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	}).format(value);
}

export function formatDate(date: Date, intlLocale: string): string {
	return new Intl.DateTimeFormat(intlLocale, { dateStyle: 'long' }).format(date);
}

/** Replace {placeholders} in a dictionary template string. */
export function interpolate(template: string, vars: Record<string, string | number>): string {
	return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''));
}
