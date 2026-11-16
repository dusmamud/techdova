<script lang="ts">
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { blogPosts } from '#lib/data/blog';
	import { categories } from '#lib/data/categories';
	import { products } from '#lib/data/products';
	import { getDictionary, locales, localize } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));

	type Entry = { path: string; label: string };

	const shopEntries = $derived<Entry[]>([
		{ path: '/', label: t.sitemapPage.labels.home },
		{ path: '/shop', label: t.sitemapPage.labels.shop },
		{ path: '/deals', label: t.sitemapPage.labels.deals },
		{ path: '/new-arrivals', label: t.sitemapPage.labels.newArrivals },
		{ path: '/best-sellers', label: t.sitemapPage.labels.bestSellers },
		{ path: '/gift-cards', label: t.sitemapPage.labels.giftCards },
		{ path: '/search', label: t.sitemapPage.labels.search }
	]);

	const categoryEntries = $derived<Entry[]>(
		categories.map((category) => ({
			path: `/category/${category.slug}`,
			label: localize(category.name, lang)
		}))
	);

	const productEntries = $derived<Entry[]>(
		products.map((product) => ({
			path: `/product/${product.slug}`,
			label: localize(product.name, lang)
		}))
	);

	const helpEntries = $derived<Entry[]>([
		{ path: '/help', label: t.sitemapPage.labels.help },
		{ path: '/faq', label: t.sitemapPage.labels.faq },
		{ path: '/shipping', label: t.sitemapPage.labels.shipping },
		{ path: '/returns', label: t.sitemapPage.labels.returns },
		{ path: '/payment', label: t.sitemapPage.labels.payment },
		{ path: '/track-order', label: t.sitemapPage.labels.trackOrder }
	]);

	const companyEntries = $derived<Entry[]>([
		{ path: '/about', label: t.sitemapPage.labels.about },
		{ path: '/stores', label: t.sitemapPage.labels.stores },
		{ path: '/testimonials', label: t.sitemapPage.labels.testimonials },
		{ path: '/blog', label: t.sitemapPage.labels.blog }
	]);

	const postEntries = $derived<Entry[]>(
		blogPosts.map((post) => ({
			path: `/blog/${post.slug}`,
			label: localize(post.title, lang)
		}))
	);

	const companyMoreEntries = $derived<Entry[]>([
		{ path: '/contact', label: t.sitemapPage.labels.contact },
		{ path: '/terms', label: t.sitemapPage.labels.terms },
		{ path: '/privacy', label: t.sitemapPage.labels.privacy },
		{ path: '/accessibility', label: t.sitemapPage.labels.accessibility },
		{ path: '/sitemap', label: t.sitemapPage.labels.sitemap }
	]);

	const accountEntries = $derived<Entry[]>([
		{ path: '/wishlist', label: t.sitemapPage.labels.wishlist },
		{ path: '/compare', label: t.sitemapPage.labels.compare },
		{ path: '/cart', label: t.sitemapPage.labels.cart },
		{ path: '/checkout', label: t.sitemapPage.labels.checkout },
		{ path: '/account', label: t.sitemapPage.labels.account }
	]);
</script>

{#snippet entryList(entries: Entry[])}
	<ul class="mt-3 space-y-1">
		{#each entries as entry (entry.path)}
			<li class="flex flex-wrap items-center gap-x-3 gap-y-1">
				<span class="text-neutral-800">{entry.label}</span>
				<span class="flex items-center gap-3 text-sm">
					{#each locales as locale (locale)}
						<a
							href={localizedPath(locale, entry.path)}
							aria-label="{getDictionary(locale).localeName} — {entry.label}"
							class="inline-flex min-h-11 items-center font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800"
						>
							{getDictionary(locale).localeName}
						</a>
					{/each}
				</span>
			</li>
		{/each}
	</ul>
{/snippet}

<Seo {lang} title={t.meta.sitemapTitle} description={t.meta.sitemapDescription} path="/sitemap" />

<div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
	<Breadcrumbs
		label={t.product.breadcrumbLabel}
		items={[
			{ label: t.nav.home, href: localizedPath(lang, '/') },
			{ label: t.sitemapPage.title }
		]}
	/>
	<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl" use:reveal>
		{t.sitemapPage.title}
	</h1>
	<p class="mt-2 max-w-2xl leading-relaxed text-neutral-600">{t.sitemapPage.description}</p>

	<div class="mt-8 grid gap-10 sm:grid-cols-2">
		<section use:reveal>
			<h2 class="text-lg font-bold text-neutral-900">{t.sitemapPage.shopHeading}</h2>
			{@render entryList(shopEntries)}
			<h3 class="mt-6 font-semibold text-neutral-900">{t.sitemapPage.categoriesLabel}</h3>
			{@render entryList(categoryEntries)}
			<h3 class="mt-6 font-semibold text-neutral-900">{t.sitemapPage.productsLabel}</h3>
			{@render entryList(productEntries)}
		</section>

		<section use:reveal={{ delay: 60 }}>
			<h2 class="text-lg font-bold text-neutral-900">{t.sitemapPage.helpHeading}</h2>
			{@render entryList(helpEntries)}
		</section>

		<section use:reveal={{ delay: 120 }}>
			<h2 class="text-lg font-bold text-neutral-900">{t.sitemapPage.companyHeading}</h2>
			{@render entryList(companyEntries)}
			<h3 class="mt-6 font-semibold text-neutral-900">{t.sitemapPage.postsLabel}</h3>
			{@render entryList(postEntries)}
			<div class="mt-6">
				{@render entryList(companyMoreEntries)}
			</div>
		</section>

		<section use:reveal={{ delay: 180 }}>
			<h2 class="text-lg font-bold text-neutral-900">{t.sitemapPage.accountHeading}</h2>
			{@render entryList(accountEntries)}
		</section>
	</div>
</div>
