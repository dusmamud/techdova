<!--
	Skeleton PDP gallery (elevation round 2, G-07). NO PROPS by design:
	B2 wires this into the PDP gallery loading state. Mirrors the real
	gallery shape (main 4:5 image + 3 thumbnails). `aria-hidden` — the
	hosting region carries the accessible label
	(`t.loadingStates.gallery`) and `aria-busy`.
-->
<div data-testid="skeleton-gallery" aria-hidden="true">
	<div class="aspect-[4/5] animate-pulse rounded-3xl bg-surface-soft"></div>
	<div class="mt-3 flex gap-3">
		<div class="h-20 w-20 animate-pulse rounded-2xl bg-surface-soft"></div>
		<div class="h-20 w-20 animate-pulse rounded-2xl bg-surface-soft"></div>
		<div class="h-20 w-20 animate-pulse rounded-2xl bg-surface-soft"></div>
	</div>
</div>
