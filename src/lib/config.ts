/**
 * Site-wide constants. SITE_URL is the live Cloudflare Pages URL —
 * canonical / hreflang / sitemap URLs derive from it in this one place.
 */
export const SITE_NAME = 'TechDova';
export const SITE_URL = 'https://techdova.pages.dev';
export const SITE_YEAR = 2026;

/** Demo contact details (nothing is sent anywhere). */
export const CONTACT_EMAIL = 'support@techdova.example.com';
export const CONTACT_PHONE = '+213 21 00 00 00';

export const SOCIAL_LINKS = [
	{ network: 'Facebook', href: 'https://www.facebook.com/' },
	{ network: 'Instagram', href: 'https://www.instagram.com/' },
	{ network: 'YouTube', href: 'https://www.youtube.com/' },
	{ network: 'TikTok', href: 'https://www.tiktok.com/' }
] as const;

export const LOCALE_STORAGE_KEY = 'techdova-locale';
export const THEME_STORAGE_KEY = 'techdova-theme';
export const PROMO_STORAGE_KEY = 'techdova-promo';
export const CART_STORAGE_KEY = 'techdova-cart';
export const WISHLIST_STORAGE_KEY = 'techdova-wishlist';
export const COMPARE_STORAGE_KEY = 'techdova-compare';
export const ORDERS_STORAGE_KEY = 'techdova-orders';
export const ACCOUNT_STORAGE_KEY = 'techdova-account';
export const RECENTLY_VIEWED_STORAGE_KEY = 'techdova-recently-viewed';
export const REVIEW_VOTES_STORAGE_KEY = 'techdova-review-votes';
export const CHECKOUT_STORAGE_KEY = 'techdova-checkout';
export const ADDRESSES_STORAGE_KEY = 'techdova-addresses';
