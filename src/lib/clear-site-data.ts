import { browser } from '$app/env';
import {
	ACCOUNT_STORAGE_KEY,
	ADDRESSES_STORAGE_KEY,
	CART_STORAGE_KEY,
	CHECKOUT_STORAGE_KEY,
	COMPARE_STORAGE_KEY,
	LOCALE_STORAGE_KEY,
	ORDERS_STORAGE_KEY,
	PROMO_STORAGE_KEY,
	RECENTLY_VIEWED_STORAGE_KEY,
	REVIEW_VOTES_STORAGE_KEY,
	THEME_STORAGE_KEY,
	WISHLIST_STORAGE_KEY
} from '#lib/config';

/**
 * Every key this demo storefront stores in the browser. The consent key
 * mirrors COOKIE_CONSENT_KEY in CookieBanner.svelte (defined locally there
 * per the component contract) so "clear my stored data" really clears
 * everything, including the remembered banner choice — the banner will ask
 * again on the next visit, which is the honest outcome of clearing storage.
 * The checkout draft lives in sessionStorage; every other key lives in
 * localStorage. Both storages are cleared for every key so the helper stays
 * correct even if a key moves between storages later.
 */
export const SITE_STORAGE_KEYS = [
	ACCOUNT_STORAGE_KEY,
	ADDRESSES_STORAGE_KEY,
	CART_STORAGE_KEY,
	CHECKOUT_STORAGE_KEY,
	COMPARE_STORAGE_KEY,
	LOCALE_STORAGE_KEY,
	ORDERS_STORAGE_KEY,
	PROMO_STORAGE_KEY,
	RECENTLY_VIEWED_STORAGE_KEY,
	REVIEW_VOTES_STORAGE_KEY,
	THEME_STORAGE_KEY,
	WISHLIST_STORAGE_KEY,
	'techdova-cookie-consent'
] as const;

/** Remove every TechDova storage entry from this browser. Browser-only, no-op during prerender. */
export function clearSiteData(): void {
	if (!browser) return;
	for (const key of SITE_STORAGE_KEYS) {
		try {
			localStorage.removeItem(key);
		} catch {
			// Storage unavailable: nothing to clear.
		}
		try {
			sessionStorage.removeItem(key);
		} catch {
			// Storage unavailable: nothing to clear.
		}
	}
}
