import { browser } from '$app/env';
import { ACCOUNT_STORAGE_KEY } from '#lib/config';

/** Demo account profile (name + email only — no passwords anywhere). */
export type AccountProfile = { name: string; email: string };

/** Demo sign-in state persisted to localStorage. */
class AccountStore {
	profile = $state<AccountProfile | null>(null);

	constructor() {
		if (browser) this.load();
	}

	signIn(name: string, email: string): void {
		this.profile = { name, email };
		this.save();
	}

	signOut(): void {
		this.profile = null;
		this.save();
	}

	private load(): void {
		try {
			const raw = localStorage.getItem(ACCOUNT_STORAGE_KEY);
			if (!raw) return;
			const parsed: unknown = JSON.parse(raw);
			if (typeof parsed !== 'object' || parsed === null) return;
			const { name, email } = parsed as { name?: unknown; email?: unknown };
			if (typeof name !== 'string' || typeof email !== 'string') return;
			this.profile = { name, email };
		} catch {
			this.profile = null;
		}
	}

	private save(): void {
		if (!browser) return;
		try {
			if (this.profile) {
				localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(this.profile));
			} else {
				localStorage.removeItem(ACCOUNT_STORAGE_KEY);
			}
		} catch {
			// Storage unavailable: the profile still works for this session.
		}
	}
}

export const account = new AccountStore();
