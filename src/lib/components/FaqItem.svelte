<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';

	let {
		question,
		answer,
		open = false
	}: { question: string; answer: string; open?: boolean } = $props();

	// svelte-ignore state_referenced_locally: `open` is intentionally the initial state only — each item manages its own open state afterwards.
	let isOpen = $state(open);

	// Deterministic ids from the question text, so server and client agree.
	const slug = $derived(
		question
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.slice(0, 48) || 'item'
	);
	const buttonId = $derived(`faq-button-${slug}`);
	const panelId = $derived(`faq-panel-${slug}`);
</script>

<div class="overflow-hidden rounded-3xl bg-surface ring-1 ring-line">
	<h3>
		<button
			type="button"
			id={buttonId}
			aria-expanded={isOpen}
			aria-controls={panelId}
			onclick={() => {
				isOpen = !isOpen;
			}}
			class="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-ink hover:text-brand-800 dark:hover:text-brand-200"
		>
			<span>{question}</span>
			<ChevronDown
				class="h-5 w-5 shrink-0 text-brand-700 dark:text-brand-300 motion-safe:transition-transform motion-safe:duration-300 {isOpen
					? 'rotate-180'
					: ''}"
				aria-hidden="true"
			/>
		</button>
	</h3>
	<div
		id={panelId}
		role="region"
		aria-labelledby={buttonId}
		inert={!isOpen}
		class="grid motion-safe:transition-[grid-template-rows] motion-safe:duration-300 motion-safe:ease-out {isOpen
			? 'grid-rows-[1fr]'
			: 'grid-rows-[0fr]'}"
	>
		<div class="min-h-0 overflow-hidden">
			<p
				class="px-5 pb-5 leading-relaxed text-muted motion-safe:transition-opacity motion-safe:duration-300 {isOpen
					? 'opacity-100'
					: 'invisible opacity-0'}"
			>
				{answer}
			</p>
		</div>
	</div>
</div>
