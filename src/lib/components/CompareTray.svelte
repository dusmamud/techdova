<script lang="ts">
	import { ArrowRight, X } from '@lucide/svelte';
	import { interpolate } from '#lib/format';
	import type { Dictionary, Locale } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import { compare } from '#lib/stores/compare.svelte';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();

	const countText = $derived(
		compare.count === 1
			? t.comparePage.trayOne
			: interpolate(t.comparePage.trayCount, { count: compare.count })
	);
</script>

{#if compare.count > 0}
	<div class="pointer-events-none fixed inset-x-4 bottom-4 z-40 flex justify-center">
		<div
			role="region"
			aria-label={t.comparePage.trayAriaLabel}
			class="pointer-events-auto flex w-full max-w-xl items-center gap-2 rounded-full bg-brand-950 py-2 pl-4 pr-2 text-white shadow-xl sm:gap-3 sm:pl-5"
		>
			<p class="min-w-0 flex-1 truncate text-sm font-semibold">{countText}</p>
			<a
				href={localizedPath(lang, '/compare')}
				class="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-brand-900 hover:bg-brand-50"
			>
				{t.comparePage.trayCompareNow}
				<ArrowRight class="h-4 w-4" aria-hidden="true" />
			</a>
			<button
				type="button"
				onclick={() => compare.clear()}
				aria-label={t.comparePage.trayClear}
				class="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
			>
				<X class="h-5 w-5" aria-hidden="true" />
			</button>
		</div>
	</div>
{/if}
