<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { Cookie, Trash2, X } from '@lucide/svelte';
	import { clearSiteData } from '#lib/clear-site-data';
	import type { Dictionary, Locale } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import { cookieBanner } from '#lib/stores/cookie-banner.svelte';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();

	// The consent choice lives under this key only. It mirrors the entry in
	// SITE_STORAGE_KEYS (clear-site-data.ts) so "clear my stored data"
	// removes the remembered choice too and the banner asks again.
	const COOKIE_CONSENT_KEY = 'techdova-cookie-consent';

	// Client-only decision: the banner starts hidden and is shown only
	// after mount when no choice is stored, so nothing about consent is
	// prerendered and returning visitors never see the banner flash in.
	let bannerVisible = $state(false);
	let modalOpen = $state(false);
	let cleared = $state(false);
	let savedInModal = $state(false);
	let modalEl: HTMLDivElement | undefined = $state();
	let bannerEl: HTMLDivElement | undefined = $state();
	let triggerEl: HTMLElement | null = null;

	function readChoice(): string | null {
		try {
			return localStorage.getItem(COOKIE_CONSENT_KEY);
		} catch {
			return null;
		}
	}

	function saveChoice(choice: 'accepted' | 'declined'): void {
		try {
			localStorage.setItem(COOKIE_CONSENT_KEY, choice);
		} catch {
			// Storage unavailable: the choice still applies for this session.
		}
		bannerVisible = false;
	}

	function openModal(trigger: HTMLElement | null): void {
		triggerEl = trigger;
		cleared = false;
		savedInModal = false;
		modalOpen = true;
	}

	async function closeModal(): Promise<void> {
		modalOpen = false;
		await tick();
		triggerEl?.focus();
	}

	function saveFromModal(choice: 'accepted' | 'declined'): void {
		saveChoice(choice);
		savedInModal = true;
	}

	function handleClearData(): void {
		clearSiteData();
		cleared = true;
	}

	function onKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') void closeModal();
	}

	onMount(() => {
		if (!readChoice()) bannerVisible = true;
		const onOpenSettings = (): void => {
			const active = document.activeElement;
			openModal(active instanceof HTMLElement ? active : null);
		};
		window.addEventListener('techdova:open-cookie-settings', onOpenSettings);
		return () => window.removeEventListener('techdova:open-cookie-settings', onOpenSettings);
	});

	// Publish the banner's height while it is visible so bottom-fixed
	// controls can lift above it; reset to 0 when it hides or unmounts.
	// The banner is z-30 (below every modal/drawer at z-50) so overlays
	// always paint above it; the lift handles the controls that share its
	// bottom edge instead of covering it.
	$effect(() => {
		if (!bannerVisible || modalOpen || !bannerEl) {
			cookieBanner.height = 0;
			return;
		}
		const el = bannerEl;
		const update = (): void => {
			cookieBanner.height = el.getBoundingClientRect().height;
		};
		update();
		const observer = new ResizeObserver(update);
		observer.observe(el);
		return () => {
			observer.disconnect();
			cookieBanner.height = 0;
		};
	});

	// Focus the modal when it opens and lock background scrolling while it
	// is open; restore scrolling when it closes or unmounts.
	$effect(() => {
		if (!modalOpen) return;
		void tick().then(() => modalEl?.focus());
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previous;
		};
	});
</script>

