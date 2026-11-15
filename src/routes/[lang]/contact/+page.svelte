<script lang="ts">
	import { tick } from 'svelte';
	import { CheckCircle2, Clock, Mail, Phone } from '@lucide/svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { CONTACT_EMAIL, CONTACT_PHONE } from '#lib/config';
	import { interpolate } from '#lib/format';
	import { getDictionary } from '#lib/i18n/index';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));

	let name = $state('');
	let email = $state('');
	let subject = $state('general');
	let message = $state('');
	let errors: { name?: string; email?: string; message?: string } = $state({});
	let submittedName = $state('');
	let submittedOnce = $state(false);
	let showSummary = $state(false);
	let summaryEl: HTMLDivElement | undefined = $state();

	type ErrorField = 'name' | 'email' | 'message';

	const fieldMeta: { field: ErrorField; id: string; label: string }[] = $derived([
		{ field: 'name', id: 'contact-name', label: t.contact.nameLabel },
		{ field: 'email', id: 'contact-email', label: t.contact.emailLabel },
		{ field: 'message', id: 'contact-message', label: t.contact.messageLabel }
	]);

	const errorEntries = $derived(
		fieldMeta.filter((meta) => errors[meta.field]).map((meta) => meta)
	);

	const subjects = $derived([
		{ value: 'general', label: t.contact.subjectGeneral },
		{ value: 'order', label: t.contact.subjectOrder },
		{ value: 'product', label: t.contact.subjectProduct },
		{ value: 'other', label: t.contact.subjectOther }
	]);

	function fieldError(field: ErrorField): string | undefined {
		if (field === 'name') return name.trim() ? undefined : t.contact.requiredError;
		if (field === 'email') {
			if (!email.trim()) return t.contact.requiredError;
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
				? undefined
				: t.contact.emailError;
		}
		if (!message.trim()) return t.contact.requiredError;
		return message.trim().length < 10 ? t.contact.messageError : undefined;
	}

	function validateField(field: ErrorField): void {
		const error = fieldError(field);
		if (error) {
			errors = { ...errors, [field]: error };
		} else {
			const { [field]: _removed, ...rest } = errors;
			errors = rest;
		}
	}

	// Blur validates a field the user typed in (or after a failed submit);
	// typing re-validates only a field that already shows an error, so a
	// pristine field is never flagged on keystroke.
	function handleBlur(field: ErrorField): void {
		const value = field === 'name' ? name : field === 'email' ? email : message;
		if (submittedOnce || value.trim()) validateField(field);
	}

	function handleInput(field: ErrorField): void {
		if (errors[field]) validateField(field);
	}

	function validate(): boolean {
		const next: typeof errors = {};
		for (const field of ['name', 'email', 'message'] as const) {
			const error = fieldError(field);
			if (error) next[field] = error;
		}
		errors = next;
		return Object.keys(next).length === 0;
	}

	async function submit(event: SubmitEvent): Promise<void> {
		event.preventDefault();
		submittedOnce = true;
		if (!validate()) {
			showSummary = true;
			await tick();
			summaryEl?.focus();
			return;
		}
		showSummary = false;
		submittedName = name.trim();
	}

	function focusField(id: string): void {
		document.getElementById(id)?.focus();
	}

	function reset(): void {
		name = '';
		email = '';
		subject = 'general';
		message = '';
		errors = {};
		submittedName = '';
		submittedOnce = false;
		showSummary = false;
	}

	const inputClass =
		'w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 text-sm text-neutral-900 placeholder:text-neutral-500';
</script>

