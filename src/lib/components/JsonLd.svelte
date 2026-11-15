<script lang="ts">
	// JSON-LD is built as a string in the instance script and injected with
	// {@html}: Svelte does not evaluate expressions inside markup script tags.
	// The closing tag is written with an escaped slash so the Svelte parser
	// never sees a literal closing script tag inside this component.
	let { json }: { json: Record<string, unknown> } = $props();

	const markup = $derived(
		'<script type="application/ld+json">' + JSON.stringify(json) + '<\/script>'
	);
</script>

{@html markup}
