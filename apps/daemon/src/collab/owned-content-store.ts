import type Database from 'better-sqlite3';

export interface OwnedContentScope {
  projectId: string;
  workspaceId: string;
  resourceTeamId: string;
  viewerMemberId: string;
  ownerMemberId: string;
}

export interface OwnedContentRecord {
  localVersion: number | null;
  latestVersion: number | null;
  ignoredVersion: number | null;
  autoApplyUntil: number | null;
  fingerprint: string | null;
}

export interface OwnedContentStore {
  read(scope: OwnedContentScope): OwnedContentRecord;
  write(scope: OwnedContentScope, record: OwnedContentRecord): void;
}

export const ownedContentScopeKey = (scope: OwnedContentScope): string => JSON.stringify([
  scope.workspaceId, scope.resourceTeamId, scope.viewerMemberId, scope.ownerMemberId, scope.projectId,
]);

export const emptyOwnedContentRecord = (): OwnedContentRecord => ({
  localVersion: null, latestVersion: null, ignoredVersion: null, autoApplyUntil: null, fingerprint: null,
});

export function migrateOwnedContentSync(db: Database.Database): void {
  db.exec(`CREATE TABLE IF NOT EXISTS owned_content_sync (
    scope_key TEXT PRIMARY KEY,
    local_version INTEGER,
    latest_version INTEGER,
    ignored_version INTEGER,
    auto_apply_until INTEGER,
    fingerprint TEXT
  )`);
}

export function createSqliteOwnedContentStore(db: Database.Database): OwnedContentStore {
  const read = db.prepare(`SELECT local_version AS localVersion, latest_version AS latestVersion,
    ignored_version AS ignoredVersion, auto_apply_until AS autoApplyUntil, fingerprint
    FROM owned_content_sync WHERE scope_key = ?`);
  const write = db.prepare(`INSERT INTO owned_content_sync
    (scope_key, local_version, latest_version, ignored_version, auto_apply_until, fingerprint)
    VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(scope_key) DO UPDATE SET
    local_version=excluded.local_version, latest_version=excluded.latest_version,
    ignored_version=excluded.ignored_version, auto_apply_until=excluded.auto_apply_until,
    fingerprint=excluded.fingerprint`);
  return {
    read(scope) { return (read.get(ownedContentScopeKey(scope)) as OwnedContentRecord | undefined) ?? emptyOwnedContentRecord(); },
    write(scope, record) {
      write.run(ownedContentScopeKey(scope), record.localVersion, record.latestVersion,
        record.ignoredVersion, record.autoApplyUntil, record.fingerprint);
    },
  };
}
