import { browser } from '$app/env';

/**
 * Gift options for the current order (demo only, localStorage).
 * Stored separately from the cart lines: gift wrap / message / "send as
 * gift" apply to the whole order, not to one line. Nothing is printed or
 * shipped — the options are only displayed in the cart and at checkout.
 */
const GIFT_STORAGE_KEY = 'techdova-gift-options';

export type GiftOptionsState = {
	wrap: boolean;
	message: string;
	sendAsGift: boolean;
};

class GiftOptionsStore {
	wrap = $state(false);
	message = $state('');
	sendAsGift = $state(false);

	constructor() {
		if (browser) this.load();
	}

	/** True when any gift option is set, so cart/checkout know to show the gift line. */
	get active(): boolean {
		return this.wrap || this.sendAsGift || this.message.trim() !== '';
	}

	setWrap(value: boolean): void {
		this.wrap = value;
		this.save();
	}

	setMessage(value: string): void {
		this.message = value;
		this.save();
	}

	setSendAsGift(value: boolean): void {
		this.sendAsGift = value;
		this.save();
	}

	clear(): void {
		this.wrap = false;
		this.message = '';
		this.sendAsGift = false;
		this.save();
	}

	private load(): void {
		try {
			const raw = localStorage.getItem(GIFT_STORAGE_KEY);
			if (!raw) return;
			const parsed: unknown = JSON.parse(raw);
			if (typeof parsed !== 'object' || parsed === null) return;
			const { wrap, message, sendAsGift } = parsed as Partial<GiftOptionsState>;
			if (typeof wrap === 'boolean') this.wrap = wrap;
			if (typeof message === 'string') this.message = message;
			if (typeof sendAsGift === 'boolean') this.sendAsGift = sendAsGift;
		} catch {
			// Corrupt or unavailable storage: start with no gift options.
		}
	}

	private save(): void {
		if (!browser) return;
		try {
			localStorage.setItem(
				GIFT_STORAGE_KEY,
				JSON.stringify({ wrap: this.wrap, message: this.message, sendAsGift: this.sendAsGift })
			);
		} catch {
			// Storage unavailable: options still apply for this session.
		}
	}
}

export const giftOptions = new GiftOptionsStore();
