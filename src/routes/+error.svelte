<script lang="ts">
	import { page } from '$app/state';
	import { ShoppingBag } from '@lucide/svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { SITE_NAME } from '#lib/config';
	import { getDictionary, isLocale, type Locale } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';

	const lang: Locale = $derived.by(() => {
		const first = page.url.pathname.split('/')[1] ?? '';
		return isLocale(first) ? first : 'en';
	});
	const t = $derived(getDictionary(lang));
</script>

<Seo
	{lang}
	title={t.meta.notFoundTitle}
	description={t.meta.notFoundDescription}
	path="/"
/>

<main class="grid min-h-screen place-items-center bg-brand-50 px-4">
	<div class="w-full max-w-lg rounded-[2rem] bg-white p-8 text-center shadow-sm ring-1 ring-brand-100">
		<span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-700 text-white">
			<ShoppingBag class="h-7 w-7" aria-hidden="true" />
		</span>
		<p class="mt-4 text-sm font-semibold uppercase tracking-wide text-brand-700">
			{t.notFound.eyebrow} · {page.status}
		</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-neutral-900">{t.notFound.title}</h1>
		<p class="mt-3 text-neutral-600">{t.notFound.description}</p>
		<div class="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
			<a
				href={localizedPath(lang, '/')}
				class="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.notFound.backHome}
			</a>
			<a
				href={localizedPath(lang, '/shop')}
				class="inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
			>
				{t.nav.shop}
			</a>
		</div>
		<p class="mt-6 text-xs text-neutral-400">{SITE_NAME}</p>
	</div>
</main>
