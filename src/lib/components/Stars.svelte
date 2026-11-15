<script lang="ts">
	let { rating, label }: { rating: number; label: string } = $props();

	const starPath =
		'M12 2.6l2.83 6.1 6.67.72-4.95 4.52 1.35 6.58L12 17.3l-5.9 3.22 1.35-6.58L2.5 9.42l6.67-.72L12 2.6z';
	const fillPercent = $derived(Math.max(0, Math.min(100, (rating / 5) * 100)));
</script>

<span class="relative inline-flex align-middle" aria-hidden="true">
	<span class="flex gap-0.5 text-neutral-300">
		{#each Array(5) as _, i (i)}
			<svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" focusable="false"
				><path d={starPath} /></svg
			>
		{/each}
	</span>
	<span
		class="absolute inset-0 flex gap-0.5 overflow-hidden text-amber-500"
		style="width: {fillPercent}%"
	>
		{#each Array(5) as _, i (i)}
			<svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 fill-current" focusable="false"
				><path d={starPath} /></svg
			>
		{/each}
	</span>
</span>
<span class="sr-only">{label}</span>
