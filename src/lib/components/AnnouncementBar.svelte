<script lang="ts">
	import { Truck } from '@lucide/svelte';
	import type { Dictionary, Locale } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();
</script>

<div class="bg-brand-800 text-white">
	<p
		class="mx-auto flex min-h-11 max-w-7xl items-center justify-center gap-2 px-4 text-sm sm:px-6 lg:px-8"
	>
		<Truck class="hidden h-4 w-4 shrink-0 sm:block" aria-hidden="true" />
		<span class="min-w-0 truncate sm:hidden">{t.announcementBar.short}</span>
		<span class="hidden min-w-0 truncate sm:inline">{t.announcementBar.text}</span>
		<a
			href={localizedPath(lang, '/shipping')}
			class="inline-flex min-h-11 shrink-0 items-center font-semibold underline underline-offset-2 hover:text-brand-100"
		>
			{t.announcementBar.linkLabel}
		</a>
	</p>
</div>
