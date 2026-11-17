<script lang="ts">
	import { browser } from '$app/env';
	import { X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { interpolate } from '#lib/format';
	import type { Dictionary } from '#lib/i18n/index';

	/**
	 * Mobile filter drawer. Generic: the parent owns all filter state and
	 * passes the controls as `children`; the drawer only owns presentation,
	 * focus management and the footer actions.
	 *
	 * Footer: pass `onApply` and/or `onClear` for the default footer (Apply
	 * + Clear all buttons with dictionary labels), or pass a `footer`
	 * snippet to replace it entirely. Neither `onApply` nor `onClear`
	 * closes the drawer — the parent's handler decides (typically: apply
	 * the draft filters, then close).
	 *
	 * Optional `facets` snippet: facet controls (brand checkboxes, rating
	 * radios, toggles, …) rendered above `children` in the scroll area.
	 * Pages that omit it keep the current layout.
	 *
	 * @example
	 * ```svelte
	 * <FilterDrawer
	 *   {t}
	 *   open={drawerOpen}
	 *   onClose={() => (drawerOpen = false)}
	 *   onApply={applyDraftFilters}
	 *   onClear={clearDraftFilters}
	 *   resultCount={filtered.length}
	 * >
	 *   <!-- draft filter controls bound to local draft state -->
	 *   <CategoryCheckboxes bind:selected={draftCategories} />
	 *   <MaxPriceSlider bind:value={draftMaxPrice} />
	 * </FilterDrawer>
	 * ```
	 */
	let {
		open,
		onClose,
		onApply,
		onClear,
		t,
		title,
		resultCount,
		id = 'filter-drawer',
		children,
		footer,
		facets
	}: {
		open: boolean;
		onClose: () => void;
		onApply?: () => void;
		onClear?: () => void;
		t: Dictionary;
		title?: string;
		resultCount?: number;
		id?: string;
		children: Snippet;
		footer?: Snippet;
		/** Facet controls rendered above `children`. Omit to keep the current layout. */
		facets?: Snippet;
	} = $props();

	const titleId = $derived(`${id}-title`);
	const heading = $derived(title ?? t.filters.filters);
	const applyLabel = $derived(
		resultCount === undefined
			? t.filters.apply
			: interpolate(t.filters.showResults, { count: resultCount })
	);
	const showDefaultFooter = $derived(!footer && (onApply !== undefined || onClear !== undefined));

	// Reduced motion: transitions run with duration 0 (instant, no slide).
	const reduceMotion = $derived(
		browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);

	let panel: HTMLDivElement | undefined = $state();
	let closeButton: HTMLButtonElement | undefined = $state();
	let opener: HTMLElement | null = null;

	$effect(() => {
		if (!browser) return;
		if (open) {
			opener = document.activeElement as HTMLElement | null;
			closeButton?.focus();
			const previous = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = previous;
				opener?.focus();
			};
		}
	});

	function handleKeydown(event: KeyboardEvent): void {
		if (!open) return;
		if (event.key === 'Escape') {
			onClose();
			return;
		}
		// Focus trap: keep Tab cycling inside the dialog while it is open.
		if (event.key !== 'Tab' || !panel) return;
		const focusable = panel.querySelectorAll<HTMLElement>(
			'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
		);
		if (focusable.length === 0) return;
		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div class="fixed inset-0 z-50">
		<button
			type="button"
			aria-label={t.nav.close}
			onclick={onClose}
			class="absolute inset-0 h-full w-full cursor-default bg-black/50"
			transition:fade={{ duration: reduceMotion ? 0 : 200 }}
		></button>
		<div
			bind:this={panel}
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			class="absolute left-0 top-0 flex h-full w-full max-w-sm flex-col bg-surface shadow-2xl"
			transition:fly={{ x: -320, duration: reduceMotion ? 0 : 300 }}
		>
			<div class="flex items-center justify-between border-b border-line px-5 py-4">
				<h2 id={titleId} class="text-lg font-bold text-ink">{heading}</h2>
				<button
					type="button"
					bind:this={closeButton}
					onclick={onClose}
					aria-label={t.nav.close}
					class="grid h-11 w-11 place-items-center rounded-full text-ink-soft hover:bg-surface-soft"
				>
					<X class="h-5 w-5" aria-hidden="true" />
				</button>
			</div>

			<div class="flex-1 overflow-y-auto px-5 py-5">
				{#if facets}
					<div class="mb-6">
						{@render facets()}
					</div>
				{/if}
				{@render children()}
			</div>

			{#if footer}
				<div class="border-t border-line px-5 py-4">
					{@render footer()}
				</div>
			{:else if showDefaultFooter}
				<div class="flex gap-2 border-t border-line px-5 py-4">
					{#if onClear}
						<button
							type="button"
							onclick={onClear}
							class="inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-4 text-sm font-semibold text-brand-800 dark:text-brand-200 dark:hover:text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50"
						>
							{t.filters.clearAll}
						</button>
					{/if}
					{#if onApply}
						<button
							type="button"
							onclick={onApply}
							class="inline-flex min-h-11 flex-1 items-center justify-center rounded-full bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800"
						>
							{applyLabel}
						</button>
					{/if}
				</div>
			{/if}
		</div>
	</div>
{/if}
