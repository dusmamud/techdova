# Research sources — TechDova

Best-practice research for this build, checked **2026-11-15** by a research
subagent using web search plus official documentation (official docs first).
URLs below are copied verbatim from that report; nothing was invented or
reconstructed. The recommendations section of the report is summarised in
"How the research was applied" below; the full source list and the open
uncertainties follow verbatim.

## How the research was applied

### i18n — typed custom dictionaries (research recommendation)

- One TypeScript module per locale: `src/lib/i18n/en.ts` is the source of
  truth (`Dictionary = typeof en`); `src/lib/i18n/fr.ts` is typed
  `fr: Dictionary`, so a missing or extra key is a `svelte-check` error.
  `src/lib/i18n/index.ts` holds the single `dictionaries` registry.
- A Vitest parity test (`src/lib/i18n.test.ts`) asserts deep key-shape
  parity including array lengths (types alone do not check array length),
  non-empty strings and identical `{placeholders}`.
- Required `[lang]` routes (`/en/...`, `/fr/...`); every dynamic route
  exports `entries()`; `prerender = true` in the root layout. Locale
  validation happens in `[lang]/+layout.ts` (unknown locales 404).
- `<html lang>` is rewritten per locale at prerender time by
  `src/hooks.server.ts` (`transformPageChunk`). Verified in built HTML:
  `build/en*.html` carries `lang="en"`, `build/fr*.html` carries `lang="fr"`.
- Language switcher = plain `<a>` links to the same path in the other
  locale (preserving query + hash), so the prerender crawler follows the
  cross-locale links. Choice persists in `localStorage`; the URL is the
  source of truth. No cookie/header detection (no server on a static host).
- Canonical self-referential per locale page; hreflang cluster (self +
  all versions + `x-default` → `/en/`) from `src/lib/components/Seo.svelte`;
  `sitemap.xml` is generated from the same route/slug table, so head links
  and sitemap cannot drift.
- Product/category content: one typed source, locale-keyed strings,
  shared numerics once, identical slugs across locales.
- Root `/` is a prerendered landing page (research option a): links to both
  locales, meta refresh + JS redirect honouring the stored locale, canonical
  to `/en/`, `noindex`.
- Paraglide was rejected for this static build: it silently falls back to
  the base locale for a missing translation (needs an extra CLI check),
  and its SSG pattern had a documented hydration-swap footgun; v3.0 had
  shipped 12 days before the check date, so most examples showed v2.
  svelte-i18n was rejected (no release since October 2024, string keys,
  async loaders complicate prerender).

### Tailwind CSS v4 — CSS-first

- `@tailwindcss/vite` + `tailwindcss` 4.3.5, `tailwindcss()` listed
  **before** `sveltekit()` in `vite.config.ts`; one CSS entry
  `src/app.css` imported from the root `+layout.svelte`; all tokens in
  `@theme`. No `tailwind.config.js`, no PostCSS config, no content globs.
- Light-only: no `dark:` utilities anywhere (the reference is light).
- Logical (RTL-ready) utilities were recommended, but this build uses
  physical utilities (`left-`/`right-`, `pl-`/`pr-`) throughout; both
  shipped locales are LTR, so this is a documented future-work item, not
  a defect. See README "Known limitations".

### Accessibility

- Native landmarks (`header`/`nav`/`main`/`footer`, named sections),
  one `<h1>` per page, skip link to `#main-content`.
- Contrast computed for every text/background pair in the theme: all pass
  WCAG 2.2 AA 4.5:1 (e.g. brand-700 on white 7.42:1, neutral-500 on white
  4.74:1, white on brand-600 5.30:1). The only sub-4.5:1 pair is disabled
  button text (3.76:1), which WCAG exempts as an inactive component.
- 44×44px build standard for interactive targets (exceeds the AA 24px
  minimum): nav links, icon buttons, carousel dots, language switcher and
  the newsletter submit button all meet it.
- Visible `:focus-visible` outline everywhere; `scroll-padding-top`
  (5.5rem) keeps anchored/focused content clear of the sticky header
  (WCAG 2.4.11).
