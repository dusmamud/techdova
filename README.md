# TechDova

A demo tech e-commerce webapp (English + French), built as a fully static
site: no backend, no database, no external requests at runtime. All content
is demo data; the cart, checkout, contact form and newsletter are local-only
and send nothing anywhere.

Brand: **TechDova** ("Your tech universe" / "Votre univers technologique").
Prices are stored as numbers in DZD and displayed with a `DA` suffix, as in
the reference design.

## Locked stack

Single project, one `package.json` at the root, npm + `package-lock.json`
(no workspaces, no monorepo). Core versions are pinned exactly (no `^`):

| Package | Version |
|---|---|
| svelte | 5.57.3 |
| @sveltejs/kit | 3.2.0 |
| vite | 8.3.8 |
| typescript | 6.0.3 (SvelteKit 3 requires TS ^6) |
| tailwindcss | 4.3.5 |
| @tailwindcss/vite | 4.3.5 |
| @sveltejs/adapter-static | 4.0.1 |
| @sveltejs/vite-plugin-svelte | 7.3.1 |
| @fontsource-variable/inter | 5.3.0 (self-hosted font) |
| @lucide/svelte | 1.73.0 (icons; no brand icons — social marks are hand-drawn SVGs) |
| vitest | 4.1.12 |
| @playwright/test / playwright | 1.65.1 |
| svelte-check | 4.7.8 |

Rendering: `adapter-static` + `prerender = true` for every page (root
layout). Dynamic product routes export `entries()`. The adapter fallback is
`404.html`, so unknown URLs serve the branded error page.

## Run locally

Requires Node.js 26 + npm (the project was built with Node v26.13.1 and
npm 11.20.0).

```sh
npm install
npm run dev      # local dev server
npm run build    # prerendered static output in build/
npm run preview  # serve the production build locally
```

Quality gates:

```sh
npm run check    # svelte-kit sync + svelte-check (0 errors, 0 warnings)
npm run test     # Vitest unit tests (67 cases, unchanged in the polish
                  # round; last green run 2026-11-16)
npm run test:e2e # Playwright tests (75: 10 smoke + 49 gap-round + 16
                  # polish-round); uses the cached headless shell, no
                  # browser downloads. Override the port with E2E_PORT
                  # (default 4173).
npm run qa       # Playwright visual QA: screenshots + horizontal-overflow
                  # checks + branded-404 + image-load checks; writes
                  # qa/shots/*.png and qa/qa-report.json
```

Counts above are the final numbers measured by QA on 2026-11-16
after the polish round: 67 Vitest cases, 75 Playwright tests
(10 smoke + 49 gap-round + 16 polish-round),
96 sitemap URLs (48 paths × 2 locales), 197 visual-QA screenshots
with 211 overflow checks and zero failures.

## Project structure

```
src/
  app.css                 Tailwind v4 CSS-first entry (@theme tokens)
  app.html                HTML shell (<html lang> rewritten per locale by hooks)
  hooks.server.ts         Prerender-time <html lang> rewrite from the URL
  lib/
    config.ts             Site name/URL, contact placeholders, storage keys
    format.ts             Intl price/count/date formatting + interpolation
    paths.ts              Locale-aware path helpers (single source for links)
    cart-math.ts          Pure cart totals/qty math (unit-tested)
    compare.ts            Pure compare-list helpers (unit-tested)
    countdown.ts          Pure countdown math (unit-tested)
    orders.ts             Demo-order helpers, browser-only (unit-tested)
    recently-viewed.ts    Recently-viewed helpers + storage (unit-tested)
    data/
      products.ts         ONE typed source of truth: 12 products
      categories.ts       6 categories (+ categorySlugs)
      blog.ts             3 demo blog posts
      deal.ts             Countdown deal end date
      reviews.ts          Demo product reviews + rating breakdown
      testimonials.ts     Demo testimonials
      stores.ts           3 demo stores (Algiers, Oran, Constantine)
    actions/
      reveal.ts           use:reveal scroll-reveal action (JS-only hidden
                          state; no-op under reduced motion)
    i18n/
      en.ts               English dictionary (source of truth for the type)
      fr.ts               French dictionary (typed as Dictionary)
      index.ts            Registry: dictionaries, Locale, helpers
    stores/
      cart.svelte.ts      Cart state + localStorage + live-region events
      wishlist.svelte.ts  Wishlist state + localStorage
      compare.svelte.ts   Compare state + localStorage
      account.svelte.ts   Demo account state + localStorage
      addresses.svelte.ts Saved-addresses state + localStorage (account CRUD)
      toast.svelte.ts     Toast notification state
    components/           Seo, JsonLd, Header, AnnouncementBar, SearchForm,
                          Footer, HeroCarousel, ProductCard, QuickView,
                          Stars, RatingBreakdown, ReviewsSection, SocialIcon,
                          CartDrawer, CheckoutSteps, CountdownTimer,
                          FaqAccordion, FaqItem, Breadcrumbs, BackToTop,
                          TestimonialsSection, RecentlyViewed,
                          NewsletterForm, LiveRegion, Toast, FilterBar,
                          FilterDrawer
  routes/
    +layout.ts            prerender = true for all pages
    +layout.svelte        Imports app.css
    +page.svelte          Locale-neutral landing (redirect to /en or stored locale)
    +error.svelte         Branded 404 (locale detected from the URL)
    [lang]/               All locale-prefixed pages: home, shop, search,
                          category/[slug], product/[slug], deals, cart,
                          checkout, order-confirmation, track-order,
                          wishlist, compare, account, faq, shipping,
                          returns, payment, testimonials, blog, blog/[slug],
                          about, contact, terms, privacy, sitemap,
                          accessibility, stores, gift-cards, help,
                          new-arrivals, best-sellers
    sitemap.xml/          Prerendered sitemap: 48 paths × 2 locales = 96 URLs
    robots.txt/           Prerendered robots.txt
static/
  images/                 All generated artwork (local only, no external URLs)
  favicon.svg             Hand-drawn bag mark
  _headers                Cloudflare Pages cache/security headers
  llms.txt                Plain-text site description for AI agents
qa/
  serve.mjs               Pure-Node static server for QA/e2e (clean URLs + 404)
  visual.mjs              Screenshot + overflow + image-load QA script
  shots/                  QA screenshots (desktop + mobile, EN + FR)
tests/e2e/                Playwright tests (smoke + gap + polish specs)
docs/sources.md           2026 best-practice research: sources + how applied
```

