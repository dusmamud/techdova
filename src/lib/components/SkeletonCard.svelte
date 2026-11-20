<!--
	Skeleton product card (elevation round 2, G-07). NO PROPS by design:
	the shop grid renders a fixed set while filters change, and the
	search page (B2) renders its own count. `aria-hidden` — the loading
	region that hosts these carries the accessible label
	(`t.loadingStates.shopGrid` / `t.loadingStates.searchResults`) and
	`aria-busy`, so the skeletons themselves stay silent. `animate-pulse`
	is the Tailwind utility; app.css freezes it under reduced motion.
-->
<div
	data-testid="skeleton-card"
	aria-hidden="true"
	class="flex h-full flex-col overflow-hidden rounded-2xl bg-surface ring-1 ring-line sm:rounded-3xl"
>
	<div class="aspect-[4/5] animate-pulse bg-surface-soft"></div>
	<div class="flex flex-1 flex-col gap-2 p-3 sm:p-4">
		<div class="h-4 w-3/4 animate-pulse rounded-full bg-surface-soft"></div>
		<div class="h-4 w-1/2 animate-pulse rounded-full bg-surface-soft"></div>
		<div class="mt-auto flex items-baseline gap-2 pt-1">
			<div class="h-5 w-16 animate-pulse rounded-full bg-surface-soft"></div>
		</div>
		<div class="mt-2 h-11 w-full animate-pulse rounded-full bg-surface-soft"></div>
	</div>
</div>