- One persistent polite live region (`src/lib/components/LiveRegion.svelte`,
  present from page load) announces cart add/remove with the product name.
  Shop result counts use `role="status"`; form success states use
  `role="status"`.
- Forms: visible labels, `autocomplete`, errors as text linked via
  `aria-describedby` + `aria-invalid` (not `aria-errormessage`), blur-then-
  input validation lifecycle, and an error summary with focus move and
  field links on failed contact submit.

### SEO / structured data

- Product JSON-LD: single `Product` per product page, `price` as a plain
  number, `priceCurrency: "DZD"` (ISO 4217, never `"DA"`), `sku`,
  `availability` as full schema.org URLs, `aggregateRating` mirroring the
  ratings visibly shown on the page; `BreadcrumbList` on product pages.
- Home: `OnlineStore` + `WebSite` (with `SearchAction`) `@graph`.
- Sitemap: absolute URLs, both locales, `lastmod`, hreflang alternates
  from the same table; no `<priority>`/`<changefreq>` (Google ignores
  them). `robots.txt` allows all + absolute `Sitemap:` line.
- Unique localized titles/descriptions, self-referential canonicals,
  `og:locale` per page.

### Performance / images / currency / data

- Every `<img>` carries explicit `width` + `height` (aspect-ratio box, no
  CLS), `decoding="async"`, localized `alt`; below-fold images are
  `loading="lazy"`; the hero image is eager with `fetchpriority="high"`.
- Images are single-size local PNGs under `static/images/` (15 MB total,
  largest file ~1.1 MB). No `srcset`/`sizes` responsive variants and no
  AVIF/WebP pipeline were built — documented limitation, see README.
- Prices are numbers (DZD) formatted with `Intl.NumberFormat` decimals
  plus a literal `" DA"` suffix (the research-verified fallback, since
  `Intl` currency formatting does not reliably render `DA`). Verified in
  the browser: EN `999.00 DA`, FR `999,00 DA`. JSON-LD always uses `DZD`.
- Product data: one typed source of truth (`src/lib/data/products.ts`,
  `categories.ts`) with unit tests for unique slugs, prices, images and
  the four reference best sellers. Cart/wishlist are client-only Svelte
  stores persisted to `localStorage`, guarded for prerender.

### Gap-filling round (2026-11-16)

A second research pass (11 more sources, listed under §2) checked the
site against e-commerce page checklists, product-page optimisation
guides, homepage-section practice and must-have-feature lists, and the
gaps it found were closed in the same round:

- **Missing pages added**: checkout, order confirmation, FAQ,
  testimonials, search results, account, blog (index + posts), shipping,
  returns and payment policy pages, order tracking, wishlist, compare,
  deals, category pages, plus sitemap and accessibility pages — taking
  the sitemap from 19 to 44 paths × 2 locales (88 URLs), with every new
  URL in the sitemap and the footer.
- **Product pages**: buy box with delivery/returns copy near the button,
  stock states, total-cost clarity, breadcrumbs, a rating summary
  linking to the reviews section, and delivery estimates.
- **Home**: collections, best sellers/new arrivals, brand story, social
  proof, email capture, trust signals and countdown promos, per the
  high-converting homepage sections in the new sources.
- **Findability and merchandising**: header search autocomplete (up to 5
  product suggestions + popular terms, keyboard navigable), a free-
  delivery announcement bar, wishlist, compare, quick view, recently
  viewed, breadcrumbs, order tracking and structured data throughout.
- All new strings went into both dictionaries (typed parity, same as
  before); no new dependencies were added.

---
## 2. Sources (full verbatim URLs, publisher, what each supports; all checked 2026-11-15)

