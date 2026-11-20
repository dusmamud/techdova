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

### Polish round (2026-11-16)

Sources for the client-quality polish round (foundation worker): mobile
listing density, the motion budget, and the new-page checklist. Grouped as
supplied by the coordinator; each line says what it supports.

**Mobile UX**
- https://webdeveasy.com/mobile-ecommerce-design/ — 2-col grid sweet spot, primary actions low + sticky, 44px targets, forms 1-col.
- https://govisibi.ai/insights/mobile-product-grid-density/ — 1-col forces endless scrolling; 2-col shows ~2x products.
- https://www.brewmyapp.io/blog/woocommerce-mobile-app-design-best-practices — 2-col default, name max 2 lines, add-to-cart from grid.
- https://github.com/medusajs/medusa-agent-skills/blob/HEAD/plugins/ecommerce-storefront/skills/storefront-best-practices/reference/layouts/product-listing.md — mobile 2-col, drawer filters, sticky filter/sort bar with active count.
- https://rovela.ai/blog/clothing-collection-page-design — 2-col mobile, 3-4 desktop, sticky filter bar, 12-24px gutters.
- https://prateeksha.com/blog/crafting-the-perfect-search-a-guide-to-results-page-ui-ux-design — bottom-sheet filters, active chips, sticky summary.

**Motion**
- https://www.monotonomo.com/journal/motion-budget-fast-sites-2026/ — every animation needs a job; ≤500ms; scroll reveals fire once; reduced-motion mandatory.
- https://github.com/nemolabsdev/conversion-craft/blob/HEAD/curriculum/research/motion-performance.md — transform+opacity only, M3 duration scale 50-500ms.
- https://www.marcfriedmanportfolio.com/blog/microinteractions-motion-3d-2026/ — feedback 100-300ms, pause control for >5s autoplay, test on real phone widths.
- https://test77.luminarybrands.co.uk/blog/website-design-trends/ — purposeful micro-interactions, progressive disclosure.

**Pages**
- https://www.komalnakrani.com/blog/astro-ecommerce-page-checklist/ — core 13 + growth: gift cards, store locator, account addresses/payments.
- https://crocoblock.com/blog/important-ecommerce-website-pages/ — 13-page checklist.
- https://rdigital.co/blog/26-must-have-pages-every-eshop-shall-have/ — store addresses, help.
- https://dokan.co/blog/4672/ecommerce-website-pages-list/ — store locator.

### Elevation round (2026-11-17)

Sources for the UI/UX elevation round (foundation worker): 2026 e-commerce
UI trends, page checklists, product-page conversion practice, and reference
implementations. Grouped as supplied by the coordinator; each line says what
it supports. Some URLs repeat earlier rounds — they were re-supplied for
this round and are listed again as checked for it.

**E-commerce UI trends 2026**
- https://commercev3.com/resources/blog/ecommerce-ui-trends-visual-design-patterns-guide — CommerceV3 — e-commerce UI trends and visual design patterns for the elevation round.
- https://www.apponix.com/blog/explore-the-latestui-ux-design-trends-in-2026 — Apponix — latest UI/UX design trends in 2026.
- https://papathemes.com/blog/ecommerce-design-trends-2026-bigcommerce-store/ — PapaThemes — e-commerce design trends for 2026 storefronts.
- https://www.enerpize.com/hub/future-of-ecommerce — Enerpize — the future of e-commerce: where storefront UX is heading.
- https://www.designstudiouiux.com/blog/ecommerce-web-design-trends/ — Design Studio UI/UX — e-commerce web design trends.
- https://hireecom.com/blog/top-ecommerce-website-design-trends-for-2026/ — HireEcom — top e-commerce website design trends for 2026.

**Page checklists and must-have features**
- https://crocoblock.com/blog/important-ecommerce-website-pages/ — Crocoblock — 13-page e-commerce checklist, re-checked for the elevation round.
- https://www.komalnakrani.com/blog/astro-ecommerce-page-checklist/ — Komal Nakrani — core e-commerce page set, re-checked for the elevation round.
- https://www.mediasearchgroup.com/blog/must-have-features-ecommerce-websites/ — Media Search Group — must-have e-commerce features, re-checked for the elevation round.
- https://emergent.sh/learn/ecommerce-website-features — Emergent — e-commerce website features checklist.

