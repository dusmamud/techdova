"""Generate AVIF + WebP + JPG variants for every artwork image.

Best-practice format waterfall (2026): AVIF first, WebP second, JPG
fallback, served via the <picture> element (see Picture.svelte). The
browser picks the first <source> type it supports, so selection is
native and instant with no JavaScript and only one file downloaded.

Sources are the PNG masters in static/images/. Re-run any time a
master changes. og-image.png is excluded on purpose: it is only used
as the og:image, and social crawlers handle AVIF/WebP poorly, so it
stays PNG. Settings match the proven portfolio pipeline (high
quality; JPG uses 4:4:4 subsampling to avoid block edges).
"""

import glob
import os
import subprocess

from PIL import Image

SRC = os.path.join(os.path.dirname(__file__), '..', 'static', 'images')
EXCLUDE = {'og-image.png'}


def main() -> None:
	names = sorted(
		os.path.basename(p) for p in glob.glob(os.path.join(SRC, '*.png')) if os.path.basename(p) not in EXCLUDE
	)
	totals = {'png': 0, 'avif': 0, 'webp': 0, 'jpg': 0}
	for name in names:
		base = os.path.join(SRC, name[: -len('.png')])
		src = base + '.png'
		# AVIF: libaom reference encoder, constant quality, full chroma.
		subprocess.run(
			[
				'ffmpeg',
				'-y',
				'-hide_banner',
				'-loglevel',
				'error',
				'-i',
				src,
				'-c:v',
				'libaom-av1',
				'-still-picture',
				'1',
				'-crf',
				'28',
				'-b:v',
				'0',
				'-cpu-used',
				'5',
				'-pix_fmt',
				'yuv444p',
				base + '.avif'
			],
			check=True
		)
		img = Image.open(src).convert('RGB')
		img.save(base + '.webp', 'WEBP', quality=85, method=6)
		img.save(base + '.jpg', 'JPEG', quality=90, subsampling=0, optimize=True, progressive=True)
		sizes = {ext: os.path.getsize(f'{base}.{ext}') for ext in ('png', 'avif', 'webp', 'jpg')}
		for ext in totals:
			totals[ext] += sizes[ext]
		print(f"{name}: png={sizes['png']} avif={sizes['avif']} webp={sizes['webp']} jpg={sizes['jpg']}")
	print(f"TOTAL ({len(names)} images): " + ' '.join(f"{ext}={totals[ext]}" for ext in ('png', 'avif', 'webp', 'jpg')))


if __name__ == '__main__':
	main()
