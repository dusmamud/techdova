/**
 * Site-wide constants. SITE_URL is a placeholder until the site is deployed —
 * update it in this one place and canonical / hreflang / sitemap URLs follow.
 */
export const SITE_NAME = 'TechDova';
export const SITE_URL = 'https://techdova.example.com';
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
export const CART_STORAGE_KEY = 'techdova-cart';
export const WISHLIST_STORAGE_KEY = 'techdova-wishlist';
