<script lang="ts">
	import FaqItem from './FaqItem.svelte';

	let { items }: { items: { question: string; answer: string }[] } = $props();
</script>

<div class="flex flex-col gap-3">
	{#each items as item (item.question)}
		<FaqItem question={item.question} answer={item.answer} />
	{/each}
</div>
