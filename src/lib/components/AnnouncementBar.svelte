<script lang="ts">
	import { Truck } from '@lucide/svelte';
	import type { Dictionary, Locale } from '#lib/i18n/index';
	import { localizedPath } from '#lib/paths';

	let { lang, t }: { lang: Locale; t: Dictionary } = $props();
</script>

<div class="bg-brand-800 text-white">
	<p
		class="mx-auto flex min-h-11 max-w-7xl flex-wrap items-center justify-center gap-x-2 px-4 text-center text-sm sm:px-6 lg:px-8"
	>
		<Truck class="h-4 w-4 shrink-0" aria-hidden="true" />
		<span>{t.announcementBar.text}</span>
		<a
			href={localizedPath(lang, '/shipping')}
			class="inline-flex min-h-11 items-center font-semibold underline underline-offset-2 hover:text-brand-100"
		>
			{t.announcementBar.linkLabel}
		</a>
	</p>
</div>
