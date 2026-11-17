<script lang="ts">
	import { page } from '$app/state';
	import { Search, ShoppingBag } from '@lucide/svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { SITE_NAME } from '#lib/config';
	import { getFeaturedProducts } from '#lib/data/products';
	import { getDictionary, isLocale, type Locale } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';

	const lang: Locale = $derived.by(() => {
		const first = page.url.pathname.split('/')[1] ?? '';
		return isLocale(first) ? first : 'en';
	});
	const t = $derived(getDictionary(lang));
	const bestSellers = getFeaturedProducts().slice(0, 4);
</script>

<Seo
	{lang}
	title={t.meta.notFoundTitle}
	description={t.meta.notFoundDescription}
	path="/"
/>

<main class="min-h-screen bg-brand-50 px-4 py-10 dark:bg-surface-soft sm:px-6 lg:px-8">
	<div class="mx-auto w-full max-w-5xl">
		<div class="mx-auto w-full max-w-lg rounded-[2rem] bg-surface p-8 text-center shadow-sm ring-1 ring-brand-100">
			<span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-700 text-white">
				<ShoppingBag class="h-7 w-7" aria-hidden="true" />
			</span>
			<p class="mt-4 text-sm font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
				{t.notFound.eyebrow} · {page.status}
			</p>
			<h1 class="mt-2 text-3xl font-bold tracking-tight text-ink">{t.notFound.title}</h1>
			<p class="mt-3 text-muted">{t.notFound.description}</p>
			<!-- Plain GET form: a native navigation, so the search page's
				?q= reader (onMount) picks the query up reliably. -->
			<form
				action={localizedPath(lang, '/search')}
				method="get"
				role="search"
				class="mt-6 text-left"
			>
				<label for="not-found-search" class="mb-1 block text-sm font-semibold text-ink">
					{t.notFound.searchLabel}
				</label>
				<div class="flex gap-2">
					<div class="relative min-w-0 flex-1">
						<Search
							class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
							aria-hidden="true"
						/>
						<input
							id="not-found-search"
							name="q"
							type="search"
							placeholder={t.notFound.searchPlaceholder}
							class="h-11 w-full rounded-full bg-surface-soft pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:bg-surface"
						/>
					</div>
					<button
						type="submit"
						class="inline-flex min-h-11 shrink-0 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
					>
						{t.notFound.searchButton}
					</button>
				</div>
			</form>
			<div class="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
				<a
					href={localizedPath(lang, '/')}
					class="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
				>
					{t.notFound.backHome}
				</a>
				<a
					href={localizedPath(lang, '/shop')}
					class="inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
				>
					{t.nav.shop}
				</a>
			</div>
			<p class="mt-6 text-xs text-neutral-400">{SITE_NAME}</p>
		</div>

		<section aria-labelledby="not-found-best-sellers" class="mt-10 sm:mt-12">
			<h2
				id="not-found-best-sellers"
				class="text-center text-[1.375rem] font-bold tracking-tight text-ink sm:text-2xl"
			>
				{t.notFound.bestSellersTitle}
			</h2>
			<div class="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-5 lg:grid-cols-4">
				{#each bestSellers as product (product.slug)}
					<ProductCard {product} {lang} {t} />
				{/each}
			</div>
		</section>

		<nav aria-labelledby="not-found-popular" class="mt-10 text-center sm:mt-12">
			<h2 id="not-found-popular" class="text-sm font-semibold text-ink">
				{t.notFound.popularTitle}
			</h2>
			<ul class="mt-3 flex flex-wrap justify-center gap-2">
				<li>
					<a
						href={localizedPath(lang, '/')}
						class="inline-flex min-h-11 items-center rounded-full bg-surface px-4 text-sm font-medium text-ink-soft ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft"
					>
						{t.nav.home}
					</a>
				</li>
				<li>
					<a
						href={localizedPath(lang, '/shop')}
						class="inline-flex min-h-11 items-center rounded-full bg-surface px-4 text-sm font-medium text-ink-soft ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft"
					>
						{t.nav.shop}
					</a>
				</li>
				<li>
					<a
						href={localizedPath(lang, '/deals')}
						class="inline-flex min-h-11 items-center rounded-full bg-surface px-4 text-sm font-medium text-ink-soft ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft"
					>
						{t.dealsPage.title}
					</a>
				</li>
				<li>
					<a
						href={localizedPath(lang, '/best-sellers')}
						class="inline-flex min-h-11 items-center rounded-full bg-surface px-4 text-sm font-medium text-ink-soft ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft"
					>
						{t.bestSellersPage.title}
					</a>
				</li>
				<li>
					<a
						href={localizedPath(lang, '/new-arrivals')}
						class="inline-flex min-h-11 items-center rounded-full bg-surface px-4 text-sm font-medium text-ink-soft ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft"
					>
						{t.newArrivalsPage.title}
					</a>
				</li>
			</ul>
		</nav>
	</div>
</main>