**i18n / SvelteKit**
- https://paraglidejs.com/sveltekit — Paraglide JS (inlang), official docs [opened] — SvelteKit's official i18n integration; compiler-based, tree-shakable, type-safe; `paraglideVitePlugin`; `%lang%`/`%dir%`; middleware + `reroute`; `prerender = true` + locale-switcher crawling + `data-sveltekit-reload`.
- https://discoverability-comparison-pages-paraglide-js.opral.workers.dev/static-site-generation — Paraglide JS docs preview/mirror on opral workers.dev [opened; NOT the canonical paraglidejs.com domain — re-verify before building] — SSG: no `paraglideMiddleware()`; `setLocale()` in `[locale]/+layout.ts`; `entries()` for locale and locale×slug; all locales URL-prefixed; `generateStaticLocalizedUrls()`; hreflang via `localizeHref()`.
- https://paraglidejs.com/basics — Paraglide JS (inlang), official docs — `setLocale()` full-document navigation; `setLocale(..., {reload:false})` warning; `localizeHref()`.
- https://www.brandonwie.dev/posts/paraglide-i18n — Brandon Wie (personal blog, static SvelteKit site on Cloudflare Pages) — runtime vs compile-time i18n; URL-prefix necessity on static hosts; SSG hydration-swap gotcha (prerendered non-base HTML may hold base-locale text until hydration); generated runtime must not be edited.
- https://www.v10r.dev/docs/blueprint/i18n — v10r project docs — Paraglide v2 vs svelte-i18n table; `%lang%` via handle; hreflang cluster + `x-default`; self-referential canonicals.
- https://www.v10r.dev/docs/stack/paraglide — v10r project docs — Paraglide vs svelte-i18n vs typesafe-i18n table (~1–2 KB vs 14 KB FormatJS runtime; type safety; hydration); svelte-i18n "due for reworking"; typesafe-i18n abandoned.
- https://www.babelize.co/blogs/best-i18n-libraries-2027/ — Babelize (versions/downloads checked 27 Oct 2026) — Paraglide as the SvelteKit pick (`npx sv add paraglide`), typed functions fail at build time; svelte-i18n last release October 2024.
- https://stack.visual-thinking.pt/decisions/0031-i18n/ — Visual Thinking ADR-0031 — Paraglide v3.0 shipped 2026-11-03; most examples still v2; pin exact version.
- https://svelte.dev/docs/kit/page-options?ref=chrisjmendez.com — SvelteKit official docs — `prerender`, `entries`, prerender crawler following `<a>` links, root-layout `prerender = true`.
- https://svelte.dev/docs/kit/adapter-static — SvelteKit official docs — adapter-static prerenders the entire site; `trailingSlash`; `ssr` must not be `false`; fallback/SPA mode SEO + performance harm; strict prerender check.
- https://www.errcodex.com/config/sveltekit/prerender/ — Errcodex (2026-10-21, verified with a build demo) [opened] — `entries()` + crawler behaviour; prerender rules (no cookies/`url.searchParams` in `load`; pages with form actions cannot be prerendered).
- https://intlpull.com/blog/svelte-i18n-internationalization-made-simple-2026 — Intlpull (2026) — svelte-i18n `register()`/`init()`/`$t` store, async loaders, SSR/hydration handling; typesafe-i18n as the compile-time-key-safety alternative.
- https://github.com/QUD-Technologies/quranic-universal-audio/blob/HEAD/docs/reference/i18n.md — QUD Technologies project docs — Paraglide compiler validates syntax + call-site types but **silently falls back to baseLocale for a missing translation**; a key-parity test is the only enforcement.
- https://socket.dev/npm/package/@inlang/cli — Socket (npm package page for `@inlang/cli`) — `npx @inlang/cli check` finds missing/empty/unused translations, exits 1, replaces deprecated `lint`/`validate`.
- https://adamarant.com/en/use-cases/multi-locale-i18n — Adamarant — typed dictionaries: English source of truth, `Record<Locale, typeof en>`, missing keys as compile errors, CI guards.
- https://dev.to/mabb0512/make-missing-translations-fail-your-astro-build-4m49 — dev.to (2026-10-14) — `satisfies` pattern (missing *and* extra keys fail); `satisfies` does not check array length — needs a parity assertion.
- https://realcoding.blog/en/2026/03/16/typescript-record-type-practical-guide/ — RealCoding (2026-03-16) — `Record<K, V>` enforces exhaustive keys at compile time.
- https://dev.to/rsale/from-nextjs-15-to-sveltekit-why-we-rewrote-rsalenets-frontend-44gh — dev.to (2026-05-03) — 50-line custom-dictionary i18n in SvelteKit (cited only for dictionary simplicity; its cookie/header routing is an SSR pattern, not applicable here).

