// CS03-local candidate types. CS01 owns the eventual analytics contract.
import { useLayoutEffect, useSyncExternalStore } from 'react';
import { reportSafetyEvent } from '../analytics/error-tracking';
import { clearChatOpenIntent, markChatOpenIntent } from './chat-health';

export interface NavigationLocation {
  kind: string;
  view?: string;
  projectId?: string | null;
  conversationId?: string | null;
  fileName?: string | null;
}

export type NavigationFailure =
  | 'open_unavailable'
  | 'project_unavailable'
  | 'scope_unavailable'
  | 'conversations_unavailable'
  | 'messages_unavailable';
export type NavigationCancellation = 'superseded' | 'route_changed' | 'page_exit' | 'scope_changed';
export interface NavigationResult {
  navigation_id: string;
  navigation_type: 'project_entry' | 'conversation_switch';
  source_type: string;
  target_type: 'project' | 'conversation';
  status: 'started' | 'ready' | 'cancelled' | 'failed';
  duration_ms: number;
  reason?: NavigationFailure | NavigationCancellation;
}
interface NavigationAttempt {
  id: string;
  startedAt: number;
  source: string;
  projectId: string;
  conversationId?: string;
  navigationType: NavigationResult['navigation_type'];
  sourceType: string;
}

function routeKey(route: NavigationLocation): string {
  // File tab persistence updates the URL during hydration; it is not a new
  // project/conversation intent and must not cancel the measurement.
  return JSON.stringify([route.kind, route.view, route.projectId, route.conversationId ?? null]);
}

export function createNavigationTiming(deps: {
  now: () => number;
  id: () => string;
  emit: (result: NavigationResult) => void;
}) {
  let active: NavigationAttempt | null = null;
  let arrived = false;
  const listeners = new Set<() => void>();
  const notify = () => { for (const listener of listeners) listener(); };
  const emit = (attempt: NavigationAttempt, status: NavigationResult['status'], reason?: NavigationResult['reason']) => {
    deps.emit({
      navigation_id: attempt.id,
      navigation_type: attempt.navigationType,
      source_type: attempt.sourceType,
      target_type: attempt.conversationId ? 'conversation' : 'project',
      status,
      duration_ms: status === 'started' ? 0 : Math.max(0, Math.round(deps.now() - attempt.startedAt)),
      ...(reason ? { reason } : {}),
    });
  };
  const finish = (id: string, status: 'ready' | 'cancelled' | 'failed', reason?: NavigationResult['reason']) => {
    if (!active || active.id !== id) return;
    const attempt = active;
    active = null;
    arrived = false;
    emit(attempt, status, reason);
    notify();
  };
  const cancel = (reason: NavigationCancellation) => {
    if (active) finish(active.id, 'cancelled', reason);
  };
  return {
    begin(source: NavigationLocation, target: { projectId: string; conversationId?: string }): string {
      cancel('superseded');
      const attempt: NavigationAttempt = {
        id: deps.id(), startedAt: deps.now(), source: routeKey(source),
        projectId: target.projectId, conversationId: target.conversationId,
        navigationType: target.conversationId ? 'conversation_switch' : 'project_entry',
        sourceType: source.kind === 'home' ? `home_${source.view ?? 'home'}` : source.kind,
      };
      active = attempt;
      arrived = false;
      emit(attempt, 'started');
      notify();
      return attempt.id;
    },
    observeRoute(route: NavigationLocation): void {
      if (!active) return;
      const matchesTarget = route.kind === 'project' && route.projectId === active.projectId
        && (!active.conversationId || route.conversationId === active.conversationId);
      if (matchesTarget) arrived = true;
      else if (arrived || routeKey(route) !== active.source) cancel('route_changed');
    },
    finish,
    cancel,
    isCurrent: (id: string): boolean => active?.id === id,
    getSnapshot: (): NavigationAttempt | null => active,
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
  };
}

export const navigationTiming = createNavigationTiming({
  now: () => performance.now(),
  // randomUUID is secure-context-only; LAN HTTP web clients still need to
  // navigate. This correlation id is not a credential or security boundary.
  id: () => globalThis.crypto?.randomUUID?.()
    ?? `nav-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
  emit: (result) => {
    if (result.status === 'started') {
      markChatOpenIntent(result.navigation_type === 'project_entry' ? 'project_switch' : 'conversation_switch');
    } else if (result.status !== 'ready') {
      clearChatOpenIntent();
    }
    reportSafetyEvent('client_navigation_result', { ...result });
  },
});

const serverSnapshot = () => null;

/** No intent is synthesized on mount. Ready requires the caller's business
 * gates, a committed surface, and a foreground animation-frame check. */
export function useProjectNavigationReady(input: {
  projectId: string;
  conversationId: string | null;
  ready: boolean;
  failure: NavigationFailure | null;
}): void {
  const attempt = useSyncExternalStore(navigationTiming.subscribe, navigationTiming.getSnapshot, serverSnapshot);
  const { projectId, conversationId, ready, failure } = input;
  useLayoutEffect(() => {
    if (!attempt || attempt.projectId !== projectId
      || (attempt.conversationId && attempt.conversationId !== conversationId)) return;
    if (failure) {
      navigationTiming.finish(attempt.id, 'failed', failure);
      return;
    }
    if (!ready) return;
    let frame: number | null = null;
    const check = () => {
      if (document.visibilityState === 'hidden' || frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        if (document.visibilityState !== 'hidden') navigationTiming.finish(attempt.id, 'ready');
      });
    };
    check();
    document.addEventListener('visibilitychange', check);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', check);
    };
  }, [attempt, projectId, conversationId, ready, failure]);
}
