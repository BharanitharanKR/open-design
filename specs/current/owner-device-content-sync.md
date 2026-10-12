# Owner device content synchronization

OPEND-3493: https://plane.powerformer.net/open-design/browse/OPEND-3493/

The same account can receive the latest published content on another device.
Opening a shared project checks its head. Hub content events and reconnect
catch-up use the same daemon decision. Existing member mirrors retain their
read-only authorization and materialization contracts.

The owner daemon records a pending update before replacing existing content.
The UI explains that the cloud snapshot replaces project content, while only
HTML has local version recovery. Confirming may authorize automatic replacement
for 24 hours for this project on this device. The preference is durable and
partitioned by workspace, resource team, viewer, owner and project. Dismissing
skips the observed version; a manual check may offer that version again.
First materialization needs no overwrite confirmation. Confirmations name the
observed head; stale confirmations do not authorize a different version.

HTTP and `od collab` expose check, accept, dismiss and reset-preference actions.
Status exposes the same pending state. Thin project SSE invalidations prompt a
status reread, rather than transferring authorization in an event payload.

The owner downloads through the authenticated Vela resource command into a
temporary sibling directory. Fresh membership/catalog checks precede transport
and immediately precede promotion. Import directories are explicitly rejected.
Files excluded from publication remain local. HTML checkpoints are taken before
overwrite and after receipt, with a distinct synchronization source. Backup or
download failures stop the operation. Generating/uploading returns BUSY; the
application does not merge concurrent edits or promise whole-project rollback.

Receiving and publishing share an owner content coordinator. A receive blocks
new publishes, and applying the same snapshot does not schedule a watcher echo.
Successfully published versions are persisted so their SSE echoes need no
replacement or confirmation. Initial watcher subscription is not a local edit.
Only relevant content changes invoke fingerprint checks; status polling does not
hash the filesystem. Content fingerprints follow the publication exclusion
rules, and are persisted across restarts.

Acceptance covers page entry, SSE, cancellation, exact head confirmation, the
24-hour expiry and restart, scope separation, first materialization, generation
and upload BUSY, failure before promotion, no echo publication, subsequent local
edits and HTML restoration. All local fixtures use synthetic accounts; live
customer data is outside this delivery. Personal unshared projects and imported
folders are not silently included. Real Vela protocol compatibility is checked
with isolated local fixtures where available, and remaining limits are reported.

## Delivery validation

The production implementation includes a durable scoped cursor/preference and
content fingerprint, a staged owner receipt, the HTTP/CLI actions, and the web
confirmation dialog. Older owner mirrors may still have a `local_only` sync
stamp; their scoped owner-update status also enables the update UI. Private
entries are preserved recursively. A remote file conflicting with a directory
containing local private entries fails before replacement.

The original same-owner-device probe failed on fetched default-branch commit
`8145e9120b5c51c84c6c497beaf3e32ae6823686`. The delivery regression uses real
isolated daemon APIs/SSE and a synthetic Vela hub: confirmation/dismissal,
manual re-offer, 24h acceptance, no received-content echo, subsequent publication,
and HTML restoration pass (`e2e/tests/collab/owner-device-update.test.ts`).
The browser witness checks page-entry requests, SSE offers, the actual dialog,
manual retry, automatic receipt and resetting permission
(`e2e/ui/owner-device-content-update.test.ts`). Daemon tests cover stale heads,
24h expiry, reopening SQLite, scope isolation, BUSY, authority revocation,
download/history/registration failure, symlinks, private-entry conflicts and
watcher reattachment. CLI tests verify all four actions use the same scoped API.

Remaining limits: no live cloud login or packaged two-device acceptance has been
run. The synthetic hub is not evidence of live owner-resource permission.
HTML history remains local and excludes whole-project/asset recovery. A process
crash during the directory swap has no automated recovery journal; retained
staging/recovery directories may need manual inspection. Suppressing a prompt
for 24h authorizes complete replacement, including unpublished public content.
Attaching a watcher alone does not publish offline edits; a later actual edit
or explicit publication does. These limits do not add conflict-merge or
whole-project recovery requirements to the approved quick-fail scope.
