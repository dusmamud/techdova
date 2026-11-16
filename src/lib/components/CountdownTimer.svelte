<script lang="ts">
	import { browser } from '$app/env';
	import { getRemaining, pad2 } from '#lib/countdown';

	export type CountdownLabels = {
		days: string;
		hours: string;
		minutes: string;
		seconds: string;
		expired: string;
	};

	let { targetIso, labels }: { targetIso: string; labels: CountdownLabels } = $props();

	let mounted = $state(false);
	let nowMs = $state(0);

	const targetMs = $derived(Date.parse(targetIso));
	const remaining = $derived(getRemaining(targetMs, nowMs));
	const units = $derived([
		{ value: pad2(remaining.days), label: labels.days },
		{ value: pad2(remaining.hours), label: labels.hours },
		{ value: pad2(remaining.minutes), label: labels.minutes },
		{ value: pad2(remaining.seconds), label: labels.seconds }
	]);

	$effect(() => {
		if (!browser) return;
		mounted = true;
		nowMs = Date.now();
		const id = setInterval(() => {
			nowMs = Date.now();
		}, 1000);
		return () => clearInterval(id);
	});
</script>

{#if mounted}
	{#if remaining.expired}
		<p class="text-sm font-semibold text-neutral-700">{labels.expired}</p>
	{:else}
		<div class="flex items-start gap-2 sm:gap-3" role="timer">
			{#each units as unit, i (unit.label)}
				<div class="flex flex-col items-center gap-1">
					<span
						class="grid min-h-11 min-w-11 place-items-center rounded-2xl bg-neutral-900 px-2 text-lg font-bold tabular-nums text-white"
					>
						{unit.value}
					</span>
					<span class="text-xs font-medium text-neutral-600">{unit.label}</span>
				</div>
				{#if i < units.length - 1}
					<span aria-hidden="true" class="pt-2 text-lg font-bold text-neutral-400">:</span>
				{/if}
			{/each}
		</div>
	{/if}
{/if}
