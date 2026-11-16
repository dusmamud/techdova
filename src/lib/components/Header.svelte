<script lang="ts">
	import { browser } from '$app/env';
	import { page } from '$app/state';
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
	import { interpolate } from '#lib/format';
	import {
		dictionaries,
		localize,
		locales,
		type Dictionary,
		type Locale
	} from '#lib/i18n/index';
	import { localizedPath, switchLocalePath } from '#lib/paths';
	import { cart } from '#lib/stores/cart.svelte';
	import AnnouncementBar from './AnnouncementBar.svelte';
	import SearchForm from './SearchForm.svelte';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();

	let headerEl: HTMLElement | undefined = $state();
	let menuOpen = $state(false);
	let categoriesOpen = $state(false);
	let scrolled = $state(false);

	// Header shadow on scroll: mount-only passive listener, cleaned up on
	// destroy. Shadow only — no layout shift. Initial call covers reloads
	// restored mid-page.
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

	function closeAll(): void {
		menuOpen = false;
		categoriesOpen = false;
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
	class="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur motion-safe:transition-shadow motion-safe:duration-200 {scrolled
		? 'shadow-md'
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
				<span class="grid h-10 w-10 place-items-center rounded-xl bg-brand-700 text-white">
					<ShoppingBag class="h-5 w-5" aria-hidden="true" />
				</span>
				<span class="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl">
					Tech<span class="text-brand-700">Dova</span>
				</span>
			</a>

			<nav class="ml-1 hidden items-center gap-0.5 lg:flex xl:ml-2 xl:gap-1" aria-label={t.nav.main}>
				{#each navLinks.slice(0, 2) as link (link.href)}
					<a
						href={link.href}
						aria-current={currentPath === link.href ? 'page' : undefined}
						class="flex min-h-11 items-center rounded-full px-2.5 text-sm font-medium text-neutral-700 hover:bg-brand-50 hover:text-brand-800 aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-800 xl:px-3"
					>
						{link.label}
					</a>
				{/each}

				<div class="relative">
					<button
						type="button"
						aria-expanded={categoriesOpen}
						onclick={() => {
							categoriesOpen = !categoriesOpen;
						}}
						class="flex min-h-11 items-center gap-1 rounded-full px-2.5 text-sm font-medium text-neutral-700 hover:bg-brand-50 hover:text-brand-800 xl:px-3"
					>
						{t.nav.categories}
						<ChevronDown
							class="h-4 w-4 transition-transform {categoriesOpen ? 'rotate-180' : ''}"
							aria-hidden="true"
						/>
					</button>
					{#if categoriesOpen}
						<div
							class="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-neutral-200"
						>
							{#each categories as category (category.slug)}
								<a
									href={localizedPath(lang, `/category/${category.slug}`)}
									onclick={closeAll}
									class="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-neutral-700 hover:bg-brand-50 hover:text-brand-800"
								>
									{localize(category.name, lang)}
								</a>
							{/each}
							<a
								href={localizedPath(lang, '/shop')}
								onclick={closeAll}
								class="mt-1 flex min-h-11 items-center rounded-xl border-t border-neutral-100 px-3 pt-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
							>
								{t.categoriesSection.viewAll}
							</a>
						</div>
					{/if}
				</div>

				{#each navLinks.slice(2) as link (link.href)}
					<a
						href={link.href}
						aria-current={currentPath === link.href ? 'page' : undefined}
						class="flex min-h-11 items-center rounded-full px-2.5 text-sm font-medium text-neutral-700 hover:bg-brand-50 hover:text-brand-800 aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-800 xl:px-3"
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
				inputClass="h-11 w-full rounded-full bg-neutral-100 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:bg-white"
			/>

			<div class="ml-auto flex items-center gap-1 md:ml-0">
				<div
					class="hidden items-center rounded-full bg-neutral-100 p-1 md:flex"
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
							class="flex min-h-11 items-center rounded-full px-2.5 text-sm font-semibold text-neutral-600 hover:text-brand-800 aria-[current=true]:bg-white aria-[current=true]:text-brand-800 aria-[current=true]:shadow xl:px-3"
						>
							{locale.toUpperCase()}
						</a>
					{/each}
				</div>

				<a
					href={localizedPath(lang, '/account')}
					aria-label={t.nav.account}
					class="hidden h-11 w-11 place-items-center rounded-full text-neutral-700 hover:bg-neutral-100 sm:grid"
				>
					<User class="h-5 w-5" aria-hidden="true" />
				</a>

				<a
					href={localizedPath(lang, '/cart')}
					aria-label={cartLabel}
					class="relative grid h-11 w-11 place-items-center rounded-full text-neutral-700 hover:bg-neutral-100"
				>
					<ShoppingCart class="h-5 w-5" aria-hidden="true" />
					{#if cart.count > 0}
						{#key cart.count}
							<span
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
					class="grid h-11 w-11 place-items-center rounded-full text-neutral-700 hover:bg-neutral-100 lg:hidden"
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
		<div id="mobile-menu" class="border-t border-neutral-200 bg-white lg:hidden">
			<div class="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
				<SearchForm
					{lang}
					{t}
					id="mobile-search"
					value={searchValue}
					wrapperClass="relative pb-2 md:hidden"
					inputClass="h-11 w-full rounded-full bg-neutral-100 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-neutral-500 focus:bg-white"
				/>
				{#each navLinks as link (link.href)}
					<a
						href={link.href}
						onclick={closeAll}
						aria-current={currentPath === link.href ? 'page' : undefined}
						class="flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-neutral-800 hover:bg-brand-50 aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-800"
					>
						{link.label}
					</a>
				{/each}
				<a
					href={localizedPath(lang, '/account')}
					onclick={closeAll}
					aria-current={currentPath === localizedPath(lang, '/account') ? 'page' : undefined}
					class="flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-neutral-800 hover:bg-brand-50 aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-800"
				>
					{t.nav.account}
				</a>
				<a
					href={localizedPath(lang, '/wishlist')}
					onclick={closeAll}
					aria-current={currentPath === localizedPath(lang, '/wishlist') ? 'page' : undefined}
					class="flex min-h-11 items-center rounded-xl px-3 text-base font-medium text-neutral-800 hover:bg-brand-50 aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-800"
				>
					{t.nav.wishlist}
				</a>
				<p class="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
					{t.nav.categories}
				</p>
				{#each categories as category (category.slug)}
					<a
						href={localizedPath(lang, `/category/${category.slug}`)}
						onclick={closeAll}
						class="flex min-h-11 items-center rounded-xl px-3 text-sm text-neutral-700 hover:bg-brand-50"
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
							class="flex min-h-11 flex-1 items-center justify-center rounded-full text-sm font-semibold ring-1 ring-neutral-200 aria-[current=true]:bg-brand-700 aria-[current=true]:text-white aria-[current=true]:ring-brand-700"
						>
							{dictionaries[locale].localeName}
						</a>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</header>
