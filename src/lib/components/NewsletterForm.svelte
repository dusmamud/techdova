<script lang="ts">
	import { Send } from '@lucide/svelte';
	import type { Dictionary } from '#lib/i18n/index';

	let { t, idPrefix = 'newsletter' }: { t: Dictionary; idPrefix?: string } = $props();

	const emailId = $derived(`${idPrefix}-email`);
	const errorId = $derived(`${idPrefix}-error`);
	const successId = $derived(`${idPrefix}-success`);

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
	<label class="sr-only" for={emailId}>{t.footer.emailLabel}</label>
	<div class="relative">
		<input
			id={emailId}
			name="email"
			type="email"
			bind:value={email}
			placeholder={t.footer.emailPlaceholder}
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={error ? errorId : success ? successId : undefined}
			autocomplete="email"
			class="h-12 w-full rounded-full bg-surface pl-4 pr-14 text-sm text-ink placeholder:text-muted"
		/>
		<button
			type="submit"
			aria-label={t.footer.subscribe}
			class="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-brand-600 text-white hover:bg-brand-50 dark:hover:bg-surface-soft0"
		>
			<Send class="h-4 w-4" aria-hidden="true" />
		</button>
	</div>
	{#if error}
		<p id={errorId} role="alert" class="mt-2 text-sm text-red-300">{error}</p>
	{/if}
	{#if success}
		<p id={successId} role="status" class="mt-2 text-sm text-brand-200">
			{t.footer.subscribeSuccess}
		</p>
	{/if}
</form>
