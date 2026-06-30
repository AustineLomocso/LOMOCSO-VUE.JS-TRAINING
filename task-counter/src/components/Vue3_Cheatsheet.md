# Vue 3 Syntax Cheatsheet

> Quick reference for the syntax used throughout this project:
> **Vue 3 + Composition API + `<script setup>` (Single-File Components)**.
> Skim it while coding. Each block is copy-paste-ready syntax, not full solutions.

---

## 1. Single-File Component (SFC) Skeleton

Every `.vue` file has up to three blocks:

```vue
<script setup>
  // JavaScript logic — state, functions, imports
</script>

<template>
  <!-- HTML markup -->
</template>

<style scoped>
  /* CSS — `scoped` keeps it local to this component */
</style>
```

- **`<script setup>`** — Composition API shorthand. Top-level declarations are
  auto-available in the template (no `return`, no `export default`).
- **`<style scoped>`** — styles only apply to this component's elements.

---

## 2. Reactivity — `ref` & `reactive`

```vue
<script setup>
import { ref, reactive, computed, watch } from 'vue'

// ref() — for primitives AND objects/arrays. Access with .value in JS.
const count = ref(0)
const tasks = ref([])

count.value++                 // change in <script> → use .value
tasks.value.push({ id: 1 })

// reactive() — for objects only, no .value needed
const state = reactive({ name: 'Vue', open: false })
state.open = true
</script>

<template>
  {{ count }}                  <!-- template auto-unwraps refs: NO .value here -->
</template>
```

| | `ref()` | `reactive()` |
|---|---|---|
| Works with | anything | objects/arrays only |
| Access in JS | `x.value` | `x.prop` |
| Access in template | `x` | `x.prop` |
| Can reassign whole value | ✅ `x.value = []` | ❌ loses reactivity |

---

## 3. Text & Attribute Binding

```vue
<template>
  <!-- Interpolation: any JS expression -->
  <p>{{ message }}</p>
  <p>{{ count * 2 }}</p>
  <p>{{ isDone ? 'Done' : 'Pending' }}</p>

  <!-- Attribute binding: v-bind  →  shorthand ":" -->
  <img v-bind:src="imageUrl" />
  <img :src="imageUrl" />               <!-- same thing -->
  <input :value="text" :disabled="isLocked" />

  <!-- Raw HTML (use carefully) -->
  <div v-html="rawHtmlString"></div>
</template>
```

> `{{ }}` accepts **expressions**, not statements. No `if`, no `let`, no `for`.

---

## 4. Class & Style Bindings

```vue
<template>
  <!-- Object syntax: class applied when value is truthy -->
  <div :class="{ active: isActive, completed: task.done }"></div>

  <!-- Array syntax -->
  <div :class="[baseClass, isActive ? 'on' : 'off']"></div>

  <!-- Static + dynamic combine -->
  <div class="card" :class="{ completed: done }"></div>

  <!-- Inline style (camelCase keys) -->
  <div :style="{ color: textColor, fontSize: size + 'px' }"></div>
</template>
```

---

## 5. Conditionals & Lists

```vue
<template>
  <!-- Conditional rendering -->
  <p v-if="status === 'loading'">Loading…</p>
  <p v-else-if="error">Error!</p>
  <p v-else>Ready</p>

  <!-- v-show: toggles CSS display only (element stays in DOM) -->
  <div v-show="isVisible">Peekaboo</div>

  <!-- List rendering — :key is REQUIRED and must be unique/stable -->
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>

  <!-- With index -->
  <li v-for="(item, i) in items" :key="item.id">{{ i }} — {{ item.name }}</li>

  <!-- Looping an object -->
  <li v-for="(value, key) in obj" :key="key">{{ key }}: {{ value }}</li>
</template>
```

> Avoid `v-if` and `v-for` on the **same element**. Wrap with a `<template>` if needed.

---

## 6. Event Handling

```vue
<template>
  <!-- v-on  →  shorthand "@" -->
  <button v-on:click="handleClick">Click</button>
  <button @click="handleClick">Click</button>          <!-- same -->

  <!-- Inline expression -->
  <button @click="count++">+1</button>

  <!-- Pass arguments -->
  <button @click="remove(item.id)">Delete</button>

  <!-- Access the native event with $event -->
  <input @input="onInput($event)" />

  <!-- Event modifiers -->
  <form @submit.prevent="onSubmit"></form>   <!-- preventDefault -->
  <div @click.stop="…"></div>                <!-- stopPropagation -->
  <input @keyup.enter="search" />            <!-- key modifier -->
  <button @click.once="init"></button>       <!-- fire only once -->
</template>
```

---

## 7. Two-Way Binding — `v-model`

```vue
<script setup>
import { ref } from 'vue'
const name = ref('')
const agreed = ref(false)
const choice = ref('a')
</script>

<template>
  <input v-model="name" />              <!-- text -->
  <textarea v-model="bio"></textarea>
  <input type="checkbox" v-model="agreed" />     <!-- boolean -->
  <select v-model="choice">
    <option value="a">A</option>
    <option value="b">B</option>
  </select>

  <!-- Modifiers -->
  <input v-model.trim="name" />         <!-- trims whitespace -->
  <input v-model.number="age" />        <!-- casts to number -->
  <input v-model.lazy="name" />         <!-- syncs on change, not input -->
</template>
```

---

## 8. Computed & Watchers

