<script lang="ts">
	import { browser } from '$app/env';
	import {
		Bell,
		Check,
		Copy,
		Heart,
		Minus,
		Plus,
		RotateCcw,
		Scale,
		Share2,
		ShieldCheck,
		ShoppingCart,
		Truck,
		X,
		ZoomIn
	} from '@lucide/svelte';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import RecentlyViewed from '#lib/components/RecentlyViewed.svelte';
	import ReviewsSection from '#lib/components/ReviewsSection.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import { SITE_NAME, SITE_URL } from '#lib/config';
	import { getCategory } from '#lib/data/categories';
	import { getPairsWellWith, getRelatedProducts } from '#lib/data/products';
	import { formatCount, formatDecimal, formatPrice, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import { loadRecentlyViewed, recordViewed, saveRecentlyViewed } from '#lib/recently-viewed';
	import { cart } from '#lib/stores/cart.svelte';
	import { compare } from '#lib/stores/compare.svelte';
	import { toasts } from '#lib/stores/toast.svelte';
	import { wishlist } from '#lib/stores/wishlist.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));
	const product = $derived(data.product);
	const name = $derived(localize(product.name, lang));
	const intlLocale = $derived(t.meta.intlLocale);
	const category = $derived(getCategory(product.category));
	const categoryName = $derived(localize(category.name, lang));
	const categoryUrl = $derived(localizedPath(lang, `/category/${product.category}`));
	const related = $derived(getRelatedProducts(product, 4));
	const pairs = $derived(getPairsWellWith(product, 3));
	const outOfStock = $derived(product.stock <= 0);
	const lowStock = $derived(!outOfStock && product.stock <= 5);
	const wished = $derived(wishlist.has(product.slug));
	const compared = $derived(compare.has(product.slug));

	let qty = $state(1);
	let added = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined;
	let selectedImage = $state(0);
	let notifyRequested = $state(false);
	let canShare = $state(false);
	let zoomOpen = $state(false);
	let showStickyBar = $state(false);
	let buyBox: HTMLDivElement | undefined = $state();
	let zoomCloseButton: HTMLButtonElement | undefined = $state();
	let zoomOpener: HTMLElement | null = null;
	const galleryImages = $derived([product.image]);

	$effect(() => {
		if (!browser) return;
		saveRecentlyViewed(recordViewed(loadRecentlyViewed(), product.slug));
		canShare = typeof navigator.share === 'function';
	});

	$effect(() => {
		if (!browser || !buyBox) return;
		const observed = buyBox;
		const observer = new IntersectionObserver(
			([entry]) => {
				showStickyBar = !entry.isIntersecting && entry.boundingClientRect.top < 0;
			},
			{ threshold: 0 }
		);
		observer.observe(observed);
		return () => observer.disconnect();
	});

	$effect(() => {
		if (!browser) return;
		if (zoomOpen) {
			zoomCloseButton?.focus();
			const previous = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = previous;
				zoomOpener?.focus();
			};
		}
	});

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape' && zoomOpen) closeZoom();
	}

	function openZoom(): void {
		if (!browser) return;
		zoomOpener = document.activeElement as HTMLElement | null;
		zoomOpen = true;
	}

	function closeZoom(): void {
		zoomOpen = false;
	}

	async function copyProductLink(): Promise<boolean> {
		if (!browser) return false;
		const url = window.location.href;
		try {
			if (navigator.clipboard?.writeText) {
				await navigator.clipboard.writeText(url);
				return true;
			}
		} catch {
			// Fall through to the legacy copy path below.
		}
		try {
			const textarea = document.createElement('textarea');
			textarea.value = url;
			textarea.setAttribute('readonly', '');
			textarea.style.position = 'fixed';
			textarea.style.opacity = '0';
			document.body.appendChild(textarea);
			textarea.select();
			const copied = document.execCommand('copy');
			document.body.removeChild(textarea);
			return copied;
		} catch {
			return false;
		}
	}

	async function copyLink(): Promise<void> {
		if (await copyProductLink()) toasts.push(t.product.copiedToast);
	}

	async function shareProduct(): Promise<void> {
		if (!browser) return;
		if (typeof navigator.share === 'function') {
			try {
				await navigator.share({
					title: name,
					text: localize(product.shortDescription, lang),
					url: window.location.href
				});
			} catch {
				// Share dismissed or unavailable: stay on the page, no fallback spam.
			}
			return;
		}
		await copyLink();
	}

	function toggleCompare(): void {
		const result = compare.toggle(product.slug);
		if (result === 'full') toasts.push(t.product.compareFull);
	}

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
				name: categoryName,
				item: `${SITE_URL}/${lang}/category/${product.category}`
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

