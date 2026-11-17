# Image prompts — additional product angles (elevation round, 2026-11-17)

For the PDP worker: generate these 24 PNG masters, then convert with
`qa/convert-images.py` (AVIF + WebP + JPG, same as the existing shots) and
extend each product's `images` array in `src/lib/data/products.ts` to
`[image, angle-2, angle-3]`. The existing primary shots (`product-<slug>`)
stay first. Do NOT edit prices, names, or specs.

## Shared style (every prompt)

Append to every prompt below: "studio product photography, soft cream
background, subtle green accents, soft natural shadow, photorealistic,
centered composition, no visible brand logos, no readable text."

PNG masters go in `static/images/`. Data paths are extensionless
(`'/images/product-<slug>-2'`), served via `Picture.svelte` exactly like
the primary shots.

## 1. iPhone 15 Pro — `iphone-15-pro`

- `product-iphone-15-pro-2.png` — DETAIL/CLOSE-UP: extreme close-up of the
  dark titanium smartphone's triple camera module and brushed titanium edge,
  shallow depth of field, side angle showing the Action Button.
- `product-iphone-15-pro-3.png` — ALTERNATE/LIFESTYLE: the dark titanium
  smartphone standing upright at a three-quarter angle beside a small green
  plant on a light desk, bright airy lifestyle setting.

## 2. Samsung Galaxy S24 — `galaxy-s24`

- `product-galaxy-s24-2.png` — DETAIL/CLOSE-UP: close-up of the smartphone's
  slim bezel and triple camera lenses on the back panel, angled top-down
  view, green gradient wallpaper glowing on the edge of the screen.
- `product-galaxy-s24-3.png` — ALTERNATE/LIFESTYLE: the smartphone lying
  flat at a diagonal angle on a cream desk next to a notebook and coffee cup,
  screen showing a green gradient wallpaper, top-down lifestyle shot.

## 3. MacBook Air M2 — `macbook-air-m2`

- `product-macbook-air-m2-2.png` — DETAIL/CLOSE-UP: close-up of the silver
  laptop's thin profile and keyboard corner, low side angle emphasising how
  thin the aluminium chassis is, screen glowing softly out of focus behind.
- `product-macbook-air-m2-3.png` — ALTERNATE/LIFESTYLE: the silver laptop
  open on a bright desk beside a small plant and a notebook, rear
  three-quarter view, green wave wallpaper on screen, airy workspace scene.

## 4. Dell XPS 13 — `dell-xps-13`

- `product-dell-xps-13-2.png` — DETAIL/CLOSE-UP: close-up of the dark grey
  laptop's edge-to-edge display corner and slim bezel, keyboard in soft
  focus, dramatic side light on the aluminium edge.
- `product-dell-xps-13-3.png` — ALTERNATE/LIFESTYLE: the dark grey laptop
  open on a wooden desk in a bright home office, angled view from the side,
  screen showing a minimal green desktop, plant in the background.

## 5. AirPods Pro — `airpods-pro`

- `product-airpods-pro-2.png` — DETAIL/CLOSE-UP: macro close-up of one white
  wireless earbud showing the silicone tip and stem, charging case softly
  blurred behind, clean minimal composition.
- `product-airpods-pro-3.png` — ALTERNATE/LIFESTYLE: the white earbuds
  resting beside their open charging case on a cream surface with a
  smartphone blurred in the background, relaxed everyday-carry scene.

## 6. Sony WH-1000XM5 — `sony-wh1000xm5`

- `product-sony-wh1000xm5-2.png` — DETAIL/CLOSE-UP: close-up of the black
  over-ear headphones' plush leather earcup and headband stitching, side
  profile, soft studio light showing the matte texture.
- `product-sony-wh1000xm5-3.png` — ALTERNATE/LIFESTYLE: the black headphones
  resting on a stack of books beside a laptop on a desk, three-quarter view,
  cosy listening corner with soft daylight.

## 7. Samsung Galaxy Watch 6 — `galaxy-watch-6`

- `product-galaxy-watch-6-2.png` — DETAIL/CLOSE-UP: close-up of the black
  smartwatch's bright display showing a dark green watch face, macro view of
  the rotating bezel edge and strap detail.
