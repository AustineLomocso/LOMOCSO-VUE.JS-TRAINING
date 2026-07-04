<!--
=============================================================
  DAY 5 ASSIGNMENT — TodoListView.vue
  Uses useFetch() to load and display todos from JSONPlaceholder
=============================================================
-->
<script setup>
import { ref, computed } from 'vue'
import { useFetch } from '@/components/day5/useFetch'

const filter = ref('all') // 'all' | 'done' | 'pending'

// TODO 1: Call useFetch with the JSONPlaceholder todos endpoint
// Rename 'data' to 'todos' using destructuring alias syntax
const { data: todos, loading, error, refetch } = useFetch('https://jsonplaceholder.typicode.com/todos')

// TODO 2: Create a filteredTodos computed() that:
//  - Returns [] if todos.value is null (still loading)
//  - Filters by filter.value ('all' shows first 20, 'done' shows completed, 'pending' shows incomplete)
const filteredTodos = computed(() => {
  if(!todos.value) return []
  if(filter.value === 'all') return todos.value.slice(0, 20)
  if(filter.value === 'done') return todos.value.filter(todo => todo.completed)
  if(filter.value === 'pending') return todos.value.filter(todo => !todo.completed)
})
</script>

<template>
  <div class="todo-view">
    <header class="app-header">
      <h1><i class="fa-solid fa-cloud-arrow-down header-icon"></i> Todo List</h1>
      <p class="subtitle">Loaded live from the JSONPlaceholder API</p>
    </header>

    <!-- TODO 3: Show a loading message/spinner while loading is true -->
    <div v-if="loading" class="loading">
      <i class="fa-solid fa-spinner fa-spin"></i> Loading todos...
    </div>

    <!-- TODO 4: Show an error message if error has a value -->
    <div v-else-if="error" class="error-box">
      <p><i class="fa-solid fa-triangle-exclamation"></i> Error loading todos: {{ error }}</p>
      <!-- EXTENSION: Retry button re-fetches when the request fails -->
      <button class="retry-btn" @click="refetch">
        <i class="fa-solid fa-rotate-right"></i> Retry
      </button>
    </div>

    <!-- TODO 5: Show the content block when NOT loading and NO error -->
    <div v-else>
      <!-- Filter buttons -->
      <div class="filters">
        <!-- TODO 6: Three buttons — All, Done, Pending -->
        <!-- Each sets filter.value and gets :class="{ active: filter === '...' }" -->
        <button @click="filter = 'all'" :class="{ active: filter === 'all' }">
          <i class="fa-solid fa-list"></i> All
        </button>
        <button @click="filter = 'done'" :class="{ active: filter === 'done' }">
          <i class="fa-solid fa-circle-check"></i> Done
        </button>
        <button @click="filter = 'pending'" :class="{ active: filter === 'pending' }">
          <i class="fa-regular fa-clock"></i> Pending
        </button>
      </div>

      <!-- TODO 7: Render filteredTodos using v-for -->
      <ul class="todo-list">
        <!-- li with checkbox (disabled, reflects todo.completed) and title -->
        <li v-for="todo in filteredTodos" :key="todo.id" :class="{ 'done-item': todo.completed }">
          <input type="checkbox" :checked="todo.completed" disabled />
          <span :class="{ 'completed-text': todo.completed }">{{ todo.title }}</span>
        </li>
      </ul>

      <!-- TODO 8: Show count of visible items -->
      <p class="count">
        <i class="fa-solid fa-list-check"></i>
        Showing {{ filteredTodos.length }} of {{ todos.length }} todos
      </p>
    </div>
  </div>
</template>

<style scoped>
.todo-view { font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif; }
.app-header { margin-bottom: 20px; }
h1 { color: var(--text-strong); margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
.header-icon { color: var(--primary); font-size: 22px; margin-right: 4px; }
.subtitle { color: var(--text-muted); font-size: 14px; margin: 4px 0 0; }
.loading { text-align: center; padding: 48px; color: var(--primary); font-size: 16px; font-weight: 600; }
.loading i { margin-right: 8px; }
.error-box {
  background: var(--danger-soft);
  border: 1px solid var(--danger-soft-border);
  border-radius: 12px;
  padding: 16px;
  color: var(--danger);
  font-size: 14px;
  font-weight: 600;
}
.error-box p { margin: 0 0 12px; }
.retry-btn {
  padding: 8px 16px;
  background: var(--danger);
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  transition: opacity 0.2s;
}
.retry-btn:hover { opacity: 0.88; }
.retry-btn i { margin-right: 6px; }
.filters { display: flex; gap: 8px; margin-bottom: 16px; }
.filters button {
  padding: 7px 16px;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  background: var(--surface);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-body);
  transition: all 0.2s;
}
.filters button i { margin-right: 5px; }
.filters button:hover { border-color: var(--primary); color: var(--primary); }
.filters button.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.todo-list { list-style: none; padding: 0; margin: 0; max-height: 380px; overflow-y: auto; }
.todo-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  background: var(--surface);
  border-radius: 10px;
  margin-bottom: 8px;
  border: 1px solid var(--border-soft);
  font-size: 14px;
  color: var(--text-body);
}
.todo-list li.done-item { background: var(--primary-soft); border-color: var(--primary-soft-border); opacity: 0.85; }
.todo-list li input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--primary); }
.todo-list li span { flex: 1; }
.completed-text { text-decoration: line-through; color: var(--text-muted); }
.count { font-size: 13px; color: var(--text-muted); margin-top: 12px; text-align: right; font-weight: 600; }
.count i { margin-right: 5px; color: var(--primary); }
</style>
