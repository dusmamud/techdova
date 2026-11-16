export type ToastItem = { id: number; message: string };

const TOAST_DURATION_MS = 3500;
const TOAST_MAX = 3;

/** Toast notifications: capped at 3, each auto-dismissing after 3.5s. */
class ToastStore {
	toasts = $state<ToastItem[]>([]);

	private nextId = 0;
	private timers = new Map<number, ReturnType<typeof setTimeout>>();

	push(message: string): void {
		const id = ++this.nextId;
		const next = [...this.toasts, { id, message }];
		while (next.length > TOAST_MAX) {
			const dropped = next.shift();
			if (dropped) this.clearTimer(dropped.id);
		}
		this.toasts = next;
		this.timers.set(
			id,
			setTimeout(() => this.dismiss(id), TOAST_DURATION_MS)
		);
	}

	dismiss(id: number): void {
		this.clearTimer(id);
		this.toasts = this.toasts.filter((toast) => toast.id !== id);
	}

	private clearTimer(id: number): void {
		const timer = this.timers.get(id);
		if (timer) clearTimeout(timer);
		this.timers.delete(id);
	}
}

export const toasts = new ToastStore();