## i18n architecture

**Choice: typed custom dictionaries** (no i18n library, no build plugin).
The 2026 research in `docs/sources.md` compared Paraglide, typed custom
dictionaries and svelte-i18n for this exact static build and recommended
custom dictionaries: they are the only option where a missing *or* extra
translation is a plain TypeScript error with no extra tooling, they keep
prerendered HTML correct per locale with no hydration-time locale swap,
and they add zero dependencies. Paraglide was rejected (silent fallback to
the base locale for missing translations; SSG hydration-swap footgun;
v3.0 had just shipped, so most examples showed v2).

How it works:

- `src/lib/i18n/en.ts` exports `en` and `Dictionary = typeof en`.
  `src/lib/i18n/fr.ts` exports `fr: Dictionary` — the annotation makes a
  missing or extra key a `svelte-check` error.
- `src/lib/i18n/index.ts` holds the registry:
  `dictionaries = { en, fr }`, `Locale = keyof typeof dictionaries`, and
  `locales` derived from the registry keys. Each dictionary carries its
  own `localeName`, `meta.ogLocale` and `meta.intlLocale`, so no other
  file needs locale-specific branches.
- Routes live under required `[lang]/`. The URL is the source of truth;
  `[lang]/+layout.ts` validates the locale (unknown locales 404) and
  returns `{ lang }`; pages call `getDictionary(lang)`. The choice is
  persisted to `localStorage` so the root `/` landing page can honour it.
- The header language switcher is plain `<a>` links to the same path in
  the other locale, preserving query string and hash — it works on every
  page and gives the prerender crawler the cross-locale links.
- Zero hardcoded UI strings in components (brand name excepted). Product
  names, descriptions, specs and image alt text are localized in the data
  files; prices are numbers formatted with `Intl.NumberFormat` per locale
  plus a literal `" DA"` suffix; dates use `Intl`.
- Localized titles/meta, self-referential canonicals, hreflang clusters
  (self + all versions + `x-default`) and `og:locale` come from
  `Seo.svelte`, driven by the same route table as the sitemap.

### Adding a 3rd locale

1. Copy `src/lib/i18n/en.ts` to `src/lib/i18n/xx.ts` (use the ISO 639-1
   code), translate every string, keep the `xx: Dictionary` annotation,
   and set `localeName`, `meta.ogLocale` and `meta.intlLocale`.
2. Add **one line** to the `dictionaries` registry in
   `src/lib/i18n/index.ts`: `xx,`.
3. Add the new locale's strings to the product/category data
   (`src/lib/data/products.ts`, `src/lib/data/categories.ts`): every
   localized field is typed per locale, so `npm run check` lists each
   missing string. No component changes are needed.
4. Run `npm run check && npm run test && npm run build`. Routes,
   `entries()`, sitemap, hreflang, the language switcher and `<html lang>`
   all derive from the registry automatically.

