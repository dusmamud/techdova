// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// Vite `?url` asset import for the font preload in
// src/routes/[lang]/+layout.svelte. No vite/client types are referenced
// in this project, so the import needs this declaration for svelte-check.
declare module '*.woff2?url' {
	const src: string;
	export default src;
}

export {};
