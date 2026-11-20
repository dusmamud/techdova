import { browser } from '$app/env';

/**
 * Price-drop alerts (demo only, localStorage). An alert records a product
 * slug and a target price; it is listed in the account page and flagged
 * on the product page when the current price is at or below the target.
 * No email is ever sent — the alert lives only in this browser.
 */
const PRICE_ALERTS_STORAGE_KEY = 'techdova-price-alerts';

export type PriceAlert = { slug: string; targetPrice: number; createdISO: string };

class PriceAlertsStore {
	alerts = $state<PriceAlert[]>([]);

	constructor() {
		if (browser) this.load();
	}

	getFor(slug: string): PriceAlert | undefined {
		return this.alerts.find((alert) => alert.slug === slug);
	}

	set(slug: string, targetPrice: number): void {
		const existing = this.getFor(slug);
		if (existing) {
			this.alerts = this.alerts.map((alert) =>
				alert.slug === slug ? { ...alert, targetPrice } : alert
			);
		} else {
			this.alerts = [
				...this.alerts,
				{ slug, targetPrice, createdISO: new Date().toISOString() }
			];
		}
		this.save();
	}

	remove(slug: string): void {
		this.alerts = this.alerts.filter((alert) => alert.slug !== slug);
		this.save();
	}

	private load(): void {
		try {
			const raw = localStorage.getItem(PRICE_ALERTS_STORAGE_KEY);
			if (!raw) return;
			const parsed: unknown = JSON.parse(raw);
			if (!Array.isArray(parsed)) return;
			const valid: PriceAlert[] = [];
			for (const entry of parsed) {
				if (typeof entry !== 'object' || entry === null) continue;
				const { slug, targetPrice, createdISO } = entry as {
					slug?: unknown;
					targetPrice?: unknown;
					createdISO?: unknown;
				};
				if (
					typeof slug === 'string' &&
					typeof targetPrice === 'number' &&
					targetPrice > 0 &&
					typeof createdISO === 'string'
				) {
					valid.push({ slug, targetPrice, createdISO });
				}
			}
			this.alerts = valid;
		} catch {
			this.alerts = [];
		}
	}

	private save(): void {
		if (!browser) return;
		try {
			localStorage.setItem(PRICE_ALERTS_STORAGE_KEY, JSON.stringify(this.alerts));
		} catch {
			// Storage unavailable: alerts still apply for this session.
		}
	}
}

export const priceAlerts = new PriceAlertsStore();