**Product-page conversion**
- https://github.com/the-up/hydrogen-ecommerce-ux/blob/HEAD/references/product-page.md — hydrogen-ecommerce-ux (GitHub, the-up) — product-page UX reference: galleries, variants, buy box.
- https://www.techcelerant.com/blog/product-page-best-practices — TechCelerant — product page best practices, re-checked for the elevation round.
- https://www.ontapgroup.com/blog/shopify-product-page-optimization — OnTap Group — product-page optimisation practice.
- https://github.com/nemolabsdev/conversion-craft/blob/HEAD/skills/product-page-cro/SKILL.md — conversion-craft (GitHub, Nemo Labs) — product-page CRO skill: conversion-focused page structure.
- https://www.getglued.co/insights/product-page-optimization — GetGlued — product page optimisation, re-checked for the elevation round.

**Reference implementations and components**
- https://codecanyon.net/item/shopo-multivendor-ecommerce-flutter-app/39965496?s_rank=20 — CodeCanyon (ShopO listing) — reference e-commerce app UI patterns.
- https://themeforest.net/item/minimog-the-high-converting-ecommerce-wordpress-theme/36947163 — ThemeForest (Minimog listing) — high-converting e-commerce theme patterns.
- https://plugg.is/en/add-ons/mega-menu — Plugg — mega-menu add-on: navigation pattern reference.
- https://wrapmarket.com/item/shopverse-responsive-multipurpose-ecommerce-html-template-WT7R65G69 — WrapMarket (Shopverse listing) — responsive multipurpose e-commerce template patterns.

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

---

## Fix round (2026-11-18) — audit-fix research sources

Research gathered for the 2026-11-18 audit-fix round (audit report:
`~/workspace/goals/techdova-tech-e-commerce-website/files/techdova-audit-report-2026-11-18.md`).
Each pattern was cross-verified against at least two sources; authoritative
sources (Google Search Central, web.dev, MDN, schema.org, Cloudflare) are
listed first per group. Secondary sources were used only where they agreed
with, or quoted, the authoritative docs.

### Responsive images (Scope A — P-3, S-7)

- https://web.dev/learn/design/responsive-images/
- https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture
- https://developers.google.com/search/docs/appearance/google-images

### Structured data (Scope B — R-1, R-2, R-4, R-5, R-6)

- https://developers.google.com/search/docs/appearance/structured-data/product-variants
- https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
- https://developers.google.com/search/docs/appearance/structured-data/search-gallery
- https://developers.google.com/search/docs/appearance/establish-business-details
- https://patrickstox.com/technical-seo/on-page/structured-data/commerce/offershippingdetails-schema/
- https://patrickstox.com/technical-seo/on-page/structured-data/commerce/productgroup-schema/
- https://xeorank.com/blog/product-schema-markup
- https://www.creahive.com/guides/product-structured-data/
- https://www.andromed.ai/ecommerce-structured-data
- https://www.garrettdigital.com/blog/product-page-seo/
- https://www.countrydevs.com/tools/schema-markup-generator
- https://www.valtariq.com/blog/structured-data-exporter-websites/
- https://tonaily.com/guides/schema-markup-guide/
- https://www.proof48.com/en/blog/schema-markup-types-for-small-business
- https://anobee.com/seo/structured-data-guide-for-bloggers
- https://adamarant.com/en/blog/the-7-schema-markup-types-every-blog-needs-in-2026
- https://www.contentify.ai/blog/structured-data-beyond-faq/
- https://seeberger-solutions.com/faq-rich-results-gone-structured-data-2026/

### Head / SEO / sitemap / robots (Scope C — P-1, P-2, S-1, S-4, S-5, S-6, S-9)

- https://developers.google.com/search/docs/crawling-indexing/block-indexing
- https://support.google.com/webmasters/answer/35624
- https://github.com/GoogleChrome/lighthouse/blob/main/core/audits/seo/link-text.js
- https://developer.chrome.com/docs/lighthouse/seo/link-text/
- https://github.com/GoogleChrome/lighthouse/issues/14845
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload
- https://web.developers.google.cn/learn/performance/resource-hints
- https://www.creahive.com/guides/noindex-tag/
- https://www.creahive.com/guides/title-tags/
- https://www.a11yflow.dev/blog/read-more-link-accessibility
- https://kathypcarr.com/articles/xml-sitemaps-what-google-says-you-need
- https://claude-seo.md/blog/xml-sitemap-guide
- https://www.guangsuan.com/en/post/sitemap-update-frequency-settings-guide-blog-news-site/
- https://www.ogscope.pk/guides/open-graph-tags
- https://myog.social/articles/og-meta-tags-guide
- https://www.knowledgegraphnavigator.com/languages/open-graph-protocol/
- https://audra.greta.sh/fix/heading-order/
- https://freebiefy.com/tools/heading-structure-checker/

