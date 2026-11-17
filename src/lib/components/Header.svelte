<script lang="ts">
	import { browser } from '$app/env';
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import {
		ChevronDown,
		Menu,
		ShoppingBag,
		ShoppingCart,
		User,
		X
	} from '@lucide/svelte';
	import { SITE_NAME } from '#lib/config';
	import { categories } from '#lib/data/categories';
	import { getFeaturedProducts } from '#lib/data/products';
	import { formatPrice, interpolate } from '#lib/format';
	import {
		dictionaries,
		localize,
		locales,
		type Dictionary,
		type Locale
	} from '#lib/i18n/index';
	import { localizedPath, productPath, switchLocalePath } from '#lib/paths';
	import { cart } from '#lib/stores/cart.svelte';
	import AnnouncementBar from './AnnouncementBar.svelte';
	import Picture from './Picture.svelte';
	import SearchForm from './SearchForm.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();

	let headerEl: HTMLElement | undefined = $state();
	let menuOpen = $state(false);
	let categoriesOpen = $state(false);
	let scrolled = $state(false);
	let megaWrapper: HTMLDivElement | undefined = $state();
	let categoriesTrigger: HTMLButtonElement | undefined = $state();
	let megaPanel: HTMLDivElement | undefined = $state();
	let megaPositioner: HTMLDivElement | undefined = $state();

	// Reduced motion: the mega-menu fade runs at duration 0 (instant).
	const reduceMotion = browser
		? window.matchMedia('(prefers-reduced-motion: reduce)').matches
		: false;

	const intlLocale = $derived(t.meta.intlLocale);
	const featuredProducts = getFeaturedProducts().slice(0, 3);

	// Header morph on scroll: stronger shadow + a smaller logo mark. The
	// bar height never changes, so page content never shifts; only the
	// shadow and the mark transition. Mount-only passive listener, cleaned
	// up on destroy. Initial call covers reloads restored mid-page.
	$effect(() => {
		if (!browser) return;
		const onScroll = (): void => {
			scrolled = window.scrollY > 4;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	const currentPath = $derived(page.url.pathname);
	// searchParams is unavailable during prerendering: read it only in the browser.
	const searchValue = $derived(browser ? (page.url.searchParams.get('q') ?? '') : '');

	const navLinks = $derived([
		{ label: t.nav.home, href: localizedPath(lang, '/') },
		{ label: t.nav.shop, href: localizedPath(lang, '/shop') },
		{ label: t.nav.deals, href: localizedPath(lang, '/deals') },
		{ label: t.nav.about, href: localizedPath(lang, '/about') },
		{ label: t.nav.contact, href: localizedPath(lang, '/contact') }
	]);

	// Keep the mega-menu panel inside the viewport: it is centred on the
	// trigger, whose centre sits left of viewport centre near the lg
	// breakpoint, so the 46rem panel would otherwise stick out past the
	// left edge at 1024px. Measure after mount and shift with margin-left
	// (the centring uses the translate property, so the two never fight);
	// re-clamp on resize while open. The panel unmounts on close, so no
	// reset is needed.
	$effect(() => {
		if (!browser || !categoriesOpen) return;
		const clamp = (): void => {
			const el = megaPositioner;
			if (!el) return;
			el.style.marginLeft = '0px';
			const rect = el.getBoundingClientRect();
			const margin = 8;
			if (rect.left < margin) el.style.marginLeft = `${margin - rect.left}px`;
			else if (rect.right > window.innerWidth - margin) {
				el.style.marginLeft = `${window.innerWidth - margin - rect.right}px`;
			}
		};
		void tick().then(clamp);
		window.addEventListener('resize', clamp);
		return () => window.removeEventListener('resize', clamp);
	});

	function closeAll(): void {
		menuOpen = false;
		categoriesOpen = false;
	}

	function openCategories(): void {
		categoriesOpen = true;
	}

	function closeCategories(returnFocus = false): void {
		categoriesOpen = false;
		if (returnFocus) categoriesTrigger?.focus();
	}

	// Close the mega menu when focus leaves the whole trigger + panel
	// wrapper (Tab past the last link, or Shift+Tab before the trigger).
	// Moving between the trigger and the panel keeps it open.
	function handleMegaFocusOut(event: FocusEvent): void {
		const next = event.relatedTarget as Node | null;
		if (next && megaWrapper?.contains(next)) return;
		categoriesOpen = false;
	}

	// Keyboard flow for the mega menu: ArrowDown on the trigger opens the
	// panel and focuses its first link; ArrowUp/ArrowDown inside the panel
	// cycle through its links (wrapping); Tab moves through links natively
	// and leaving the wrapper closes the panel; Escape closes the panel and
	// returns focus to the trigger. Enter/Space keep the native click
	// toggle on the trigger button.
	async function handleMegaKeydown(event: KeyboardEvent): Promise<void> {
		if (event.key === 'Escape' && categoriesOpen) {
			event.preventDefault();
			closeCategories(true);
			return;
		}
		if (event.target === categoriesTrigger && event.key === 'ArrowDown') {
			event.preventDefault();
			categoriesOpen = true;
			await tick();
			megaPanel?.querySelector('a')?.focus();
			return;
		}
		if (
			(event.key === 'ArrowDown' || event.key === 'ArrowUp') &&
			megaPanel?.contains(event.target as Node)
		) {
			const links = [...megaPanel.querySelectorAll('a')];
			const current = links.indexOf(document.activeElement as HTMLAnchorElement);
			if (current === -1) return;
			event.preventDefault();
			const next =
				event.key === 'ArrowDown'
					? (current + 1) % links.length
					: (current - 1 + links.length) % links.length;
			links[next]?.focus();
		}
	}

	function handleWindowClick(event: MouseEvent): void {
		if (headerEl && !headerEl.contains(event.target as Node)) closeAll();
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') closeAll();
	}

	function switchHref(locale: Locale): string {
		// Effective URL: after a shallow replaceState (shop filters) the new
		// query lives in `page.shallow.url`, not `page.url`.
		const effective = page.shallow?.url ?? page.url;
		const suffix = browser ? effective.search + effective.hash : '';
		return switchLocalePath(currentPath, locale) + suffix;
	}

	const cartLabel = $derived(
		cart.count > 0
			? `${t.nav.cart}, ${interpolate(t.cart.itemsLabel, { count: cart.count })}`
			: t.nav.cart
	);
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleKeydown} />

<header
	bind:this={headerEl}
	class="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur motion-safe:transition-shadow motion-safe:duration-200 {scrolled
		? 'shadow-lg'
		: ''}"
>
	<AnnouncementBar {lang} {t} />
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center gap-1.5 sm:gap-2 lg:h-[72px] lg:gap-3 xl:gap-4">
			<a
				href={localizedPath(lang, '/')}
				class="flex min-h-11 shrink-0 items-center gap-2 rounded-full"
				aria-label={SITE_NAME}
			>
				<span
					class="grid place-items-center rounded-xl bg-brand-700 text-white motion-safe:transition-[width,height] motion-safe:duration-200 {scrolled
						? 'h-9 w-9'
						: 'h-10 w-10'}"
				>
					<ShoppingBag class="h-5 w-5" aria-hidden="true" />
				</span>
				<span class="text-lg font-bold tracking-tight text-ink sm:text-xl">
					Tech<span class="text-brand-700 dark:text-brand-300">Dova</span>
				</span>
			</a>

			<nav class="ml-1 hidden items-center gap-0.5 lg:flex xl:ml-2 xl:gap-1" aria-label={t.nav.main}>
				{#each navLinks.slice(0, 2) as link (link.href)}
					<a
						href={link.href}
						aria-current={currentPath === link.href ? 'page' : undefined}
						class="flex min-h-11 items-center rounded-full px-2.5 text-sm font-medium text-ink-soft hover:bg-brand-50 hover:text-brand-800 aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-800 xl:px-3"
					>
						{link.label}
					</a>
				{/each}

				<!-- svelte-ignore a11y_no_static_element_interactions: hover/keyboard delegation for the mega menu; the trigger button and panel links carry the interaction -->
				<div
					bind:this={megaWrapper}
					class="relative"
					onmouseenter={openCategories}
					onmouseleave={() => {
						categoriesOpen = false;
					}}
					onfocusin={openCategories}
					onfocusout={handleMegaFocusOut}
					onkeydown={handleMegaKeydown}
				>
					<button
						bind:this={categoriesTrigger}
						type="button"
						id="categories-trigger"
						aria-expanded={categoriesOpen}
						aria-controls="mega-menu"
						aria-haspopup="true"
						onclick={() => {
							categoriesOpen = !categoriesOpen;
						}}
						class="flex min-h-11 items-center gap-1 rounded-full px-2.5 text-sm font-medium text-ink-soft hover:bg-brand-50 hover:text-brand-800 xl:px-3"
					>
						{t.nav.categories}
						<ChevronDown
							class="h-4 w-4 transition-transform {categoriesOpen ? 'rotate-180' : ''}"
							aria-hidden="true"
						/>
					</button>
					{#if categoriesOpen}
						<!-- Outer div positions the panel and bridges the 8px
							gap with padding (hoverable), so moving the mouse
							from the trigger into the panel never fires
							mouseleave. The inner div carries the visuals and
							the fade-only transition: the panel is centred
							with -translate-x-1/2, and any transform keyframe
							would override that translation. Opacity-only
							keeps the centering intact while animating open
							and close. -->
						<div
							bind:this={megaPositioner}
							class="absolute left-1/2 top-full z-50 w-[min(46rem,calc(100vw-2rem))] -translate-x-1/2 pt-2"
						>
							<div
								bind:this={megaPanel}
								id="mega-menu"
								role="region"
								aria-label={t.nav.categories}
								transition:fade={{ duration: reduceMotion ? 0 : 200 }}
								class="rounded-3xl bg-surface p-5 shadow-xl ring-1 ring-line"
							>
							<div class="grid grid-cols-[1.4fr_1fr_0.95fr] gap-6">
								<div>
									<p class="text-xs font-semibold uppercase tracking-wide text-muted">
										{t.megaMenu.categoriesHeading}
									</p>
									<ul class="mt-3 grid grid-cols-2 gap-1">
										{#each categories as category (category.slug)}
											<li>
												<a
													href={localizedPath(lang, `/category/${category.slug}`)}
													onclick={closeAll}
													class="flex min-h-11 flex-col items-start gap-1.5 rounded-xl px-2 py-2 text-sm font-medium text-ink-soft hover:bg-brand-50 hover:text-brand-800"
												>
													<span
														class="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-brand-50"
													>
														<Picture
															base={category.image}
															alt={localize(category.imageAlt, lang)}
															width={96}
															height={96}
															loading="lazy"
															decoding="async"
															class="h-full w-full object-cover"
														/>
													</span>
													{localize(category.name, lang)}
												</a>
											</li>
										{/each}
									</ul>
									<a
										href={localizedPath(lang, '/shop')}
										onclick={closeAll}
										class="mt-2 inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-brand-700 hover:bg-brand-50 dark:text-brand-300"
									>
										{t.categoriesSection.viewAll}
									</a>
								</div>
								<div>
									<p class="text-xs font-semibold uppercase tracking-wide text-muted">
										{t.megaMenu.featuredHeading}
									</p>
									<ul class="mt-3 space-y-1">
										{#each featuredProducts as product (product.slug)}
											<li>
												<a
													href={productPath(lang, product.slug)}
													onclick={closeAll}
													class="flex min-h-11 items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-brand-50"
												>
													<span
														class="h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-brand-50"
													>
														<Picture
															base={product.image}
															alt={localize(product.imageAlt, lang)}
															width={96}
															height={120}
															loading="lazy"
															decoding="async"
															class="h-full w-full object-cover"
														/>
													</span>
													<span class="min-w-0">
														<span class="block truncate text-sm font-medium text-ink-soft">
															{localize(product.name, lang)}
														</span>
														<span class="block text-sm font-bold text-ink">
															{formatPrice(product.price, intlLocale)}
														</span>
													</span>
												</a>
											</li>
										{/each}
									</ul>
								</div>
								<a
									href={localizedPath(lang, '/deals')}
									onclick={closeAll}
									class="flex flex-col justify-between rounded-2xl bg-brand-700 p-4 text-white hover:bg-brand-800"
								>
									<span>
										<span class="block text-base font-bold leading-snug">
											{t.megaMenu.promoTitle}
										</span>
										<span class="mt-1 block text-sm leading-relaxed text-brand-100">
											{t.megaMenu.promoText}
										</span>
									</span>
									<span
										class="mt-4 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-2"
									>
										{t.megaMenu.promoCta}
									</span>
								</a>
							</div>
							</div>
						</div>
					{/if}
				</div>

				{#each navLinks.slice(2) as link (link.href)}
					<a
						href={link.href}
						aria-current={currentPath === link.href ? 'page' : undefined}
						class="flex min-h-11 items-center rounded-full px-2.5 text-sm font-medium text-ink-soft hover:bg-brand-50 hover:text-brand-800 aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-800 xl:px-3"
					>
						{link.label}
					</a>
				{/each}
			</nav>

			<SearchForm
				{lang}
				{t}
				id="header-search"
				value={searchValue}
				wrapperClass="relative ml-auto hidden min-w-0 flex-1 md:block md:max-w-[240px] lg:max-w-[280px] xl:max-w-md"
				inputClass="h-11 w-full rounded-full bg-surface-soft pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:bg-surface"
			/>

			<div class="ml-auto flex items-center gap-1 md:ml-0">
				<div
					class="hidden items-center rounded-full bg-surface-soft p-1 md:flex"
					role="group"
					aria-label={t.nav.language}
				>
					{#each locales as locale (locale)}
						<a
							href={switchHref(locale)}
							aria-current={locale === lang ? 'true' : undefined}
							aria-label={interpolate(t.nav.switchTo, {
								language: dictionaries[locale].localeName
							})}
							class="flex min-h-11 items-center rounded-full px-2.5 text-sm font-semibold text-muted hover:text-brand-800 dark:hover:text-brand-200 aria-[current=true]:bg-white aria-[current=true]:text-brand-800 aria-[current=true]:shadow xl:px-3"
						>
							{locale.toUpperCase()}
						</a>
					{/each}
				</div>

				<ThemeToggle {t} />

				<a
					href={localizedPath(lang, '/account')}
					aria-label={t.nav.account}
					class="hidden h-11 w-11 place-items-center rounded-full text-ink-soft hover:bg-surface-soft sm:grid"
				>
					<User class="h-5 w-5" aria-hidden="true" />
				</a>

				<a
					href={localizedPath(lang, '/cart')}
					data-cart-target
					aria-label={cartLabel}
					class="relative grid h-11 w-11 place-items-center rounded-full text-ink-soft hover:bg-surface-soft"
				>
					<ShoppingCart class="h-5 w-5" aria-hidden="true" />
					{#if cart.count > 0}
						{#key cart.count}
							<span
								data-cart-badge
								class="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 animate-pop place-items-center rounded-full bg-brand-700 px-1 text-[11px] font-bold text-white"
								aria-hidden="true"
							>
								{cart.count}
							</span>
						{/key}
					{/if}
				</a>

				<button
					type="button"
					aria-expanded={menuOpen}
					aria-controls="mobile-menu"
					aria-label={menuOpen ? t.nav.close : t.nav.menu}
					onclick={() => {
						menuOpen = !menuOpen;
					}}
					class="grid h-11 w-11 place-items-center rounded-full text-ink-soft hover:bg-surface-soft lg:hidden"
				>
					{#if menuOpen}
						<X class="h-5 w-5" aria-hidden="true" />
					{:else}
						<Menu class="h-5 w-5" aria-hidden="true" />
					{/if}
				</button>
			</div>
		</div>
	</div>

	{#if menuOpen}
		<div id="mobile-menu" class="border-t border-line bg-surface lg:hidden">
			<div class="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
				<SearchForm
					{lang}
					{t}
					id="mobile-search"
					value={searchValue}
					wrapperClass="relative pb-2 md:hidden"
					inputClass="h-11 w-full rounded-full bg-surface-soft pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:bg-surface"
				/>
				{#each navLinks as link (link.href)}
					<a
						href={link.href}
						onclick={closeAll}
						aria-current={currentPath === link.href ? 'page' : undefined}
						class="flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-ink-soft hover:bg-brand-50 dark:hover:bg-surface-soft aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-800"
					>
						{link.label}
					</a>
				{/each}
				<a
					href={localizedPath(lang, '/account')}
					onclick={closeAll}
					aria-current={currentPath === localizedPath(lang, '/account') ? 'page' : undefined}
					class="flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-ink-soft hover:bg-brand-50 dark:hover:bg-surface-soft aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-800"
				>
					{t.nav.account}
				</a>
				<a
					href={localizedPath(lang, '/wishlist')}
					onclick={closeAll}
					aria-current={currentPath === localizedPath(lang, '/wishlist') ? 'page' : undefined}
					class="flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-ink-soft hover:bg-brand-50 dark:hover:bg-surface-soft aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-800"
				>
					{t.nav.wishlist}
				</a>
				<p class="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted">
					{t.nav.categories}
				</p>
				{#each categories as category (category.slug)}
					<a
						href={localizedPath(lang, `/category/${category.slug}`)}
						onclick={closeAll}
						class="flex min-h-11 items-center rounded-xl px-3 text-sm text-ink-soft hover:bg-brand-50 dark:hover:bg-surface-soft"
					>
						{localize(category.name, lang)}
					</a>
				{/each}
				<div class="flex gap-2 pt-3" role="group" aria-label={t.nav.language}>
					{#each locales as locale (locale)}
						<a
							href={switchHref(locale)}
							onclick={closeAll}
							aria-current={locale === lang ? 'true' : undefined}
							class="flex min-h-11 flex-1 items-center justify-center rounded-full text-sm font-semibold ring-1 ring-line aria-[current=true]:bg-brand-700 aria-[current=true]:text-white aria-[current=true]:ring-brand-700"
						>
							{dictionaries[locale].localeName}
						</a>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</header>
