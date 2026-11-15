<script lang="ts">
	import { Check, ChevronRight, Heart, Minus, Plus, RotateCcw, ShieldCheck, ShoppingCart, Truck } from '@lucide/svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import { SITE_NAME, SITE_URL } from '#lib/config';
	import { getCategory } from '#lib/data/categories';
	import { getRelatedProducts } from '#lib/data/products';
	import { formatCount, formatDecimal, formatPrice, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath, shopPath } from '#lib/paths';
	import { cart } from '#lib/stores/cart.svelte';
	import { wishlist } from '#lib/stores/wishlist.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const product = $derived(data.product);
	const name = $derived(localize(product.name, lang));
	const intlLocale = $derived(t.meta.intlLocale);
	const category = $derived(getCategory(product.category));
	const related = $derived(getRelatedProducts(product, 4));
	const outOfStock = $derived(product.stock <= 0);
	const lowStock = $derived(!outOfStock && product.stock <= 5);
	const wished = $derived(wishlist.has(product.slug));

	let qty = $state(1);
	let added = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;
	let selectedImage = $state(0);
	const galleryImages = $derived([product.image]);

	const ratingLabel = $derived(
		`${interpolate(t.product.ratingLabel, { rating: formatDecimal(product.rating, intlLocale) })} — ${interpolate(t.product.reviewsLabel, { count: formatCount(product.reviewCount, intlLocale) })}`
	);

	const stockText = $derived(
		outOfStock
			? t.product.outOfStock
			: lowStock
				? interpolate(t.product.lowStock, { count: product.stock })
				: t.product.inStock
	);

	function addToCart(): void {
		cart.add(product.slug, qty);
		added = true;
		cart.openDrawer();
		clearTimeout(timer);
		timer = setTimeout(() => {
			added = false;
		}, 1800);
	}

	const productJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'Product',
		name,
		image: [`${SITE_URL}${product.image}`],
		description: localize(product.description, lang),
		sku: product.slug,
		offers: {
			'@type': 'Offer',
			priceCurrency: 'DZD',
			price: product.price,
			availability: outOfStock
				? 'https://schema.org/OutOfStock'
				: 'https://schema.org/InStock',
			url: `${SITE_URL}/${lang}/product/${product.slug}`
		},
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: product.rating,
			reviewCount: product.reviewCount
		}
	});

	const breadcrumbJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: SITE_NAME,
				item: `${SITE_URL}/${lang}`
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: t.product.breadcrumbShop,
				item: `${SITE_URL}/${lang}/shop`
			},
			{
				'@type': 'ListItem',
				position: 3,
				name,
				item: `${SITE_URL}/${lang}/product/${product.slug}`
			}
		]
	});
</script>

<Seo
	{lang}
	title="{name} | {SITE_NAME}"
	description={localize(product.shortDescription, lang)}
	path="/product/{product.slug}"
	image={product.image}
	type="product"
