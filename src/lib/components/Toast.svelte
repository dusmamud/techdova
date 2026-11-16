<script lang="ts">
	import { X } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { toasts } from '#lib/stores/toast.svelte';

	let { dismissLabel }: { dismissLabel: string } = $props();
</script>

<div
	role="status"
	aria-live="polite"
	class="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
>
	{#each toasts.toasts as toast (toast.id)}
		<div
			transition:fade={{ duration: 200 }}
			class="pointer-events-auto flex min-h-11 w-full max-w-md items-center gap-2 rounded-full bg-neutral-900 py-1 pl-4 pr-1 text-sm text-white shadow-lg"
		>
			<p class="min-w-0 flex-1">{toast.message}</p>
			<button
				type="button"
				onclick={() => toasts.dismiss(toast.id)}
				aria-label={dismissLabel}
				class="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white hover:bg-white/10"
			>
				<X class="h-4 w-4" aria-hidden="true" />
			</button>
		</div>
	{/each}
</div>
