<script lang="ts">
	import { onMount } from 'svelte';
	import { ShoppingCart, X } from '@lucide/svelte';
	import { interpolate } from '#lib/format';
	import { type Dictionary, type Locale } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import { cart } from '#lib/stores/cart.svelte';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();

	let visible = $state(false);
	const DISMISSED_FLAG = 'techdova-cart-nudge-dismissed';

	onMount(() => {
		try {
			if (sessionStorage.getItem(DISMISSED_FLAG)) return;
		} catch {
			// Storage unavailable: fall through and show the nudge once.
		}
		if (cart.count > 0) visible = true;
	});

	function dismiss(): void {
		visible = false;
		try {
			sessionStorage.setItem(DISMISSED_FLAG, '1');
		} catch {
			// Storage unavailable: the nudge simply shows again next visit.
		}
	}
</script>

{#if visible}
	<div role="status" class="border-b border-line bg-surface-soft">
		<div
			class="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6 lg:px-8"
		>
			<ShoppingCart class="size-5 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			<p class="min-w-0 flex-1 text-sm text-ink">
				<span class="font-semibold">{t.cart.returnNudgeTitle}</span>
				{' — '}
				{cart.count === 1
					? t.cart.returnNudgeTextOne
					: interpolate(t.cart.returnNudgeText, { count: cart.count })}
			</p>
			<a
				href={localizedPath(lang, '/cart')}
				class="inline-flex min-h-11 items-center rounded-full bg-brand-700 px-4 text-sm font-semibold text-white transition hover:bg-brand-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
			>
				{t.cart.viewCart}
			</a>
			<button
				type="button"
				onclick={dismiss}
				aria-label={t.cart.returnNudgeDismiss}
				class="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted transition hover:bg-surface-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
			>
				<X class="size-4" aria-hidden="true" />
			</button>
		</div>
	</div>
{/if}
