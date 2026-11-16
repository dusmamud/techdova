import { browser } from '$app/env';
import { ORDERS_STORAGE_KEY } from '#lib/config';

/** Demo orders live only in the browser: nothing is sent anywhere. */
export type DemoOrderLine = { slug: string; qty: number; unitPrice: number };

export type DemoOrder = {
	id: string;
	placedAtISO: string;
	name: string;
	email: string;
	lines: DemoOrderLine[];
	total: number;
};

export type OrderStatus = 'ordered' | 'shipped' | 'out-for-delivery' | 'delivered';

export const ORDER_STATUS_STEPS: OrderStatus[] = [
	'ordered',
	'shipped',
	'out-for-delivery',
	'delivered'
];

/** Order id in the existing cart style: `TD-` + base-36 timestamp. */
export function generateOrderId(): string {
	return `TD-${Date.now().toString(36).toUpperCase()}`;
}

/** Sum of qty x unitPrice over the order lines. Pure. */
export function orderTotal(lines: DemoOrderLine[]): number {
	return lines.reduce((sum, line) => sum + line.qty * line.unitPrice, 0);
}

const HOUR_MS = 3600_000;

/**
 * Delivery status derived purely from the order's age: under 24h ordered,
 * under 48h shipped, under 72h out for delivery, older delivered.
 */
export function statusFromAge(placedAtISO: string, nowMs: number): OrderStatus {
	const age = Math.max(0, nowMs - Date.parse(placedAtISO));
	if (age < 24 * HOUR_MS) return 'ordered';
	if (age < 48 * HOUR_MS) return 'shipped';
	if (age < 72 * HOUR_MS) return 'out-for-delivery';
	return 'delivered';
}

function isDemoOrder(value: unknown): value is DemoOrder {
	if (typeof value !== 'object' || value === null) return false;
	const order = value as DemoOrder;
	return (
		typeof order.id === 'string' &&
		typeof order.placedAtISO === 'string' &&
		typeof order.name === 'string' &&
		typeof order.email === 'string' &&
		typeof order.total === 'number' &&
		Array.isArray(order.lines) &&
		order.lines.every(
			(line) =>
				typeof line.slug === 'string' &&
				typeof line.qty === 'number' &&
				typeof line.unitPrice === 'number'
		)
	);
}

/** Load saved demo orders (newest first). Empty on the server or on bad data. */
export function loadDemoOrders(): DemoOrder[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(isDemoOrder);
	} catch {
		return [];
	}
}

/** Prepend an order, keeping at most the 20 most recent. */
export function saveDemoOrder(order: DemoOrder): void {
	if (!browser) return;
	try {
		const orders = [order, ...loadDemoOrders()].slice(0, 20);
		localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
	} catch {
		// Storage unavailable: the order still exists for this session's caller.
	}
}

export function findDemoOrder(id: string): DemoOrder | undefined {
	return loadDemoOrders().find((order) => order.id === id);
}