**Tailwind CSS v4** (official tailwindcss.com pages were quoted inside secondary sources but not directly retrieved — see §3)
- https://starterpick.com/guides/tailwind-v4-setup-customization-boilerplate-2026 — Starterpick — CSS-first config, `@theme` replaces `theme.extend`, `@import "tailwindcss"`, `@config` compatibility layer.
- https://blog.redlinesoft.net/posts/building-design-system-tailwind-v4/ — Redline Soft blog (2026-08-10) — `@theme` tokens as CSS variables, Vite plugin, no config file / no content globs; cites official theme docs.
- https://www.sundargautam.com.np/blog/tailwind-css-v4-migration-guide/ — Sundar Gautam — breaking changes (border `currentColor`, 1px ring, renamed scales), browser targets, JS config no longer auto-detected.
- https://www.nowaterprogramming.com/blog/mastering-tailwind-css — NoWaterProgramming (checked vs Tailwind 4.2.2, 2026-08-20) — `@custom-variant dark`, `@plugin` in CSS, container queries in core, PostCSS plugin rename.
- https://mcp.nerdleveltech.com/tailwind-v4-dark-mode — NerdLevelTech (verified vs 4.3.1, 2026-06-15) — `dark:` defaults to `prefers-color-scheme`; exact `@custom-variant dark (&:where(.dark, .dark *));` line; `:where()` zero-specificity rationale.
- https://tryhoverify.com/blog/the-art-of-dark-mode-implementation-with-tailwind-css/ — Hoverify (updated 2026-07-20) — v4 dark-mode strategies, class strategy, `color-scheme`.
- https://evershop.io/docs/development/theme/styling — EverShop docs — half-dark hazard when `dark:` utilities exist without `.dark` tokens / missing `@custom-variant`.
- https://tuts.kandz.me/tailwind-css-49-%f0%9f%8e%a8-rtl-right-to-left-support-using-logical-properties-ms-me-ps-pe/ — KandZ Tuts — logical utilities `ms-`/`me-`/`ps-`/`pe-`/`inset-s-`/`inset-e-`, v4.2 block-axis utilities.
- https://dev.to/mamareza/rtl-in-practice-css-logical-properties-bidi-text-icons-numerals-and-a-testing-checklist-5hl7 — dev.to — logical-properties map, `rtl:`/`ltr:` variants, physical classes as review red flags.
- https://copyprogramming.com/howto/css-how-to-use-tailwind-with-svelte — CopyProgramming — SvelteKit + Tailwind v4: `tailwindcss()` before `sveltekit()`, CSS import in `+layout.svelte`. Low-authority source; corroborated by the next item only.
- https://github.com/302ai/302-AI-Studio/blob/HEAD/.agents/skills/sveltekit-svelte5-tailwind-skill/README.md — 302.AI Studio skill docs — same plugin-order and CSS-import claims; CSS-not-loading/HMR failure modes.

