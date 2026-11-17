<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import type { Dictionary } from '#lib/i18n/index';
	import { theme } from '#lib/stores/theme.svelte';

	let { t }: { t: Dictionary } = $props();
</script>

<button
	type="button"
	onclick={() => theme.toggle()}
	aria-label={theme.dark ? t.theme.switchToLight : t.theme.switchToDark}
	class="grid h-11 w-11 place-items-center rounded-full text-ink-soft hover:bg-surface-soft"
>
	{#if theme.dark}
		<Sun class="h-5 w-5" aria-hidden="true" />
	{:else}
		<Moon class="h-5 w-5" aria-hidden="true" />
	{/if}
</button>
