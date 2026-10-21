import { defineConfig, type ReporterDescription } from '@playwright/test';
import { fileURLToPath } from 'node:url';

import base from '../../playwright.config.ts';

// Trace and reports may contain authenticated local HTTP evidence.
process.umask(0o077);

const reports = (name: string) => fileURLToPath(new URL(`../../ui/reports/api-security/${name}`, import.meta.url));
const reporter: ReporterDescription[] = [
  ['list'],
  ['html', { open: 'never', outputFolder: reports('html') }],
  ['json', { outputFile: reports('results.json') }],
  ['junit', { outputFile: reports('junit.xml') }],
];
if (process.env.CI) reporter.unshift(['github']);

// Explicit real-AMR lane. The private fixture and live ownership are required;
// this test is excluded from the ordinary hermetic functional pool.
export default defineConfig({
  ...base,
  testDir: fileURLToPath(new URL('../../ui', import.meta.url)),
  outputDir: reports('artifacts'),
  reporter,
  testMatch: 'api-security-view016.test.ts',
  testIgnore: [],
  workers: 1,
  fullyParallel: false,
  retries: 0,
  use: { ...base.use, trace: 'on', screenshot: 'only-on-failure' },
});
