<script lang="ts">
	import { Send } from '@lucide/svelte';
	import type { Dictionary } from '#lib/i18n/index';

	let { t }: { t: Dictionary } = $props();

	let email = $state('');
	let error = $state('');
	let success = $state(false);

	function subscribe(event: SubmitEvent): void {
		event.preventDefault();
		const value = email.trim();
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			error = t.footer.subscribeError;
			success = false;
			return;
		}
		error = '';
		success = true;
		email = '';
	}
</script>

<form onsubmit={subscribe} novalidate class="w-full">
	<label class="sr-only" for="newsletter-email">{t.footer.emailLabel}</label>
	<div class="relative">
		<input
			id="newsletter-email"
			name="email"
			type="email"
			bind:value={email}
			placeholder={t.footer.emailPlaceholder}
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={error ? 'newsletter-error' : success ? 'newsletter-success' : undefined}
			autocomplete="email"
			class="h-12 w-full rounded-full bg-white pl-4 pr-14 text-sm text-neutral-900 placeholder:text-neutral-500"
		/>
		<button
			type="submit"
			aria-label={t.footer.subscribe}
			class="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-brand-600 text-white hover:bg-brand-500"
		>
			<Send class="h-4 w-4" aria-hidden="true" />
		</button>
	</div>
	{#if error}
		<p id="newsletter-error" role="alert" class="mt-2 text-sm text-red-300">{error}</p>
	{/if}
	{#if success}
		<p id="newsletter-success" role="status" class="mt-2 text-sm text-brand-200">
			{t.footer.subscribeSuccess}
		</p>
	{/if}
</form>
