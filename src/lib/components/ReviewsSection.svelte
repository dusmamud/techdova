<script lang="ts">
	import { browser } from '$app/env';
	import { ThumbsUp } from '@lucide/svelte';
	import { reveal } from '#lib/actions/reveal';
	import { REVIEW_VOTES_STORAGE_KEY } from '#lib/config';
	import type { Product } from '#lib/data/products';
	import {
		getRatingBreakdown,
		getReviewsForProduct,
		toggleVote,
		type DemoReview
	} from '#lib/data/reviews';
	import { formatCount, formatDate, formatDecimal, interpolate } from '#lib/format';
	import { localize, type Dictionary, type Locale } from '#lib/i18n/index';
	import RatingBreakdown from './RatingBreakdown.svelte';
	import Stars from './Stars.svelte';

	let { lang, t, product }: { lang: Locale; t: Dictionary; product: Product } = $props();

	const intlLocale = $derived(t.meta.intlLocale);
	const breakdown = $derived(getRatingBreakdown(product.rating, product.reviewCount));
	const basedOn = $derived(
		interpolate(t.reviews.basedOn, { count: formatCount(product.reviewCount, intlLocale) })
	);
	const ratingLabel = $derived(
		interpolate(t.reviews.ratingOption, { n: formatDecimal(product.rating, intlLocale) })
	);

	let sessionReviews = $state<DemoReview[]>([]);
	let votedIds = $state<string[]>([]);
	const reviews = $derived([...sessionReviews, ...getReviewsForProduct(product.slug)]);

	$effect(() => {
		if (!browser) return;
		try {
			const raw = localStorage.getItem(REVIEW_VOTES_STORAGE_KEY);
			if (!raw) return;
			const parsed: unknown = JSON.parse(raw);
			if (Array.isArray(parsed)) {
				votedIds = parsed.filter((v): v is string => typeof v === 'string');
			}
		} catch {
			votedIds = [];
		}
	});

	function toggleHelpful(id: string): void {
		votedIds = toggleVote(votedIds, id);
		if (!browser) return;
		try {
			localStorage.setItem(REVIEW_VOTES_STORAGE_KEY, JSON.stringify(votedIds));
		} catch {
			// Storage unavailable: the vote still applies for this session.
		}
	}

	function initials(name: string): string {
		return name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0])
			.join('')
			.toUpperCase();
	}

	function parseDate(dateISO: string): Date {
		const [year, month, day] = dateISO.split('-').map(Number);
		return new Date(year, month - 1, day);
	}

	// Demo write-a-review form: validated locally, session-only.
	let name = $state('');
	let rating = $state(5);
	let title = $state('');
	let text = $state('');
	let nameError = $state('');
	let titleError = $state('');
	let textError = $state('');
	let submitted = $state(false);

	const formId = $derived(`review-form-${product.slug}`);

	function submitReview(event: SubmitEvent): void {
		event.preventDefault();
		nameError = name.trim() ? '' : t.reviews.nameError;
		titleError = title.trim() ? '' : t.reviews.titleError;
		textError = text.trim().length >= 10 ? '' : t.reviews.textError;
		if (nameError || titleError || textError) {
			submitted = false;
			return;
		}
		const today = new Date();
		const dateISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
		const trimmedName = name.trim();
		sessionReviews = [
			{
				id: `session-${Date.now()}`,
				author: { en: trimmedName, fr: trimmedName },
				rating,
				dateISO,
				title: { en: title.trim(), fr: title.trim() },
				text: { en: text.trim(), fr: text.trim() },
				helpful: 0
			},
			...sessionReviews
		];
		name = '';
		rating = 5;
		title = '';
		text = '';
		submitted = true;
	}
</script>

