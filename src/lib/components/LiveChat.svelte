<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import { MessageCircle, Send, X } from '@lucide/svelte';
	import { pressSpring } from '#lib/actions/press';
	import type { Dictionary, Locale } from '#lib/i18n/index';
	import { compare } from '#lib/stores/compare.svelte';
	import { cookieBanner } from '#lib/stores/cookie-banner.svelte';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();

	type ChatMessage = { from: 'user' | 'assistant'; text: string };

	// Positioned above BackToTop (fixed right-4, bottom-4, 48px tall; lifted
	// to bottom-24 while the compare tray is open). The chat button mirrors
	// the tray-aware offset so the two floating controls never overlap: the
	// button sits at bottom-20 normally and bottom-40 while the tray is
	// open, with the panel stacked above the button in both states. Both
	// also lift above the cookie banner while it is visible, and the panel
	// height shrinks by the same amount so it never runs past the top of
	// the viewport.
	const trayOpen = $derived(compare.count > 0);
	const bannerLift = $derived(cookieBanner.height > 0 ? cookieBanner.height + 16 : 0);
	const fabBottom = $derived(bannerLift + (trayOpen ? 160 : 80));
	const panelBottom = $derived(bannerLift + (trayOpen ? 224 : 160));

	let open = $state(false);
	let messages = $state<ChatMessage[]>([]);
	let draft = $state('');
	let typing = $state(false);
	let replyTimer: ReturnType<typeof setTimeout> | undefined;
	let fabEl: HTMLButtonElement | undefined = $state();
	let inputEl: HTMLInputElement | undefined = $state();
	let logEl: HTMLDivElement | undefined = $state();

	// Scroll-aware auto-hide (elevation round 2, G-01): while the user
	// scrolls DOWN on a small screen the FAB slides away, so it never
	// covers a product-card CTA mid-scroll; it returns on scroll-up (or
	// whenever the panel is open). Desktop keeps the FAB always visible.
	// Derived from `scrollingDown` so opening the panel re-shows the FAB
	// (it carries the close affordance) even mid-scroll.
	let scrollingDown = $state(false);
	let lastScrollY = $state(0);
	const fabHidden = $derived(!open && scrollingDown);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const onScroll = (): void => {
			const y = window.scrollY;
			scrollingDown = y > lastScrollY + 4 && y > 200;
			lastScrollY = y;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	// Keyword lists are matching logic, never displayed, so they live here
	// per locale; every reply shown comes from the dictionary.
	const KEYWORDS: Record<Locale, { topic: string; words: string[] }[]> = {
		en: [
			{ topic: 'greeting', words: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'] },
			{ topic: 'tracking', words: ['track', 'order status', 'where is my order', 'delivery status'] },
			{ topic: 'returns', words: ['return', 'refund', 'exchange'] },
			{ topic: 'shipping', words: ['deliver', 'shipping', 'ship', 'arrive', 'how long'] },
			{ topic: 'payment', words: ['pay', 'payment', 'card', 'instalment', 'installment', 'bnpl', 'cash'] },
			{ topic: 'warranty', words: ['warranty', 'guarantee', 'repair', 'broken', 'cover'] },
			{ topic: 'contact', words: ['contact', 'human', 'person', 'support', 'phone', 'email', 'help'] }
		],
		fr: [
			{ topic: 'greeting', words: ['bonjour', 'salut', 'bonsoir', 'coucou'] },
			{ topic: 'tracking', words: ['suivre', 'suivi', 'commande', 'ou est', 'statut'] },
			{ topic: 'returns', words: ['retour', 'rembours', 'echange'] },
			{ topic: 'shipping', words: ['livraison', 'livrer', 'delai', 'arrive', 'expedition'] },
			{ topic: 'payment', words: ['paiement', 'payer', 'carte', 'versement', 'especes'] },
			{ topic: 'warranty', words: ['garantie', 'reparation', 'casse', 'panne'] },
			{ topic: 'contact', words: ['contact', 'humain', 'personne', 'support', 'telephone', 'email', 'aide'] }
		]
	};

	function normalize(text: string): string {
		return text
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '');
	}

	function replyFor(text: string): string {
		const haystack = ` ${normalize(text)} `;
		const answers: Record<string, string> = {
			greeting: t.chatWidget.answerGreeting,
			tracking: t.chatWidget.answerTracking,
			returns: t.chatWidget.answerReturns,
			shipping: t.chatWidget.answerShipping,
			payment: t.chatWidget.answerPayment,
			warranty: t.chatWidget.answerWarranty,
			contact: t.chatWidget.answerContact
		};
		for (const { topic, words } of KEYWORDS[lang]) {
			if (words.some((word) => haystack.includes(word))) return answers[topic] ?? t.chatWidget.fallback;
		}
		return t.chatWidget.fallback;
	}

	async function toggle(): Promise<void> {
		open = !open;
		if (open) {
			if (messages.length === 0) messages = [{ from: 'assistant', text: t.chatWidget.greeting }];
			await tick();
			inputEl?.focus();
		} else {
			fabEl?.focus();
		}
	}

	function close(): void {
		open = false;
		fabEl?.focus();
	}

	function send(text: string): void {
		const trimmed = text.trim();
		if (!trimmed || typing) return;
		messages = [...messages, { from: 'user', text: trimmed }];
		draft = '';
		typing = true;
		const reply = replyFor(trimmed);
		replyTimer = setTimeout(() => {
			messages = [...messages, { from: 'assistant', text: reply }];
			typing = false;
		}, 700);
	}

	function onKeydown(event: KeyboardEvent): void {
		if (event.key === 'Escape') close();
	}

	onDestroy(() => clearTimeout(replyTimer));

	// Keep the newest message in view.
	$effect(() => {
		void messages.length;
		void typing;
		if (!open) return;
		void tick().then(() => {
			if (logEl) logEl.scrollTop = logEl.scrollHeight;
		});
	});

	const quickReplies = $derived([
		t.chatWidget.quickShipping,
		t.chatWidget.quickReturns,
		t.chatWidget.quickTracking,
		t.chatWidget.quickContact
	]);
</script>

<!-- Elevation round 2, G-01: on <sm the FAB moves to bottom-LEFT (it
	used to sit bottom-right on top of product-card CTAs) and slides away
	while scrolling down; on sm+ it keeps its old bottom-right spot.
	The safe-area inset is folded into the bottom offset. -->
<div
	class="fixed left-4 z-50 sm:left-auto sm:right-4"
	style:bottom="calc({fabBottom}px + env(safe-area-inset-bottom, 0px))"
>
	<button
		type="button"
		data-testid="chat-fab"
		use:pressSpring
		bind:this={fabEl}
		onclick={() => void toggle()}
		aria-expanded={open}
		aria-controls="techdova-chat-panel"
		aria-label={open ? t.chatWidget.closeLabel : t.chatWidget.buttonLabel}
		class="grid h-14 w-14 place-items-center rounded-full bg-brand-700 text-white shadow-lg hover:bg-brand-800 motion-safe:transition-[opacity,transform] motion-safe:duration-200 {fabHidden
			? 'max-sm:pointer-events-none max-sm:translate-y-40 max-sm:opacity-0'
			: ''}"
	>
		{#if open}
			<X class="h-6 w-6" aria-hidden="true" />
		{:else}
			<MessageCircle class="h-6 w-6" aria-hidden="true" />
		{/if}
	</button>
</div>

{#if open}
	<div
		id="techdova-chat-panel"
		role="dialog"
		tabindex="-1"
		aria-label={t.chatWidget.title}
		onkeydown={onKeydown}
		class="fixed left-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl bg-surface shadow-xl ring-1 ring-line sm:left-auto sm:right-4"
		style:bottom="calc({panelBottom}px + env(safe-area-inset-bottom, 0px))"
		style:height="min(30rem, calc(100dvh - {panelBottom + 48}px))"
	>
	>
		<div class="flex items-start justify-between gap-3 bg-brand-700 px-5 py-4 text-white">
			<div>
				<h2 class="font-bold">{t.chatWidget.title}</h2>
				<p class="text-sm text-white/80">{t.chatWidget.subtitle}</p>
			</div>
			<button
				type="button"
				onclick={close}
				aria-label={t.chatWidget.closeLabel}
				class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20"
			>
				<X class="h-5 w-5" aria-hidden="true" />
			</button>
		</div>

		<div bind:this={logEl} role="log" aria-live="polite" aria-label={t.chatWidget.title} class="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
			{#each messages as message, i (i)}
				{#if message.from === 'assistant'}
					<p class="max-w-[85%] rounded-2xl rounded-bl-md bg-surface-soft px-4 py-2.5 text-sm leading-relaxed text-ink">
						{message.text}
					</p>
				{:else}
					<p class="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-brand-700 px-4 py-2.5 text-sm leading-relaxed text-white">
						{message.text}
					</p>
				{/if}
			{/each}
			{#if typing}
				<p role="status" class="flex max-w-[85%] items-center gap-2 rounded-2xl rounded-bl-md bg-surface-soft px-4 py-3">
					<span class="sr-only">{t.chatWidget.typingLabel}</span>
					<span aria-hidden="true" class="flex gap-1">
						<span class="h-2 w-2 animate-pulse rounded-full bg-muted"></span>
						<span class="h-2 w-2 animate-pulse rounded-full bg-muted" style="animation-delay: 150ms"></span>
						<span class="h-2 w-2 animate-pulse rounded-full bg-muted" style="animation-delay: 300ms"></span>
					</span>
				</p>
			{/if}
		</div>

		<div class="border-t border-line px-4 pt-3">
			<p id="chat-quick-label" class="text-xs font-semibold uppercase tracking-wide text-muted">
				{t.chatWidget.quickLabel}
			</p>
			<div class="mt-2 flex flex-wrap gap-2" role="group" aria-labelledby="chat-quick-label">
				{#each quickReplies as reply (reply)}
					<button
						type="button"
						disabled={typing}
						onclick={() => send(reply)}
						class="inline-flex min-h-11 items-center rounded-full px-3 text-xs font-medium ring-1 ring-line hover:bg-surface-soft disabled:opacity-50"
					>
						{reply}
					</button>
				{/each}
			</div>
		</div>

		<form
			onsubmit={(event) => {
				event.preventDefault();
				send(draft);
			}}
			class="flex items-end gap-2 px-4 py-3"
		>
			<label for="techdova-chat-input" class="sr-only">{t.chatWidget.inputLabel}</label>
			<input
				id="techdova-chat-input"
				bind:this={inputEl}
				type="text"
				bind:value={draft}
				disabled={typing}
				placeholder={t.chatWidget.placeholder}
				autocomplete="off"
				class="min-h-12 min-w-0 flex-1 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted disabled:opacity-50"
			/>
			<button
				type="submit"
				disabled={typing || !draft.trim()}
				aria-label={t.chatWidget.sendLabel}
				class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-700 text-white hover:bg-brand-800 disabled:opacity-50"
			>
				<Send class="h-5 w-5" aria-hidden="true" />
			</button>
		</form>
		<p class="border-t border-line px-4 py-2 text-xs leading-relaxed text-muted">
			{t.chatWidget.demoNote}
		</p>
	</div>
{/if}
