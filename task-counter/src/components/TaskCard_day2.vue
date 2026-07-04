<!--
=============================================================
  DAY 2 ASSIGNMENT — Reusable TaskCard Component
  Topic: Props, Emits, Slots, Component Lifecycle
  Files: TaskCard.vue (child)  +  TaskListView.vue (parent)
  Time: 60 minutes
=============================================================

OBJECTIVE
---------
Build a reusable TaskCard child component that accepts data as props
and communicates back to the parent via custom events (emits). The
parent renders a list of TaskCards and handles all state changes.

WHAT TO BUILD — TaskCard.vue (this file)
-----------------------------------------
  1. Accept a "task" prop: { id, name, done, dueDate }
  2. Display the task name and dueDate (via a named slot "meta")
  3. Emit "complete" event (payload: task.id) when Complete/Undo clicked
  4. Emit "delete" event (payload: task.id) when Delete clicked
  5. Show "Complete" when task.done is false, "Undo" when true
  6. Apply a visual style change when task.done is true

WHAT TO BUILD — TaskListView.vue (see that file)
-------------------------------------------------
  1. Hold a tasks ref array with at least 3 sample tasks
  2. Render a TaskCard for each task using v-for
  3. Handle @complete → toggle that task's done property
  4. Handle @delete → remove that task from the array
  5. Fill the "meta" named slot with the due date

REQUIREMENTS (Acceptance Criteria)
------------------------------------
  [x] TaskCard uses defineProps({ task: Object })
  [x] TaskCard uses defineEmits(['complete', 'delete'])
  [x] TaskCard has <slot name="meta" /> for optional metadata
  [x] Parent passes :task="task" and listens @complete @delete
  [x] Parent fills the slot with <template #meta>...</template>
  [x] Data flows DOWN (props) and events flow UP (emits)
  [x] Parent owns the state — TaskCard never mutates props directly

EXTENSION (additional points)
---------------------------------
  - Add a priority badge prop (low/medium/high) with colour coding
  - Add an edit mode: clicking the task name turns it into an input
  - Emit an "update" event when the edited name is saved

HINTS (read only if stuck)
---------------------------
  Hint 1: const props = defineProps({ task: { type: Object, required: true } })
  Hint 2: const emit = defineEmits(['complete', 'delete'])
  Hint 3: @click="emit('complete', props.task.id)"
  Hint 4: In the parent — @complete="handleComplete"
           function handleComplete(id) { find task by id, toggle done }
  Hint 5: Named slot in child  → <slot name="meta" />
           Fill in parent      → <template #meta>Due: {{ task.dueDate }}</template>
  Hint 6: NEVER do this inside TaskCard: props.task.done = !props.task.done
           That mutates a prop directly — Vue will warn you. Emit instead.
=============================================================
-->

<!-- ─── TaskCard.vue ─── -->
<script setup>
import { ref } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  // EXTENSION: priority badge — 'low' | 'medium' | 'high'
  priority: {
    type: String,
    default: null,
    validator: v => ['low', 'medium', 'high'].includes(v)
  }
})

const emit = defineEmits(['complete', 'delete', 'update'])

// EXTENSION: edit mode
const editing = ref(false)
const editName = ref('')

function startEdit() {
  if (props.task.done) return   // don't allow editing a completed task
  editName.value = props.task.name
  editing.value = true
}

function saveEdit() {
  const trimmed = editName.value.trim()
  if (trimmed && trimmed !== props.task.name) {
    emit('update', { id: props.task.id, name: trimmed })
  }
  editing.value = false
}

function cancelEdit() {
  editing.value = false
}
</script>

<template>
  <div class="task-card" :class="{ completed: task.done }">

    <div class="task-header">
      <!-- EXTENSION: priority badge -->
      <span v-if="priority" class="priority-badge" :class="`priority-${priority}`">
        {{ priority }}
      </span>

      <!-- EXTENSION: edit mode — click name to edit, Enter/blur to save, Esc to cancel -->
      <span v-if="!editing" class="name" :title="task.done ? '' : 'Click to edit'" @click="startEdit">
        <span v-if="task.done" class="check"><i class="fa-solid fa-check"></i></span>
        {{ task.name }}
      </span>
      <input
        v-else
        v-model="editName"
        class="name-input"
        autofocus
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        @blur="saveEdit"
      />

      <span class="meta">
        <slot name="meta" />
      </span>
    </div>

    <div class="task-actions">
      <button class="btn-complete" @click="emit('complete', task.id)">
        <i :class="task.done ? 'fa-solid fa-rotate-left' : 'fa-solid fa-check'"></i>
        {{ task.done ? 'Undo' : 'Complete' }}
      </button>
      <button class="btn-delete" @click="emit('delete', task.id)">
        <i class="fa-solid fa-trash-can"></i> Delete
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ── Priority badge ─────────────────────────────────── */
.priority-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  margin-right: 6px;
}
.priority-low    { background: var(--primary-soft); color: var(--primary-hover); }
.priority-medium { background: var(--warn-soft); color: var(--warn); }
.priority-high   { background: var(--danger-soft); color: var(--danger); }

/* ── Inline name editor ─────────────────────────────── */
.name-input {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-strong);
  border: 1.5px solid var(--primary);
  border-radius: 6px;
  padding: 3px 8px;
  outline: none;
  background: var(--primary-soft);
}

/* ── Existing card styles ───────────────────────────── */
.task-card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-left: 4px solid var(--primary);
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-soft);
}
.task-card:hover {
  box-shadow: 0 6px 18px rgba(56, 74, 54, 0.12);
  transform: translateY(-2px);
}
.task-card.completed {
  background: var(--primary-soft);
  border-color: var(--primary-soft-border);
  border-left-color: var(--primary);
  opacity: 0.85;
}
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.task-header span.name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
  color: var(--text-strong);
}
.task-card.completed span.name {
  text-decoration: line-through;
  color: var(--text-muted);
}
.check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: var(--primary);
  color: #fff;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
  text-decoration: none;
}
.task-header .meta {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--surface-soft);
  padding: 3px 10px;
  border-radius: 999px;
  white-space: nowrap;
}
.task-actions {
  display: flex;
  gap: 8px;
}
.btn-complete {
  padding: 7px 16px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s, transform 0.05s;
}
.btn-complete i { margin-right: 4px; }
.btn-complete:hover { background: var(--primary-hover); }
.btn-complete:active { transform: scale(0.97); }
.task-card.completed .btn-complete {
  background: var(--surface-soft);
  color: var(--text-body);
  border: 1px solid var(--border-soft);
}
.task-card.completed .btn-complete:hover { background: var(--border-soft); }
.btn-delete {
  padding: 7px 16px;
  background: var(--danger-soft);
  color: var(--danger);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-delete i { margin-right: 4px; }
.btn-delete:hover { background: var(--danger-soft-border); }
</style>
