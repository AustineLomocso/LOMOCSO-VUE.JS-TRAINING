import { describe, expect, it } from 'vitest';
import { usePriority, PRIORITIES } from '@/composables/usePriority';

describe('usePriority', () => {
  const { priorityColor, priorityLabel, priorityWeight } = usePriority();

  it('lists priorities low → high', () => {
    expect(PRIORITIES).toEqual(['low', 'medium', 'high']);
  });

  it('maps colors', () => {
    expect(priorityColor('high')).toBe('danger');
    expect(priorityColor('medium')).toBe('warning');
    expect(priorityColor('low')).toBe('medium');
  });

  it('maps labels', () => {
    expect(priorityLabel('high')).toBe('High');
    expect(priorityLabel('low')).toBe('Low');
  });

  it('orders weights high > medium > low', () => {
    expect(priorityWeight('high')).toBeGreaterThan(priorityWeight('medium'));
    expect(priorityWeight('medium')).toBeGreaterThan(priorityWeight('low'));
  });
});
