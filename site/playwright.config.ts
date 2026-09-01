import { defineConfig, devices } from '@playwright/test';
import { BASE } from './site.config.mjs';

/** Tests run against the built static output, not the dev server — what
 *  ships is what gets checked. */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  /* Trailing slash matters: tests navigate with relative paths ('about/'),
     which resolve against the base the site is actually deployed under. */
  use: { baseURL: `http://localhost:4322${BASE}/`, trace: 'on-first-retry' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  /* Its own port, never reused: hitting a running `astro dev` instead of the
     build gives different behaviour (HMR, React dev mode) and cost me an
     afternoon of chasing phantom island failures. */
  webServer: {
    command: 'npx astro build && node scripts/serve.mjs dist 4322',
    url: `http://localhost:4322${BASE}/`,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
