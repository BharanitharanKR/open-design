# Real local Workspace funding regression

This explicit sandbox lane preserves the VIEW-015 browser transitions observed
on OD `39b9966cd0fec6f5f0d1a3697ce4fcc6683de1af` and AMR
`885d2f8229d725768803db8b18058ae0f97e3bdb`. The original Home red evidence is
retained; the new cases have no skip, expected-failure, or relaxed draft oracle.
Tests must run on the selected new source before claiming its result.

This is separate from the normal hermetic UI pool. It requires an explicitly
leased disposable **loopback** AMR API/Link/Web environment with real PG/Redis,
an explicit compiled Vela CLI, and a controlled upstream provider. It does not
create or stop AMR, change pricing, recharge funds, or implement task concurrency.
It uses the repository's suite entrypoint and shared tools-dev lifecycle for one
independent OD namespace/data root per test. Daemon data paths follow the root
AGENTS.md data directory contract. It does not borrow normal developer data.

Run from `e2e`, after the normal workspace dependency/build preparation, through
the mandatory owner runner. The evidence directory must be a fresh, nonexistent
path under an existing private evidence parent:

```sh
OD_FUNDING_FIXTURE="$PRIVATE_FIXTURE" OD_FUNDING_RUN_ID="$SANDBOX_RUN_ID" \
OD_FUNDING_EVIDENCE_DIR="$NEW_PRIVATE_EVIDENCE" \
  pnpm exec tsx lib/playwright/funding-runner.ts
```

The config uses one worker and no retry; the three cases are independent and
can be selected individually with `OD_FUNDING_CASE=project`, `home`, or `dp`.
Direct Playwright execution fails before OD startup. Missing, expired, mismatched, or
non-private fixtures fail explicitly. Do not insert this lane into CI without
a disposable fixture provisioner. The normal config excludes this file, so
ordinary CI does not require private sandbox inputs.

The external JSON fixture is mode 0600 and is never committed:

```json
{
  "version": 1,
  "isolation": {
    "runId": "<exclusive run ID, same as OD_FUNDING_RUN_ID>",
    "expiresAt": "<future ISO timestamp>",
    "workspaceNamePrefix": "<unique disposable workspace name prefix>",
    "exclusive": true
  },
  "upstream": {
    "apiUrl": "<loopback API origin>",
    "linkUrl": "<loopback Link origin>",
    "webUrl": "<loopback console origin>",
    "amrSha": "<complete source SHA>"
  },
  "owner": {
    "sourceRoot": "<absolute canonical AMR checkout>",
    "sandboxName": "<exact named sandbox>",
    "ownerEnvPath": "<absolute 0600 server-owner capability JSON>",
    "runtimeReceiptPath": "<absolute 0600 server-owner runtime receipt JSON>",
    "helperSha256": "<canonical e2e/helper/e2e_ownership.py SHA256>"
  },
  "runtime": {
    "velaBin": "<absolute explicitly supplied executable>",
    "velaSha256": "<SHA256>",
    "openCodeBin": "<absolute explicitly supplied executable>",
    "openCodeSha256": "<SHA256>",
    "modelId": "<model routed to the controlled sandbox provider>"
  },
  "actor": {
    "controlKey": "<sandbox control key>",
    "userId": "<sandbox user>",
    "email": "<sandbox email>"
  },
  "spaces": {
    "funded": { "workspaceId": "<A>", "ownerMemberId": "<A owner>", "runtimeKey": "<A scoped key>" },
    "empty": { "workspaceId": "<B>", "ownerMemberId": "<B owner>", "runtimeKey": "<B scoped key>" },
    "dp": { "workspaceId": "<D>", "ownerMemberId": "<D owner>", "runtimeKey": "<D scoped key>" }
  }
}
```

The environment owner provisions three distinct Go spaces for the same Owner:
A has $100; B has $0 and both DP windows exhausted; D has $0 and both DP windows
available with `modelCovered === true` for the chosen model. Legitimate advisory
`fundingCheck: unknown` remains allowed for A/D. The runner verifies exact IDs/Owner memberships,
name prefix, real preflight verdicts, and executable hashes before the browser
workflow. `exclusive` and future timestamps alone are insufficient: the server
owner holds the real canonical target lock throughout the browser command.

The capability JSON contains only `E2E_DATABASE_URL`, `VELA_E2E_OWNER_TOKEN`,
`VELA_E2E_OWNER_LABEL`, `VELA_E2E_OWNER_KEY`, and `VELA_SANDBOX_NAME`. The server's
runtime receipt contains `name`, `database`, `targetKey`, `sourceRoot`, `amrSha`,
`urls: {api, link, web}`, `redisDb`, `guardianPid`, ISO `deadlineUtc`,
`helperPath`, and `helperSha256`. The runner
checks the actual canonical `sandbox/cli.py status <name> --json`, exact Git HEAD,
clean tracked source, both canonical control files' Git bytes, endpoints, database,
Redis DB, and inherited target digest. It then executes the real canonical
`e2e/helper/e2e_ownership.py verify-inherited` immediately before and in finally
after the entire browser command. Each OD case also checks before startup and
after cleanup. No new lock is acquired. Failed pre-verification starts no child;
failed post-verification rejects an otherwise green child as ownership-unverified.
The guardian must retain the whole-command budget plus cleanup reserve. The
runner cannot take over or stop the server owner's AMR environment.

Only safe identity/exit receipts are curated; database URLs and tokens never
appear there. Provisioning/provider isolation and the subsequent AMR all-key/
ledger audit remain the environment owner's job. Unit checks of the guard are
not evidence that a real live lease was held during any browser execution.

For Project and Home, only the delivery time of genuine OD billing responses is
controlled using `route.fetch`; their body bytes are unchanged and hashed. B's
actual response is completed in the browser and its insufficient dialog is
visible before A's older response is delivered. Both phases assert the original
page, exact draft, and zero new run; editability is required after dismissing
the modal. Background editability while the modal is open is diagnostic only.
Project creation and queue presence are
diagnostic records, not additional QA requirements. The Project case creates its own local project
and establishes its Recent entry before testing the real workspace switch.

The positive D case proves only one correctly scoped HTTP 202 submission with
real cash0/availableDP preconditions. It cancels only its own created run during
cleanup. It does **not** prove model admission, completion, provider tokens, or
accounting. A model/Link success oracle and readonly accounting audit are separate.
These three cases cover VIEW-015 slices; they do not mark the whole QA case passed.
Project and Home each map to step 1; D maps only to the submission boundary of
step 2. Attachment preservation is not exercised in this response-order scenario.
The absence of POST /api/runs proves no new OD run was submitted through this
page; a separate AMR/provider/ledger audit is needed to rule out model requests
through every other path. The source cannot turn HTTP 202 into successful DP use.

Playwright traces and runtime scratch are local diagnostics and can contain
sandbox credentials. Review/redact them before any publication. Curated JSON
attachments omit control/runtime keys and user email. All created runtime
processes are stopped through the shared lifecycle in finally, after page close.
