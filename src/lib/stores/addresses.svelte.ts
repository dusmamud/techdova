import { browser } from '$app/env';
import { ADDRESSES_STORAGE_KEY } from '#lib/config';

/** Demo delivery address fields (no payment data — never collected). */
export type AddressInput = {
	name: string;
	street: string;
	city: string;
	postalCode: string;
	phone: string;
};

export type SavedAddress = AddressInput & { id: string };

function isValidAddress(value: unknown): value is SavedAddress {
	if (typeof value !== 'object' || value === null) return false;
	const { id, name, street, city, postalCode, phone } = value as Record<string, unknown>;
	return (
		typeof id === 'string' &&
		id.length > 0 &&
		typeof name === 'string' &&
		typeof street === 'string' &&
		typeof city === 'string' &&
		typeof postalCode === 'string' &&
		typeof phone === 'string'
	);
}

function newId(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}
	return `addr-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

/** Demo saved addresses persisted to localStorage (browser only). */
class AddressesStore {
	addresses = $state<SavedAddress[]>([]);

	constructor() {
		if (browser) this.load();
	}

	add(input: AddressInput): SavedAddress {
		const address: SavedAddress = { ...input, id: newId() };
		this.addresses = [...this.addresses, address];
		this.save();
		return address;
	}

	update(id: string, input: AddressInput): void {
		this.addresses = this.addresses.map((address) =>
			address.id === id ? { ...input, id } : address
		);
		this.save();
	}

	remove(id: string): void {
		this.addresses = this.addresses.filter((address) => address.id !== id);
		this.save();
	}

	private load(): void {
		try {
			const raw = localStorage.getItem(ADDRESSES_STORAGE_KEY);
			if (!raw) return;
			const parsed: unknown = JSON.parse(raw);
			if (!Array.isArray(parsed)) return;
			this.addresses = parsed.filter(isValidAddress);
		} catch {
			this.addresses = [];
		}
	}

	private save(): void {
		if (!browser) return;
		try {
			localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(this.addresses));
		} catch {
			// Storage unavailable: addresses still work for this session.
		}
	}
}

export const addresses = new AddressesStore();