{#if bannerVisible && !modalOpen}
	<div
		bind:this={bannerEl}
		role="region"
		aria-label={t.cookieConsent.bannerTitle}
		class="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface shadow-lg"
	>
		<div class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
			<div class="flex min-w-0 flex-1 items-start gap-3">
				<span class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700">
					<Cookie class="h-5 w-5" aria-hidden="true" />
				</span>
				<div class="min-w-0">
					<h2 class="font-bold text-ink">{t.cookieConsent.bannerTitle}</h2>
					<p class="mt-0.5 text-sm leading-relaxed text-muted">{t.cookieConsent.bannerText}</p>
					<!-- The link's visible text stays "Learn more": the aria-label
						names it descriptively for assistive technology, and the
						sr-only suffix makes the rendered text itself descriptive
						— Lighthouse's link-text audit reads innerText, which
						ignores aria-label. -->
					<p class="mt-1 text-sm">
						<a
							href={localizedPath(lang, '/cookies')}
							aria-label={t.cookieConsent.learnMoreLabel}
							class="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
						>
							{t.cookieConsent.learnMore} <span class="sr-only">{t.cookieConsent.learnMoreSuffix}</span>
						</a>
					</p>
				</div>
			</div>
			<div class="flex flex-wrap gap-2 lg:shrink-0">
				<button
					type="button"
					onclick={() => saveChoice('accepted')}
					class="inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
				>
					{t.cookieConsent.accept}
				</button>
				<button
					type="button"
					onclick={() => saveChoice('declined')}
					class="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-ink-soft ring-1 ring-line hover:bg-surface-soft"
				>
					{t.cookieConsent.decline}
				</button>
				<button
					type="button"
					onclick={(event) => openModal(event.currentTarget)}
					class="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50 dark:text-brand-200"
				>
					{t.cookieConsent.customize}
				</button>
			</div>
		</div>
	</div>
{/if}

{#if modalOpen}
	<div class="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/50 p-4" role="presentation">
		<div
			bind:this={modalEl}
			role="dialog"
			aria-modal="true"
			aria-labelledby="cookie-settings-title"
			tabindex="-1"
			onkeydown={onKeydown}
			class="w-full max-w-lg rounded-3xl bg-surface p-6 shadow-xl outline-none"
		>
			<div class="flex items-start justify-between gap-3">
				<h2 id="cookie-settings-title" class="text-xl font-bold text-ink">
					{t.cookieConsent.modalTitle}
				</h2>
				<button
					type="button"
					onclick={() => void closeModal()}
					aria-label={t.cookieConsent.close}
					class="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-soft ring-1 ring-line hover:bg-surface-soft"
				>
					<X class="h-5 w-5" aria-hidden="true" />
				</button>
			</div>

			{#if savedInModal}
				<p role="status" class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
					{t.cookieConsent.choiceSaved}
				</p>
				<button
					type="button"
					onclick={() => void closeModal()}
					class="mt-4 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
				>
					{t.cookieConsent.close}
				</button>
			{:else}
				<p class="mt-3 text-sm leading-relaxed text-muted">{t.cookieConsent.modalIntro}</p>
				<h3 class="mt-5 font-semibold text-ink">{t.cookieConsent.storageTitle}</h3>
				<p class="mt-1 text-sm leading-relaxed text-muted">{t.cookieConsent.storageText}</p>
				<h3 class="mt-4 font-semibold text-ink">{t.cookieConsent.trackersTitle}</h3>
				<p class="mt-1 text-sm leading-relaxed text-muted">{t.cookieConsent.trackersText}</p>
				<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
					{t.cookieConsent.declineNote}
				</p>

				<div class="mt-5">
					<button
						type="button"
						onclick={handleClearData}
						class="inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold text-red-700 dark:text-red-300 ring-1 ring-red-300 dark:ring-red-800 hover:bg-red-50 dark:hover:bg-red-950/60"
					>
						<Trash2 class="h-4 w-4" aria-hidden="true" />
						{t.cookieConsent.clearData}
					</button>
					{#if cleared}
						<p role="status" class="mt-3 text-sm leading-relaxed text-muted">
							{t.cookieConsent.clearDataDone}
						</p>
					{/if}
				</div>

				<div class="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
					<button
						type="button"
						onclick={() => saveFromModal('accepted')}
						class="inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
					>
						{t.cookieConsent.accept}
					</button>
					<button
						type="button"
						onclick={() => saveFromModal('declined')}
						class="inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-ink-soft ring-1 ring-line hover:bg-surface-soft"
					>
						{t.cookieConsent.decline}
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}