### Headers + manifest (Scope D — S-2, S-3, S-8)

- https://developers.cloudflare.com/pages/configuration/headers/
- https://developer.mozilla.org/en/docs/Web/Security/HTTP_Strict_Transport_Security
- https://web.dev/learn/pwa/web-app-manifest
- https://test.developer.allizom.org/en-US/docs/Web/Progressive_web_apps/How_to/Define_app_icons
- https://www.openpwa.net/reference/manifest/screenshots/
- https://www.ssg-production.com/production-ready-deployment-cicd-workflows/cloudflare-pages-edge-caching-setup/
- https://patrickstox.com/technical-seo/https/hsts/
- https://pewterkit.com/guides/hsts-header-missing
- https://stacksiren.com/blog/x-frame-options-vs-frame-ancestors
- https://www.kumaraman.in/blog/web-security-headers-complete-guide
- https://scaplet.com/glossary/x-frame-options
- https://www.securityheaders.tools/blog/permissions-policy-header
- https://centralcsp.com/en/blog/permissions-policy-explained
- https://www.acuityscan.com/blog/permissions-policy-referrer-policy-what-your-site-gives-away
- https://built2winweb.com/blog/security-headers-small-business/
- https://angelforce.eu/blog/security-headers-that-matter/
- https://www.softwaresecurity.com/domains/appsec/browser-security/security-headers/
- https://dropto.run/blog/old-version-after-deploy
- https://lud.icro.us/cache-control-for-a-content-site-explained-by-what-breaks/
- https://www.globalwebsitespeedtest.com/blog/browser-caching
- https://tips.ojapp.app/en/pwa-manifest-screenshots-install-ui-2/
- https://whatpwacando.today/installation/

## Elevation round 2 — research (2026-11-20)

Research gathered for the 2026-11-20 elevation round 2 (research report:
`~/workspace/goals/techdova-tech-e-commerce-website/hidden_files/elevation2/research-findings.md`).
Each claim was cross-verified against at least two sources where possible;
authoritative sources (Baymard, NN/g, motion.dev, SvelteKit docs, npm
registry) are listed first per group. Registry versions below were verified
directly against `registry.npmjs.org` on 2026-11-20, not copied from blog
posts.

### Premium e-commerce UX checklists (PDP, checkout, navigation, search, trust)

- https://baymard.com/research-articles/current-state-ecommerce-product-page-ux — Baymard Institute (updated 2026-03-18) — 10 PDP best practices from 30,000+ usability scores: button selectors, in-scale images, human-model images, guest wishlist, price per unit, total order cost near buy box, returns link on PDP, gifting options, staff replies to negative reviews, cross-review image navigation.
- https://baymard.com/research-articles/current-state-of-checkout-ux — Baymard Institute (2026) — 10 checkout best practices from 44,000+ usability scores: account creation saved for confirmation step, collapse completed steps into summaries, delivery date not speed, cutoff-time countdown, all fulfillment options in shipping selector.
- https://baymard.com/blog/ux-audit-checklist-template — Baymard Institute — full-journey UX audit checklist (homepage/navigation, product lists, product pages, checkout, mobile pass).
- https://www.nngroup.com/reports/mobile-website-and-application-usability/?lm=infinite-scrolling-when&pt=youtubevideo — Nielsen Norman Group — 713-page mobile usability report, 374 guidelines (5th edition: PWA, skeleton screens, passkeys, OTP/minimal login, bottom navigation, infinite lists).
- https://websitesdesigner.com/insights/checkout-page-design/ — Websites Designer — Baymard-based checkout summary: guest checkout prominence, full cost before checkout, delivery date, 70.22% average cart abandonment.
- https://www.fixreports.com/blog/product-page-checklist-what-stops-shoppers — FixReports — PDP checklist restating Baymard 2026 figures (67% no total-cost estimate, 44% no returns link on PDP).

### Mobile-first responsive (thumb zones, sticky CTAs, touch targets, PDP order)

