/** Pure countdown helpers (no DOM, no timers — the component ticks). */

export type Remaining = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	/** Milliseconds left, clamped to 0 once the target has passed. */
	totalMs: number;
	expired: boolean;
};

/** Time left until `targetMs`, with every field clamped to 0 once expired. */
export function getRemaining(targetMs: number, nowMs: number): Remaining {
	const totalMs = Math.max(0, targetMs - nowMs);
	const expired = targetMs <= nowMs;
	const totalSeconds = Math.floor(totalMs / 1000);
	return {
		days: Math.floor(totalSeconds / 86400),
		hours: Math.floor(totalSeconds / 3600) % 24,
		minutes: Math.floor(totalSeconds / 60) % 60,
		seconds: totalSeconds % 60,
		totalMs,
		expired
	};
}

/** Zero-pad a countdown unit to two digits. */
export function pad2(n: number): string {
	return String(Math.max(0, n)).padStart(2, '0');
}
