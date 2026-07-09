# Day 2 — Component Communication in Vue 3

### Course Material: Props, Emits, Slots & One-Way Data Flow

> This document explains the **syntax and structure** behind the Day 2 assignment
> (`TaskCard_day2.vue` + `TaskListView_day2.vue`). It is reference material — it
> teaches the concepts the task asks you to apply. It does **not** solve the TODOs.

---

## 1. The Big Picture: Parent ↔ Child Components

This assignment is built on the single most important pattern in Vue:

```
        ┌─────────────────────────────┐
        │   TaskListView.vue (PARENT) │   ← owns the data (the "tasks" array)
        │   - holds state             │
        │   - handles changes         │
        └──────────────┬──────────────┘
                       │
        props (data goes DOWN) │ ▼      ▲ │ emits (events go UP)
                       ▼      │
        ┌─────────────────────────────┐
        │     TaskCard.vue (CHILD)    │   ← displays one task
        │   - receives a task         │
        │   - asks parent to change   │
        └─────────────────────────────┘
```

Two rules drive everything:

1. **Data flows DOWN** — the parent passes data into the child through **props**.
2. **Events flow UP** — the child cannot change the parent's data directly; it
   **emits an event** to ask the parent to make the change.

This is called **one-way data flow**, and it is why the assignment says:

> *"Parent owns the state — TaskCard never mutates props directly."*

---

## 2. `<script setup>` — The Composition API Shorthand

Both files start with:

```vue
<script setup>
</script>
```

`<script setup>` is Vue 3's compile-time syntax for the Composition API. Anything
you declare at the top level (variables, functions, imports) is **automatically
available in the template** — no `return` statement, no `export default`, no
`components: {}` registration needed.

```vue
<script setup>
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'   // importing = registering. Usable in template immediately.

const message = 'hello'                 // usable as {{ message }} in template
function doThing() { /* ... */ }         // usable as @click="doThing"
</script>
```

---

## 3. Props — Receiving Data (the CHILD side)

### What a prop is
A **prop** is a custom attribute the parent sets on the child. It is the channel
for data flowing *down*.

### `defineProps()`
Inside `TaskCard.vue`, props are declared with the `defineProps()` **compiler
macro**:

```vue
<script setup>
const props = defineProps({
  task: {
    type: Object,      // expected data type
    required: true     // parent MUST provide it
  }
})
</script>
```

Key points about the syntax:

| Detail | Explanation |
|---|---|
| **Compiler macro** | `defineProps` is *not* imported. Vue's compiler understands it inside `<script setup>`. |
| **Object form** | `{ task: { type: Object, required: true } }` gives validation. The shorthand `defineProps(['task'])` works too but skips validation. |
| **`type: Object`** | Documents that `task` is `{ id, name, done, dueDate }`. |
| **`required: true`** | Vue warns in the console if the parent forgets to pass it. |
| **Return value** | `const props = ...` lets you reference `props.task` in JS. In the *template* you can write `task` directly (no `props.` prefix). |

### Using a prop in the template
```vue
<template>
  <span class="name">{{ task.name }}</span>   <!-- read task fields directly -->
</template>
```

### ⚠️ Props are READ-ONLY
The assignment hint warns explicitly:

```js
// NEVER do this inside TaskCard:
props.task.done = !props.task.done   // ❌ mutating a prop → Vue console warning
```

The child must **not** reassign or mutate a prop. To change data, it emits an
event (next section).

---

## 4. Emits — Sending Events Up (the CHILD side)

When the child needs the parent to *do* something (toggle done, delete a task),
it **emits a custom event**.

### `defineEmits()`
```vue
<script setup>
const emit = defineEmits(['complete', 'delete'])
</script>
```

- Also a **compiler macro** (no import).
- The array lists the event names this component is allowed to fire.
- `defineEmits` returns the `emit` function you call to fire an event.

### Firing an event with a payload
```vue
<template>
  <button @click="emit('complete', task.id)">Complete</button>
  <button @click="emit('delete',   task.id)">Delete</button>
</template>
```

Syntax breakdown of `emit('complete', task.id)`:

| Part | Meaning |
|---|---|
| `'complete'` | the event **name** — must match what `defineEmits` declared |
| `task.id` | the **payload** — extra data sent to the parent's handler |

The child says *"the user wants to complete the task with this id"* and stops
there. It does **not** know or care how the parent fulfills the request. That
separation is what makes `TaskCard` **reusable**.

---

## 5. Conditional Text & Conditional Classes (the CHILD side)

The assignment asks the button to say **"Complete"** when not done, **"Undo"**
when done, and to style the card differently when done.

### Ternary expression inside `{{ }}`
Vue templates accept JavaScript *expressions* inside mustaches:

```vue
<button>{{ task.done ? 'Undo' : 'Complete' }}</button>
```

### Dynamic class binding with `:class`
```vue
<div class="task-card" :class="{ completed: task.done }">
```

- `:class` is shorthand for `v-bind:class`.
- The **object syntax** `{ completed: task.done }` means: apply the CSS class
  `completed` **only when** `task.done` is truthy.
- It combines with the static `class="task-card"`, so the element can have both
  `task-card` and `task-card completed`.

This pairs with the scoped CSS already in the file:

```css
.task-card.completed {
  background: #f0fdf4;
  opacity: 0.8;
}
```

---

## 6. Slots — Letting the Parent Inject Content (the CHILD side)

A **slot** is a placeholder in the child's template that the parent fills with
its own markup. It is how you make a component flexible about *what goes inside
it*.

### Named slot in the child
```vue
<template>
  <div class="task-header">
    <span class="name">{{ task.name }}</span>
    <slot name="meta" />        <!-- placeholder named "meta" -->
  </div>
</template>
```

