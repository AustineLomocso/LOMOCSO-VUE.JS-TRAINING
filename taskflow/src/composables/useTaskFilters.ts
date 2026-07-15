import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue';
import type { Priority, Task } from '@/stores/tasks';
import { usePriority } from '@/composables/usePriority';

export type PriorityFilter = 'all' | Priority;
export type CategoryFilter = 'all' | string;
export type SortKey = 'priority' | 'dueDate' | 'title' | 'created';

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'priority', label: 'Priority' },
  { value: 'dueDate', label: 'Due date' },
  { value: 'title', label: 'Title' },
  { value: 'created', label: 'Newest' },
];

/**
 * Owns the search / priority-filter / category-filter / sort view-state for a task
 * list and returns a computed, filtered + sorted list derived from `source`.
 *
 * State lives here (not in the Pinia store) because it's transient view state that
 * doesn't need persistence and keeps the filtering logic unit-testable in isolation.
 */
export function useTaskFilters(source: MaybeRefOrGetter<Task[]>) {
  const { priorityWeight } = usePriority();

  const searchTerm = ref('');
  const priorityFilter = ref<PriorityFilter>('all');
  const categoryFilter = ref<CategoryFilter>('all');
  const sortBy = ref<SortKey>('priority');

  const filteredTasks = computed<Task[]>(() => {
    const term = searchTerm.value.trim().toLowerCase();

    const result = toValue(source).filter((task) => {
      const matchesSearch =
        !term ||
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term);
      const matchesPriority =
        priorityFilter.value === 'all' || task.priority === priorityFilter.value;
      const matchesCategory =
        categoryFilter.value === 'all' || task.category === categoryFilter.value;
      return matchesSearch && matchesPriority && matchesCategory;
    });

    // Sort a copy so the source array is never mutated.
    return [...result].sort((a, b) => {
      switch (sortBy.value) {
        case 'priority':
          return priorityWeight(b.priority) - priorityWeight(a.priority);
        case 'dueDate': {
          // Undated tasks sort last.
          const ax = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const bx = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          return ax - bx;
        }
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created': {
          const ax = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bx = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bx - ax; // newest first
        }
        default:
          return 0;
      }
    });
  });

  /** True when filters are active but nothing matched (vs. genuinely empty source). */
  const hasActiveFilters = computed(
    () =>
      !!searchTerm.value.trim() ||
      priorityFilter.value !== 'all' ||
      categoryFilter.value !== 'all',
  );

  return {
    searchTerm,
    priorityFilter,
    categoryFilter,
    sortBy,
    filteredTasks,
    hasActiveFilters,
  };
}
