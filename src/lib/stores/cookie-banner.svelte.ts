/**
 * Height in pixels of the visible cookie banner (0 when hidden or during
 * prerender). Bottom-fixed controls — compare tray, chat FAB/panel,
 * back-to-top button, PDP sticky bar — lift by this amount so the banner
 * never covers them on a first visit, when no consent choice is stored yet.
 */
class CookieBannerStore {
	height = $state(0);
}

export const cookieBanner = new CookieBannerStore();
