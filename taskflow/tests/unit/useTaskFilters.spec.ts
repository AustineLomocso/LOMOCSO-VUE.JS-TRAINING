import { describe, expect, it } from 'vitest';
import { useTaskFilters } from '@/composables/useTaskFilters';
import type { Task } from '@/stores/tasks';

const tasks: Task[] = [
  {
    id: 1,
    title: 'Alpha',
    description: 'first',
    priority: 'low',
    done: false,
    dueDate: '2026-08-10',
    category: 'Work',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Bravo',
    description: 'second task',
    priority: 'high',
    done: false,
    category: 'Personal',
    createdAt: '2026-03-01T00:00:00.000Z',
  },
  {
    id: 3,
    title: 'Charlie',
    description: 'third',
    priority: 'medium',
    done: false,
    dueDate: '2026-07-01',
    createdAt: '2026-02-01T00:00:00.000Z',
  },
];

const ids = (list: Task[]) => list.map((t) => t.id);

describe('useTaskFilters', () => {
  it('defaults to priority sort (high → low)', () => {
    const { filteredTasks } = useTaskFilters(tasks);
    expect(ids(filteredTasks.value)).toEqual([2, 3, 1]);
  });

  it('filters by search term across title and description', () => {
    const { searchTerm, filteredTasks } = useTaskFilters(tasks);
    searchTerm.value = 'task'; // only "second task"
    expect(ids(filteredTasks.value)).toEqual([2]);
  });

  it('filters by priority', () => {
    const { priorityFilter, filteredTasks } = useTaskFilters(tasks);
    priorityFilter.value = 'high';
    expect(ids(filteredTasks.value)).toEqual([2]);
  });

  it('filters by category', () => {
    const { categoryFilter, filteredTasks } = useTaskFilters(tasks);
    categoryFilter.value = 'Work';
    expect(ids(filteredTasks.value)).toEqual([1]);
  });

  it('sorts by title A→Z', () => {
    const { sortBy, filteredTasks } = useTaskFilters(tasks);
    sortBy.value = 'title';
    expect(ids(filteredTasks.value)).toEqual([1, 2, 3]);
  });

  it('sorts by due date soonest first, undated last', () => {
    const { sortBy, filteredTasks } = useTaskFilters(tasks);
    sortBy.value = 'dueDate';
    expect(ids(filteredTasks.value)).toEqual([3, 1, 2]);
  });

  it('sorts by newest created first', () => {
    const { sortBy, filteredTasks } = useTaskFilters(tasks);
    sortBy.value = 'created';
    expect(ids(filteredTasks.value)).toEqual([2, 3, 1]);
  });

  it('does not mutate the source array', () => {
    const { sortBy, filteredTasks } = useTaskFilters(tasks);
    sortBy.value = 'title';
    void filteredTasks.value;
    expect(ids(tasks)).toEqual([1, 2, 3]); // original order intact
  });

  it('reports hasActiveFilters', () => {
    const { searchTerm, hasActiveFilters } = useTaskFilters(tasks);
    expect(hasActiveFilters.value).toBe(false);
    searchTerm.value = 'a';
    expect(hasActiveFilters.value).toBe(true);
  });
});
