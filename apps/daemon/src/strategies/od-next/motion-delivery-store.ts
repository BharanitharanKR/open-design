import type Database from 'better-sqlite3';
import { MotionDeliveryContractSchema, type MotionDeliveryContract } from '@open-design/contracts';
import { getStrategyTaskExecutionByRunId } from '../task-store.js';

export function readTaskMotionDeliveries(db: Database.Database, taskId?: string): MotionDeliveryContract[] {
  if (!taskId) return [];
  const row = db.prepare('SELECT declarations_json FROM strategy_motion_deliveries WHERE task_execution_id=?').get(taskId) as { declarations_json: string } | undefined;
  if (!row) return [];
  const values: unknown = JSON.parse(row.declarations_json);
  if (!Array.isArray(values)) throw new Error('Invalid persisted motion requirements.');
  return values.map(value => MotionDeliveryContractSchema.parse(value));
}

export function declareTaskMotionDelivery(db: Database.Database, runId: string, value: unknown, projectId?: string): MotionDeliveryContract[] {
  return db.transaction(() => {
    const task = getStrategyTaskExecutionByRunId(db, runId);
    if (!task || task.latestRunId !== runId || task.outcome !== 'running' || task.executionIntent === 'plan_only'
      || (projectId !== undefined && task.projectId !== projectId)
      || !['request', 'clarification', 'production'].includes(task.inputStage)) {
      throw new Error('Only the current active production-authorized task may declare motion delivery.');
    }
    const contract = MotionDeliveryContractSchema.parse(value);
    if (contract.mode === 'video' && contract.audio === undefined) throw new Error('Declare required or silent audio for a new motion film.');
    const row = db.prepare('SELECT frozen FROM strategy_motion_deliveries WHERE task_execution_id=?').get(task.taskExecutionId) as {frozen: number} | undefined;
    const current = readTaskMotionDeliveries(db, task.taskExecutionId);
    const found = current.find(item => item.sourcePath === contract.sourcePath);
    if (found && JSON.stringify(found) === JSON.stringify(contract)) return current;
    if (row?.frozen) throw new Error('Motion delivery requirements are frozen for this task.');
    if (found) throw new Error('A registered source cannot change its delivery requirement within this task.');
    const paths = current.flatMap(item => item.mode === 'video' ? [item.sourcePath, item.videoPath] : [item.sourcePath]);
    const incoming = contract.mode === 'video' ? [contract.sourcePath, contract.videoPath] : [contract.sourcePath];
    if (current.length >= 8 || incoming.some(path => paths.includes(path))) throw new Error('Motion output paths must be unique and bounded.');
    const next = [...current, contract];
    db.prepare(`INSERT INTO strategy_motion_deliveries(task_execution_id,declarations_json,frozen) VALUES (?,?,?)
      ON CONFLICT(task_execution_id) DO UPDATE SET declarations_json=excluded.declarations_json, frozen=excluded.frozen`)
      .run(task.taskExecutionId, JSON.stringify(next), task.inputStage === 'production' ? 1 : 0);
    return next;
  })();
}

export function freezeTaskMotionDeliveries(db: Database.Database, taskId: string): void {
  db.prepare('UPDATE strategy_motion_deliveries SET frozen=1 WHERE task_execution_id=?').run(taskId);
}
