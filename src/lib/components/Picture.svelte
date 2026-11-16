<script lang="ts">
	// Format waterfall: AVIF first, WebP second, JPG fallback. The
	// browser picks the first <source> type it supports, natively and
	// instantly — no JavaScript, and only one file is downloaded. The
	// <img> carries alt, dimensions and loading attributes and is the
	// universal fallback. Variants are generated from the PNG masters
	// by qa/convert-images.py; every image exists in all 3 formats.
	// The <picture> wrapper is display:contents so layout behaves
	// exactly as if the <img> stood alone.
	let {
		base,
		alt,
		width,
		height,
		loading,
		fetchPriority,
		decoding = 'async',
		class: className = ''
	}: {
		base: string; // path without extension, e.g. '/images/product-iphone-15-pro'
		alt: string;
		width?: number;
		height?: number;
		loading?: 'lazy' | 'eager';
		fetchPriority?: 'high' | 'low' | 'auto';
		decoding?: 'async' | 'sync' | 'auto';
		class?: string;
	} = $props();
</script>

<picture class="contents">
	<source srcset="{base}.avif" type="image/avif" />
	<source srcset="{base}.webp" type="image/webp" />
	<img
		src="{base}.jpg"
		{alt}
		{width}
		{height}
		{loading}
		fetchpriority={fetchPriority}
		{decoding}
		class={className}
	/>
</picture>
