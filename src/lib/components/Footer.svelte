<script lang="ts">
	import { ShoppingBag } from '@lucide/svelte';
	import { SITE_NAME, SITE_YEAR, SOCIAL_LINKS } from '#lib/config';
	import type { Dictionary, Locale } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';
	import NewsletterForm from './NewsletterForm.svelte';
	import SocialIcon from './SocialIcon.svelte';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();

	const usefulLinks = $derived([
		{ label: t.nav.home, href: localizedPath(lang, '/') },
		{ label: t.nav.shop, href: localizedPath(lang, '/shop') },
		{ label: t.nav.about, href: localizedPath(lang, '/about') },
		{ label: t.nav.contact, href: localizedPath(lang, '/contact') }
	]);
</script>

<footer class="bg-brand-950 text-white">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.5fr]">
			<div>
				<a
					href={localizedPath(lang, '/')}
					class="flex min-h-11 items-center gap-2 rounded-full"
					aria-label={SITE_NAME}
				>
					<span class="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-white">
						<ShoppingBag class="h-5 w-5" aria-hidden="true" />
					</span>
					<span class="text-xl font-bold tracking-tight">
						Tech<span class="text-brand-300">Dova</span>
					</span>
				</a>
				<p class="mt-3 text-sm text-white/70">{t.footer.tagline}</p>
			</div>

			<nav aria-label={t.footer.usefulLinks}>
				<h2 class="text-base font-semibold">{t.footer.usefulLinks}</h2>
				<ul class="mt-3 space-y-1">
					{#each usefulLinks as link (link.href)}
						<li>
							<a
								href={link.href}
								class="inline-flex min-h-11 items-center text-sm text-white/75 hover:text-white"
							>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<div>
				<h2 class="text-base font-semibold">{t.footer.followUs}</h2>
				<ul class="mt-3 flex gap-2">
					{#each SOCIAL_LINKS as social (social.network)}
						<li>
							<a
								href={social.href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="{t.footer.followUs} — {social.network}"
								class="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
							>
								<SocialIcon network={social.network} />
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<div>
				<h2 class="text-base font-semibold">{t.footer.newsletterTitle}</h2>
				<p class="mt-3 text-sm text-white/70">{t.footer.newsletterText}</p>
				<div class="mt-4">
					<NewsletterForm {t} />
				</div>
			</div>
		</div>

		<div
			class="mt-12 flex flex-col gap-2 border-t border-white/10 pt-5 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between"
		>
			<p>© {SITE_YEAR} {SITE_NAME}. {t.footer.rights}</p>
			<div class="flex gap-5">
				<a
					href={localizedPath(lang, '/terms')}
					class="inline-flex min-h-11 items-center hover:text-white"
				>
					{t.footer.terms}
				</a>
				<a
					href={localizedPath(lang, '/privacy')}
					class="inline-flex min-h-11 items-center hover:text-white"
				>
					{t.footer.privacy}
				</a>
			</div>
		</div>
	</div>
</footer>