- https://www.locallylost.com/guides/mobile-ecommerce-ux-2026/ — Locally Lost (2026-04-19) — mobile = 66% of e-commerce revenue 2026, mobile conversion ~half of desktop; thumb-zone bottom nav (48px targets), sticky add-to-cart with price, mobile PDP scroll order, single-page checkout, 16px inputs (no iOS auto-zoom).
- https://aestheticweb.eu/journal/shopify-mobile-product-page-checklist/ — Aesthetic Web (2026-09-15) — mobile PDP checklist: image/name/price/variant in first screen, ATC one short scroll away, sticky ATC only after main button scrolls out, 48×48px targets, delivery/returns next to button.
- https://github.com/eneryleen/ai-web-design-codex/blob/HEAD/03-site-types/ecommerce-ux.md — ai-web-design-codex (GitHub) — Baymard-grounded e-commerce UX: tap targets ≥44×44px (Apple HIG) / 48×48dp (Material 3) / 24×24px WCAG 2.5.8 minimum; bottom tab nav beats hamburger (20–30% discovery loss); sticky bottom CTA above safe-area inset; keyboard covers 40–50% of screen.
- https://marketinglib.com/thumb-zone-design-optimizing-your-shopify-mobile-store-for-how-people-actually-hold-their-phones/ — MarketingLib — thumb-zone map (comfortable = lower 60%, dead zone = top 35%), sticky-footer CTA as the single biggest mobile fix.
- https://webdesignerindia.medium.com/mobile-first-ux-patterns-conversion-optimization-ecaf0b2689ae — Medium / WebDesignerIndia — thumb-zone optimization, gesture controls (pinch-to-zoom), progressive disclosure; cites NN/g + Baymard.
- https://olympianthemes.com/website-navigation-best-practices/ — Olympian Themes (2026-09-27) — navigation synthesis from Baymard, NN/g, W3C/WAI, Material Design: visible search (~30 chars), task shortcuts, mobile top-level category surfacing.

### Search UX (autocomplete, typo tolerance, facets, zero results)

- https://m.tengence.com/en/blog/article/site-search-ux-optimization — Tengence — search as closed loop: autocomplete after 2–3 chars in 100–250ms, typo correction + synonyms push zero-result rate to single digits, live facet counts, zero-result recovery; Baymard: ~56% of sites fail search needs.
- https://www.sparq.ai/blogs/search-bar-ui — Sparq (2026) — 12 search-bar rules: visual suggestions with images/prices, typo tolerance recovers 10–15% of failed searches, zero-result page must offer a path forward, search-type ladder (keyword → autocomplete → faceted → typo-tolerant → AI).
- https://www.xtalsearch.com/blog/ecommerce-site-search-best-practices — XTAL Search — autocomplete on 80% of sites but only 19% get details right (Baymard); synonym dictionary, dynamic facet counts, mobile slide-up filter drawer with 44px targets.
- https://ux.detroit3d.com/patterns/search-filtering.html — UX Encyclopedia — Baymard search findings: 3–5 reformulations before abandonment, keep query in box on results page, ARIA combobox keyboard pattern, zero-result as design surface.

### Motion / animation best practice 2026

- https://adamarant.com/en/blog/functional-ui-animation-in-2026-the-checklist-before-it-ships — Adamarant (2026) — functional animation checklist: micro 100–200ms, component 200–300ms, page 300–500ms; animate opacity + transform only; interruptible animations; prefers-reduced-motion at root + JS guard.
- https://github.com/nemolabsdev/conversion-craft/blob/HEAD/curriculum/research/motion-performance.md — conversion-craft (GitHub, Nemo Labs) — motion-performance rules: transform/opacity only (web.dev), Material Design 3 duration scale 50–500ms, never exceed ~500ms per step on a sales page; CSS `animation-timeline: scroll()` case studies.
- https://ww38.theuxshop.com/patterns/micro-interactions-feedback-language/ — The UX Shop (updated 2026-04-12) — micro-interactions: 100–300ms, match scale to action, real-physics easing, reduced-motion variants (essential → instant-appear, decorative → suppressed).
- https://dcs.colorado.gov/ids/digital-guidelines/design-tokens/motion-interaction — Colorado DCS — motion must be purposeful, subtle, consistent, controllable, reduced-motion aware; no flash >3×/second.

### Motion (motion.dev) + Svelte — compatibility (verified first, primary sources)

