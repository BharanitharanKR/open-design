import type { StrategyOutputGoal, StrategyDeliveryState } from '@open-design/contracts';
import type { StrategyTaskExecutionRecord } from '../task-store.js';
import type { OdNextReply } from './protocol.js';
import type { MarkerCompletionEvidence } from './marker-settlement.js';

/** Production cannot downgrade the goal accepted with its plan to an answer. */
export function currentOutputGoal(task: StrategyTaskExecutionRecord, reply: OdNextReply): StrategyOutputGoal | undefined {
  if (task.inputStage === 'production') {
    return task.runs.find(run => run.settlementFacts?.outputGoal)?.settlementFacts?.outputGoal;
  }
  return reply.outputGoal;
}

/** A goal constrains delivery; only the existing production marker authorizes a successor. */
export function deliveryState(input: {
  goal?: StrategyOutputGoal;
  ready: boolean;
  askedUserQuestion: boolean;
  planOnly: boolean;
  evidence?: MarkerCompletionEvidence;
}): StrategyDeliveryState {
  const { evidence } = input;
  if (evidence?.physicalStatus !== 'succeeded') return 'incomplete';
  if (evidence.truncated || evidence.hostDeliveryFailure) return 'incomplete';
  if (input.askedUserQuestion) return 'waiting';
  if (input.ready) return 'pending';
  if (input.planOnly || input.goal?.length === 0) return 'answer';
  if (evidence.todoUnfinished) return 'incomplete';
  if (!input.goal) return 'unknown';
  return evidence.deliverableValid ? 'delivered' : 'incomplete';
}
