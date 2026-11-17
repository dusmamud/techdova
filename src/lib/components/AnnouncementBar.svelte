<script lang="ts">
	import { browser } from '$app/env';
	import { Truck } from '@lucide/svelte';
	import type { Dictionary, Locale } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();

	let index = $state(0);
	let paused = $state(false);

	// Reduced motion: no rotation, no interval — the first message stays.
	const reduceMotion = browser
		? window.matchMedia('(prefers-reduced-motion: reduce)').matches
		: false;

	const messages = $derived(t.announcementBar.messages);
	const shortMessages = $derived(t.announcementBar.shortMessages);
	const message = $derived(messages[index % messages.length] ?? '');
	const shortMessage = $derived(shortMessages[index % shortMessages.length] ?? message);

	// Rotate every ~5s; the effect re-runs when `paused` changes, so
	// hovering/focusing the bar stops the interval and leaving restarts it.
	$effect(() => {
		if (!browser || reduceMotion || paused || messages.length <= 1) return;
		const id = setInterval(() => {
			index = (index + 1) % messages.length;
		}, 5000);
		return () => clearInterval(id);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions: hover/focus only pauses message rotation; the link inside carries the interaction -->
<div
	class="bg-brand-800 text-white"
	onmouseenter={() => {
		paused = true;
	}}
	onmouseleave={() => {
		paused = false;
	}}
	onfocusin={() => {
		paused = true;
	}}
	onfocusout={() => {
		paused = false;
	}}
>
	<p
		class="mx-auto flex min-h-11 max-w-7xl items-center justify-center gap-2 px-4 text-sm sm:px-6 lg:px-8"
	>
		<Truck class="hidden h-4 w-4 shrink-0 sm:block" aria-hidden="true" />
		{#key index}
			<span class="min-w-0 animate-fade-in truncate sm:hidden">{shortMessage}</span>
			<span class="hidden min-w-0 animate-fade-in truncate sm:inline">{message}</span>
		{/key}
		<a
			href={localizedPath(lang, '/shipping')}
			class="inline-flex min-h-11 shrink-0 items-center font-semibold underline underline-offset-2 hover:text-brand-100"
		>
			{t.announcementBar.linkLabel}
		</a>
	</p>
</div>
