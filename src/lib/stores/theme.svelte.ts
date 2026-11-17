import { browser } from '$app/env';
import { THEME_STORAGE_KEY } from '#lib/config';

/**
 * Theme-color values kept in sync with the tokens in src/app.css and the
 * no-flash script in src/app.html: light matches --color-surface, dark
 * matches the .dark --color-surface.
 */
export const THEME_COLOR_LIGHT = '#ffffff';
export const THEME_COLOR_DARK = '#0e1712';

/**
 * Dark-mode state (Svelte 5 runes) persisted to localStorage. The `.dark`
 * class is set before first paint by the inline script in app.html, so the
 * initial state is read straight from the document — the store never
 * flashes the wrong theme on load. Prerendered HTML is always light;
 * the no-flash script fixes the class before paint on the client.
 */
class ThemeStore {
	dark = $state(false);

	constructor() {
		if (browser) {
			this.dark = document.documentElement.classList.contains('dark');
		}
	}

	toggle(): void {
		this.setDark(!this.dark);
	}

	setDark(dark: boolean): void {
		this.dark = dark;
		if (!browser) return;
		document.documentElement.classList.toggle('dark', dark);
		try {
			localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
		} catch {
			// Storage unavailable: the theme still applies for this session.
		}
		document
			.querySelector('meta[name="theme-color"]')
			?.setAttribute('content', dark ? THEME_COLOR_DARK : THEME_COLOR_LIGHT);
	}
}

export const theme = new ThemeStore();