/>
<JsonLd json={productJsonLd} />
<JsonLd json={breadcrumbJsonLd} />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<nav aria-label={t.product.breadcrumbLabel} class="text-sm text-neutral-500">
		<ol class="flex flex-wrap items-center gap-1">
			<li>
				<a href={localizedPath(lang, '/')} class="inline-flex min-h-11 items-center hover:text-brand-800">
					{t.product.breadcrumbHome}
				</a>
			</li>
			<li aria-hidden="true"><ChevronRight class="h-4 w-4" /></li>
			<li>
				<a
					href={localizedPath(lang, '/shop')}
					class="inline-flex min-h-11 items-center hover:text-brand-800"
				>
					{t.product.breadcrumbShop}
				</a>
			</li>
			<li aria-hidden="true"><ChevronRight class="h-4 w-4" /></li>
			<li aria-current="page" class="inline-flex min-h-11 items-center font-medium text-neutral-800">
				{name}
			</li>
		</ol>
	</nav>

	<div class="mt-4 grid gap-8 lg:grid-cols-2 lg:gap-12">
		<div>
			<figure aria-label={t.product.galleryLabel} class="relative overflow-hidden rounded-3xl bg-brand-50">
				<div class="aspect-[4/5]">
					<img
						src={galleryImages[selectedImage]}
						alt={localize(product.imageAlt, lang)}
						width="1408"
						height="1760"
						decoding="async"
						fetchpriority="high"
						class="h-full w-full object-cover"
					/>
				</div>
				{#if product.badge}
					<span
						class="absolute left-4 top-4 rounded-full bg-brand-700 px-3 py-1 text-sm font-bold text-white"
					>
						{product.badge}
					</span>
				{/if}
			</figure>
			<div class="mt-3 flex gap-3">
				{#each galleryImages as image, i (i)}
					<button
						type="button"
						onclick={() => {
							selectedImage = i;
						}}
						aria-current={selectedImage === i ? 'true' : undefined}
						aria-label="{t.product.galleryLabel} {i + 1}"
						class="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-brand-50 ring-2 aria-[current=true]:ring-brand-700 aria-[current=false]:ring-transparent"
					>
						<img
							src={image}
							alt={localize(product.imageAlt, lang)}
							width="1408"
							height="1760"
							loading="lazy"
							decoding="async"
							class="h-full w-full object-cover"
						/>
					</button>
				{/each}
			</div>
		</div>

		<div>
			<a
				href={shopPath(lang, product.category)}
				class="inline-flex min-h-11 items-center text-sm font-semibold text-brand-700 hover:text-brand-800"
			>
				{localize(category.name, lang)}
			</a>
			<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{name}</h1>
			<p class="mt-3 flex flex-wrap items-center gap-2">
				<Stars rating={product.rating} label={ratingLabel} />
				<span class="text-sm text-neutral-500" aria-hidden="true">
					({formatCount(product.reviewCount, intlLocale)})
				</span>
			</p>
			<p class="mt-4 flex flex-wrap items-baseline gap-3">
				<span class="text-3xl font-bold text-neutral-900">
					{formatPrice(product.price, intlLocale)}
				</span>
				{#if product.oldPrice}
					<s class="text-lg text-neutral-500">{formatPrice(product.oldPrice, intlLocale)}</s>
					<span class="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800">
						{interpolate(t.product.saveLabel, {
							amount: formatPrice(product.oldPrice - product.price, intlLocale)
						})}
					</span>
				{/if}
			</p>
			<p class="mt-4 leading-relaxed text-neutral-600">
				{localize(product.description, lang)}
			</p>
			<p class="mt-4 flex items-center gap-2 text-sm font-semibold {outOfStock ? 'text-red-600' : 'text-brand-700'}">
				<span
					class="h-2.5 w-2.5 rounded-full {outOfStock ? 'bg-red-500' : lowStock ? 'bg-amber-500' : 'bg-brand-600'}"
					aria-hidden="true"
				></span>
				{stockText}
			</p>

			<div class="mt-6 flex flex-wrap items-center gap-3">
				<div class="flex items-center gap-1">
					<span id="qty-label" class="sr-only">{t.product.quantity}</span>
					<button
						type="button"
						onclick={() => {
							qty = Math.max(1, qty - 1);
						}}
						disabled={qty <= 1 || outOfStock}
						aria-label="{t.product.quantity}: {qty - 1}"
						class="grid h-12 w-12 place-items-center rounded-full ring-1 ring-neutral-300 hover:bg-neutral-50 disabled:opacity-40"
					>
						<Minus class="h-4 w-4" aria-hidden="true" />
					</button>
					<span class="w-10 text-center text-base font-semibold" role="status" aria-labelledby="qty-label">
						{qty}
					</span>
					<button
						type="button"
						onclick={() => {
							qty = Math.min(product.stock, qty + 1);
						}}
						disabled={qty >= product.stock || outOfStock}
						aria-label="{t.product.quantity}: {qty + 1}"
						class="grid h-12 w-12 place-items-center rounded-full ring-1 ring-neutral-300 hover:bg-neutral-50 disabled:opacity-40"
					>
						<Plus class="h-4 w-4" aria-hidden="true" />
					</button>
				</div>
				<button
					type="button"
					disabled={outOfStock}
					onclick={addToCart}
					class="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500 sm:flex-none sm:px-8"
				>
					{#if added}
						<Check class="h-4 w-4" aria-hidden="true" />
						{t.product.addedToCart}
					{:else if outOfStock}
						{t.product.outOfStock}
					{:else}
						<ShoppingCart class="h-4 w-4" aria-hidden="true" />
						{t.product.addToCart}
					{/if}
				</button>
				<button
					type="button"
					aria-pressed={wished}
					onclick={() => wishlist.toggle(product.slug)}
					class="inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-neutral-700 ring-1 ring-neutral-300 hover:bg-neutral-50"
				>
					<Heart
						class="h-4 w-4 {wished ? 'text-rose-600' : ''}"
						fill={wished ? 'currentColor' : 'none'}
						aria-hidden="true"
					/>
					{wished ? t.productCard.removeFromWishlist : t.productCard.addToWishlist}
				</button>
			</div>

			<ul class="mt-6 space-y-2 border-t border-neutral-200 pt-5 text-sm text-neutral-600">
				<li class="flex items-center gap-2">
					<Truck class="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
					{t.product.freeDelivery}
				</li>
				<li class="flex items-center gap-2">
					<ShieldCheck class="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
					{t.product.warranty}
				</li>
				<li class="flex items-center gap-2">
					<RotateCcw class="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
					{t.product.returns}
				</li>
			</ul>
		</div>
	</div>

	<div class="mt-12 grid gap-8 lg:grid-cols-2">
		<section aria-labelledby="description-heading">
			<h2 id="description-heading" class="text-xl font-bold text-neutral-900">{t.product.description}</h2>
			<p class="mt-3 leading-relaxed text-neutral-600">{localize(product.description, lang)}</p>
			<p class="mt-3 leading-relaxed text-neutral-600">
				{localize(product.shortDescription, lang)}
			</p>
		</section>
		<section aria-labelledby="specs-heading">
			<h2 id="specs-heading" class="text-xl font-bold text-neutral-900">{t.product.specifications}</h2>
			<dl class="mt-3 divide-y divide-neutral-200 rounded-3xl bg-neutral-50 px-5">
				{#each product.specs as spec (localize(spec.label, 'en'))}
					<div class="grid grid-cols-2 gap-4 py-3 text-sm">
						<dt class="font-medium text-neutral-500">{localize(spec.label, lang)}</dt>
						<dd class="font-semibold text-neutral-900">{localize(spec.value, lang)}</dd>
					</div>
				{/each}
			</dl>
		</section>
	</div>

	<section aria-labelledby="related-heading" class="mt-12">
		<h2 id="related-heading" class="text-2xl font-bold tracking-tight text-neutral-900">
			{t.product.relatedTitle}
		</h2>
		<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each related as relatedProduct (relatedProduct.slug)}
				<ProductCard product={relatedProduct} {lang} {t} />
			{/each}
		</div>
	</section>
</div>
