import { browser } from '$app/env';
import { ACCOUNT_STORAGE_KEY } from '#lib/config';

/** Demo account profile (name + email only — no passwords anywhere). */
export type AccountProfile = { name: string; email: string };

/** Demo notification preferences. Toggles only — no message is ever sent. */
export type NotificationPreferences = {
	orderUpdates: boolean;
	offers: boolean;
	newsletter: boolean;
};

export type NotificationPreferenceKey = keyof NotificationPreferences;

const DEFAULT_PREFERENCES: NotificationPreferences = {
	orderUpdates: true,
	offers: false,
	newsletter: false
};

/** Demo sign-in state persisted to localStorage. */
class AccountStore {
	profile = $state<AccountProfile | null>(null);
	preferences = $state<NotificationPreferences>({ ...DEFAULT_PREFERENCES });

	constructor() {
		if (browser) this.load();
	}

	signIn(name: string, email: string): void {
		this.profile = { name, email };
		this.save();
	}

	/** Change the signed-in profile's name/email, keeping preferences. */
	updateProfile(name: string, email: string): void {
		if (!this.profile) return;
		this.profile = { name, email };
		this.save();
	}

	setPreference(key: NotificationPreferenceKey, value: boolean): void {
		this.preferences = { ...this.preferences, [key]: value };
		this.save();
	}

	signOut(): void {
		this.profile = null;
		this.preferences = { ...DEFAULT_PREFERENCES };
		this.save();
	}

	private load(): void {
		try {
			const raw = localStorage.getItem(ACCOUNT_STORAGE_KEY);
			if (!raw) return;
			const parsed: unknown = JSON.parse(raw);
			if (typeof parsed !== 'object' || parsed === null) return;
			const { name, email, preferences } = parsed as {
				name?: unknown;
				email?: unknown;
				preferences?: unknown;
			};
			if (typeof name !== 'string' || typeof email !== 'string') return;
			this.profile = { name, email };
			// Preferences ride along in the same stored object; older
			// stored profiles without them keep the defaults.
			if (typeof preferences === 'object' && preferences !== null) {
				const { orderUpdates, offers, newsletter } = preferences as {
					orderUpdates?: unknown;
					offers?: unknown;
					newsletter?: unknown;
				};
				this.preferences = {
					orderUpdates: typeof orderUpdates === 'boolean' ? orderUpdates : true,
					offers: typeof offers === 'boolean' ? offers : false,
					newsletter: typeof newsletter === 'boolean' ? newsletter : false
				};
			}
		} catch {
			this.profile = null;
		}
	}

	private save(): void {
		if (!browser) return;
		try {
			if (this.profile) {
				localStorage.setItem(
					ACCOUNT_STORAGE_KEY,
					JSON.stringify({ ...this.profile, preferences: this.preferences })
				);
			} else {
				localStorage.removeItem(ACCOUNT_STORAGE_KEY);
			}
		} catch {
			// Storage unavailable: the profile still works for this session.
		}
	}
}

export const account = new AccountStore();