```vue
<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

const first = ref('Ada')
const last  = ref('Lovelace')

// computed: cached, recalculates only when dependencies change
const fullName = computed(() => `${first.value} ${last.value}`)

// watch: react to a specific source changing
watch(first, (newVal, oldVal) => {
  console.log(`changed from ${oldVal} to ${newVal}`)
})

// watch multiple sources
watch([first, last], ([nf, nl]) => { /* … */ })

// watchEffect: runs immediately + re-runs when any used ref changes
watchEffect(() => console.log(first.value))
</script>
```

> Use **computed** for derived values you display. Use **watch** for side effects
> (API calls, logging) when something changes.

---

## 9. Props (Child Receives Data)

```vue
<script setup>
// Compiler macros — NOT imported.

// Object form (with validation) — preferred
const props = defineProps({
  task:     { type: Object,  required: true },
  title:    { type: String,  default: 'Untitled' },
  count:    { type: Number,  default: 0 },
  tags:     { type: Array,   default: () => [] }   // object/array defaults need a factory fn
})

// Array form (no validation)
// const props = defineProps(['task', 'title'])
</script>

<template>
  <h2>{{ title }}</h2>      <!-- use props directly by name in template -->
  <p>{{ task.name }}</p>
</template>
```

> ⚠️ Props are **read-only**. Never assign to `props.x` — emit an event instead.

---

## 10. Emits (Child Sends Events Up)

```vue
<script setup>
const emit = defineEmits(['complete', 'delete', 'update'])

function onSave(newName) {
  emit('update', { id: props.task.id, name: newName })   // name + payload
}
</script>

<template>
  <button @click="emit('complete', task.id)">Done</button>
  <button @click="emit('delete', task.id)">Delete</button>
</template>
```

Parent listens with `@`:

```vue
<Child @complete="handleComplete" @delete="handleDelete" />
```

---

## 11. Slots (Parent Injects Markup into Child)

**Child** defines slots:

```vue
<template>
  <div class="card">
    <slot />                          <!-- default slot -->
    <slot name="meta" />              <!-- named slot -->
    <slot name="footer">Fallback</slot>  <!-- default content if unfilled -->
  </div>
</template>
```

**Parent** fills slots:

```vue
<template>
  <Card>
    Default content here              <!-- goes into default slot -->
    <template #meta>Due: {{ date }}</template>     <!-- #meta = v-slot:meta -->
    <template #footer>Custom footer</template>
  </Card>
</template>
```

---

## 12. Using Child Components

```vue
<script setup>
import TaskCard from './TaskCard.vue'   // importing registers it automatically
</script>

<template>
  <!-- Pass props with :, listen to events with @ -->
  <TaskCard
    v-for="task in tasks"
    :key="task.id"
    :task="task"
    @complete="handleComplete"
    @delete="handleDelete"
  />
</template>
```

> `:task="task"` passes the **variable**. `task="task"` would pass the **string**
> `"task"`. The colon (`v-bind`) makes it a JS expression.

---

## 13. Lifecycle Hooks

```vue
<script setup>
import { onMounted, onUnmounted, onUpdated, onBeforeMount } from 'vue'

onBeforeMount(() => { /* before first render */ })
onMounted(() => { /* DOM is ready — fetch data, focus inputs */ })
onUpdated(() => { /* after a reactive change re-renders */ })
onUnmounted(() => { /* cleanup — remove listeners, timers */ })
</script>
```

---

## 14. Template Refs (Access a DOM Element)

```vue
<script setup>
import { ref, onMounted } from 'vue'
const inputEl = ref(null)             // same name as ref="" attribute

onMounted(() => inputEl.value.focus())
</script>

<template>
  <input ref="inputEl" />
</template>
```

---

## 15. Directive & Shorthand Quick Table

| Directive | Shorthand | Purpose |
|---|---|---|
| `v-bind:x` | `:x` | Bind attribute / prop to an expression |
| `v-on:event` | `@event` | Listen to events |
| `v-slot:name` | `#name` | Fill a named slot |
| `v-model` | — | Two-way binding on form inputs |
| `v-if` / `v-else-if` / `v-else` | — | Conditional rendering (adds/removes element) |
| `v-show` | — | Toggle visibility via CSS `display` |
| `v-for` | — | Loop (always with `:key`) |
| `v-html` | — | Render raw HTML |
| `v-once` | — | Render once, never update |
| `{{ }}` | — | Text interpolation |

---

## 16. Common Gotchas

| Mistake | Fix |
|---|---|
| Forgot `.value` in `<script>` | `count.value++`, not `count++` (in JS) |
| Used `.value` in template | Templates auto-unwrap: `{{ count }}` |
| Missing `:key` in `v-for` | Always add a unique, stable `:key` |
| Mutating a prop | Emit an event; let the parent change it |
| `task="x"` vs `:task="x"` | Use `:` for variables/expressions |
| Object/array prop `default` | Use a factory: `default: () => []` |
| `v-if` + `v-for` together | Split them; use a wrapping `<template>` |

---

## 17. Project Setup Commands (Vite)

```bash
npm install        # install dependencies
npm run dev        # start dev server (hot reload)
npm run build      # production build
npm run preview    # preview the production build
```

---

### One-line mental model
> **State** lives in `ref`/`reactive`. **Props** flow down, **events** flow up,
> **slots** inject markup. The template is HTML + directives (`:`, `@`, `v-*`)
> wrapped around plain JS expressions.
