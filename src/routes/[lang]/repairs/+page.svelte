<script lang="ts">
	import { CalendarCheck, CheckCircle2, Wrench } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import Breadcrumbs from '#lib/components/Breadcrumbs.svelte';
	import JsonLd from '#lib/components/JsonLd.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { SITE_URL } from '#lib/config';
	import { products } from '#lib/data/products';
	import { interpolate } from '#lib/format';
	import { getDictionary, localize } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const lang = $derived(data.lang);
	const t = $derived(getDictionary(lang));

	const breadcrumbJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: t.product.breadcrumbHome,
				item: `${SITE_URL}/${lang}`
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: t.repairsPage.title,
				item: `${SITE_URL}/${lang}/repairs`
			}
		]
	});

	const webPageJsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		'@id': `${SITE_URL}/${lang}/repairs`,
		url: `${SITE_URL}/${lang}/repairs`,
		name: t.repairsPage.title,
		description: t.meta.repairsDescription,
		inLanguage: lang
	});

	const intlLocale = $derived(t.meta.intlLocale);

	// Mock calendar: the next 14 days from today, with 7 slots a day.
	// A slot is shown as taken by a hash-stable rule (day + slot), so the
	// same day always shows the same taken slots and every day keeps free
	// slots. Demo only — nothing is booked anywhere.
	const SLOTS = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30'];

	const days = $derived.by(() => {
		const start = new Date();
		start.setHours(0, 0, 0, 0);
		return Array.from({ length: 14 }, (_, i) => {
			const d = new Date(start);
			d.setDate(start.getDate() + i);
			return d;
		});
	});

	function isSlotTaken(dayIndex: number, slotIndex: number): boolean {
		return (dayIndex * 3 + slotIndex) % 5 === 0;
	}

	function shortDate(date: Date): string {
		return new Intl.DateTimeFormat(intlLocale, {
			weekday: 'short',
			day: 'numeric',
			month: 'short'
		}).format(date);
	}

	let deviceSlug = $state('');
	let serviceIndex = $state(-1);
	let dayIndex = $state(-1);
	let slotIndex = $state(-1);
	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let error = $state('');
	let bookedReference = $state('');

	const selectedDateLabel = $derived(
		dayIndex >= 0 ? shortDate(days[dayIndex]) : ''
	);

	function selectDay(index: number): void {
		dayIndex = index;
		slotIndex = -1;
	}

	function submit(): void {
		if (
			!deviceSlug ||
			serviceIndex < 0 ||
			dayIndex < 0 ||
			slotIndex < 0 ||
			!name.trim() ||
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
		) {
			error = t.repairsPage.validationError;
			return;
		}
		error = '';
		const seed = dayIndex * 100 + slotIndex * 10 + (name.trim().length % 10);
		bookedReference = `TD-R-${String(100000 + seed * 137).slice(0, 6)}`;
	}

	function bookAnother(): void {
		bookedReference = '';
		deviceSlug = '';
		serviceIndex = -1;
		dayIndex = -1;
		slotIndex = -1;
		name = '';
		email = '';
		phone = '';
	}

	const inputClass =
		'w-full rounded-xl border border-line bg-surface px-3 py-3 text-sm text-ink placeholder:text-muted';
</script>

<Seo {lang} title={t.meta.repairsTitle} description={t.meta.repairsDescription} path="/repairs" />
<JsonLd json={breadcrumbJsonLd} />
<JsonLd json={webPageJsonLd} />

