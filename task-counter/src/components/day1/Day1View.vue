<!--
=============================================================
  DAY 1 — Task Counter
  Local reactive state: add / toggle / remove / filter tasks
  with total / done / pending counts.
=============================================================
-->
<script setup>
import { ref, computed } from 'vue'

const newTaskName = ref('')
const newTaskPriority = ref('Medium')
const filter = ref('all')

const tasks = ref([])

const totalCount   = computed(() => tasks.value.length)
const doneCount    = computed(() => tasks.value.filter(t => t.done).length)
const pendingCount = computed(() => tasks.value.filter(t => !t.done).length)

const visibleTasks = computed(() => {
  if (filter.value === 'done') return tasks.value.filter(t => t.done)
  if (filter.value === 'pending') return tasks.value.filter(t => !t.done)
  return tasks.value
})

function addTask() {
  const name = newTaskName.value.trim()
  if (!name) return
  tasks.value.push({
    id: Date.now(),
    name,
    done: false,
    priority: newTaskPriority.value,
  })
  newTaskName.value = ''
}

function toggleTask(id) {
  const task = tasks.value.find(t => t.id === id)
  if (task) task.done = !task.done
}

function removeTask(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

function clearDone() {
  tasks.value = tasks.value.filter(t => !t.done)
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1><i class="fa-solid fa-list-check header-icon"></i> Task Counter</h1>
      <p class="subtitle">Stay on top of what matters today</p>
    </header>

    <div class="input-row">
      <input
        v-model="newTaskName"
        @keyup.enter="addTask"
        placeholder="Add a new task..."
      />
      <select v-model="newTaskPriority">
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <button @click="addTask"><i class="fa-solid fa-plus"></i> Add</button>
    </div>

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

    <div class="filter-row">
      <button :class="{ active: filter === 'all' }" @click="filter = 'all'">
        <i class="fa-solid fa-list"></i> All
      </button>
      <button :class="{ active: filter === 'done' }" @click="filter = 'done'">
        <i class="fa-solid fa-circle-check"></i> Done
      </button>
      <button :class="{ active: filter === 'pending' }" @click="filter = 'pending'">
        <i class="fa-regular fa-clock"></i> Pending
      </button>
      <button v-if="doneCount > 0" class="clear" @click="clearDone">
        <i class="fa-solid fa-broom"></i> Clear done
      </button>
    </div>

    <p v-if="tasks.length === 0" class="empty">
      <i class="fa-regular fa-clipboard"></i> No tasks yet. Add one above!
    </p>

    <TransitionGroup tag="ul" name="list" class="task-list">
      <li v-for="task in visibleTasks" :key="task.id" :class="{ 'is-done': task.done }">
        <input type="checkbox" v-model="task.done" />
        <span class="task-name" :class="{ done: task.done }">
          {{ task.name }}
          <small class="priority" :class="'priority--' + task.priority.toLowerCase()">{{ task.priority }}</small>
        </span>
        <button @click="removeTask(task.id)">
          <i class="fa-solid fa-trash-can"></i> Remove
        </button>
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.app {
  font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
  padding: 32px;
  background: var(--surface);
  border-radius: 18px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--border-soft);
}

.app-header {
  margin-bottom: 24px;
}

h1 {
  color: var(--text-strong);
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
.header-icon {
  color: var(--primary);
  font-size: 22px;
  margin-right: 4px;
}

.subtitle {
  margin: 4px 0 0;
  color: var(--text-muted);
  font-size: 14px;
}

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

.input-row select {
  padding: 11px 12px;
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  font-size: 14px;
  background: var(--surface);
  color: var(--text-strong);
  cursor: pointer;
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.priority {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 2px 8px;
  border-radius: 999px;
}

.priority--low { background: var(--primary-soft); color: var(--primary-hover); }
.priority--medium { background: var(--warn-soft); color: var(--warn); }
.priority--high { background: var(--danger-soft); color: var(--danger); }

.done {
  text-decoration: line-through;
  color: var(--text-muted);
}

.task-list li button {
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
.task-list li button i { margin-right: 4px; }

.task-list li button:hover { background: var(--danger-soft-border); }

.filter-row {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.filter-row button {
  padding: 7px 16px;
  border: 1px solid var(--border-soft);
  background: var(--surface);
  border-radius: 999px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-body);
  transition: all 0.2s;
}
.filter-row button i { margin-right: 4px; }

.filter-row button:hover { border-color: var(--primary); color: var(--primary); }

.filter-row button.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.filter-row .clear {
  margin-left: auto;
  background: var(--danger-soft);
  color: var(--danger);
  border-color: var(--danger-soft-border);
}
.filter-row .clear:hover {
  background: var(--danger-soft-border);
  color: var(--danger);
  border-color: var(--danger);
}

/* ───── Task list enter/leave/move animations ───── */
.list-enter-active,
.list-leave-active {
  transition: all 0.25s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
.list-leave-active {
  position: absolute;
  width: 100%;
}
.list-move {
  transition: transform 0.25s ease;
}
</style>