**SEO / structured data / sitemap / hreflang**
- https://support.google.com/webmasters/answer/189077 — Google Search Central — hreflang: every version lists itself + all others, reciprocal, fully-qualified URLs, three methods (HTML/headers/sitemap), ISO 639-1 + ISO 3166-1 codes.
- https://hirebalzac.ai/google-hreflang-rules/ — Balzac (verified against Google's page 2026-10-07) — hreflang rules restated; three methods equivalent; `x-default`.
- https://developers.google.com/search/docs/appearance/structured-data/product?hl — Google Search Central — Product intro: product snippets vs merchant listings; Organization policy markup recommendation for e-commerce.
- https://developers.google.com/search/docs/appearance/structured-data/product-snippet — Google Search Central — rich results only for single-product pages; focus markup on product pages, not listing pages.
- https://developers.google.com/search/docs/appearance/structured-data/organization?utm_source=podcasts&utm_medium=unpaidsoc&utm_campaign=CDR_efrainpedroza_sotr_ShoppingMarkup_090324&utm_content=description — Google Search Central — Organization: no required properties; home-page placement; most specific subtype.
- https://developers.google.com/search/docs/guides/sd-policies — Google Search Central — JSON-LD recommended; don't block structured-data pages; specify all required properties.
- https://www.greadme.com/blog/schemas/what-is-product-schema-complete-guide — Greadme — merchant-listing requirements (`name`/`image`/`offers`, price > 0, `priceCurrency`, availability); price format (plain number string, no symbols/commas).
- https://patrickstox.com/technical-seo/on-page/structured-data/commerce/product-schema/ — Patrick Stox (verified 2026-07-16) — snippet vs merchant-listing property tables (`AggregateOffer`/price-0 rules).
- https://developers.google.com/search/docs/advanced/sitemaps/build-sitemap?ref=library.linkbot.com&visit_id=639081215835925114-3700032553&rd=1 — Google Search Central — sitemap formats/limits (50 MB / 50,000 URLs), UTF-8, `Sitemap:` line in robots.txt, submission as a hint only.

**Accessibility / images / currency**
- https://w3c.github.io/wcag/techniques/html/H101 — W3C WAI techniques — H101 semantic HTML landmarks (`header`/`nav`/`main`/`section` with name/`aside`/`footer`), no redundant roles needed.
- https://www.calamnet.com/guides/deepdive-landmarks/ — Calamnet (2026-10-09) — eight landmark roles; WCAG 1.3.1 / 2.4.1 relationship; native elements preferred.
- https://freetoolbank.com/guides/wcag-2-2-checklist/ — FreeToolBank — WCAG 2.2 AA: 4.5:1 / 3:1 contrast, 24×24 targets (2.5.8), 44×44 is AAA, focus visible / not obscured.
- https://keronlewis.dev/blog/wcag-accessibility-checklist — Keron Lewis — WCAG 2.2 developer checklist; 2.5.8 24px, 2.5.5 AAA 44px, 2.4.11 focus not obscured.
- https://dev.to/agentkit/why-your-added-to-cart-toast-notification-never-reaches-screen-reader-users-and-the-two-line-fix-58en — dev.to — `aria-live="polite"` vs `assertive` for cart toasts; region-timing gotcha.
- https://blog.a11yfix.dev/checklist/opencart/ — a11yfix — cart status region present on load (`role="status"` + `aria-live="polite"`), specific message text.
- https://quietramp.com/notes/accessible-loading-states-spinners-skeletons-ecommerce.html — Quietramp — WCAG 4.1.3 status messages; `aria-busy` announces nothing alone; button accessible-name preservation.
- https://veduis.com/blog/accessible-form-error-messaging-wcag/ — Veduis — 3.3.1/3.3.3/4.1.3; `aria-describedby` + `aria-invalid`; blur-then-input timing; error-summary + focus pattern.
- https://accessibility.build/guides/accessible-forms — accessibility.build (July 2026) — accessible forms: labels, validation lifecycle, error summary with `role="alert"` + `tabindex="-1"` focus move.
- https://web.dev/learn/design/responsive-images/ — web.dev — `width`/`height` hints, `loading` lazy/eager, `fetchpriority="high"`, `srcset` + `sizes`, `decoding="async"`.
- https://www.devtidy.com/blog/image-optimization-web/ — Devtidy (2026-06-23) — LCP/CLS image rules: never lazy-load the hero; one high-priority image.
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat?retiredLocale=de — MDN — `Intl.NumberFormat`: `style: 'currency'` requires `currency` (ISO 4217); `currencyDisplay` options (`code`/`symbol`/`narrowSymbol`/`name`).
- https://www.localization.guide/country/dz — localization.guide (updated 13 Nov 2026) — Algeria/DZD formatting; use ISO code for storage/interchange.
- https://all-currency-converter.codeurdivoire.com/currencies/dzd — All Currency Converter — DZD symbol `DA` (`د.ج`), ISO 4217 code DZD, Bank of Algeria.
- https://taxsummaries.pwc.com/glossary/currency-codes — PwC Tax Summaries — Algeria: DZD, dinar (ISO 4217).