<div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
	<div use:reveal>
		<Breadcrumbs
			label={t.product.breadcrumbLabel}
			items={[
				{ label: t.product.breadcrumbHome, href: localizedPath(lang, '/') },
				{ label: t.repairsPage.title }
			]}
		/>
		<div class="mt-2 flex items-center gap-3">
			<span class="grid h-12 w-12 place-items-center rounded-2xl bg-brand-700 text-white">
				<Wrench class="h-6 w-6" aria-hidden="true" />
			</span>
			<h1 class="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{t.repairsPage.title}</h1>
		</div>
		<p class="mt-3 leading-relaxed text-muted">{t.repairsPage.description}</p>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm leading-relaxed text-muted dark:bg-surface-soft">
			{t.repairsPage.intro}
		</p>
		<p class="mt-4 rounded-2xl bg-brand-50 p-4 text-sm leading-relaxed text-muted dark:bg-surface-soft">
			{t.repairsPage.demoNote}
		</p>
	</div>

	{#if bookedReference}
		<div
			class="mt-8 rounded-3xl bg-brand-50 p-6 text-center dark:bg-surface-soft sm:p-10"
			use:reveal
		>
			<CheckCircle2 class="mx-auto h-10 w-10 text-brand-700 dark:text-brand-300" aria-hidden="true" />
			<h2 class="mt-4 text-2xl font-bold text-ink">{t.repairsPage.successTitle}</h2>
			<p class="mx-auto mt-2 max-w-md leading-relaxed text-muted">
				{interpolate(t.repairsPage.successText, { reference: bookedReference })}
			</p>
			<p class="mt-4 text-sm font-semibold text-ink">
				{t.repairsPage.referenceLabel}: {bookedReference}
			</p>
			<button
				type="button"
				onclick={bookAnother}
				class="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				{t.repairsPage.bookAnotherButton}
			</button>
		</div>
	{:else}
		<form
			class="mt-8 space-y-8"
			onsubmit={(event) => {
				event.preventDefault();
				submit();
			}}
			use:reveal
		>
			<h2 class="text-2xl font-bold tracking-tight text-ink">{t.repairsPage.formTitle}</h2>

			{#if error}
				<p role="alert" class="rounded-2xl bg-rose-50 p-4 text-sm font-medium text-rose-700 dark:bg-rose-950 dark:text-rose-200">
					{error}
				</p>
			{/if}

			<div>
				<label for="repairs-device" class="block text-sm font-semibold text-ink">
					{t.repairsPage.deviceLabel}
				</label>
				<select id="repairs-device" bind:value={deviceSlug} class="{inputClass} mt-2 min-h-12">
					<option value="" disabled>{t.repairsPage.devicePlaceholder}</option>
					{#each products as product (product.slug)}
						<option value={product.slug}>{localize(product.name, lang)}</option>
					{/each}
				</select>
			</div>

			<fieldset>
				<legend class="text-sm font-semibold text-ink">{t.repairsPage.serviceLabel}</legend>
				<div class="mt-2 grid gap-3 sm:grid-cols-2">
					{#each t.repairsPage.services as service, i (service)}
						<button
							type="button"
							aria-pressed={serviceIndex === i}
							onclick={() => {
								serviceIndex = i;
							}}
							class="min-h-12 rounded-2xl px-4 py-3 text-left text-sm font-medium ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft aria-pressed:bg-brand-700 aria-pressed:text-white aria-pressed:ring-brand-700"
						>
							{service}
						</button>
					{/each}
				</div>
			</fieldset>

			<fieldset>
				<legend class="text-sm font-semibold text-ink">{t.repairsPage.dateLabel}</legend>
				<div class="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
					{#each days as day, i (day.toISOString())}
						<button
							type="button"
							aria-pressed={dayIndex === i}
							onclick={() => selectDay(i)}
							class="min-h-12 rounded-2xl px-3 py-2 text-sm font-medium ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft aria-pressed:bg-brand-700 aria-pressed:text-white aria-pressed:ring-brand-700"
						>
							{shortDate(day)}
						</button>
					{/each}
				</div>
			</fieldset>

			<fieldset>
				<legend class="text-sm font-semibold text-ink">{t.repairsPage.slotLabel}</legend>
				{#if dayIndex < 0}
					<p class="mt-2 text-sm text-muted">{t.repairsPage.chooseDateFirst}</p>
				{:else}
					<div class="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
						{#each SLOTS as slot, i (slot)}
							{@const taken = isSlotTaken(dayIndex, i)}
							<button
								type="button"
								disabled={taken}
								aria-pressed={slotIndex === i}
								aria-label={taken ? `${slot} — ${t.repairsPage.takenLabel}` : slot}
								onclick={() => {
									slotIndex = i;
								}}
								class="min-h-12 rounded-2xl px-3 py-2 text-sm font-medium ring-1 ring-line hover:bg-brand-50 dark:hover:bg-surface-soft aria-pressed:bg-brand-700 aria-pressed:text-white aria-pressed:ring-brand-700 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted disabled:line-through"
							>
								{slot}
							</button>
						{/each}
					</div>
					{#if dayIndex >= 0 && slotIndex >= 0}
						<p class="mt-3 flex items-center gap-2 text-sm font-medium text-muted">
							<CalendarCheck class="h-4 w-4 text-brand-700 dark:text-brand-300" aria-hidden="true" />
							{selectedDateLabel} · {SLOTS[slotIndex]}
						</p>
					{/if}
				{/if}
			</fieldset>

			<div class="grid gap-5 sm:grid-cols-2">
				<div>
					<label for="repairs-name" class="block text-sm font-semibold text-ink">
						{t.repairsPage.nameLabel}
					</label>
					<input
						id="repairs-name"
						type="text"
						autocomplete="name"
						bind:value={name}
						class="{inputClass} mt-2 min-h-12"
					/>
				</div>
				<div>
					<label for="repairs-email" class="block text-sm font-semibold text-ink">
						{t.repairsPage.emailLabel}
					</label>
					<input
						id="repairs-email"
						type="email"
						autocomplete="email"
						bind:value={email}
						class="{inputClass} mt-2 min-h-12"
					/>
				</div>
				<div>
					<label for="repairs-phone" class="block text-sm font-semibold text-ink">
						{t.repairsPage.phoneLabel}
					</label>
					<input
						id="repairs-phone"
						type="tel"
						autocomplete="tel"
						bind:value={phone}
						class="{inputClass} mt-2 min-h-12"
					/>
				</div>
			</div>

			<button
				type="submit"
				class="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
			>
				<CalendarCheck class="h-4 w-4" aria-hidden="true" />
				{t.repairsPage.submitButton}
			</button>
		</form>
	{/if}
</div>
