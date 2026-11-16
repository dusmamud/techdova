import { defineConfig } from '@playwright/test';

// Port is configurable so e2e never collides with another local server:
// E2E_PORT=4191 npm run test:e2e
const port = Number(process.env.E2E_PORT ?? 4173);

export default defineConfig({
	testDir: 'tests/e2e',
	timeout: 30000,
	retries: 0,
	workers: 1,
	// In CI the GitHub reporter turns each failure into a check-run
	// annotation (readable via the API), so a red E2E step names its
	// failing tests without needing the run log.
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: `http://127.0.0.1:${port}`,
		trace: 'retain-on-failure'
	},
	webServer: {
		command: 'node qa/serve.mjs',
		port,
		reuseExistingServer: false,
		timeout: 20000,
		env: { PORT: String(port) }
	}
});
