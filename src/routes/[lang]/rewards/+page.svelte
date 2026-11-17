<script lang="ts">
	import { tick } from 'svelte';
	import { Award, CheckCircle2, Gift, Star } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { getDictionary } from '#lib/i18n/index';
	import { interpolate } from '#lib/format';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));

	const tierIcons = [Award, Star, Gift];

	// --- Join form (demo: local success state only, nothing stored or sent) ---
	let name = $state('');
	let email = $state('');
	let errors: { name?: string; email?: string } = $state({});
	let submittedOnce = $state(false);
	let showSummary = $state(false);
	let summaryEl: HTMLDivElement | undefined = $state();
	let joinedName = $state<string | null>(null);

	type ErrorField = 'name' | 'email';

	const fieldMeta: { field: ErrorField; id: string; label: string }[] = $derived([
		{ field: 'name', id: 'rewards-name', label: t.rewardsPage.nameLabel },
		{ field: 'email', id: 'rewards-email', label: t.rewardsPage.emailLabel }
	]);

	const errorEntries = $derived(fieldMeta.filter((meta) => errors[meta.field]));

	function fieldError(field: ErrorField): string | undefined {
		if (field === 'name') return name.trim() ? undefined : t.rewardsPage.requiredError;
		if (!email.trim()) return t.rewardsPage.requiredError;
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? undefined : t.rewardsPage.emailError;
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

	function handleBlur(field: ErrorField): void {
		const value = field === 'name' ? name : email;
		if (submittedOnce || value.trim()) validateField(field);
	}

	function handleInput(field: ErrorField): void {
		if (errors[field]) validateField(field);
	}

	async function submit(event: SubmitEvent): Promise<void> {
		event.preventDefault();
		submittedOnce = true;
		const next: typeof errors = {};
		for (const field of ['name', 'email'] as const) {
			const error = fieldError(field);
			if (error) next[field] = error;
		}
		errors = next;
		if (Object.keys(next).length > 0) {
			showSummary = true;
			await tick();
			summaryEl?.focus();
			return;
		}
		showSummary = false;
		joinedName = name.trim();
	}

	function reset(): void {
		joinedName = null;
		name = '';
		email = '';
		errors = {};
		submittedOnce = false;
		showSummary = false;
	}

	function focusField(id: string): void {
		document.getElementById(id)?.focus();
	}

	const inputClass =
		'w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm text-ink placeholder:text-muted';
</script>

<Seo {lang} title={t.meta.rewardsTitle} description={t.meta.rewardsDescription} path="/rewards" />

<div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.rewardsPage.title }
			]}
		/>
		<h1 class="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
			{t.rewardsPage.title}
		</h1>
		<p class="mt-2 max-w-2xl leading-relaxed text-muted">{t.rewardsPage.description}</p>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-muted dark:bg-surface-soft">
			{t.rewardsPage.demoNote}
		</p>
	</div>

	<section aria-labelledby="rewards-how-heading" class="mt-8" use:reveal>
		<h2 id="rewards-how-heading" class="text-xl font-bold text-ink">{t.rewardsPage.howTitle}</h2>
		<ol class="mt-4 space-y-3">
			{#each t.rewardsPage.howSteps as step, i (i)}
				<li class="flex items-start gap-3 rounded-3xl bg-surface p-5 ring-1 ring-line">
					<span
						class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white"
						aria-hidden="true"
					>
						{i + 1}
					</span>
					<p class="pt-1 leading-relaxed text-muted">{step}</p>
				</li>
			{/each}
		</ol>
	</section>

	<section aria-labelledby="rewards-tiers-heading" class="mt-10" use:reveal>
		<h2 id="rewards-tiers-heading" class="text-xl font-bold text-ink">{t.rewardsPage.tiersTitle}</h2>
		<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each t.rewardsPage.tiers as tier, i (tier.name)}
				{@const Icon = tierIcons[i] ?? Award}
				<article
					class="flex flex-col rounded-3xl bg-surface p-5 ring-1 ring-line"
					use:reveal={{ delay: Math.min(i * 60, 300) }}
				>
					<span class="grid h-11 w-11 place-items-center self-start rounded-2xl bg-brand-50 text-brand-700">
						<Icon class="h-5 w-5" aria-hidden="true" />
					</span>
					<h3 class="mt-3 text-lg font-bold text-ink">{tier.name}</h3>
					<p class="text-sm font-semibold text-brand-700 dark:text-brand-300">{tier.threshold}</p>
					<p class="mt-1 text-sm leading-relaxed text-muted">{tier.description}</p>
					<ul class="mt-3 flex-1 space-y-2 text-sm leading-relaxed text-muted">
						{#each tier.perks as perk (perk)}
							<li class="flex items-start gap-2">
								<CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-brand-700 dark:text-brand-300" aria-hidden="true" />
								<span>{perk}</span>
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</section>

	<section
		aria-labelledby="rewards-join-heading"
		class="mt-10 rounded-3xl bg-surface p-6 ring-1 ring-line"
		use:reveal
	>
		<h2 id="rewards-join-heading" class="text-xl font-bold text-ink">{t.rewardsPage.joinTitle}</h2>
		{#if joinedName}
			<div class="mt-4 rounded-2xl bg-brand-50 p-5 dark:bg-surface-soft" role="status">
				<p class="flex items-center gap-2 font-bold text-ink">
					<CheckCircle2 class="h-5 w-5 text-brand-700 dark:text-brand-300" aria-hidden="true" />
					{t.rewardsPage.successTitle}
				</p>
				<p class="mt-2 text-sm leading-relaxed text-muted">
					{interpolate(t.rewardsPage.successText, { name: joinedName })}
				</p>
				<button
					type="button"
					onclick={reset}
					class="mt-4 inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold text-brand-800 ring-1 ring-brand-700 hover:bg-brand-50 dark:text-brand-200"
				>
					{t.rewardsPage.joinAnother}
				</button>
			</div>
		{:else}
			<p class="mt-1 text-sm leading-relaxed text-muted">{t.rewardsPage.joinText}</p>
			<form onsubmit={submit} novalidate class="mt-5 space-y-4">
				{#if showSummary && errorEntries.length > 0}
					<div
						bind:this={summaryEl}
						tabindex="-1"
						role="alert"
						class="rounded-2xl bg-red-50 dark:bg-red-950/60 p-4 ring-1 ring-red-200 dark:ring-red-900 focus:outline-2 focus:outline-offset-2 focus:outline-red-600"
					>
						<p class="text-sm font-semibold text-red-800 dark:text-red-200">{t.rewardsPage.errorSummary}</p>
						<ul class="mt-2 list-disc space-y-1 pl-5 text-sm">
							{#each errorEntries as entry (entry.field)}
								<li>
									<a
										href="#{entry.id}"
										onclick={(event) => {
											event.preventDefault();
											focusField(entry.id);
										}}
										class="text-red-700 dark:text-red-300 underline hover:text-red-800 dark:hover:text-red-200"
									>
										{entry.label}
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				<div>
					<label for="rewards-name" class="mb-1 block text-sm font-medium text-ink-soft">
						{t.rewardsPage.nameLabel}
					</label>
					<input
						id="rewards-name"
						name="name"
						type="text"
						bind:value={name}
						onblur={() => handleBlur('name')}
						oninput={() => handleInput('name')}
						placeholder={t.rewardsPage.namePlaceholder}
						autocomplete="name"
						aria-invalid={errors.name ? 'true' : undefined}
						aria-describedby={errors.name ? 'rewards-name-error' : undefined}
						class="{inputClass} min-h-12"
					/>
					{#if errors.name}
						<p id="rewards-name-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
					{/if}
				</div>
				<div>
					<label for="rewards-email" class="mb-1 block text-sm font-medium text-ink-soft">
						{t.rewardsPage.emailLabel}
					</label>
					<input
						id="rewards-email"
						name="email"
						type="email"
						bind:value={email}
						onblur={() => handleBlur('email')}
						oninput={() => handleInput('email')}
						placeholder={t.rewardsPage.emailPlaceholder}
						autocomplete="email"
						aria-invalid={errors.email ? 'true' : undefined}
						aria-describedby={errors.email ? 'rewards-email-error' : undefined}
						class="{inputClass} min-h-12"
					/>
					{#if errors.email}
						<p id="rewards-email-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
					{/if}
				</div>
				<button
					type="submit"
					class="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
				>
					<Gift class="h-4 w-4" aria-hidden="true" />
					{t.rewardsPage.joinButton}
				</button>
			</form>
		{/if}
	</section>
</div>
