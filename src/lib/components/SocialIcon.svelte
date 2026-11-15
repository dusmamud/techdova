<script lang="ts">
	// Hand-drawn minimal social marks (Lucide 1.x ships no brand icons).
	let { network }: { network: 'Facebook' | 'Instagram' | 'YouTube' | 'TikTok' } = $props();
</script>

{#if network === 'Facebook'}
	<svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true" focusable="false"
		><path
			d="M13.5 21.5v-7h2.45l.4-3h-2.85V9.6c0-.87.3-1.5 1.6-1.5h1.35V5.4c-.3-.04-1.15-.12-2.1-.12-2.05 0-3.45 1.25-3.45 3.55v1.67H8.5v3h2.4v7h2.6z"
		/></svg
	>
{:else if network === 'Instagram'}
	<svg
		viewBox="0 0 24 24"
		class="h-5 w-5"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		aria-hidden="true"
		focusable="false"
		><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle
			cx="17.2"
			cy="6.8"
			r="0.6"
			fill="currentColor"
			stroke="none"
		/></svg
	>
{:else if network === 'YouTube'}
	<svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true" focusable="false"
		><path
			d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26.1 26.1 0 0 0 2 12a26.1 26.1 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26.1 26.1 0 0 0 22 12a26.1 26.1 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z"
		/></svg
	>
{:else}
	<svg viewBox="0 0 24 24" class="h-5 w-5 fill-current" aria-hidden="true" focusable="false"
		><path
			d="M15.5 3h2.6a6.4 6.4 0 0 0 2 3.9v2.5a8.9 8.9 0 0 1-4.6-1.4v7.4a5.6 5.6 0 1 1-5.6-5.6c.35 0 .7.04 1 .12v2.75a2.85 2.85 0 1 0 1.85 2.67V3h2.75z"
		/></svg
	>
{/if}