- `product-galaxy-watch-6-3.png` — ALTERNATE/LIFESTYLE: the black smartwatch
  lying on a cream gym towel beside a water bottle, angled view, bright
  fitness lifestyle setting.

## 8. Apple Watch Series 9 — `apple-watch-9`

- `product-apple-watch-9-2.png` — DETAIL/CLOSE-UP: close-up of the
  smartwatch's bright gradient watch face and digital crown, macro view,
  light-coloured strap curving softly out of frame.
- `product-apple-watch-9-3.png` — ALTERNATE/LIFESTYLE: the smartwatch with a
  light band standing on its charging puck on a bedside table in soft
  morning light, lifestyle scene with a plant nearby.

## 9. DualSense Controller — `dualsense-controller`

- `product-dualsense-controller-2.png` — DETAIL/CLOSE-UP: close-up of the
  white and black game controller's thumbsticks, adaptive triggers and
  button cluster, low angle, shallow depth of field.
- `product-dualsense-controller-3.png` — ALTERNATE/LIFESTYLE: the white and
  black game controller resting on a sofa armrest beside a TV remote, living
  room scene in soft daylight, relaxed gaming setup.

## 10. Nintendo Switch — `nintendo-switch`

- `product-nintendo-switch-2.png` — DETAIL/CLOSE-UP: close-up of the
  handheld console's screen edge, attached controllers and joystick detail,
  angled macro view showing the build quality.
- `product-nintendo-switch-3.png` — ALTERNATE/LIFESTYLE: the handheld console
  standing on a table in tabletop mode with controllers detached beside it,
  bright living room scene, family game-night feeling.

## 11. MagSafe Charger — `magsafe-charger`

- `product-magsafe-charger-2.png` — DETAIL/CLOSE-UP: top-down macro of the
  white round magnetic charging puck showing its smooth surface and the
  coiled cable loop, minimal centered composition.
- `product-magsafe-charger-3.png` — ALTERNATE/LIFESTYLE: the white magnetic
  charging puck with its cable neatly coiled beside a smartphone on a
  nightstand, soft evening light, everyday charging scene.

## 12. USB-C Hub 7-in-1 — `usb-c-hub`

- `product-usb-c-hub-2.png` — DETAIL/CLOSE-UP: close-up of the dark grey
  aluminium hub's row of ports (HDMI, USB-A, card slots), low angled view
  showing the port detail and brushed metal finish.
- `product-usb-c-hub-3.png` — ALTERNATE/LIFESTYLE: the dark grey aluminium
  hub connected to a laptop on a tidy desk with a monitor cable and memory
  card nearby, bright workspace scene.

## Hero regeneration — ONLY-IF-NEEDED

Do NOT regenerate the hero unless the hero/motion worker asks for it: the
current `hero-main` shot is already live and the carousel rework may not
need a new image.

- `hero-main-v2.png` — RICHER DEVICE GROUP: a bright, airy hero photograph
  of a device group — a slim laptop, a smartphone, wireless earbuds and a
  smartwatch arranged together on a soft cream studio background with subtle
  green accent shapes, soft shadows, photorealistic, wide 16:9 composition,
  no visible brand logos, no readable text. Brighter and richer than the
  current hero shot, same studio style.

## Filename checklist (25 PNGs)

```
product-iphone-15-pro-2.png       product-iphone-15-pro-3.png
product-galaxy-s24-2.png          product-galaxy-s24-3.png
product-macbook-air-m2-2.png      product-macbook-air-m2-3.png
product-dell-xps-13-2.png         product-dell-xps-13-3.png
product-airpods-pro-2.png         product-airpods-pro-3.png
product-sony-wh1000xm5-2.png      product-sony-wh1000xm5-3.png
product-galaxy-watch-6-2.png      product-galaxy-watch-6-3.png
product-apple-watch-9-2.png       product-apple-watch-9-3.png
product-dualsense-controller-2.png  product-dualsense-controller-3.png
product-nintendo-switch-2.png     product-nintendo-switch-3.png
product-magsafe-charger-2.png     product-magsafe-charger-3.png
product-usb-c-hub-2.png           product-usb-c-hub-3.png
hero-main-v2.png                  (ONLY-IF-NEEDED)
```