- `<slot name="meta" />` reserves a spot called **"meta"**.
- If the parent provides content for that slot, it renders here.
- A slot *without* a `name` is the **default slot**; a slot *with* a `name` is a
  **named slot** (this task uses a named one for the due-date metadata).

The child decides **where** the metadata appears; the parent decides **what** the
metadata is.

---

## 7. Putting It Together: The PARENT (`TaskListView.vue`)

The parent is the owner of state and the orchestrator.

### 7.1 Reactive state with `ref()`
```vue
<script setup>
import { ref } from 'vue'

const tasks = ref([
  { id: 1, name: 'Write report', done: false, dueDate: '2026-07-01' },
  // ...at least 3 tasks
])
</script>
```

- `ref()` makes a value **reactive** — when it changes, the UI re-renders.
- In `<script>`, access/modify the contents via `.value` (e.g. `tasks.value`).
- In the **template**, Vue unwraps refs automatically — you write `tasks`, not
  `tasks.value`.

### 7.2 Rendering a list with `v-for`
```vue
<template>
  <TaskCard
    v-for="task in tasks"
    :key="task.id"
    :task="task"
    @complete="handleComplete"
    @delete="handleDelete"
  >
    <template #meta>
      Due: {{ task.dueDate }}
    </template>
  </TaskCard>
</template>
```

Line-by-line syntax:

| Syntax | Meaning |
|---|---|
| `v-for="task in tasks"` | Render one `<TaskCard>` for each item in the array. |
| `:key="task.id"` | A **unique, stable key** per item. Required for `v-for`; lets Vue track items efficiently and correctly. |
| `:task="task"` | **Pass the prop down.** `:task` is `v-bind:task` — binds the JS value `task` to the child's `task` prop. |
| `@complete="handleComplete"` | **Listen for the emitted event.** `@complete` is `v-on:complete`. When the child emits `complete`, `handleComplete` runs. |
| `@delete="handleDelete"` | Same pattern for the `delete` event. |

### 7.3 Static vs dynamic attributes — the colon matters
```vue
:task="task"     <!-- with colon → JS expression: passes the variable `task`     -->
task="task"      <!-- no colon   → literal string: passes the text "task" ❌      -->
```
The leading `:` (i.e. `v-bind`) is what makes the attribute a **JavaScript
expression** instead of a plain string.

### 7.4 Receiving the payload in handlers
The child emitted `emit('complete', task.id)`. The parent receives that `id`:

```js
function handleComplete(id) {
  // toggle the matching task's `done`
}

function handleDelete(id) {
  // remove the matching task from the array
}
```

The parameter `id` is exactly the payload the child sent. The parent owns the
`tasks` array, so **only the parent mutates it** — keeping data flow one-way.

### 7.5 Filling the named slot
```vue
<template #meta>
  Due: {{ task.dueDate }}
</template>
```

- `<template #meta>` targets the child's `<slot name="meta" />`.
- `#meta` is shorthand for `v-slot:meta`.
- Everything inside renders where the child placed that slot.

---

## 8. Vocabulary of Directives & Shorthands Used

| Long form | Shorthand | Example | Purpose |
|---|---|---|---|
| `v-bind:prop` | `:prop` | `:task="task"` | Pass dynamic data / props down |
| `v-on:event` | `@event` | `@complete="fn"` | Listen for events / DOM events |
| `v-slot:name` | `#name` | `#meta` | Fill a named slot |
| `v-for` | — | `v-for="t in tasks"` | Loop over a list |
| `{{ }}` | — | `{{ task.name }}` | Interpolate an expression |

---

## 9. Concept Checklist (what each file is teaching)

**`TaskCard.vue` (CHILD) teaches:**
- [ ] `defineProps()` — declaring and validating incoming data
- [ ] `defineEmits()` — declaring outgoing events
- [ ] `emit('name', payload)` — sending an event up with data
- [ ] `{{ ternary }}` — conditional text (Complete / Undo)
- [ ] `:class="{ completed: task.done }"` — conditional styling
- [ ] `<slot name="meta" />` — exposing a fill point to the parent
- [ ] Treating props as **read-only**

**`TaskListView.vue` (PARENT) teaches:**
- [ ] `ref([])` — reactive state ownership
- [ ] `v-for` + `:key` — rendering a list of components
- [ ] `:task="task"` — passing props down
- [ ] `@complete` / `@delete` — listening to child events
- [ ] Handler functions that receive the **payload** and update state
- [ ] `<template #meta>` — supplying named-slot content

---

## 10. Mental Model Summary

> **The child is a "dumb" display + button.** It shows whatever task it's given
> and shouts an event when clicked. **The parent is the "brain."** It holds the
> real list, listens for shouts, and is the only one allowed to change the data.
>
> Props go **down**. Events go **up**. State lives in **one** place (the parent).

This separation is what makes `TaskCard` a **reusable component**: it works for
*any* task, in *any* parent, because it never assumes how the data is stored or
changed.

---

## 11. The Extension Concepts (optional, mentioned in the brief)

The assignment's extension section hints at three further ideas:

- **A priority badge prop** — add another prop (e.g. `priority: String`) and use
  `:class` to colour-code it. *Concept: multiple props, conditional styling.*
- **Edit mode** — toggle the name into an `<input>` on click. *Concept: local UI
  state with `ref(false)`, conditional rendering with `v-if`/`v-else`.*
- **An `'update'` event** — emit the edited name. *Concept: a third custom event
  carrying a richer payload (e.g. `{ id, name }`).*

These reinforce the same core loop: **local interaction in the child → emit →
parent updates the authoritative state**.
