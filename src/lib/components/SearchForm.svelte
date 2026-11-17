<script lang="ts">
	import { goto } from '$app/navigation';
	import { Search } from '@lucide/svelte';
	import { filterProducts, products } from '#lib/data/products';
	import { formatPrice } from '#lib/format';
	import { localize, type Dictionary, type Locale } from '#lib/i18n/index';
	import { localizedPath, productPath } from '#lib/paths';

	let {
		lang,
		t,
		id,
		value = '',
		inputClass = '',
		wrapperClass = ''
	}: {
		lang: Locale;
		t: Dictionary;
		id: string;
		value?: string;
		inputClass?: string;
		wrapperClass?: string;
	} = $props();

	let wrapperEl: HTMLDivElement | undefined = $state();
	let inputEl: HTMLInputElement | undefined = $state();
	// Synced from the `value` prop by the effect below (the prop is owned by
	// the header); starting empty avoids capturing the prop's initial value.
	let query = $state('');
	let open = $state(false);
	let activeIndex = $state(-1);

	// The header owns the initial value (read from the URL behind a browser
	// guard, since searchParams is unavailable during prerendering); keep the
	// field in sync when navigation changes it.
	$effect(() => {
		query = value;
	});

	const listboxId = $derived(`${id}-listbox`);
	const trimmed = $derived(query.trim());
	const suggestions = $derived(
		trimmed ? filterProducts(products, { query: trimmed }, lang).slice(0, 5) : []
	);
	const showListbox = $derived(open && (!trimmed || suggestions.length > 0));
	const optionCount = $derived(
		trimmed ? suggestions.length : t.searchAutocomplete.popular.length
	);
	const activeId = $derived(
		open && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
	);

	function optionId(index: number): string {
		return `${id}-option-${index}`;
	}

	function close(): void {
		open = false;
		activeIndex = -1;
	}

	function handleWindowClick(event: MouseEvent): void {
		if (wrapperEl && !wrapperEl.contains(event.target as Node)) close();
	}

	function choosePopular(term: string): void {
		query = term;
		activeIndex = -1;
		open = true;
		inputEl?.focus();
	}

	function activateOption(index: number): void {
		if (trimmed) {
			const product = suggestions[index];
			if (product) {
				close();
				void goto(productPath(lang, product.slug));
			}
		} else {
			const term = t.searchAutocomplete.popular[index];
			if (term) choosePopular(term);
		}
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			if (!open) {
				open = true;
				activeIndex = event.key === 'ArrowDown' ? 0 : optionCount - 1;
				return;
			}
			if (optionCount === 0) return;
			activeIndex =
				event.key === 'ArrowDown'
					? (activeIndex + 1) % optionCount
					: (activeIndex - 1 + optionCount) % optionCount;
		} else if (event.key === 'Enter') {
			if (open && activeIndex >= 0) {
				event.preventDefault();
				activateOption(activeIndex);
			}
		} else if (event.key === 'Escape') {
			// Prevent the browser's native "Escape clears a search field"
			// behaviour: without this, the clear fires an `input` event that
			// re-opens the listbox (with popular searches) right after close().
			event.preventDefault();
			close();
		} else if (event.key === 'Tab') {
			close();
		}
	}
</script>

<svelte:window onclick={handleWindowClick} />

<form
	method="get"
	action={localizedPath(lang, '/search')}
	role="search"
	class={wrapperClass}
	onsubmit={close}
>
	<div bind:this={wrapperEl} class="relative">
		<label class="sr-only" for={id}>{t.nav.searchLabel}</label>
		<Search
			class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
			aria-hidden="true"
		/>
		<input
			bind:this={inputEl}
			{id}
			name="q"
			type="search"
			role="combobox"
			aria-autocomplete="list"
			aria-expanded={open}
			aria-controls={showListbox ? listboxId : undefined}
			aria-activedescendant={activeId}
			value={query}
			placeholder={t.nav.searchPlaceholder}
			class={inputClass}
			onfocus={() => {
				open = true;
				activeIndex = -1;
			}}
			oninput={(event) => {
				query = event.currentTarget.value;
				open = true;
				activeIndex = -1;
			}}
			onkeydown={handleKeydown}
		/>
		{#if open}
			<div
				class="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl bg-surface shadow-xl ring-1 ring-line"
			>
				{#if trimmed}
					{#if suggestions.length > 0}
						<p
							id="{id}-label"
							class="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted"
						>
							{t.searchAutocomplete.suggestionsLabel}
						</p>
						<ul id={listboxId} role="listbox" aria-labelledby="{id}-label" class="p-2 pt-0">
							{#each suggestions as product, i (product.slug)}
								<li role="option" id={optionId(i)} aria-selected={activeIndex === i}>
									<a
										href={productPath(lang, product.slug)}
										onclick={close}
										onmouseenter={() => {
											activeIndex = i;
										}}
										class="flex min-h-11 items-center justify-between gap-3 rounded-xl px-3 text-sm text-ink-soft hover:bg-brand-50 dark:hover:bg-surface-soft {activeIndex ===
										i
											? 'bg-brand-50 dark:bg-surface-soft'
											: ''}"
									>
										<span class="min-w-0 truncate">{localize(product.name, lang)}</span>
										<span class="shrink-0 font-semibold text-brand-700 dark:text-brand-300">
											{formatPrice(product.price, t.meta.intlLocale)}
										</span>
									</a>
								</li>
							{/each}
						</ul>
					{:else}
						<p role="status" class="px-4 py-3 text-sm text-muted">
							{t.searchAutocomplete.noResults}
						</p>
					{/if}
					<a
						href="{localizedPath(lang, '/search')}?q={encodeURIComponent(trimmed)}"
						onclick={close}
						class="flex min-h-11 items-center border-t border-line px-4 text-sm font-semibold text-brand-700 dark:text-brand-300 dark:hover:text-brand-800 hover:bg-brand-50"
					>
						{t.searchAutocomplete.viewAllResults}
					</a>
				{:else}
					<ul
						id={listboxId}
						role="listbox"
						aria-label={t.searchAutocomplete.suggestionsLabel}
						class="p-2"
					>
						{#each t.searchAutocomplete.popular as term, i (term)}
							<li role="option" id={optionId(i)} aria-selected={activeIndex === i}>
								<button
									type="button"
									onclick={() => choosePopular(term)}
									onmouseenter={() => {
										activeIndex = i;
									}}
									class="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-left text-sm text-ink-soft hover:bg-brand-50 dark:hover:bg-surface-soft {activeIndex ===
									i
										? 'bg-brand-50 dark:bg-surface-soft'
										: ''}"
								>
									<Search class="h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
									{term}
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}
	</div>
</form>
