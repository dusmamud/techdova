<script lang="ts">
	import { browser } from '$app/env';
	import {
		Bell,
		Check,
		ChevronLeft,
		ChevronRight,
		Copy,
		Heart,
		Minus,
		Package,
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
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import FaqItem from '#lib/components/FaqItem.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Picture from '#lib/components/Picture.svelte';
	import ProductCard from '#lib/components/ProductCard.svelte';
	import RecentlyViewed from '#lib/components/RecentlyViewed.svelte';
	import ReviewsSection from '#lib/components/ReviewsSection.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import Stars from '#lib/components/Stars.svelte';
	import { SITE_NAME, SITE_URL } from '#lib/config';
	import { getCategory } from '#lib/data/categories';
	import {
		getDefaultVariant,
		getPairsWellWith,
		getProduct,
		getRelatedProducts,
		getVariant,
		variantPrice,
		type Product,
		type ProductVariant
	} from '#lib/data/products';
	import { getProductQA } from '#lib/data/product-qa';
	import { flyToCart, prefersReducedMotion } from '#lib/fly-cart';
	import { formatCount, formatDecimal, formatPrice, interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import { loadRecentlyViewed, recordViewed, saveRecentlyViewed } from '#lib/recently-viewed';
	import { cart } from '#lib/stores/cart.svelte';
	import { compare } from '#lib/stores/compare.svelte';
	import { cookieBanner } from '#lib/stores/cookie-banner.svelte';
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
	const variants = $derived(product.variants ?? []);
	const qaItems = $derived(getProductQA(product.slug));
	const bundleProducts = $derived(
		(product.pairsWellWith ?? [])
			.map((slug) => getProduct(slug))
			.filter((candidate): candidate is Product => candidate !== undefined)
	);
	// Only in-stock partners count toward the bundle total and the add-all
	// action; out-of-stock partners are still shown, labeled as such.
	const bundleAvailable = $derived(bundleProducts.filter((candidate) => candidate.stock > 0));
	const wished = $derived(wishlist.has(product.slug));
	const compared = $derived(compare.has(product.slug));

	let qty = $state(1);
	let added = $state(false);
	let selectedVariantId = $state<string | undefined>(undefined);
	let bundleAdded = $state(false);
	let bundleTimer: ReturnType<typeof setTimeout> | undefined;
	let scrollProgress = $state(0);
	// Client-only clock: null until the interval effect runs, so prerendered
	// and hydrated HTML agree and the delivery countdown never mismatches.
	let nowMs = $state<number | null>(null);
	let magnify = $state(false);
	let magnifyOrigin = $state('50% 50%');
	let finePointer = $state(false);
	let touchStartX = $state<number | null>(null);
	// Pop counters (same pattern as ProductCard): incremented only by this
	// page's own toggle clicks, so the keyed icons pop on interaction —
	// never on initial render. `animate-pop` is disabled under reduced
	// motion by app.css.
	let heartPopKey = $state(0);
	let comparePopKey = $state(0);
	let timer: ReturnType<typeof setTimeout> | undefined;
	let selectedImage = $state(0);
	let notifyRequested = $state(false);
	let canShare = $state(false);
	let zoomOpen = $state(false);
	let showStickyBar = $state(false);
	let buyBox: HTMLDivElement | undefined = $state();
	let zoomCloseButton: HTMLButtonElement | undefined = $state();
	let zoomOpener: HTMLElement | null = null;
	// Default selection is the base-priced variant (priceDelta 0), so the
	// base price shows until the shopper picks another option — NOT
	// variants[0], which for the phones is the cheaper 128 GB option.
	const selectedVariant = $derived(getVariant(product, selectedVariantId) ?? getDefaultVariant(product));
	const displayPrice = $derived(variantPrice(product, selectedVariant));
	const variantStock = $derived(selectedVariant?.stock ?? product.stock);
	const outOfStock = $derived(variantStock <= 0);
	const lowStock = $derived(!outOfStock && variantStock <= 5);
	const bundleTotal = $derived(
		displayPrice + bundleAvailable.reduce((sum, candidate) => sum + candidate.price, 0)
	);
	// Gallery follows a color variant's own image when one exists. No variant
	// ships one yet — the generated angles depict the base colorway — so
	// today this is the product's own angles, primary image first.
	const galleryImages = $derived(
		selectedVariant?.image
			? [
					selectedVariant.image,
					...product.images.filter((image) => image !== selectedVariant.image)
				]
			: product.images
	);

	$effect(() => {
		if (!browser) return;
		saveRecentlyViewed(recordViewed(loadRecentlyViewed(), product.slug));
		canShare = typeof navigator.share === 'function';
	});

	// Per-product state resets when navigating between products: SvelteKit
	// reuses this component, so $state would otherwise leak across slugs.
	$effect(() => {
		void product.slug;
		selectedVariantId = undefined;
		selectedImage = 0;
		qty = 1;
		added = false;
		notifyRequested = false;
		bundleAdded = false;
	});

	$effect(() => {
		if (selectedImage >= galleryImages.length) selectedImage = 0;
	});

	$effect(() => {
		if (qty > variantStock && variantStock > 0) qty = variantStock;
	});

	$effect(() => {
		if (!browser) return;
		finePointer = window.matchMedia('(pointer: fine)').matches;
	});

	$effect(() => {
		if (!browser) return;
		const tick = () => {
			nowMs = Date.now();
		};
		tick();
		const interval = setInterval(tick, 60_000);
		return () => clearInterval(interval);
	});

	$effect(() => {
		if (!browser) return;
		const onScroll = () => {
			const doc = document.documentElement;
			const max = doc.scrollHeight - doc.clientHeight;
			scrollProgress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
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
		else if (event.key === 'ArrowLeft' && zoomOpen) prevImage();
		else if (event.key === 'ArrowRight' && zoomOpen) nextImage();
	}

	function prevImage(): void {
		selectedImage = (selectedImage - 1 + galleryImages.length) % galleryImages.length;
	}

	function nextImage(): void {
		selectedImage = (selectedImage + 1) % galleryImages.length;
	}

	function onGalleryKeydown(event: KeyboardEvent): void {
		if (event.key === 'ArrowLeft') prevImage();
		else if (event.key === 'ArrowRight') nextImage();
	}

	function onTouchStart(event: TouchEvent): void {
		touchStartX = event.touches[0]?.clientX ?? null;
	}

	function onTouchEnd(event: TouchEvent): void {
		if (touchStartX === null) return;
		const endX = event.changedTouches[0]?.clientX ?? touchStartX;
		const delta = endX - touchStartX;
		touchStartX = null;
		if (Math.abs(delta) < 40) return;
		if (delta < 0) nextImage();
		else prevImage();
	}

	function onGalleryMouseEnter(): void {
		if (finePointer && !prefersReducedMotion()) magnify = true;
	}

	function onGalleryMouseMove(event: MouseEvent): void {
		const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;
		magnifyOrigin = `${x.toFixed(1)}% ${y.toFixed(1)}%`;
	}

	function selectVariant(variant: ProductVariant): void {
		if (variant.stock <= 0) return;
		selectedVariantId = variant.id;
	}

	function scrollToReviews(event: MouseEvent): void {
		event.preventDefault();
		if (!browser) return;
		const heading = document.getElementById('reviews-heading');
		if (!heading) return;
		heading.scrollIntoView({
			behavior: prefersReducedMotion() ? 'auto' : 'smooth',
			block: 'start'
		});
		heading.focus({ preventScroll: true });
		window.history.replaceState(null, '', '#reviews');
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

	function toggleWishlist(): void {
		heartPopKey++;
		wishlist.toggle(product.slug);
	}

	function toggleCompare(): void {
		comparePopKey++;
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
				? interpolate(t.product.lowStock, { count: variantStock })
				: t.product.inStock
	);

	// Delivery countdown: orders placed before the 16:00 local cutoff are
	// estimated to arrive 48h after that cutoff. Computed from the live
	// clock (null until the interval effect runs, so the static estimate
	// renders first) and labeled as a demo estimate in the UI.
	const deliveryInfo = $derived.by(() => {
		if (nowMs === null) return null;
		const now = new Date(nowMs);
		const cutoff = new Date(now);
		cutoff.setHours(16, 0, 0, 0);
		const target = now < cutoff ? cutoff : new Date(cutoff.getTime() + 24 * 3600_000);
		const remainingMs = target.getTime() - nowMs;
		const hours = Math.floor(remainingMs / 3600_000);
		const minutes = Math.floor((remainingMs % 3600_000) / 60_000);
		const delivery = new Date(target.getTime() + 48 * 3600_000);
		const date = new Intl.DateTimeFormat(intlLocale, {
			weekday: 'long',
			day: 'numeric',
			month: 'long'
		}).format(delivery);
		const time =
			hours > 0
				? interpolate(t.product.deliveryCountdownTime, { hours, minutes })
				: interpolate(t.product.deliveryCountdownMinutes, { minutes });
		return interpolate(t.product.deliveryCountdown, { time, date });
	});

	function addToCart(event: MouseEvent): void {
		const source = event.currentTarget;
		if (source instanceof HTMLElement) flyToCart(source, galleryImages[selectedImage]);
		cart.add(product.slug, qty, selectedVariant?.id);
		added = true;
		cart.openDrawer();
		clearTimeout(timer);
		timer = setTimeout(() => {
			added = false;
		}, 1800);
	}

	function addBundle(event: MouseEvent): void {
		const source = event.currentTarget;
		if (source instanceof HTMLElement) flyToCart(source, galleryImages[selectedImage]);
		cart.add(product.slug, qty, selectedVariant?.id);
		for (const partner of bundleAvailable) cart.add(partner.slug, 1);
		bundleAdded = true;
		cart.openDrawer();
		clearTimeout(bundleTimer);
		bundleTimer = setTimeout(() => {
			bundleAdded = false;
		}, 1800);
	}

	const productJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'Product',
		name,
		image: product.images.map((image) => `${SITE_URL}${image}.jpg`),
		description: localize(product.description, lang),
		sku: product.sku,
		offers: {
			'@type': 'Offer',
			priceCurrency: 'DZD',
			price: displayPrice,
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
	image={`${product.image}.jpg`}
	type="product"
/>
<JsonLd json={productJsonLd} />
<JsonLd json={breadcrumbJsonLd} />

<svelte:window onkeydown={handleKeydown} />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div
		role="progressbar"
		aria-label={t.product.scrollProgressLabel}
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={Math.round(scrollProgress * 100)}
		class="sticky top-28 z-30 -mx-4 mb-4 h-1 overflow-hidden bg-line sm:-mx-6 lg:-mx-8 lg:top-[7.5rem]"
	>
		<div
			class="h-full w-full origin-left bg-brand-700"
			style="transform: scaleX({scrollProgress})"
		></div>
	</div>
	<Breadcrumbs
		label={t.product.breadcrumbLabel}
		items={[
			{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
			{ label: categoryName, href: categoryUrl },
			{ label: name }
		]}
	/>

	<div class="mt-4 grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
		<!-- svelte-ignore a11y_no_static_element_interactions: arrow-key gallery navigation delegates from the focusable thumbnail/arrow buttons inside -->
		<div class="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none" onkeydown={onGalleryKeydown}>
			<figure
				aria-label={t.product.galleryLabel}
				class="relative overflow-hidden rounded-3xl bg-brand-50"
				ontouchstart={onTouchStart}
				ontouchend={onTouchEnd}
			>
				<p class="sr-only" role="status">
					{interpolate(t.product.galleryImageLabel, {
						current: selectedImage + 1,
						total: galleryImages.length
					})}
				</p>
				<button
					type="button"
					onclick={openZoom}
					aria-label={t.product.zoomLabel}
					class="block w-full cursor-zoom-in"
					onmouseenter={onGalleryMouseEnter}
					onmouseleave={() => {
						magnify = false;
					}}
					onmousemove={onGalleryMouseMove}
				>
					<div
						class="aspect-[4/5] motion-safe:transition-transform motion-safe:duration-200 {magnify
							? 'scale-[1.8]'
							: ''}"
						style="transform-origin: {magnifyOrigin}"
					>
						<Picture
							base={galleryImages[selectedImage]}
							alt={localize(product.imageAlt, lang)}
							width={1408}
							height={1760}
							decoding="async"
							fetchPriority="high"
							class="h-full w-full object-cover"
						/>
					</div>
				</button>
				<span
					class="pointer-events-none absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-surface/90 text-ink-soft shadow"
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
				{#if galleryImages.length > 1}
					<button
						type="button"
						onclick={prevImage}
						aria-label={t.product.galleryPrevious}
						class="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink shadow hover:bg-surface"
					>
						<ChevronLeft class="h-5 w-5" aria-hidden="true" />
					</button>
					<button
						type="button"
						onclick={nextImage}
						aria-label={t.product.galleryNext}
						class="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-surface/90 text-ink shadow hover:bg-surface"
					>
						<ChevronRight class="h-5 w-5" aria-hidden="true" />
					</button>
				{/if}
			</figure>
			<p class="mt-2 hidden text-center text-xs text-muted [@media(pointer:fine)]:block">
				{t.product.magnifierHint}
			</p>
			{#if galleryImages.length > 1}
				<div class="mt-3 flex gap-3">
					{#each galleryImages as image, i (i)}
						<button
							type="button"
							onclick={() => {
								selectedImage = i;
							}}
							aria-current={selectedImage === i ? 'true' : undefined}
							aria-label={interpolate(t.product.galleryThumbnailLabel, { n: i + 1 })}
							class="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-brand-50 ring-2 aria-[current=true]:ring-brand-700 aria-[current=false]:ring-transparent"
						>
							<Picture
								base={image}
								alt={localize(product.imageAlt, lang)}
								width={1408}
								height={1760}
								loading="lazy"
								decoding="async"
								class="h-full w-full object-cover"
							/>
						</button>
					{/each}
				</div>
				<div class="mt-3 flex justify-center gap-1">
					{#each galleryImages as _, i (i)}
						<button
							type="button"
							onclick={() => {
								selectedImage = i;
							}}
							aria-current={selectedImage === i ? 'true' : undefined}
							aria-label={interpolate(t.product.galleryThumbnailLabel, { n: i + 1 })}
							class="grid h-6 w-6 place-items-center"
						>
							<span
								class="h-2 rounded-full {selectedImage === i
									? 'w-4 bg-brand-700'
									: 'w-2 bg-line hover:bg-brand-300'}"
								aria-hidden="true"
							></span>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<div>
			<a
				href={categoryUrl}
				class="inline-flex min-h-11 items-center text-sm font-semibold text-brand-700 dark:text-brand-300 hover:text-brand-800 dark:hover:text-brand-200"
			>
				{categoryName}
			</a>
			<h1 class="text-[1.75rem] font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl">{name}</h1>
			<p class="mt-3">
				<a
					href="#reviews"
					onclick={scrollToReviews}
					class="inline-flex min-h-11 flex-wrap items-center gap-2 hover:text-brand-800 dark:hover:text-brand-200"
				>
					<Stars rating={product.rating} label={ratingLabel} />
					<span class="text-sm text-muted" aria-hidden="true">
						({formatCount(product.reviewCount, intlLocale)})
					</span>
					<span class="text-sm font-semibold text-brand-700 dark:text-brand-300 underline-offset-2 hover:underline">
						{t.product.reviewsLink}
					</span>
				</a>
			</p>
			<p class="mt-2 text-sm text-muted">
				{t.product.skuLabel}:
				<span class="font-medium text-ink-soft">{product.sku}</span>
			</p>
			<p class="mt-4 flex flex-wrap items-baseline gap-3">
				<span class="text-3xl font-bold text-ink">
					{formatPrice(displayPrice, intlLocale)}
				</span>
				{#if product.oldPrice && displayPrice === product.price}
					<s class="text-lg text-muted">{formatPrice(product.oldPrice, intlLocale)}</s>
					<span class="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800">
						{interpolate(t.product.saveLabel, {
							amount: formatPrice(product.oldPrice - product.price, intlLocale)
						})}
					</span>
				{/if}
			</p>
			<p class="mt-4 leading-relaxed text-muted">
				{localize(product.description, lang)}
			</p>
			<p class="mt-4 flex items-center gap-2 text-sm font-semibold {outOfStock ? 'text-red-600 dark:text-red-400' : 'text-brand-700 dark:text-brand-300'}">
				<span
					class="h-2.5 w-2.5 rounded-full {outOfStock ? 'bg-red-50 dark:bg-red-950/600' : lowStock ? 'bg-amber-500' : 'bg-brand-600'}"
					aria-hidden="true"
				></span>
				{stockText}
			</p>

			{#if variants.length > 0}
				<div class="mt-6">
					<p class="text-sm font-semibold text-ink">
						{selectedVariant?.kind === 'color'
							? t.product.variantColorLabel
							: t.product.variantStorageLabel}
						{#if selectedVariant}
							<span class="font-normal text-muted">
								{interpolate(t.product.variantSelected, {
									label: localize(selectedVariant.label, lang)
								})}
							</span>
						{/if}
					</p>
					<p class="sr-only" role="status" aria-live="polite">
						{#if selectedVariant}
							{interpolate(t.product.variantSelected, {
								label: localize(selectedVariant.label, lang)
							})}
						{/if}
					</p>
					<div class="mt-3 flex flex-wrap gap-2">
						{#each variants as variant (variant.id)}
							{@const isSelected = selectedVariant?.id === variant.id}
							{@const variantOutOfStock = variant.stock <= 0}
							<button
								type="button"
								disabled={variantOutOfStock}
								aria-pressed={isSelected}
								onclick={() => selectVariant(variant)}
								class="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 transition-colors disabled:cursor-not-allowed disabled:opacity-40 {isSelected
									? 'bg-brand-700 text-white ring-brand-700'
									: 'text-ink-soft ring-line hover:bg-surface-soft'}"
							>
								{#if variant.kind === 'color' && variant.swatch}
									<span
										class="h-4 w-4 shrink-0 rounded-full ring-1 ring-black/20"
										style="background-color: {variant.swatch}"
										aria-hidden="true"
									></span>
								{/if}
								{localize(variant.label, lang)}
								{#if variant.priceDelta !== 0}
									<span class="font-normal opacity-80">
										({variant.priceDelta > 0 ? '+' : '−'}{formatPrice(
											Math.abs(variant.priceDelta),
											intlLocale
										)})
									</span>
								{/if}
								{#if variantOutOfStock}
									<span class="font-normal">({t.product.variantOutOfStockSuffix})</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/if}

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
						class="grid h-12 w-12 place-items-center rounded-full ring-1 ring-line hover:bg-surface-soft disabled:opacity-40"
					>
						<Minus class="h-4 w-4" aria-hidden="true" />
					</button>
					<span class="w-10 text-center text-base font-semibold" role="status" aria-labelledby="qty-label">
						{qty}
					</span>
					<button
						type="button"
						onclick={() => {
							qty = Math.min(variantStock, qty + 1);
						}}
						disabled={qty >= variantStock || outOfStock}
						aria-label="{t.product.quantity}: {qty + 1}"
						class="grid h-12 w-12 place-items-center rounded-full ring-1 ring-line hover:bg-surface-soft disabled:opacity-40"
					>
						<Plus class="h-4 w-4" aria-hidden="true" />
					</button>
				</div>
				<button
					type="button"
					disabled={outOfStock}
					onclick={addToCart}
					class="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted sm:flex-none sm:px-8"
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
					onclick={toggleWishlist}
					class="inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-soft ring-1 ring-line hover:bg-surface-soft"
				>
					{#key heartPopKey}
						<Heart
							class="h-4 w-4 {wished ? 'text-rose-600' : ''} {heartPopKey > 0
								? 'animate-pop'
								: ''}"
							fill={wished ? 'currentColor' : 'none'}
							aria-hidden="true"
						/>
					{/key}
					{wished ? t.productCard.removeFromWishlist : t.productCard.addToWishlist}
				</button>
				<button
					type="button"
					aria-pressed={compared}
					onclick={toggleCompare}
					class="inline-flex min-h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-soft ring-1 ring-line hover:bg-surface-soft {compared
						? 'ring-brand-700'
						: ''}"
				>
					{#key comparePopKey}
						<Scale
							class="h-4 w-4 {compared ? 'text-brand-700 dark:text-brand-300' : ''} {comparePopKey > 0
								? 'animate-pop'
								: ''}"
							aria-hidden="true"
						/>
					{/key}
					{compared ? t.product.compareRemove : t.product.compareAdd}
				</button>
			</div>

			<div class="mt-4 space-y-1.5 text-sm text-muted">
				<p>
					{interpolate(t.product.estimatedCost, {
						total: formatPrice(displayPrice * qty, intlLocale)
					})}
				</p>
				<p class="flex items-center gap-2">
					<Truck class="h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
					{t.product.freeDelivery}
				</p>
				<p>
					{t.product.returns}
					·
					<a
						href={localizedPath(lang, '/returns')}
						class="font-semibold text-brand-700 dark:text-brand-300 underline-offset-2 hover:underline"
					>
						{t.product.returnPolicyLink}
					</a>
				</p>
			</div>

			{#if outOfStock}
				<div class="mt-4">
					{#if notifyRequested}
						<p role="status" class="text-sm font-medium text-brand-800 dark:text-brand-200">
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

			<div class="mt-6 border-t border-line pt-5">
				<h2 class="text-sm font-bold text-ink">{t.product.deliveryTitle}</h2>
				<ul class="mt-2 space-y-2 text-sm text-muted">
					<li>
						<a
							href={localizedPath(lang, '/shipping')}
							class="inline-flex min-h-11 items-center gap-2 hover:text-brand-800 dark:hover:text-brand-200"
						>
							<Truck class="h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
							{deliveryInfo ?? t.product.deliveryEstimate}
						</a>
					</li>
					<li>
						<a
							href={localizedPath(lang, '/shipping')}
							class="inline-flex min-h-11 items-center gap-2 hover:text-brand-800 dark:hover:text-brand-200"
						>
							<Truck class="h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
							{t.product.freeDelivery}
						</a>
					</li>
					<li class="flex min-h-11 items-center gap-2">
						<ShieldCheck class="h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
						{t.product.warranty}
					</li>
					<li>
						<a
							href={localizedPath(lang, '/returns')}
							class="inline-flex min-h-11 items-center gap-2 hover:text-brand-800 dark:hover:text-brand-200"
						>
							<RotateCcw class="h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
							{t.product.returns}
						</a>
					</li>
				</ul>
				<p class="mt-2 text-xs text-muted">{t.product.deliveryDemoNote}</p>
			</div>

			<div class="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
				<span class="text-sm font-semibold text-ink">{t.product.shareLabel}</span>
				<button
					type="button"
					onclick={copyLink}
					class="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-soft ring-1 ring-line hover:bg-surface-soft"
				>
					<Copy class="h-4 w-4" aria-hidden="true" />
					{t.product.copyLink}
				</button>
				{#if canShare}
					<button
						type="button"
						onclick={shareProduct}
						class="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink-soft ring-1 ring-line hover:bg-surface-soft"
					>
						<Share2 class="h-4 w-4" aria-hidden="true" />
						{t.product.shareViaLabel}
					</button>
				{/if}
			</div>
		</div>
	</div>

	<div class="mt-10 grid gap-6 sm:mt-12 sm:gap-8 lg:grid-cols-2">
		<section aria-labelledby="description-heading" use:reveal>
			<h2 id="description-heading" class="text-xl font-bold text-ink">{t.product.description}</h2>
			<p class="mt-3 leading-relaxed text-muted">{localize(product.description, lang)}</p>
			<p class="mt-3 leading-relaxed text-muted">
				{localize(product.shortDescription, lang)}
			</p>
		</section>
		<section aria-labelledby="specs-heading" use:reveal>
			<h2 id="specs-heading" class="text-xl font-bold text-ink">{t.product.specifications}</h2>
			<dl class="mt-3 divide-y divide-line rounded-3xl bg-surface-soft px-5">
				{#each product.specs as spec (localize(spec.label, 'en'))}
					<div class="grid grid-cols-2 gap-4 py-3 text-sm">
						<dt class="font-medium text-muted">{localize(spec.label, lang)}</dt>
						<dd class="font-semibold text-ink">{localize(spec.value, lang)}</dd>
					</div>
				{/each}
			</dl>
		</section>
	</div>

	{#if bundleProducts.length > 0}
		<section aria-labelledby="bundle-heading" class="mt-10 sm:mt-12" use:reveal>
			<h2 id="bundle-heading" class="text-[1.375rem] font-bold tracking-tight text-ink sm:text-2xl">
				{t.product.bundleTitle}
			</h2>
			<div class="mt-5 rounded-3xl bg-surface p-5 ring-1 ring-line sm:mt-6 sm:p-6">
				<ul class="space-y-4">
					<li class="flex items-center gap-4">
						<div class="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-brand-50">
							<Picture
								base={product.image}
								alt={localize(product.imageAlt, lang)}
								width={320}
								height={400}
								loading="lazy"
								decoding="async"
								class="h-full w-full object-cover"
							/>
						</div>
						<div class="min-w-0">
							<p class="truncate font-semibold text-ink">{name}</p>
							{#if selectedVariant}
								<p class="text-sm text-muted">{localize(selectedVariant.label, lang)}</p>
							{/if}
							<p class="mt-0.5 text-sm font-bold text-ink">
								{formatPrice(displayPrice, intlLocale)}
							</p>
						</div>
					</li>
					{#each bundleProducts as partner (partner.slug)}
						<li class="flex items-center gap-3">
							<Plus class="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
							<a
								href={localizedPath(lang, `/product/${partner.slug}`)}
								class="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-brand-50"
							>
								<Picture
									base={partner.image}
									alt={localize(partner.imageAlt, lang)}
									width={320}
									height={400}
									loading="lazy"
									decoding="async"
									class="h-full w-full object-cover"
								/>
							</a>
							<div class="min-w-0">
								<p class="truncate">
									<a
										href={localizedPath(lang, `/product/${partner.slug}`)}
										class="font-semibold text-ink underline-offset-2 hover:underline"
									>
										{localize(partner.name, lang)}
									</a>
								</p>
								<p class="mt-0.5 flex flex-wrap items-center gap-2 text-sm">
									<span class="font-bold text-ink">{formatPrice(partner.price, intlLocale)}</span>
									{#if partner.stock <= 0}
										<span class="font-semibold text-red-600 dark:text-red-400">{t.product.outOfStock}</span>
									{/if}
								</p>
							</div>
						</li>
					{/each}
				</ul>
				<div class="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
					<p class="text-base font-bold text-ink">
						{interpolate(t.product.bundleTotal, {
							count: bundleAvailable.length + 1,
							total: formatPrice(bundleTotal, intlLocale)
						})}
					</p>
					<button
						type="button"
						disabled={outOfStock}
						onclick={addBundle}
						class="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
					>
						{#if bundleAdded}
							<Check class="h-4 w-4" aria-hidden="true" />
							{t.product.bundleAdded}
						{:else}
							<ShoppingCart class="h-4 w-4" aria-hidden="true" />
							{interpolate(t.product.bundleAddAll, { count: bundleAvailable.length + 1 })}
						{/if}
					</button>
				</div>
			</div>
		</section>
	{/if}

	{#if (product.inTheBox ?? []).length > 0}
		<section aria-labelledby="box-heading" class="mt-10 sm:mt-12" use:reveal>
			<h2 id="box-heading" class="text-[1.375rem] font-bold tracking-tight text-ink sm:text-2xl">
				{t.product.inTheBoxTitle}
			</h2>
			<ul class="mt-5 divide-y divide-line rounded-3xl bg-surface-soft px-5 sm:mt-6">
				{#each product.inTheBox ?? [] as item, i (i)}
					<li class="flex items-center gap-3 py-3 text-sm">
						<Package class="h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
						<span class="text-ink-soft">{localize(item, lang)}</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	{#if qaItems.length > 0}
		<section aria-labelledby="qa-heading" class="mt-10 sm:mt-12" use:reveal>
			<h2 id="qa-heading" class="text-[1.375rem] font-bold tracking-tight text-ink sm:text-2xl">
				{t.product.qaTitle}
			</h2>
			<p class="mt-2 text-sm text-muted">{t.product.qaDemoNote}</p>
			<div class="mt-5 space-y-3 sm:mt-6">
				{#each qaItems as item, i (i)}
					<FaqItem
						question={localize(item.question, lang)}
						answer={localize(item.answer, lang)}
						open={i === 0}
					/>
				{/each}
			</div>
		</section>
	{/if}

	<ReviewsSection {lang} {t} {product} />

	<section aria-labelledby="pairs-heading" class="mt-10 sm:mt-12" use:reveal>
		<h2 id="pairs-heading" class="text-[1.375rem] font-bold tracking-tight text-ink sm:text-2xl">
			{t.product.pairsTitle}
		</h2>
		<div class="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-5 lg:grid-cols-3">
			{#each pairs as pairedProduct, i (pairedProduct.slug)}
				<div class="grid" use:reveal={{ delay: Math.min(i * 60, 300) }}>
					<ProductCard product={pairedProduct} {lang} {t} />
				</div>
			{/each}
		</div>
	</section>

	<section aria-labelledby="related-heading" class="mt-10 sm:mt-12" use:reveal>
		<h2 id="related-heading" class="text-[1.375rem] font-bold tracking-tight text-ink sm:text-2xl">
			{t.product.relatedTitle}
		</h2>
		<div class="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-5 lg:grid-cols-4">
			{#each related as relatedProduct, i (relatedProduct.slug)}
				<div class="grid" use:reveal={{ delay: Math.min(i * 60, 300) }}>
					<ProductCard product={relatedProduct} {lang} {t} />
				</div>
			{/each}
		</div>
	</section>

	<div class="mt-10 sm:mt-12" use:reveal>
		<RecentlyViewed {lang} {t} excludeSlug={product.slug} />
	</div>

	{#if showStickyBar}
		<div class="h-24 lg:hidden" aria-hidden="true"></div>
	{/if}
</div>

{#if showStickyBar}
	<div
		class="fixed inset-x-0 z-40 border-t border-line bg-surface/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden"
		style:bottom="{cookieBanner.height}px"
	>
		<div class="mx-auto flex max-w-7xl items-center gap-3">
			<p class="flex min-w-0 flex-col">
				<span class="truncate text-sm font-semibold text-ink">{name}</span>
				<span class="text-base font-bold text-ink">
					{formatPrice(displayPrice, intlLocale)}
				</span>
			</p>
			<button
				type="button"
				disabled={outOfStock}
				onclick={addToCart}
				class="ml-auto inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
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
			class="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl bg-surface shadow-2xl"
		>
			<button
				type="button"
				bind:this={zoomCloseButton}
				onclick={closeZoom}
				aria-label={t.nav.close}
				class="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-surface text-ink-soft shadow hover:bg-surface-soft"
			>
				<X class="h-5 w-5" aria-hidden="true" />
			</button>
			<Picture
				base={galleryImages[selectedImage]}
				alt={localize(product.imageAlt, lang)}
				width={1408}
				height={1760}
				decoding="async"
				class="max-h-[90vh] w-full object-contain"
			/>
		</div>
	</div>
{/if}
