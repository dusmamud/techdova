<script lang="ts">
	import { Star } from '@lucide/svelte';

	let {
		breakdown,
		totalLabel
	}: { breakdown: { stars: number; percent: number }[]; totalLabel: string } = $props();
</script>

<div>
	<p class="text-sm font-semibold text-neutral-900">{totalLabel}</p>
	<ul class="mt-3 flex flex-col gap-2">
		{#each breakdown as row (row.stars)}
			<li class="flex items-center gap-3 text-sm">
				<span class="flex w-10 shrink-0 items-center gap-1 font-medium text-neutral-700">
					{row.stars}
					<Star class="h-4 w-4 fill-amber-500 text-amber-500" aria-hidden="true" />
				</span>
				<span
					role="meter"
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={row.percent}
					aria-label="{row.stars} / 5 — {row.percent}%"
					class="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-neutral-200"
				>
					<span
						class="block h-full rounded-full bg-amber-500"
						style="width: {row.percent}%"
					></span>
				</span>
				<span class="w-10 shrink-0 text-right tabular-nums text-neutral-600">
					{row.percent}%
				</span>
			</li>
		{/each}
	</ul>
</div>
