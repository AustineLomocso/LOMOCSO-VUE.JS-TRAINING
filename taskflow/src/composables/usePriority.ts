import type { Priority } from '@/stores/tasks';

/** Ordered list of priorities (low → high) for selects and iteration. */
export const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

const COLORS: Record<Priority, string> = {
  high: 'danger',
  medium: 'warning',
  low: 'medium',
};

const LABELS: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const WEIGHTS: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Priority helpers shared across views so the color/label/sort-weight mapping
 * lives in exactly one place.
 */
export function usePriority() {
  const priorityColor = (priority: Priority) => COLORS[priority];
  const priorityLabel = (priority: Priority) => LABELS[priority];
  const priorityWeight = (priority: Priority) => WEIGHTS[priority];
  return { priorities: PRIORITIES, priorityColor, priorityLabel, priorityWeight };
}
