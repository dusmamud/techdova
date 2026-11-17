<script lang="ts">
	import { browser } from '$app/env';
	import type { Dictionary, Locale } from '#lib/i18n/index';
	import { cart } from '#lib/stores/cart.svelte';

	// No visible UI: this component only manages document.title while the
	// tab is hidden. `lang` is accepted per the layout-mount contract but
	// the title copy comes from the dictionary (`t`).
	let { t }: { lang: Locale; t: Dictionary } = $props();

	$effect(() => {
		if (!browser) return;

		// The original title is captured lazily, at the moment the tab is
		// hidden — never at mount — so a navigation that changed the title
		// while the tab was visible is never clobbered with a stale value
		// on return. It is cleared as soon as the title is restored.
		let originalTitle: string | null = null;

		const apply = (): void => {
			if (document.hidden && cart.count > 0) {
				originalTitle ??= document.title;
				document.title = `(${cart.count}) ${t.tabReminder.waiting}`;
			} else if (originalTitle !== null) {
				document.title = originalTitle;
				originalTitle = null;
			}
		};

		// Reading cart.count here (via apply) subscribes the effect, so a
		// cart change while hidden updates the count in the title, and
		// emptying the cart while hidden restores the original title.
		apply();
		document.addEventListener('visibilitychange', apply);
		return () => {
			document.removeEventListener('visibilitychange', apply);
			if (originalTitle !== null) document.title = originalTitle;
		};
	});
</script>