**Gap-filling round (checked 2026-11-16)**
- https://crocoblock.com/blog/important-ecommerce-website-pages/ — Crocoblock — 13-page e-commerce checklist: Home, Product, Contact, Cart, Checkout, Thank You, 404, FAQ, Testimonials, Search Results, Privacy & Terms, Account, Blog.
- https://www.komalnakrani.com/blog/astro-ecommerce-page-checklist/ — Komal Nakrani — core e-commerce page set including collection pages, order confirmation, and shipping/returns policies.
- https://www.trywebtec.com/resources/learn/ecommerce/product-page-optimization/ — TryWebTec — product page optimisation: buy box, delivery/returns near the button, reviews, stock, total cost.
- https://www.getglued.co/insights/product-page-optimization — GetGlued — product page optimisation: buy box, delivery/returns near the button, reviews, stock, total cost.
- https://www.techcelerant.com/blog/product-page-best-practices — TechCelerant — product page best practices: breadcrumbs, rating summary linking to reviews, delivery estimates.
- https://embed.ecomposer.io/blogs/shopify-knowledge/shopify-homepage-design-a-guide-to-high-conversions-2026 — EComposer — homepage design for high conversions: hero, collections, best sellers/new arrivals, brand story, social proof, email capture, trust signals, countdown promos.
- https://www.obsessai.com/blog/shopify-homepage-design — Obsess AI — homepage design: hero, collections, best sellers/new arrivals, brand story, social proof, email capture, trust signals, countdown promos.
- https://www.suyashparnerkar.in/top-5-high-converting-sections-every-shopify-homepage-needs-in-2026/ — Suyash Parnerkar — high-converting homepage sections: hero, collections, best sellers/new arrivals, brand story, social proof, email capture, trust signals, countdown promos.
- https://www.mediasearchgroup.com/blog/must-have-features-ecommerce-websites/ — Media Search Group — must-have e-commerce features: wishlist, compare, quick view, recently viewed, breadcrumbs, search autocomplete, order tracking, structured data.
- https://www.aprodence.com/how-to-design-great-ux-for-an-e-commerce-app-the-complete-2026-guide/ — Aprodence — e-commerce UX guide: wishlist, compare, quick view, recently viewed, breadcrumbs, search autocomplete, order tracking, structured data.
- https://www.starluxe.tech/tools/ecommerce-cro-checklist — StarLuxe — e-commerce CRO checklist: wishlist, compare, quick view, recently viewed, breadcrumbs, search autocomplete, order tracking, structured data.

## 3. Conflicts, uncertainties, and what the builder must verify

