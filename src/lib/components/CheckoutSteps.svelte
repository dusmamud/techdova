<script lang="ts">
	import { Check } from '@lucide/svelte';

	export type CheckoutStepLabels = { contact: string; shipping: string; payment: string };

	let { current, labels }: { current: 1 | 2 | 3; labels: CheckoutStepLabels } = $props();

	const steps = $derived([labels.contact, labels.shipping, labels.payment]);
</script>

<ol class="flex items-start">
	{#each steps as stepLabel, i (stepLabel)}
		{@const step = i + 1}
		{@const done = step < current}
		{@const isCurrent = step === current}
		<li
			aria-current={isCurrent ? 'step' : undefined}
			class="flex flex-1 flex-col items-center gap-2 text-center"
		>
			<span class="flex w-full items-center">
				<span
					aria-hidden="true"
					class="h-0.5 flex-1 {i === 0 ? 'bg-transparent' : done || isCurrent ? 'bg-brand-700' : 'bg-neutral-200'}"
				></span>
				<span
					class="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-bold {done
						? 'bg-brand-700 text-white'
						: isCurrent
							? 'bg-brand-700 text-white ring-4 ring-brand-100'
							: 'bg-neutral-100 text-neutral-500 ring-1 ring-neutral-200'}"
				>
					{#if done}
						<Check class="h-5 w-5" aria-hidden="true" />
					{:else}
						{step}
					{/if}
				</span>
				<span
					aria-hidden="true"
					class="h-0.5 flex-1 {i === steps.length - 1 ? 'bg-transparent' : done ? 'bg-brand-700' : 'bg-neutral-200'}"
				></span>
			</span>
			<span
				class="text-xs font-semibold sm:text-sm {isCurrent ? 'text-neutral-900' : 'text-neutral-500'}"
			>
				{stepLabel}
			</span>
		</li>
	{/each}
</ol>
