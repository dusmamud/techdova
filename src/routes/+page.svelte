<script lang="ts">
	import { onMount } from 'svelte';
	import { ShoppingBag } from '@lucide/svelte';
	import { LOCALE_STORAGE_KEY, SITE_NAME, SITE_URL } from '#lib/config';
	import { isLocale } from '#lib/i18n/index';

	// Locale-neutral landing page: the only page allowed to carry hardcoded
	// bilingual microcopy, because no locale is selected yet. JavaScript
	// honours a stored language choice; without JS the meta refresh below
	// sends visitors to the English home and the links stay usable.
	onMount(() => {
		let target = '/en';
		try {
			const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
			if (stored && isLocale(stored)) target = `/${stored}`;
		} catch {
			// Storage unavailable: fall through to the default locale.
		}
		window.location.replace(target);
	});
</script>

<svelte:head>
	<title>{SITE_NAME}</title>
	<meta name="robots" content="noindex" />
	<meta http-equiv="refresh" content="0; url=/en" />
	<link rel="canonical" href="{SITE_URL}/en" />
</svelte:head>

<main class="grid min-h-screen place-items-center bg-brand-50 px-4 dark:bg-surface-soft">
	<div class="w-full max-w-md rounded-[2rem] bg-surface p-8 text-center shadow-sm ring-1 ring-brand-100">
		<span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-700 text-white">
			<ShoppingBag class="h-7 w-7" aria-hidden="true" />
		</span>
		<h1 class="mt-4 text-2xl font-bold tracking-tight text-ink">
			Tech<span class="text-brand-700 dark:text-brand-300">Dova</span>
		</h1>
		<p class="mt-2 text-sm text-muted">Choose your language / Choisissez votre langue</p>
		<div class="mt-6 grid grid-cols-2 gap-3">
			<a
				href="/en"
				class="flex min-h-12 items-center justify-center rounded-full bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800"
			>
				English
			</a>
			<a
				href="/fr"
				class="flex min-h-12 items-center justify-center rounded-full px-4 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
			>
				Français
			</a>
		</div>
	</div>
</main>