1. **Paraglide "missing key" claims conflict — resolved as above.** One blog says TypeScript catches a key forgotten in the second locale file; a project doc says the compiler silently falls back to the base locale. The consistent reading: call-site typos and keys missing from the *base* locale fail; translations missing from a *non-base* locale do not. Hence the custom-dictionary recommendation and, if Paraglide is used, the mandatory `@inlang/cli check` gate.
2. **Three different Paraglide/SvelteKit patterns circulate** (middleware+`reroute` SSR pattern on the official SvelteKit page; `[locale]`+`setLocale` SSG pattern on the workers.dev preview; hydration-swap behaviour reported on a real static site). They are different deployment modes, not interchangeable options. For this fully static build only the SSG pattern applies — and its source is a preview/mirror domain, so the builder should re-check it against the canonical Paraglide docs at build time, and in all cases verify built HTML per locale.
3. **`<html lang>` mechanism for Kit 3 + adapter-static 4.0.1 was not directly verified.** Sources show the `%lang%` + `transformPageChunk` hooks pattern (SSR docs) and layout-level language setting. Whether hooks transforms apply per-locale during prerendering in this exact stack was not established by the sources retrieved. **Acceptance test (non-negotiable):** after build, grep `build/en/**/*.html` for `<html lang="en"` and `build/fr/**/*.html` for `<html lang="fr"`, and grep each locale's HTML for that locale's strings. Do not ship on the assumption that hydration or hooks fixed it.
4. **Tailwind official docs not directly retrieved.** The `@tailwindcss/vite` setup, `@theme`, and dark-mode claims rest on multiple consistent secondary sources quoting tailwindcss.com, but no `tailwindcss.com/docs/...` page was returned as a full-URL result or opened, so none is cited. The Vite-plugin-order claim (`tailwindcss()` before `sveltekit()`) rests on two secondary sources only — cheap to verify (CSS either emits or it doesn't). No Vite-8-specific Tailwind issue was found; the brief's pinned versions were **not** re-verified against the npm registry in this research.
5. **W3C WCAG 2.2 normative text not directly retrieved.** The 4.5:1 / 3:1 / 24px / 44px-AAA figures are consistent across four independent checklists quoting W3C, plus the W3C H101 technique page retrieved directly — high confidence, but the normative pages themselves were not opened.
6. **Google's dedicated merchant-listing page was not directly retrieved.** Merchant-listing property requirements are cited from Google's Product intro/snippet/Organization pages plus two detailed secondary summaries that agree. Re-check against Google's merchant-listing doc before finalizing JSON-LD if the builder wants primary-source confirmation.
7. **`Intl.NumberFormat` output for DZD in `en`/`fr` was not verified.** Whether it renders `DA`, `DZD`, or `د.ج` depends on ICU data and was not established. Builder must run the formatter in Node and in a browser for both locales before choosing between the `currencyDisplay` options and the `formatToParts()` + literal ` DA` approach. JSON-LD `priceCurrency: "DZD"` is unaffected by this.
8. **Root `/` behaviour and host redirect capability are undecided** (see §1(i)). No authoritative static-root pattern was retrieved; this needs a product/host decision, not a guess.
9. **Dark mode and RTL are out of scope for the brief** (light reference, LTR-only locales). The recommendations above are deliberately minimal (light-only; logical utilities by default). Adding either feature later is a separate decision.
10. **Paraglide version drift:** v3.0 shipped 2026-11-03, twelve days before this check date. Any Paraglide-based build must pin an exact version and verify API names (`setLocale`, `localizeHref`, `paraglideVitePlugin` options) against that version's docs — v2 examples may not apply.

**Bottom line for the coordinator:** build with typed custom dictionaries under required `[lang]/` routes + `entries()`; Tailwind v4 via `@tailwindcss/vite` + `@theme` with no JS config; 44px touch targets, 4.5:1 contrast, persistent polite cart live region, `aria-describedby` form errors; Product JSON-LD with `priceCurrency: "DZD"`; hreflang + sitemap from one route table; and gate the build on the built-HTML locale/lang greps and the `DA` currency-format check in §3.
---

## Builder verification log (2026-11-15)

Checks the builder ran after applying the research, closing the report's
open verification items where the build itself could settle them:

- Built-HTML locale greps: `<html lang="en"` / `<html lang="fr"` correct;
  French strings present in `build/fr*.html`, English in `build/en*.html`;
  zero matches for the reference design's original brand name
  (case-insensitive) in built HTML/XML/TXT.
- Currency format verified in Node and in the browser (screenshots):
  `999.00 DA` (en), `999,00 DA` (fr); `1,299.00 DA` (en),
  `1 299,00 DA` (fr, narrow no-break space grouping).
- Tailwind plugin order verified by the build emitting CSS and the site
  rendering styled in QA screenshots.
- Contrast ratios computed with a WCAG luminance script (see above).
- The `satisfies`-vs-annotation note: this build types `fr` with an
  explicit `Dictionary` annotation rather than `satisfies`, which fails
  on missing AND extra keys alike under `svelte-check`.
- Not re-verified: the pinned versions against the npm registry during
  this research pass (they were cross-verified separately when the stack
  was locked); Google's dedicated merchant-listing page (requirements
  taken from Google's Product intro/snippet/Organization pages plus two
  agreeing secondary summaries); W3C normative WCAG text (figures
  consistent across four checklists plus the retrieved H101 page).