<section id="reviews" aria-labelledby="reviews-heading" class="mt-12 scroll-mt-24" use:reveal>
	<h2 id="reviews-heading" tabindex="-1" class="text-2xl font-bold tracking-tight text-ink focus:outline-none">
		{t.reviews.heading}
	</h2>
	<p class="mt-2 text-sm text-muted">{t.reviews.demoNote}</p>
	<p class="mt-1 text-sm text-muted">
		{interpolate(t.reviews.sampleNote, { count: formatCount(product.reviewCount, intlLocale) })}
	</p>

	<div class="mt-6 grid gap-8 lg:grid-cols-[1fr_2fr]">
		<div>
			<p class="flex flex-wrap items-center gap-2">
				<span class="text-3xl font-bold text-ink">
					{formatDecimal(product.rating, intlLocale)}
				</span>
				<Stars rating={product.rating} label={ratingLabel} />
			</p>
			<h3 class="mt-4 text-base font-semibold text-ink">{t.reviews.breakdownLabel}</h3>
			<div class="mt-2">
				<RatingBreakdown {breakdown} totalLabel={basedOn} />
			</div>
		</div>

		<ul class="flex flex-col gap-5">
			{#each reviews as review (review.id)}
				{@const author = localize(review.author, lang)}
				{@const voted = votedIds.includes(review.id)}
				{@const helpfulCount = review.helpful + (voted ? 1 : 0)}
				<li class="rounded-3xl bg-surface p-5 ring-1 ring-line">
					<div class="flex items-center gap-3">
						<span
							aria-hidden="true"
							class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-800"
						>
							{initials(author)}
						</span>
						<div class="min-w-0">
							<p class="text-sm font-semibold text-ink">{author}</p>
							<p class="text-sm text-muted">
								{formatDate(parseDate(review.dateISO), intlLocale)}
							</p>
						</div>
						<span class="ml-auto">
							<Stars
								rating={review.rating}
								label={interpolate(t.reviews.ratingOption, { n: review.rating })}
							/>
						</span>
					</div>
					<h3 class="mt-3 text-base font-semibold text-ink">
						{localize(review.title, lang)}
					</h3>
					<p class="mt-1 leading-relaxed text-muted">{localize(review.text, lang)}</p>
					<button
						type="button"
						aria-pressed={voted}
						onclick={() => toggleHelpful(review.id)}
						class="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold ring-1 {voted
							? 'bg-brand-50 text-brand-800 ring-brand-700'
							: 'text-ink-soft ring-line hover:bg-surface-soft'}"
					>
						<ThumbsUp class="h-4 w-4" aria-hidden="true" />
						{interpolate(voted ? t.reviews.helpfulVoted : t.reviews.helpful, {
							count: formatCount(helpfulCount, intlLocale)
						})}
					</button>
				</li>
			{/each}
		</ul>
	</div>

	<div class="mt-8 rounded-3xl bg-surface-soft p-5 sm:p-6">
		<h3 class="text-lg font-bold text-ink">{t.reviews.writeTitle}</h3>
		<form id={formId} onsubmit={submitReview} novalidate class="mt-4 flex flex-col gap-4">
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label
						for="{formId}-name"
						class="mb-1 block text-sm font-semibold text-ink"
					>
						{t.reviews.nameLabel}
					</label>
					<input
						id="{formId}-name"
						name="name"
						type="text"
						bind:value={name}
						aria-invalid={nameError ? 'true' : undefined}
						aria-describedby={nameError ? `${formId}-name-error` : undefined}
						autocomplete="name"
						class="h-12 w-full rounded-2xl bg-surface px-4 text-sm text-ink ring-1 ring-line placeholder:text-muted"
					/>
					{#if nameError}
						<p id="{formId}-name-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{nameError}</p>
					{/if}
				</div>
				<div>
					<label
						for="{formId}-rating"
						class="mb-1 block text-sm font-semibold text-ink"
					>
						{t.reviews.ratingLabel}
					</label>
					<select
						id="{formId}-rating"
						name="rating"
						bind:value={rating}
						class="h-12 w-full rounded-2xl bg-surface px-4 text-sm text-ink ring-1 ring-line"
					>
						{#each [5, 4, 3, 2, 1] as n (n)}
							<option value={n}>{interpolate(t.reviews.ratingOption, { n })}</option>
						{/each}
					</select>
				</div>
			</div>
			<div>
				<label
					for="{formId}-title"
					class="mb-1 block text-sm font-semibold text-ink"
				>
					{t.reviews.titleLabel}
				</label>
				<input
					id="{formId}-title"
					name="title"
					type="text"
					bind:value={title}
					aria-invalid={titleError ? 'true' : undefined}
					aria-describedby={titleError ? `${formId}-title-error` : undefined}
					class="h-12 w-full rounded-2xl bg-surface px-4 text-sm text-ink ring-1 ring-line placeholder:text-muted"
				/>
				{#if titleError}
					<p id="{formId}-title-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{titleError}</p>
				{/if}
			</div>
			<div>
				<label
					for="{formId}-text"
					class="mb-1 block text-sm font-semibold text-ink"
				>
					{t.reviews.textLabel}
				</label>
				<textarea
					id="{formId}-text"
					name="text"
					bind:value={text}
					rows="4"
					aria-invalid={textError ? 'true' : undefined}
					aria-describedby={textError ? `${formId}-text-error` : undefined}
					class="w-full rounded-2xl bg-surface px-4 py-3 text-sm text-ink ring-1 ring-line placeholder:text-muted"
				></textarea>
				{#if textError}
					<p id="{formId}-text-error" class="mt-1 text-sm text-red-600 dark:text-red-400">{textError}</p>
				{/if}
			</div>
			<div>
				<button
					type="submit"
					class="inline-flex min-h-12 items-center justify-center rounded-full bg-brand-700 px-6 text-sm font-semibold text-white hover:bg-brand-800"
				>
					{t.reviews.submit}
				</button>
				{#if submitted}
					<p role="status" class="mt-2 text-sm font-medium text-brand-800 dark:text-brand-200">
						{t.reviews.successNote}
					</p>
				{/if}
			</div>
		</form>
	</div>
</section>
