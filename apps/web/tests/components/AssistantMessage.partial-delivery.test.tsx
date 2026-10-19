// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AssistantMessage } from '../../src/components/AssistantMessage';
import type { ChatMessage } from '../../src/types';

function reply(withTodos: boolean, withFile: boolean): ChatMessage {
  return {
    id: 'partial-delivery', role: 'assistant',
    content: withFile ? 'Created index.html. Animation and mobile layout remain.' : 'Hello!',
    runStatus: 'succeeded', startedAt: 1000, endedAt: 2000,
    strategyTaskDelivered: withFile,
    events: withTodos ? [{
      kind: 'tool_use', id: 'todo-1', name: 'TodoWrite',
      input: { todos: [
        { content: 'Write the page', status: 'completed' },
        { content: 'Add animation', status: 'pending' },
        { content: 'Adapt for mobile', status: 'pending' },
      ] },
    }] : [],
  };
}

describe('partial file delivery does not finish declared work', () => {
  afterEach(cleanup);

  it.each(['unknown', 'incomplete'] as const)('keeps host %s visible without TodoWrite and waits for a user click', (state) => {
    const onContinue = vi.fn();
    const message: ChatMessage = { ...reply(false, true), strategyTaskDelivered: false,
      strategyDeliveryState: state, endedWithUnfinishedWork: true };
    const view = render(<AssistantMessage message={message} streaming={false}
      projectId="project-1" conversationId="conv-1" isLast onContinueRemainingTasks={onContinue} />);
    expect(screen.getByTestId('assistant-label').textContent).not.toBe('Done');
    expect(screen.getByTestId('assistant-footer').getAttribute('data-unfinished')).toBe('true');
    expect(onContinue).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('assistant-continue-remaining'));
    expect(onContinue).toHaveBeenCalledExactlyOnceWith([]);
    view.rerender(<AssistantMessage message={{ ...message, strategyDeliveryState: 'delivered',
      endedWithUnfinishedWork: false, strategyTaskDelivered: true }} streaming={false}
      projectId="project-1" conversationId="conv-1" isLast onContinueRemainingTasks={onContinue} />);
    expect(screen.queryByTestId('assistant-continue-remaining')).toBeNull();
  });

  it('does not offer recovery for a completed plan-only answer', () => {
    render(<AssistantMessage message={{ ...reply(false, false), strategyDeliveryState: 'answer' }}
      streaming={false} projectId="project-1" isLast onContinueRemainingTasks={vi.fn()} />);
    expect(screen.queryByTestId('assistant-continue-remaining')).toBeNull();
  });

  it('offers the remaining work but continues only after the user clicks', () => {
    const onContinue = vi.fn();
    render(<AssistantMessage message={reply(true, true)} streaming={false}
      projectId="project-1" conversationId="conv-1" isLast
      onContinueRemainingTasks={onContinue} />);
    const button = screen.getByTestId('assistant-continue-remaining');
    expect(onContinue).not.toHaveBeenCalled();
    fireEvent.click(button);
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it.each([false, true])('does not invent remaining work when no todo exists (file: %s)', (withFile) => {
    const onContinue = vi.fn();
    render(<AssistantMessage message={reply(false, withFile)} streaming={false}
      projectId="project-1" conversationId="conv-1" isLast
      onContinueRemainingTasks={onContinue} />);
    expect(screen.queryByTestId('assistant-continue-remaining')).toBeNull();
    expect(onContinue).not.toHaveBeenCalled();
    expect(screen.queryByText('Stopped with unfinished work')).toBeNull();
  });
});
