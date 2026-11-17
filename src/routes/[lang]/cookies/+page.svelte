<script lang="ts">
	import { Cookie, Trash2 } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { clearSiteData } from '#lib/clear-site-data';
	import { getDictionary } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));

	let cleared = $state(false);

	function handleClearData(): void {
		clearSiteData();
		cleared = true;
	}

	function openCookieSettings(): void {
		window.dispatchEvent(new CustomEvent('techdova:open-cookie-settings'));
	}
</script>

<Seo {lang} title={t.meta.cookiesTitle} description={t.meta.cookiesDescription} path="/cookies" />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.cookiesPage.title }
			]}
		/>
		<h1 class="mt-2 flex items-center gap-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			<Cookie class="h-8 w-8 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			{t.cookiesPage.title}
		</h1>
		<p class="mt-2 text-sm text-muted">{t.cookiesPage.updated}</p>
		<p class="mt-4 leading-relaxed text-muted">{t.cookiesPage.intro}</p>
	</div>

	<section aria-labelledby="cookies-none-heading" class="mt-8" use:reveal>
		<h2 id="cookies-none-heading" class="text-xl font-bold text-ink">{t.cookiesPage.noCookiesTitle}</h2>
		<p class="mt-2 leading-relaxed text-muted">{t.cookiesPage.noCookiesText}</p>
	</section>

	<section aria-labelledby="cookies-storage-heading" class="mt-8" use:reveal>
		<h2 id="cookies-storage-heading" class="text-xl font-bold text-ink">
			{t.cookiesPage.storageTitle}
		</h2>
		<p class="mt-2 leading-relaxed text-muted">{t.cookiesPage.storageIntro}</p>
		<div class="mt-4 overflow-x-auto rounded-3xl ring-1 ring-line">
			<table class="w-full min-w-0 text-left text-sm">
				<tbody class="divide-y divide-line">
					{#each t.cookiesPage.storageRows as row (row.key)}
						<tr class="bg-surface">
							<th scope="row" class="w-1/3 px-4 py-3 align-top font-mono text-[13px] break-all text-ink">
								{row.key}
							</th>
							<td class="px-4 py-3 leading-relaxed text-muted">{row.purpose}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</section>

	<section aria-labelledby="cookies-choices-heading" class="mt-8" use:reveal>
		<h2 id="cookies-choices-heading" class="text-xl font-bold text-ink">
			{t.cookiesPage.choicesTitle}
		</h2>
		<p class="mt-2 leading-relaxed text-muted">{t.cookiesPage.choicesText}</p>
		<div class="mt-4 flex flex-wrap gap-2">
			<button
				type="button"
				onclick={openCookieSettings}
				class="inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.footer.cookieSettings}
			</button>
			<button
				type="button"
				onclick={handleClearData}
				class="inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-red-700 dark:text-red-300 ring-1 ring-red-300 dark:ring-red-800 hover:bg-red-50 dark:hover:bg-red-950/60"
			>
				<Trash2 class="h-4 w-4" aria-hidden="true" />
				{t.cookiesPage.clearData}
			</button>
		</div>
		{#if cleared}
			<p role="status" class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
				{t.cookiesPage.clearDataDone}
			</p>
		{/if}
		<p class="mt-4 text-sm leading-relaxed text-muted">{t.cookiesPage.browserText}</p>
	</section>
</div>
