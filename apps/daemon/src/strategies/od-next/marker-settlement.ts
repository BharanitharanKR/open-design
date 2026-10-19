import type { StrategySettlementReasonV2, StrategySettlementFactsV2 } from '@open-design/contracts';
import type { OdNextReply } from './protocol.js';
import type Database from 'better-sqlite3';
import { countRenderableQuestionForms } from '../../question-form-detect.js';
import { compareAndTransitionStrategyTaskExecution, getStrategyTaskExecution, type StrategyTaskExecutionRecord } from '../task-store.js';
import type { OdNextCoordinatorResult } from './coordinator.js';
import { currentOutputGoal, deliveryState } from './delivery-goal.js';

export interface MarkerCompletionEvidence {
  physicalStatus: 'succeeded' | 'failed' | 'canceled';
  deliverableValid: boolean;
  truncated?: boolean;
  todoUnfinished?: boolean;
  hostDeliveryFailure?: boolean;
}

export function settleMarkerTurn(db: Database.Database, input: {
  taskExecutionId: string;
  runId: string;
  parsed: OdNextReply;
  completionEvidence?: MarkerCompletionEvidence;
  updatedAt?: number;
}): OdNextCoordinatorResult {
  const task = getStrategyTaskExecution(db, input.taskExecutionId);
  if (!task || task.latestRunId !== input.runId || task.outcome !== 'running') {
    throw new Error('Only the current running task can settle an assistant reply.');
  }
  const status = input.completionEvidence?.physicalStatus;
  const ready = status === 'succeeded' && !input.completionEvidence?.truncated
    && !input.completionEvidence?.hostDeliveryFailure && markerMayContinue(task, input.parsed);
  // Task state owns orchestration only; a failed physical Run stays failed.
  const outcome = status === 'canceled' ? 'canceled' : ready ? 'plan_ready' : 'completed';
  const reasonCodes: string[] = [];
  const askedUserQuestion = countRenderableQuestionForms(input.parsed.visibleText) > 0;
  const settlementReason: StrategySettlementReasonV2 = ready ? 'continued'
    : status === 'succeeded' && askedUserQuestion ? 'question' : 'ended';
  const outputGoal = currentOutputGoal(task, input.parsed);
  const settlementFacts: StrategySettlementFactsV2 = {
    ...(outputGoal ? { outputGoal } : {}),
    deliveryState: deliveryState({ ...(outputGoal ? { goal: outputGoal } : {}), ready, askedUserQuestion,
      planOnly: task.executionIntent === 'plan_only',
      ...(input.completionEvidence ? { evidence: input.completionEvidence } : {}),
    }),
    ...(input.parsed.productionSignal ? { productionSignal: input.parsed.productionSignal } : {}),
    ...(input.completionEvidence?.hostDeliveryFailure === undefined ? {} : { hostDeliveryFailure: input.completionEvidence.hostDeliveryFailure }),
    ...(status ? { physicalStatus: status } : {}),
    ...(input.completionEvidence ? { deliverableValid: input.completionEvidence.deliverableValid } : {}),
    ...(input.completionEvidence?.truncated === undefined ? {} : { truncated: input.completionEvidence.truncated }),
    ...(input.completionEvidence?.todoUnfinished === undefined ? {} : { todoUnfinished: input.completionEvidence.todoUnfinished }),
    askedUserQuestion,
    productionReady: input.parsed.productionReady,
    emptyReply: !input.parsed.visibleText.trim(),
    ...(task.executionIntent ? { executionIntent: task.executionIntent } : {}),
  };
  const settled = compareAndTransitionStrategyTaskExecution(db, {
    taskExecutionId: task.taskExecutionId, expectedRevision: task.revision,
    deliverableValid: input.completionEvidence?.deliverableValid === true,
    settlementReason, settlementFacts,
    to: {
      route: task.route ?? 'full_plan', inputStage: task.inputStage,
      outcome, executionMode: task.executionMode ?? (ready ? 'simple' : null),
      executionIntent: task.executionIntent ?? 'produce',
    },
    ...(input.updatedAt === undefined ? {} : { updatedAt: input.updatedAt }),
  });
  return { action: outcome, task: settled, visibleText: input.parsed.visibleText, reasonCodes };
}

export function markerMayContinue(task: StrategyTaskExecutionRecord, parsed: OdNextReply): boolean {
  return parsed.productionReady === true
    && parsed.outputGoal?.length !== 0
    && Boolean(parsed.visibleText.trim())
    && ['request', 'clarification'].includes(task.inputStage)
    && task.executionIntent !== 'plan_only'
    && task.route !== 'direct_edit'
    && !task.runs.some(run => run.inputStage === 'production')
    && countRenderableQuestionForms(parsed.visibleText) === 0;
}
