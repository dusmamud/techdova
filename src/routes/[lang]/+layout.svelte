<script lang="ts">
	import { browser } from '$app/env';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';
	import BackToTop from '#lib/components/BackToTop.svelte';
	import CartDrawer from '#lib/components/CartDrawer.svelte';
	import CompareTray from '#lib/components/CompareTray.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import Header from '#lib/components/Header.svelte';
	import LiveRegion from '#lib/components/LiveRegion.svelte';
	import Toast from '#lib/components/Toast.svelte';
	import { LOCALE_STORAGE_KEY } from '#lib/config';
	import { getDictionary } from '#lib/i18n/index';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	const t = $derived(getDictionary(data.lang));

	// Page-enter fade: enter-only, 200ms (motion token duration-200). The
	// reduced-motion check runs at init (browser-only) so the value is
	// correct before the first render — no branch flip, no content remount.
	// Duration 0 under reduced motion means no fade at all; content always
	// renders immediately and the fade is purely decorative.
	const reduceMotion = browser
		? window.matchMedia('(prefers-reduced-motion: reduce)').matches
		: false;
	const pathname = $derived(page.url.pathname);

	// Persist the locale from the URL so the root page can honour it later.
	$effect(() => {
		if (!browser) return;
		try {
			localStorage.setItem(LOCALE_STORAGE_KEY, data.lang);
		} catch {
			// Storage unavailable: the URL remains the source of truth.
		}
	});
</script>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
>
	{t.nav.skipToContent}
</a>
<Header lang={data.lang} {t} />
<LiveRegion lang={data.lang} {t} />
<main id="main-content">
	{#key pathname}
		<div in:fade={{ duration: reduceMotion ? 0 : 200 }}>{@render children()}</div>
	{/key}
</main>
<Footer lang={data.lang} {t} />
<CartDrawer lang={data.lang} {t} />
<CompareTray lang={data.lang} {t} />
<Toast dismissLabel={t.toast.dismiss} />
<BackToTop label={t.backToTop.label} />
