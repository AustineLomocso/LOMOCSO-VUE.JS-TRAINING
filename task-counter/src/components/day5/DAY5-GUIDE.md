# Day 5 Guide — API Integration, Async/Await & Composables

This guide explains every concept you need to finish `useFetch.js` and `TodoListView.vue`.
It uses **generic examples only** — none of the snippets below are the assignment answer. Read the concept, understand the example, then apply the pattern to your own code.

---

## Table of Contents

1. [What is a Composable?](#1-what-is-a-composable)
2. [`ref()` — Reactive State](#2-ref--reactive-state)
3. [`onMounted()` — Lifecycle Hooks](#3-onmounted--lifecycle-hooks)
4. [`fetch()` and Async/Await](#4-fetch-and-asyncawait)
5. [Error Handling — try / catch / finally](#5-error-handling--try--catch--finally)
6. [The Loading / Error / Data Pattern](#6-the-loading--error--data-pattern)
7. [Destructuring with Aliases](#7-destructuring-with-aliases)
8. [`computed()` — Derived State](#8-computed--derived-state)
9. [Conditional Rendering — `v-if` / `v-else-if` / `v-else`](#9-conditional-rendering)
10. [List Rendering — `v-for`](#10-list-rendering--v-for)
11. [Dynamic Classes — `:class`](#11-dynamic-classes--class)
12. [Putting It Together — TODO Map](#12-putting-it-together--todo-map)
13. [Watch Out! Common Mistakes](#13-watch-out-common-mistakes)

---

## 1. What is a Composable?

**What it is:** A composable is a plain JavaScript function that uses Vue's reactivity APIs (`ref`, `computed`, `onMounted`, etc.) and returns reactive state. By convention, its name starts with `use` — like `useMouse`, `useLocalStorage`, `useFetch`.

**What it does:** It lets you extract stateful logic out of a component so it can be **reused** across many components. Instead of copy-pasting the same "fetch data, track loading, catch errors" boilerplate into every view, you write it once in a composable and call it anywhere.

**How to apply it:** Put the function in its own file, export it, and call it inside a component's `<script setup>`.

```js
// composables/useCounter.js — a generic example, NOT the assignment
import { ref } from 'vue'

export function useCounter(startAt) {
  const count = ref(startAt)

  function increment() {
    count.value++
  }

  // Return everything the component needs
  return { count, increment }
}
```

```vue
<!-- Any component can now reuse it -->
<script setup>
import { useCounter } from '@/composables/useCounter'

const { count, increment } = useCounter(10)
</script>
```

Key rules:
- A composable is called **inside** `<script setup>` (or `setup()`), so lifecycle hooks like `onMounted` still work inside it.
- It **returns an object** of refs/functions — the component destructures what it needs.
- Each component that calls it gets its **own independent state** (calling `useCounter()` twice gives two separate counters).

> **For your assignment:** `useFetch(url)` is a composable that owns three refs (`data`, `loading`, `error`), starts a fetch on mount, and returns all three.

---

## 2. `ref()` — Reactive State

**What it is:** `ref()` wraps a value in a reactive container. When the value changes, any template or `computed` using it updates automatically.

**What it does:** It creates an object with a single `.value` property. In `<script>` you read/write `.value`; in the `<template>` Vue unwraps it for you (no `.value` needed).

**How to apply it:**

```js
import { ref } from 'vue'

const message = ref(null)     // starts empty
const isBusy  = ref(true)     // starts true

isBusy.value = false          // ✅ script: use .value
console.log(message.value)    // ✅ script: use .value
```

```html
<!-- template: NO .value -->
<p v-if="isBusy">Working…</p>
<p>{{ message }}</p>
```

> **For your assignment:** you need three refs with specific starting values — `data` starts as `null` (nothing loaded yet), `loading` starts as `true` (the fetch begins immediately), `error` starts as `null` (no error yet).

---

## 3. `onMounted()` — Lifecycle Hooks

**What it is:** A lifecycle hook — a function Vue calls at a specific moment in a component's life. `onMounted` fires **once**, right after the component is inserted into the DOM.

**What it does:** It's the standard place to run side effects that should happen when the component appears: fetching data, starting timers, reading the DOM.

**How to apply it:** Pass it a callback. The callback can be `async`.

```js
import { onMounted } from 'vue'

onMounted(() => {
  console.log('Component is now on screen!')
})

// It also accepts an async callback:
onMounted(async () => {
  const result = await someAsyncWork()
  console.log(result)
})
```

Important: `onMounted` works inside a composable **because** the composable is called during component setup. Vue knows which component is currently being set up and attaches the hook to it.

> **For your assignment:** the fetch call lives inside `onMounted(async () => { ... })` **inside** `useFetch`. That means: component mounts → fetch starts automatically. The component never has to say "go fetch".

---

## 4. `fetch()` and Async/Await

**What it is:** `fetch()` is the browser's built-in function for making HTTP requests. It returns a **Promise**. `async/await` is syntax that lets you write Promise-based code as if it were sequential.

**What it does:**
- `await fetch(url)` pauses until the server responds, then gives you a `Response` object.
- `await response.json()` parses the response body as JSON (also asynchronous!).

**How to apply it:**

```js
// Generic example: fetching users (NOT the todos endpoint)
async function loadUsers() {
  const response = await fetch('https://api.example.com/users')

  // ⚠️ fetch does NOT throw on HTTP errors like 404 or 500.
  // It only throws on network failure. YOU must check the status:
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const users = await response.json()   // second await!
  return users
}
```

Two things people always forget:
1. **Two awaits** — one for `fetch()`, one for `.json()`.
2. **`response.ok` check** — a 404 page still "succeeds" from fetch's point of view. `response.ok` is `true` only for status codes 200–299. If it's false, `throw` an Error yourself so the `catch` block handles it.

> **For your assignment:** the acceptance criteria explicitly requires the `if (!response.ok) throw new Error(...)` check. The parsed JSON goes into `data.value`.

---

## 5. Error Handling — try / catch / finally

**What it is:** JavaScript's structured error-handling blocks.

**What it does:**
- `try` — run this code; if anything throws, jump to `catch`.
- `catch (e)` — runs **only** if something in `try` threw. `e` is the Error object; `e.message` is its text.
- `finally` — runs **always** — after success OR failure. Perfect for cleanup.

**How to apply it:**

```js
// Generic example
async function saveSettings() {
  const saving = ref(true)
  const problem = ref(null)

  try {
    const res = await fetch('/api/settings', { method: 'POST' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    console.log('saved!')
  } catch (e) {
    problem.value = e.message      // store the message, not the whole Error
  } finally {
    saving.value = false           // runs whether it worked or failed
  }
}
```

Why `finally` matters here: if you set `loading.value = false` only at the end of `try`, a failed request would leave your UI spinning forever. `finally` guarantees the spinner stops **no matter what happened**.

> **For your assignment:** `catch` sets `error.value` to the message string; `finally` sets `loading.value = false`. That exact structure is an acceptance criterion.

---

## 6. The Loading / Error / Data Pattern

**What it is:** The universal three-state model for any async UI. At any moment your view is in exactly one of these states:

| State | `loading` | `error` | `data` | What the user sees |
|-------|-----------|---------|--------|--------------------|
| Fetching | `true` | `null` | `null` | Spinner / "Loading…" |
| Failed | `false` | `"HTTP 500"` | `null` | Error message |
| Success | `false` | `null` | `[...]` | The actual content |

**What it does:** It makes every possible situation visible to the user — no blank screens, no silent failures.

**How to apply it:** The composable manages the state transitions; the template renders one branch per state (see [section 9](#9-conditional-rendering)).

```
mount ──► loading=true ──► fetch ──┬─ ok ───► data=json,  loading=false
                                   └─ fail ─► error=msg,  loading=false
```

---

## 7. Destructuring with Aliases

**What it is:** Object destructuring pulls properties out of an object into local variables. An **alias** (`:` syntax) renames the variable while doing it.

**What it does:** Lets you give a returned property a more meaningful local name.

**How to apply it:**

```js
// Generic example
const settings = { color: 'green', size: 'large' }

const { color } = settings                 // local variable: color
const { color: themeColor } = settings     // local variable: themeColor (renamed!)

// Very common with composables:
const { data: users } = useSomething('/users')
// → the composable returned 'data', but locally you call it 'users'
```

The pattern `{ data: todos }` reads as: *"take the property named `data`, and call it `todos` in this file."*

> **For your assignment:** TODO 1 in the component is already done this way — `data` is renamed to `todos` so the rest of the component reads naturally.

---

## 8. `computed()` — Derived State

**What it is:** `computed()` creates a reactive value that is **calculated from other reactive values**. It re-runs automatically whenever a dependency changes, and caches the result otherwise.

**What it does:** Perfect for filtering, sorting, counting — anything you can *derive* from existing state instead of storing separately.

**How to apply it:**

```js
import { ref, computed } from 'vue'

const search   = ref('')
const products = ref(null)   // will be filled by an API later

const visibleProducts = computed(() => {
  // 🛡️ Guard: if data hasn't arrived yet, return a safe empty array
  if (!products.value) return []

  return products.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
})
```

Why the guard matters: while a fetch is in flight, `products.value` is still `null`. Calling `.filter()` on `null` crashes. Returning `[]` keeps the template happy (`v-for` over an empty array simply renders nothing).

Useful array methods for computeds:
- `array.filter(item => condition)` — keeps items where the condition is true
- `array.slice(0, 20)` — returns the first 20 items
- `array.length` — count of items (great for the "N items" footer)

> **For your assignment:** TODO 2 is already implemented — study it and note the null guard, the `slice` for "all", and the `filter` calls for done/pending. Your item count (TODO 8) can just be `filteredTodos.length` in the template — you don't even need a new computed.

---

## 9. Conditional Rendering

**What it is:** `v-if`, `v-else-if`, and `v-else` are directives that add or remove elements from the DOM based on a condition.

**What it does:** Only **one branch** of an if/else-if/else chain renders at a time — exactly what the three-state pattern needs.

**How to apply it:**

```html
<!-- Generic example: a weather widget -->
<div v-if="checking" class="loading">
  ⏳ Checking the weather…
</div>

<div v-else-if="failure" class="error-box">
  ⚠️ Could not load weather: {{ failure }}
</div>

<div v-else>
  <p>It is {{ temperature }}° today.</p>
</div>
```

Rules:
- `v-else-if` and `v-else` must sit on an element **immediately after** the `v-if` element (no unrelated elements in between).
- A truthy check like `v-else-if="failure"` works because a non-empty string is truthy and `null` is falsy.

> **For your assignment:** TODOs 3, 4, 5 are exactly this chain — loading branch, error branch, content branch. The stylesheet already gives you `.loading` and `.error-box` classes to use.

---

## 10. List Rendering — `v-for`

**What it is:** `v-for` repeats an element once per item in an array.

**What it does:** Renders dynamic lists. The `:key` binding gives Vue a stable identity for each row so it can update the list efficiently.

**How to apply it:**

```html
<!-- Generic example: a book list -->
<ul>
  <li v-for="book in visibleBooks" :key="book.id">
    <input type="checkbox" :checked="book.isRead" disabled />
    <span :class="{ 'completed-text': book.isRead }">{{ book.title }}</span>
  </li>
</ul>
```

Breaking that down:
- `v-for="book in visibleBooks"` — loop variable `book`, source array `visibleBooks` (usually a computed).
- `:key="book.id"` — **always** bind a unique, stable key. Use the item's `id`, never the array index if you can avoid it.
- `:checked="book.isRead"` — binds the checkbox's checked state to data. Adding `disabled` makes it display-only.

> **For your assignment:** TODO 7 loops over `filteredTodos`. Each todo from JSONPlaceholder looks like `{ id: 1, title: "...", completed: false, userId: 1 }` — so you have `todo.id`, `todo.title`, and `todo.completed` to work with. The CSS gives you `.done-item` (for the `<li>`) and `.completed-text` (for the title) to style finished todos.

---

## 11. Dynamic Classes — `:class`

**What it is:** `:class` with an **object syntax** applies a CSS class only when a condition is true.

**What it does:** `:class="{ someClass: condition }"` — the class `someClass` is added when `condition` is truthy, removed when falsy. It merges with any static `class` on the same element.

**How to apply it:**

```html
<!-- Generic example: tab buttons -->
<button
  :class="{ active: currentTab === 'home' }"
  @click="currentTab = 'home'">
  Home
</button>
<button
  :class="{ active: currentTab === 'about' }"
  @click="currentTab = 'about'">
  About
</button>
```

Each button does two things:
1. `@click` sets the shared state to its own value.
2. `:class` highlights itself when the shared state matches its value.

> **For your assignment:** TODO 6 is three buttons following this exact pattern, using your `filter` ref and the values `'all'`, `'done'`, `'pending'`. The `.filters button.active` CSS rule is already written for you.

---

## 12. Putting It Together — TODO Map

A checklist of which concept solves which TODO:

**`useFetch.js`**

| TODO | What to do | Concept section |
|------|------------|-----------------|
| 1 | Export `useFetch(url)` | §1 Composables |
| 2 | Create `data`, `loading`, `error` refs | §2 ref() |
| 3 | `onMounted(async () => {...})` | §3 onMounted |
| 4 | `fetch` → check `response.ok` → parse JSON into `data.value` | §4 fetch/await |
| 5 | Put the error message into `error.value` | §5 try/catch |
| 6 | `loading.value = false` in `finally` | §5 finally |
| 7 | `return { data, loading, error }` | §1 Composables |

**`TodoListView.vue`**

| TODO | What to do | Concept section |
|------|------------|-----------------|
| 1 | ✅ Already done — destructure with alias | §7 Aliases |
| 2 | ✅ Already done — filtered computed with null guard | §8 computed() |
| 3 | Loading branch | §9 v-if |
| 4 | Error branch | §9 v-else-if |
| 5 | Content branch | §9 v-else |
| 6 | Three filter buttons with `@click` + `:class` | §11 :class |
| 7 | `v-for` over `filteredTodos` with `:key` | §10 v-for |
| 8 | Show `filteredTodos.length` | §8 computed() |

---

## 13. Watch Out! Common Mistakes

1. **🐛 There's a bug already in your file** — line 11 of `TodoListView.vue`:
   ```js
   const filter = ref('all' | 'done' | 'pending')
   ```
   `|` is the **bitwise OR** operator, not "one of these types"! `'all' | 'done' | 'pending'` evaluates to the number `0`, so `filter` starts as `ref(0)` — and none of your `filter.value === 'all'` checks will match. The `'a' | 'b'` union syntax only exists in **TypeScript types**, not runtime JavaScript. Initialize the ref with just the single starting value `'all'` and keep the options in the comment.

2. **Import path mismatch** — the component imports from `@/composables/useFetch`, but your `useFetch.js` currently lives in `components/day5/`. Either move the file to `src/composables/useFetch.js` (the assignment header says that's where it belongs) or fix the import path. Otherwise you'll get a "failed to resolve import" error.

3. **Forgetting `.value` in script / adding it in template** — script needs it, template doesn't.

4. **One `await` instead of two** — `response.json()` also returns a Promise.

5. **Skipping the `response.ok` check** — a 404 will silently put an error HTML/JSON body into your data instead of triggering your error UI.

6. **Storing the Error object instead of its message** — `error.value = e` works but renders uglily; `e.message` gives a clean string.

7. **`v-else-if` / `v-else` separated from `v-if`** — they must be adjacent siblings, or Vue throws a compile error.

8. **Missing `:key` on `v-for`** — Vue warns in the console; always use `todo.id`.

Good luck! Work top-down: finish `useFetch.js` first (test it with a `console.log`), then wire up the template. 🚀