<svelte:window onkeydown={handleKeydown} />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<Breadcrumbs
		label={t.product.breadcrumbLabel}
		items={[
			{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
			{ label: categoryName, href: categoryUrl },
			{ label: name }
		]}
	/>

	<div class="mt-4 grid gap-8 lg:grid-cols-2 lg:gap-12">
		<div>
			<figure aria-label={t.product.galleryLabel} class="relative overflow-hidden rounded-3xl bg-brand-50">
				<button type="button" onclick={openZoom} aria-label={t.product.zoomLabel} class="block w-full cursor-zoom-in">
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
				</button>
				<span
					class="pointer-events-none absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-neutral-700 shadow"
					aria-hidden="true"
				>
					<ZoomIn class="h-5 w-5" />
				</span>
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
				href={categoryUrl}
				class="inline-flex min-h-11 items-center text-sm font-semibold text-brand-700 hover:text-brand-800"
			>
				{categoryName}
			</a>
			<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{name}</h1>
			<p class="mt-3">
				<a href="#reviews" class="inline-flex min-h-11 flex-wrap items-center gap-2 hover:text-brand-800">
					<Stars rating={product.rating} label={ratingLabel} />
					<span class="text-sm text-neutral-500" aria-hidden="true">
						({formatCount(product.reviewCount, intlLocale)})
					</span>
					<span class="text-sm font-semibold text-brand-700 underline-offset-2 hover:underline">
						{t.product.reviewsLink}
					</span>
				</a>
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

			<div bind:this={buyBox} class="mt-6 flex flex-wrap items-center gap-3">
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
				<button
					type="button"
					aria-pressed={compared}
					onclick={toggleCompare}
					class="inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-neutral-700 ring-1 ring-neutral-300 hover:bg-neutral-50 {compared
						? 'ring-brand-700'
						: ''}"
				>
					<Scale class="h-4 w-4 {compared ? 'text-brand-700' : ''}" aria-hidden="true" />
					{compared ? t.product.compareRemove : t.product.compareAdd}
				</button>
			</div>

			{#if outOfStock}
				<div class="mt-4">
					{#if notifyRequested}
						<p role="status" class="text-sm font-medium text-brand-800">
							{t.product.notifySuccess}
						</p>
					{:else}
						<button
							type="button"
							onclick={() => {
								notifyRequested = true;
							}}
							class="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-50 px-5 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-100"
						>
							<Bell class="h-4 w-4" aria-hidden="true" />
							{t.product.notifyLabel}
						</button>
					{/if}
				</div>
			{/if}

			<div class="mt-6 border-t border-neutral-200 pt-5">
				<h2 class="text-sm font-bold text-neutral-900">{t.product.deliveryTitle}</h2>
				<ul class="mt-2 space-y-2 text-sm text-neutral-600">
					<li>
						<a
							href={localizedPath(lang, '/shipping')}
							class="inline-flex min-h-11 items-center gap-2 hover:text-brand-800"
						>
							<Truck class="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
							{t.product.deliveryEstimate}
						</a>
					</li>
					<li>
						<a
							href={localizedPath(lang, '/shipping')}
							class="inline-flex min-h-11 items-center gap-2 hover:text-brand-800"
						>
							<Truck class="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
							{t.product.freeDelivery}
						</a>
					</li>
					<li class="flex min-h-11 items-center gap-2">
						<ShieldCheck class="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
						{t.product.warranty}
					</li>
					<li>
						<a
							href={localizedPath(lang, '/returns')}
							class="inline-flex min-h-11 items-center gap-2 hover:text-brand-800"
						>
							<RotateCcw class="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
							{t.product.returns}
						</a>
					</li>
				</ul>
			</div>

			<div class="mt-6 flex flex-wrap items-center gap-3 border-t border-neutral-200 pt-5">
				<span class="text-sm font-semibold text-neutral-900">{t.product.shareLabel}</span>
				<button
					type="button"
					onclick={copyLink}
					class="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-neutral-700 ring-1 ring-neutral-300 hover:bg-neutral-50"
				>
					<Copy class="h-4 w-4" aria-hidden="true" />
					{t.product.copyLink}
				</button>
				{#if canShare}
					<button
						type="button"
						onclick={shareProduct}
						class="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-neutral-700 ring-1 ring-neutral-300 hover:bg-neutral-50"
					>
						<Share2 class="h-4 w-4" aria-hidden="true" />
						{t.product.shareViaLabel}
					</button>
				{/if}
			</div>
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

	<ReviewsSection {lang} {t} {product} />

	<section aria-labelledby="pairs-heading" class="mt-12">
		<h2 id="pairs-heading" class="text-2xl font-bold tracking-tight text-neutral-900">
			{t.product.pairsTitle}
		</h2>
		<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each pairs as pairedProduct (pairedProduct.slug)}
				<ProductCard product={pairedProduct} {lang} {t} />
			{/each}
		</div>
	</section>

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

	<div class="mt-12">
		<RecentlyViewed {lang} {t} excludeSlug={product.slug} />
	</div>

	{#if showStickyBar}
		<div class="h-24 lg:hidden" aria-hidden="true"></div>
	{/if}
</div>

{#if showStickyBar}
	<div class="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
		<div class="mx-auto flex max-w-7xl items-center gap-3">
			<p class="flex min-w-0 flex-col">
				<span class="truncate text-sm font-semibold text-neutral-900">{name}</span>
				<span class="text-base font-bold text-neutral-900">
					{formatPrice(product.price, intlLocale)}
				</span>
			</p>
			<button
				type="button"
				disabled={outOfStock}
				onclick={addToCart}
				class="ml-auto inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-500"
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
		</div>
	</div>
{/if}

{#if zoomOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button
			type="button"
			aria-label={t.nav.close}
			onclick={closeZoom}
			class="absolute inset-0 h-full w-full cursor-default bg-black/70"
		></button>
		<div
			role="dialog"
			aria-modal="true"
			aria-label={localize(product.imageAlt, lang)}
			class="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
		>
			<button
				type="button"
				bind:this={zoomCloseButton}
				onclick={closeZoom}
				aria-label={t.nav.close}
				class="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-neutral-700 shadow hover:bg-neutral-100"
			>
				<X class="h-5 w-5" aria-hidden="true" />
			</button>
			<img
				src={galleryImages[selectedImage]}
				alt={localize(product.imageAlt, lang)}
				width="1408"
				height="1760"
				decoding="async"
				class="max-h-[90vh] w-full object-contain"
			/>
		</div>
	</div>
{/if}
