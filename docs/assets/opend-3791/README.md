# OPEND-3791 — share freshness review evidence

Issue: [OPEND-3791](https://plane.powerformer.net/open-design/browse/OPEND-3791/).

These fixed-build screenshots show the file toolbar's **Share** entry and its panel:

- [Checking](checking.png): the existing link remains copyable while the share-state GET is pending.
- [Outdated](outdated.png): after the GET completes, the update notice and **Update link** appear without reopening.
- [Read failed](read-failed.png): a failed check offers an explicit retry of the state GET, not a publish action.

## Evidence boundary

Captured by `e2e/ui/share-freshness.test.ts` in an isolated, suite-owned tools-dev runtime. The project, HTML/CSS writes, file watcher, SSE, file-list refresh, and browser UI are real. The account/workspace and share-service responses are controlled mocks. All content, account counters, and share URLs are synthetic; no real share was published, updated, or stopped.

These are three states of the fixed build, not before/after screenshots or proof of production latency. The pre-fix evidence is the failing regression test on the pinned feature base `c2e382bfed2a3b024a4b583ee13d67c163313254`, as described in the PR's bug verification section.

Reproduce with the existing Playwright suite:

```sh
pnpm --filter @open-design/e2e exec playwright test -c playwright.config.ts ui/share-freshness.test.ts --workers=1 --project=chromium
```

The suite isolates runtime data and AMR configuration. On a development host, unset `VELA_CONTROL_KEY` and `VELA_API_URL` and use `OD_WORKSPACE_CONTEXT_SOURCE=local` for this mock-backed check. No real provider credentials are required. Production/packaged latency and CI results are not established by these screenshots.
