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
import { useTaskStore } from '@/components/day-4-assignment/taskStore'

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
        <span class="stat-label">Total</span>
      </div>
      <div class="stat stat--done">
        <span class="stat-value">{{ doneCount }}</span>
        <span class="stat-label">Done</span>
      </div>
      <div class="stat stat--pending">
        <span class="stat-value">{{ pendingCount }}</span>
        <span class="stat-label">Pending</span>
      </div>
    </div>

    <div class="input-row">
      <input v-model="newTaskName" placeholder="Add a new task..." @keyup.enter="handleAdd" />
      <button @click="handleAdd">+ Add</button>
    </div>

    <p v-if="tasks.length === 0" class="empty">No tasks yet. Add one above!</p>

    <!-- TODO 7: Render the task list using tasks from the store -->
    <TransitionGroup tag="ul" name="list" class="task-list">
      <li v-for="task in tasks" :key="task.id" :class="{ 'is-done': task.done }">
        <input type="checkbox" v-model="task.done" @change="toggleTask(task.id)" />
        <span class="task-name" :class="{ done: task.done }">{{ task.name }}</span>
        <button class="remove" @click="removeTask(task.id)">Remove</button>
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
  background: #f4f6fa;
  border-radius: 12px;
  border: 1px solid #eef1f6;
}
.stat-value {
  font-size: 22px;
  font-weight: 800;
  color: #1B2A4A;
  line-height: 1;
}
.stat-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #8a94a6;
  font-weight: 600;
}
.stat--done { background: #ecfdf3; border-color: #c8f0d8; }
.stat--done .stat-value { color: #1f9d57; }
.stat--pending { background: #fff7ed; border-color: #fde4c8; }
.stat--pending .stat-value { color: #d97706; }

.input-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.input-row input {
  flex: 1;
  padding: 11px 14px;
  border: 1px solid #dfe3ea;
  border-radius: 10px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input-row input:focus {
  outline: none;
  border-color: #42B883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.15);
}
.input-row button {
  padding: 11px 20px;
  background: #42B883;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: background 0.2s, transform 0.05s;
}
.input-row button:hover { background: #369d6f; }
.input-row button:active { transform: scale(0.97); }

.empty {
  text-align: center;
  color: #aab2c0;
  font-style: italic;
  margin: 36px 0;
}

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
  background: white;
  border-radius: 12px;
  margin-bottom: 10px;
  border: 1px solid #eef1f6;
  transition: box-shadow 0.2s, transform 0.1s, opacity 0.2s;
}
.task-list li:hover {
  box-shadow: 0 4px 14px rgba(27, 42, 74, 0.08);
  transform: translateY(-1px);
}
.task-list li.is-done {
  background: #fafbfc;
  opacity: 0.75;
}
.task-list li input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #42B883;
  cursor: pointer;
}
.task-name {
  flex: 1;
  font-size: 14px;
  color: #334155;
}
.done {
  text-decoration: line-through;
  color: #aab2c0;
}
.task-list li .remove {
  padding: 6px 12px;
  background: #fef2f2;
  color: #dc2626;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: background 0.2s;
}
.task-list li .remove:hover { background: #fee2e2; }

/* Enter/leave/move animations for the task list */
.list-enter-active,
.list-leave-active { transition: all 0.25s ease; }
.list-enter-from { opacity: 0; transform: translateY(-8px); }
.list-leave-to { opacity: 0; transform: translateX(16px); }
.list-leave-active { position: absolute; width: 100%; }
.list-move { transition: transform 0.25s ease; }
</style>
