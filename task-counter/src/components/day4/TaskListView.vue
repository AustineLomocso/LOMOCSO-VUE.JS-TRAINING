<!--
=============================================================
  DAY 4 ASSIGNMENT — TaskListView.vue (refactored for Pinia)
  Remove all local state. Use the store for everything.
=============================================================
-->
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

// TODO 1: Import your store
import { useTaskStore } from '@/components/day4/taskStore'

// TODO 2: Get the store instance
const taskStore = useTaskStore()

// TODO 3: Destructure REACTIVE STATE using storeToRefs()
const { tasks, doneCount, pendingCount, totalCount } = storeToRefs(taskStore)

// TODO 4: Destructure ACTIONS directly (no storeToRefs needed for functions)
const { addTask, toggleTask, removeTask } = taskStore

// This local ref is fine — it's UI state, not task state
const newTaskName = ref('')

function handleAdd() {
  // TODO 5: Call addTask() from the store, then clear the input
  const name = newTaskName.value.trim()
  if (!name) return
  addTask(name)
  newTaskName.value = ''
}
</script>

<template>
  <div class="task-view">
    <!-- TODO 6: Display totalCount, doneCount, pendingCount from the store -->
    <div class="stats">
      <div class="stat">
        <span class="stat-value">{{ totalCount }}</span>
        <span class="stat-label"><i class="fa-solid fa-list"></i> Total</span>
      </div>
      <div class="stat stat--done">
        <span class="stat-value">{{ doneCount }}</span>
        <span class="stat-label"><i class="fa-solid fa-circle-check"></i> Done</span>
      </div>
      <div class="stat stat--pending">
        <span class="stat-value">{{ pendingCount }}</span>
        <span class="stat-label"><i class="fa-regular fa-clock"></i> Pending</span>
      </div>
    </div>

    <div class="input-row">
      <input v-model="newTaskName" placeholder="Add a new task..." @keyup.enter="handleAdd" />
      <button @click="handleAdd"><i class="fa-solid fa-plus"></i> Add</button>
    </div>

    <p v-if="tasks.length === 0" class="empty">
      <i class="fa-regular fa-clipboard"></i> No tasks yet. Add one above!
    </p>

    <!-- TODO 7: Render the task list using tasks from the store -->
    <TransitionGroup tag="ul" name="list" class="task-list">
      <li v-for="task in tasks" :key="task.id" :class="{ 'is-done': task.done }">
        <input type="checkbox" v-model="task.done" @change="toggleTask(task.id)" />
        <span class="task-name" :class="{ done: task.done }">{{ task.name }}</span>
        <button class="remove" @click="removeTask(task.id)">
          <i class="fa-solid fa-trash-can"></i> Remove
        </button>
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.task-view {
  font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
}

.stats {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 14px 8px;
  background: var(--surface-soft);
  border-radius: 12px;
  border: 1px solid var(--border-soft);
}
.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: var(--text-strong);
  line-height: 1;
}
.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--text-muted);
  font-weight: 600;
}
.stat-label i { margin-right: 3px; }
.stat--done { background: var(--primary-soft); border-color: var(--primary-soft-border); }
.stat--done .stat-value { color: var(--primary); }
.stat--pending { background: var(--warn-soft); border-color: var(--warn-soft-border); }
.stat--pending .stat-value { color: var(--warn); }

.input-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.input-row input {
  flex: 1;
  padding: 11px 14px;
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  font-size: 14px;
  background: var(--surface);
  color: var(--text-strong);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input-row input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(60, 107, 80, 0.15);
}
.input-row button {
  padding: 11px 20px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.2s, transform 0.05s;
}
.input-row button i { margin-right: 5px; }
.input-row button:hover { background: var(--primary-hover); }
.input-row button:active { transform: scale(0.97); }

.empty {
  text-align: center;
  color: var(--text-muted);
  font-style: italic;
  margin: 36px 0;
}
.empty i { margin-right: 6px; }

.task-list {
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0;
}
.task-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  background: var(--surface);
  border-radius: 12px;
  margin-bottom: 10px;
  border: 1px solid var(--border-soft);
  transition: box-shadow 0.2s, transform 0.1s, opacity 0.2s;
}
.task-list li:hover {
  box-shadow: 0 4px 14px rgba(56, 74, 54, 0.1);
  transform: translateY(-1px);
}
.task-list li.is-done {
  background: var(--primary-soft);
  border-color: var(--primary-soft-border);
  opacity: 0.8;
}
.task-list li input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  cursor: pointer;
}
.task-name {
  flex: 1;
  font-size: 14px;
  color: var(--text-body);
}
.done {
  text-decoration: line-through;
  color: var(--text-muted);
}
.task-list li .remove {
  padding: 6px 12px;
  background: var(--danger-soft);
  color: var(--danger);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.2s;
}
.task-list li .remove i { margin-right: 4px; }
.task-list li .remove:hover { background: var(--danger-soft-border); }

/* Enter/leave/move animations for the task list */
.list-enter-active,
.list-leave-active { transition: all 0.25s ease; }
.list-enter-from { opacity: 0; transform: translateY(-8px); }
.list-leave-to { opacity: 0; transform: translateX(16px); }
.list-leave-active { position: absolute; width: 100%; }
.list-move { transition: transform 0.25s ease; }
</style>
