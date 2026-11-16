<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';

	export type BreadcrumbItem = { label: string; href?: string };

	let { items, label }: { items: BreadcrumbItem[]; label: string } = $props();
</script>

<nav aria-label={label} class="text-sm text-neutral-500">
	<ol class="flex flex-wrap items-center gap-1">
		{#each items as item, i (i)}
			{#if i > 0}
				<li aria-hidden="true"><ChevronRight class="h-4 w-4" /></li>
			{/if}
			{#if i === items.length - 1 || !item.href}
				<li
					aria-current={i === items.length - 1 ? 'page' : undefined}
					class="inline-flex min-h-11 items-center font-medium text-neutral-800"
				>
					{item.label}
				</li>
			{:else}
				<li>
					<a
						href={item.href}
						class="inline-flex min-h-11 items-center hover:text-brand-800"
					>
						{item.label}
					</a>
				</li>
			{/if}
		{/each}
	</ol>
</nav>
