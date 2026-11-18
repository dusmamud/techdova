<script lang="ts">
	import { SITE_NAME, SITE_URL } from '#lib/config';
	import { getDictionary, locales, type Locale } from '#lib/i18n/index';

	let {
		lang,
		title,
		description,
		path,
		image = '/images/og-image.png',
		type = 'website',
		publishedTime,
		noindex = false
	}: {
		lang: Locale;
		title: string;
		description: string;
		/** Locale-less path, e.g. '/' or '/shop' or '/product/iphone-15-pro'. */
		path: string;
		image?: string;
		type?: 'website' | 'product' | 'article';
		/** ISO 8601 datetime with timezone for `article:published_time` (article pages only). */
		publishedTime?: string;
		noindex?: boolean;
	} = $props();

	const dict = $derived(getDictionary(lang));

	function absolute(locale: Locale): string {
		const clean = path === '/' ? '' : path;
		return `${SITE_URL}/${locale}${clean}`;
	}

	const canonical = $derived(absolute(lang));
	const imageUrl = $derived(`${SITE_URL}${image}`);
	const alternates = $derived(locales.filter((l) => l !== lang));
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}
	<link rel="canonical" href={canonical} />
	{#each locales as locale (locale)}
		<link rel="alternate" hreflang={locale} href={absolute(locale)} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={absolute('en')} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	{#if publishedTime}
		<meta property="article:published_time" content={publishedTime} />
	{/if}
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:locale" content={dict.meta.ogLocale} />
	{#each alternates as locale (locale)}
		<meta property="og:locale:alternate" content={getDictionary(locale).meta.ogLocale} />
	{/each}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