- https://motion.dev/docs/svelte — Motion official docs (published 2026-10-09) — official Svelte 5 guide: `npm install motion`; `{@attach}` needs Svelte 5.29+, same functions work as `use:` actions on earlier Svelte 5; `hover`/`press`/`animate`/`scroll`/`inView`/`animateView`/`animateLayout` patterns; `flushSync` required for `animateView`/`animateLayout`; "Motion doesn't have an official Svelte component API… The JavaScript API above covers gestures, scroll, layout and view animations"; community declarative option `@humanspeak/svelte-motion` named.
- https://www.npmjs.com/package/motion — npm registry (verified via registry API 2026-11-20) — `motion` 14.14.0 (published 2026-11-13), MIT; dependencies `tslib` + `framer-motion` 14.14.0 (thin wrapper re-export); peerDependencies `react`/`react-dom`/`remix` ALL marked `optional: true` in `peerDependenciesMeta` (vanilla install pulls no React); `sideEffects: false`; exports `.` (vanilla JS), `./mini`, `./react`, `./react-m`, `./react-mini`.
- https://www.npmjs.com/package/motion-dom — npm registry (verified 2026-11-20) — `motion-dom` 14.14.0, MIT, sole dependency `motion-utils`, no peer dependencies (the pure vanilla engine underneath `motion`).
- https://www.npmjs.com/package/@humanspeak/svelte-motion — npm registry + https://motion.svelte.page/ — `@humanspeak/svelte-motion` 2.12.0, MIT; dependencies `motion` 14.12.0 + `motion-dom` 14.12.0; peerDependency `svelte ^5.0.0`; declarative `motion.<tag>` components, AnimatePresence, gestures, FLIP layout, springs, "SSR-safe by default" (vendor claim).
- https://socket.dev/npm/package/@humanspeak/svelte-motion — Socket — svelte-motion capability table (initial/animate/transition, variants, whileHover/whileTap/whileFocus/whileInView, drag, AnimatePresence, MotionConfig reducedMotion); known gaps (no Framer-style whileInView viewport options yet); 676 unit + 290 E2E tests claimed.
- https://motion.svelte.page/blog/migrating-from-svelte-motion — Svelte Motion docs (2026-08-23) — unscoped `svelte-motion` dormant (no release since Feb 2024); migrate to `@humanspeak/svelte-motion` for Svelte 5 runes + SSR-safe SvelteKit support.
- https://motion.svelte.page/compare/framer-motion — Svelte Motion compare — "Framer Motion is React-only. Svelte Motion is its Svelte 5 counterpart" (declarative component API sense; the vanilla `motion` JS API is framework-agnostic — see motion.dev/docs/svelte).
- https://motion.svelte.page/compare/gsap — Svelte Motion compare — declarative component library vs GSAP timeline engine; "the two can coexist: Svelte Motion for UI animation, GSAP when you need its timeline engine."
- https://www.hontran.dev/blog/gsap-vs-framer-motion — Hon Tran (2026) — Motion vs GSAP: full `motion` component ~34KB gzip, LazyMotion + `m` ~4.6KB initial (React-only pattern); GSAP core ~23KB gzip, ScrollTrigger ~+10KB; "Motion's ergonomic API is React-specific (vanilla `animate()` exists but lacks the component/gesture/layout ergonomics)".
- https://tessl.io/registry/skills/github/secondsky/claude-skills/motion — Tessl — Motion 12.43.0 bundle figures: full component ~34KB, LazyMotion + `m` ~4.6KB, useAnimate mini 2.3KB (React figures; vanilla `motion/mini` ~2.6KB per Motion docs pattern).
- https://ui.soralabs.studio/docs/performance — Sora UI — Motion bundle table: buttons/links/card hovers = Tailwind transitions (0KB Motion); imperative event animation = useAnimate mini ~2.3KB.

### View Transitions API + SvelteKit (zero-dependency page transitions)

- https://svelte.dev/docs/kit/faq — SvelteKit official FAQ — "How do I use the view transitions API? … you can call `document.startViewTransition` in `onNavigate`"; official code pattern quoted in research report.
- https://blog.teliaz.com/2026/08/10/view-transitions-api-native-page-animations-without-a-javascript-framework/ — Teliaz (2026-08-10) — same-document Baseline; cross-document `@view-transition { navigation: auto; }` in Chrome 126+ / Safari 18.2+, Firefox in progress; support matrix table.
- https://blogs.abhipanseriya.dev/blog/view-transitions-went-cross-browser-the-spa-lost-its-best-excuse — Abhipanseriya — same-document view transitions became Baseline 2026-10-14 (Chrome, Safari, Firefox all shipped); cross-document in Chrome 126 + Safari 18.2.
- https://codexskills.dev/skills/frontend/view-transitions/ — Codex Skills (2026-11-06) — support model late 2026: same-document yes everywhere; cross-document Chrome 126+/Safari 18.2+/Firefox not yet; reduced-motion fallback `@media (prefers-reduced-motion: reduce) { @view-transition { navigation: none; } }`.

