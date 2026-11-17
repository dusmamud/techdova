<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import Picture from '#lib/components/Picture.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { getBrands, getProductsByBrand } from '#lib/data/products';
	import { formatPrice, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath, productPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const intlLocale = $derived(t.meta.intlLocale);
	const brands = getBrands();

	function countText(count: number): string {
		return count === 1 ? t.brandsPage.productOne : interpolate(t.brandsPage.productsCount, { count });
	}

	// Contract with the shop page: `brand` query param, value = brand name.
	function brandShopHref(brand: string): string {
		return `${localizedPath(lang, '/shop')}?brand=${encodeURIComponent(brand)}`;
	}
</script>

<Seo {lang} title={t.meta.brandsTitle} description={t.meta.brandsDescription} path="/brands" />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.brandsPage.title }
			]}
		/>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			{t.brandsPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.brandsPage.description}</p>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
			{t.brandsPage.demoNote}
		</p>
	</div>

	<div class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
		{#each brands as brand, i (brand)}
			{@const brandProducts = getProductsByBrand(brand)}
			<article
				class="flex flex-col rounded-3xl bg-surface p-5 ring-1 ring-line"
				use:reveal={{ delay: Math.min(i * 60, 300) }}
			>
				<h2 class="text-xl font-bold text-ink">
					<a href={brandShopHref(brand)} class="hover:text-brand-800 dark:hover:text-brand-200">
						{brand}
					</a>
				</h2>
				<p class="mt-1 text-sm font-medium text-brand-700 dark:text-brand-300">
					{countText(brandProducts.length)}
				</p>
				<ul
					class="mt-4 flex-1 space-y-3"
					aria-label={interpolate(t.brandsPage.previewLabel, { brand })}
				>
					{#each brandProducts.slice(0, 3) as product (product.slug)}
						<li>
							<a
								href={productPath(lang, product.slug)}
								class="flex items-center gap-3 rounded-2xl p-1 hover:bg-surface-soft"
							>
								<span class="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-brand-50">
									<Picture
										base={product.image}
										alt={localize(product.imageAlt, lang)}
										loading="lazy"
										decoding="async"
										class="h-full w-full object-cover"
									/>
								</span>
								<span class="min-w-0">
									<span class="block truncate font-semibold text-ink">
										{localize(product.name, lang)}
									</span>
									<span class="block text-sm text-muted">
										{formatPrice(product.price, intlLocale)}
									</span>
								</span>
							</a>
						</li>
					{/each}
				</ul>
				<p class="mt-4">
					<a
						href={brandShopHref(brand)}
						class="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
					>
						{interpolate(t.brandsPage.shopBrand, { brand })}
						<ArrowRight class="h-4 w-4" aria-hidden="true" />
					</a>
				</p>
			</article>
		{/each}
	</div>

	<p class="mt-8" use:reveal>
		<a
			href={localizedPath(lang, '/shop')}
			class="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
		>
			{t.brandsPage.browseShop}
			<ArrowRight class="h-4 w-4" aria-hidden="true" />
		</a>
	</p>
</div>