<Seo {lang} title={t.meta.contactTitle} description={t.meta.contactDescription} path="/contact" />

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<h1 class="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{t.contact.title}</h1>
	<p class="mt-2 max-w-2xl leading-relaxed text-neutral-600">{t.contact.description}</p>

	<div class="mt-8 grid gap-8 lg:grid-cols-[1fr_1.5fr]">
		<section aria-labelledby="contact-info-heading">
			<h2 id="contact-info-heading" class="text-lg font-bold text-neutral-900">{t.contact.infoTitle}</h2>
			<ul class="mt-4 space-y-3">
				<li class="flex items-start gap-3 rounded-3xl bg-brand-50 p-4">
					<Mail class="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
					<div>
						<p class="text-sm font-semibold text-neutral-900">{t.contact.emailTitle}</p>
						<a href="mailto:{CONTACT_EMAIL}" class="inline-flex min-h-11 items-center text-sm text-brand-700 hover:text-brand-800">
							{CONTACT_EMAIL}
						</a>
					</div>
				</li>
				<li class="flex items-start gap-3 rounded-3xl bg-brand-50 p-4">
					<Phone class="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
					<div>
						<p class="text-sm font-semibold text-neutral-900">{t.contact.phoneTitle}</p>
						<a href="tel:{CONTACT_PHONE.replaceAll(' ', '')}" class="inline-flex min-h-11 items-center text-sm text-brand-700 hover:text-brand-800">
							{CONTACT_PHONE}
						</a>
					</div>
				</li>
				<li class="flex items-start gap-3 rounded-3xl bg-brand-50 p-4">
					<Clock class="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
					<div>
						<p class="text-sm font-semibold text-neutral-900">{t.contact.hoursTitle}</p>
						<p class="mt-1 text-sm text-neutral-600">{t.contact.hoursValue}</p>
					</div>
				</li>
			</ul>
		</section>

		{#if submittedName}
			<div class="rounded-3xl bg-brand-50 p-6 text-center sm:p-8" role="status">
				<CheckCircle2 class="mx-auto h-10 w-10 text-brand-700" aria-hidden="true" />
				<h2 class="mt-3 text-xl font-bold text-neutral-900">{t.contact.successTitle}</h2>
				<p class="mx-auto mt-2 max-w-md text-neutral-600">
					{interpolate(t.contact.successText, { name: submittedName })}
				</p>
				<button
					type="button"
					onclick={reset}
					class="mt-5 inline-flex min-h-11 items-center rounded-full bg-brand-700 px-5 text-sm font-semibold text-white hover:bg-brand-800"
				>
					{t.contact.sendAnother}
				</button>
			</div>
		{:else}
			<form onsubmit={submit} novalidate class="space-y-4">
				{#if showSummary && errorEntries.length > 0}
					<div
						bind:this={summaryEl}
						tabindex="-1"
						role="alert"
						class="rounded-2xl bg-red-50 p-4 ring-1 ring-red-200 focus:outline-2 focus:outline-offset-2 focus:outline-red-600"
					>
						<p class="text-sm font-semibold text-red-800">{t.contact.errorSummary}</p>
						<ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
							{#each errorEntries as entry (entry.field)}
								<li>
									<a
										href="#{entry.id}"
										onclick={(event) => {
											event.preventDefault();
											focusField(entry.id);
										}}
										class="text-red-700 underline hover:text-red-800"
									>
										{entry.label}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				<div>
					<label for="contact-name" class="mb-1 block text-sm font-medium text-neutral-700">
						{t.contact.nameLabel}
					</label>
					<input
						id="contact-name"
						name="name"
						type="text"
						bind:value={name}
						onblur={() => handleBlur('name')}
						oninput={() => handleInput('name')}
						placeholder={t.contact.namePlaceholder}
						autocomplete="name"
						aria-invalid={errors.name ? 'true' : undefined}
						aria-describedby={errors.name ? 'contact-name-error' : undefined}
						class="{inputClass} min-h-12"
					/>
					{#if errors.name}
						<p id="contact-name-error" class="mt-1 text-sm text-red-600">{errors.name}</p>
					{/if}
				</div>
				<div>
					<label for="contact-email" class="mb-1 block text-sm font-medium text-neutral-700">
						{t.contact.emailLabel}
					</label>
					<input
						id="contact-email"
						name="email"
						type="email"
						bind:value={email}
						onblur={() => handleBlur('email')}
						oninput={() => handleInput('email')}
						placeholder={t.contact.emailPlaceholder}
						autocomplete="email"
						aria-invalid={errors.email ? 'true' : undefined}
						aria-describedby={errors.email ? 'contact-email-error' : undefined}
						class="{inputClass} min-h-12"
					/>
					{#if errors.email}
						<p id="contact-email-error" class="mt-1 text-sm text-red-600">{errors.email}</p>
					{/if}
				</div>
				<div>
					<label for="contact-subject" class="mb-1 block text-sm font-medium text-neutral-700">
						{t.contact.subjectLabel}
					</label>
					<select id="contact-subject" name="subject" bind:value={subject} class="{inputClass} min-h-12">
						{#each subjects as option (option.value)}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>
				<div>
					<label for="contact-message" class="mb-1 block text-sm font-medium text-neutral-700">
						{t.contact.messageLabel}
					</label>
					<textarea
						id="contact-message"
						name="message"
						rows="5"
						bind:value={message}
						onblur={() => handleBlur('message')}
						oninput={() => handleInput('message')}
						placeholder={t.contact.messagePlaceholder}
						aria-invalid={errors.message ? 'true' : undefined}
						aria-describedby={errors.message ? 'contact-message-error' : undefined}
						class={inputClass}
					></textarea>
					{#if errors.message}
						<p id="contact-message-error" class="mt-1 text-sm text-red-600">{errors.message}</p>
					{/if}
				</div>
				<button
					type="submit"
					class="inline-flex min-h-12 items-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
				>
					{t.contact.send}
				</button>
			</form>
		{/if}
	</div>
</div>