### GSAP / Lenis with SvelteKit (alternatives)

- https://github.com/yzavyas/claude-1337/blob/HEAD/plugins/experience-1337/skills/build-experience/SKILL.md — build-experience skill — Svelte-first animation decision tree: simple enter/exit → Svelte transitions; state values → spring()/tweened(); timeline → GSAP; complex scrub/pin → GSAP ScrollTrigger + Lenis; GSAP ~23KB core, Lenis ~3KB; GSAP cleanup on unmount mandatory; SSR guards; prefers-reduced-motion.
- https://github.com/farid22022/nexacart/blob/HEAD/.claude/skills/frontend/SKILL.md — nexacart frontend skill — Svelte/SvelteKit: Three.js + GSAP in `onMount` with SSR guard; GSAP 3 + ScrollTrigger + Lenis pairing.
- https://www.npmjs.com/package/gsap — npm registry (verified 2026-11-20) — `gsap` 3.15.1, no dependencies, no peer dependencies, standard (free) license.
- https://www.npmjs.com/package/lenis — npm registry (verified 2026-11-20) — `lenis` 1.3.27, MIT, no dependencies; peerDependencies `vue`/`react`/`@nuxt/kit` all marked `optional: true` (vanilla install clean).

### Leading-store features (missing-page inventory)

- https://grabon.com/blog/guide-on-bestbuy-products-services/ — Grabon — Best Buy services: Geek Squad setup/repair (24/7, appointments), expert shopping (virtual/in-store/in-home), AppleCare+ via membership, protection plans.
- https://www.bestbuy.com/site/best-buy-trade-in/trade-in-offers/pcmcat1774297472214.c?id — Best Buy — trade-in flow (estimate → backup/reset → in-store/mail-in → gift card), trade-in promotions, recycling ("We take all kinds of tech for recycling"), 12-month financing, price-match note.
- https://thekrazycouponlady.com/tips/store-hacks/best-buy-hacks-save-on-electronics — Krazy Coupon Lady — student discount (.edu), trade-in, refurbished, Best Buy Outlet (open-box up to 60% off), floor-model discount, price match.
- https://thegadgetbuyer.com/buy-from-best-buy-vs-apple-store-new-macbook-pro/ — The Gadget Buyer — Apple Education Store pricing (students/teachers), Best Buy price-match guarantee naming Apple as qualified competitor, membership tiers, 60-day member returns.
- https://gfxsaga.com/blogs/content-marketing/ecommerce-content-marketing-examples/ — GfxSaga (checked 2026-10-20 and 2026-11-16) — REI Expert Advice hub (buying guides), Patagonia care/repair guides, Sephora Shade Finder quiz, Warby Parker virtual try-on + style quiz, IKEA planners; formats: buying guides, gift guides, quizzes/product finders.
- https://triggerbee.com/blog/discount-strategies — Triggerbee — gift guides (SEO + conversion), clearance/outlet rebranding ("Outlet" as ongoing clearance without brand damage), flash sales, pre-launch/waitlist.
- https://outgrow.co/blog/shopify-quiz-funnel-guide — Outgrow (2026) — product recommendation quizzes: 88% of shoppers want personalized recommendations (Epsilon 2024); quiz conversion 25–40% vs ~2.86% site average (vendor-reported, directional); ideal length 6–10 questions; results = 3–5 matches + why + CTAs.

### Other packages checked (registry-verified 2026-11-20)

- https://www.npmjs.com/package/embla-carousel-svelte — npm registry — `embla-carousel-svelte` 8.6.0, peer `svelte ^3.49.0 || ^4.0.0 || ^5.0.0`; deps `embla-carousel` 8.6.0.
- https://www.npmjs.com/package/bits-ui — npm registry — `bits-ui` 2.21.0, MIT; peer `svelte ^5.33.0` (site has 5.57.3 ✓); deps `runed`, `tabbable`, `@floating-ui/dom`.
- https://www.npmjs.com/package/svelte-sonner — npm registry — `svelte-sonner` 1.2.3, peer `svelte ^5.0.0`, zero dependencies.
- https://www.npmjs.com/package/@neoconfetti/svelte — npm registry — `@neoconfetti/svelte` 2.2.2, peer `svelte ^3 || ^4 || ^5`.