## Demo behaviour (nothing leaves the browser)

- **Cart**: add/remove/quantity, subtotal/discount/total, drawer + cart
  page, persisted in `localStorage`, header badge, polite live-region
  announcements. Checkout shows a demo success state and clears the cart.
- **Wishlist / compare**: hearts and compare lists persist in
  `localStorage`; dedicated wishlist and compare pages in both locales.
- **Shop**: search, category filter, sort, max-price filter, live result
  count, empty state.
- **Search**: header search with autocomplete (up to 5 product
  suggestions with prices + popular terms, keyboard navigable) submits
  to the dedicated search results page. Category pages list one
  category's products; the deals page collects discounted products with
  a countdown.
- **Announcement bar**: free-delivery message + link to the shipping
  page, above the header on every page. The footer has Shop / Help /
  Company link columns plus follow-us links and the newsletter form.
- **More pages**: multi-step demo checkout with order confirmation,
  order tracking, demo account (with saved addresses), FAQ, shipping /
  returns / payment policies, testimonials, blog, sitemap,
  accessibility, stores, gift cards, help centre, new arrivals and
  best sellers — all local-only, all in EN + FR.
- **Contact / newsletter**: validated locally with inline errors and
  success states; nothing is sent.
- **Hero carousel**: arrows, dots, keyboard, auto-advance (6s) with pause
  on hover/focus, reduced-motion respected.
- **Root `/`**: prerendered landing with EN/FR links; redirects to the
  stored locale (or `/en`) via meta refresh + JS.

## Configuration before deploying

- `SITE_URL` in `src/lib/config.ts` is the live Cloudflare Pages URL
  (`https://techdova.pages.dev`). Canonical URLs, hreflang, sitemap,
  `og:` URLs and JSON-LD all derive from it — update it there if the
  domain ever changes.
- Contact details in `src/lib/config.ts` are placeholders
  (`support@techdova.example.com`, `+213 21 00 00 00`).
- The site is a static build (`build/`): any static host works. No
  server-side code, no environment variables at runtime.

## Images

All 23 images under `static/images/` were generated for this project
(hero ×3, promo ×1, categories ×6, products ×12, og image ×1). No stock
photos, no external URLs, no visible brand logos or readable brand text on
devices, no text from the reference design's original brand anywhere. Product shots are 1408×1760 (4:5),
category thumbs 1600×1600, hero main 2048×1152 (16:9). Every `<img>` has
localized alt text and explicit `width`/`height`.

Format waterfall: each of the 22 content images exists as AVIF + WebP +
JPG (generated from the PNG masters by `qa/convert-images.py`; the PNG
masters are preserved in git history) and is served via the native
`<picture>` element in `Picture.svelte` — AVIF first, WebP second, JPG
fallback, no JavaScript, one file downloaded. Totals: 14.3 MB PNG →
298 KB AVIF, 861 KB WebP, 3.4 MB JPG. `og-image.png` stays PNG on
purpose: it is only the `og:image`, and social crawlers handle
AVIF/WebP poorly. Verify serving with `node qa/avif-qa.mjs` (or
`BASE_URL=https://techdova.pages.dev node qa/avif-qa.mjs` for live).

## Known limitations

- Product galleries hold a single image per product (the gallery UI
  supports multiple; only one shot was generated per product).
- `build/404.html` is the adapter-static fallback shell; the branded
  error page renders client-side. Standard adapter-static behaviour.
- Images are single-size (no `srcset`/`sizes` responsive variants); the
  AVIF/WebP/JPG waterfall is in place, see Images above.
- Tailwind utilities are physical (`left-`/`right-`, `pl-`/`pr-`); both
  shipped locales are LTR. A future RTL locale should convert these to
  logical utilities (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`).
- The best-sellers scroller uses CSS paint containment (`contain-paint`)
  to keep its scroll-snap content from extending the document's
  horizontal scroll range in Chromium (verified: zero overflow at
  320–1440px, scroller still scrolls).
- Discount badges are stored explicitly per product: the reference's
  AirPods Pro badge is -20% while 649/819 computes to -21% by rounding,
  so the stored badge wins over computed values.
- Discounts, ratings, review counts, stock levels and delivery copy are
  demo data.

## Research

2026 best practices (SvelteKit i18n + adapter-static/prerender, Tailwind
v4 CSS-first, e-commerce accessibility/SEO/performance) were researched
2026-11-15 and applied throughout. A gap-filling round on 2026-11-16
added 11 more sources (e-commerce page checklists, product-page and
homepage practice, must-have features) and closed the gaps they exposed.
Full source list with verbatim URLs,
publisher, what each source supports, open uncertainties and the builder
verification log: [`docs/sources.md`](docs/sources.md).
