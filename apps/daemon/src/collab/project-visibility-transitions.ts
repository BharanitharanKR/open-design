/** One move lane shared by explicit routes and catalog reconciliation.
 * Reads that overlap a move, including reads completing after its ACK, cannot
 * overwrite staging, rollback or confirmed local policy with an older catalog.
 */
export function createProjectVisibilityTransitions() {
  const tails = new Map<string, Promise<void>>();
  const revisions = new Map<string, number>();
  let revision = 0;
  return {
    captureReconciliation(): (projectId: string) => boolean {
      const capturedRevision = revision;
      const blocked = new Set(tails.keys());
      return (id) => !blocked.has(id) && !tails.has(id)
        && (revisions.get(id) ?? 0) <= capturedRevision;
    },
    async withMoves<T>(ids: string[], operation: () => Promise<T>): Promise<T> {
      const keys = [...new Set(ids)].sort();
      async function acquire(index: number): Promise<T> {
        const key = keys[index];
        if (key === undefined) return operation();
        const previous = tails.get(key) ?? Promise.resolve();
        let release!: () => void;
        const current = new Promise<void>((resolve) => { release = resolve; });
        tails.set(key, current);
        revisions.set(key, ++revision);
        await previous;
        try { return await acquire(index + 1); }
        finally {
          revisions.set(key, ++revision);
          release();
          if (tails.get(key) === current) tails.delete(key);
        }
      }
      return acquire(0);
    },
  };
}

export type ProjectVisibilityTransitions = ReturnType<typeof createProjectVisibilityTransitions>;
