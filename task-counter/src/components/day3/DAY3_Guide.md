# Day 3 — Vue Router Implementation Guide

> **Topic:** Dynamic Routes · Navigation Guards · Programmatic Navigation
> **Files:** `router/index.js` · `HomeView.vue` · `TaskDetailView.vue`
>
> ⚠️ This is a **syntax + how-to reference only**. Every code block below uses a
> *deliberately different example* (products, users, articles…) so you can see the
> **pattern** without being handed the answer. Translate the pattern to your own
> tasks — don't copy-paste.

---

## 0. Environment check (do this before touching the TODOs)

Your project is *not quite ready* for these files as written. The TODOs import from
`@/views/...` and `@/stores/taskStore`, but those folders don't exist yet. Sort this out first.

### 0.1 What `@` means
`vite.config.js` already maps the `@` alias to `./src`:

```js
// already configured for you
'@': fileURLToPath(new URL('./src', import.meta.url))
```

So `@/views/HomeView.vue` resolves to `src/views/HomeView.vue`. Decide where your
real files live and make the import paths match. You have two clean options:

| Option | What to do |
|--------|------------|
| **A. Move files** | Move the DAY3 `.vue` files into `src/views/` so `@/views/...` imports resolve. |
| **B. Keep files where they are** | Change the imports to point at the real location, e.g. `@/components/DAY3/HomeView.vue`. |

Pick one and stay consistent. (Nothing to solve here — just make imports and file locations agree.)

### 0.2 Is a store required?
The guard and the views import a **Pinia** store (`useTaskStore`). Pinia is **not installed**
in this project (`package.json` has `vue` and `vue-router` only). You have two paths:

- **Install Pinia** and create a `taskStore` (see §5), *or*
- **Skip Pinia** for now and expose a plain shared task array/module the guard and views can read.

Either is acceptable — the routing concepts are identical. The examples below show the Pinia version because that's what the TODO comments assume.

### 0.3 Wire the router into the app (not a numbered TODO, but required)
`main.js` currently mounts the app **without** the router, and `App.vue` has **no `<RouterView />`**.
Routing will not render until both are fixed. Pattern:

```js
// main.js — pattern (uses a made-up router path)
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'   // wherever YOUR router file ends up

createApp(App).use(router).mount('#app')
```

```vue
<!-- App.vue — the router needs an outlet to render matched components into -->
<template>
  <RouterView />
</template>
```

> `<RouterView />` is where the *matched* component appears. `<RouterLink>` is how you
> navigate to it. Both are globally available once `app.use(router)` runs.

---

## 1. `router/index.js`

### Concept: what a route table looks like
A router maps URL paths to components. Minimal shape:

```js
// EXAMPLE — a shop, not your task app
import { createRouter, createWebHistory } from 'vue-router'
import ProductsView from '@/views/ProductsView.vue'

const routes = [
  { path: '/products', component: ProductsView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

### TODO 1 — Import view components
**Pattern:** a default import per view.
```js
import ProductsView from '@/views/ProductsView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
```
✅ Make sure each path actually resolves (see §0.1). ❌ Don't import a file that doesn't exist yet.

### TODO 2 — Import the store
**Pattern:** named import of the store factory.
```js
import { useProductStore } from '@/stores/productStore'
```
> **Important gotcha:** call `useProductStore()` *inside* the guard function, **not** at the
> top of the module. Calling it at import time (before `app.use(pinia)` runs) throws
> *"getActivePinia() was called but there was no active Pinia"*. More in TODO 8.

### TODO 3 — Redirect `/` → your home path
**Pattern:** a route with `redirect` instead of `component`.
```js
{ path: '/', redirect: '/products' }
```

### TODO 4 — A static route
**Pattern:** path + component.
```js
{ path: '/products', component: ProductsView }
```

### TODO 5 — A **dynamic** route with a param + meta flag
**Pattern:** `:paramName` in the path, and `meta` to tag routes your guard should protect.
```js
{
  path: '/product/:sku',
  component: ProductDetailView,
  meta: { requiresProduct: true },   // guard reads this later
}
```
- `:sku` becomes available as `route.params.sku` inside the component.
- `meta` is arbitrary data attached to the route — the guard uses it to decide whether to run its check.

### TODO 6 — Another static route
Same shape as TODO 4. If the target component doesn't exist yet, either create it or leave
its import commented until it does (an import for a missing file breaks the whole router).

### TODO 7 — History mode
Already filled: `history: createWebHistory()`. This gives clean URLs (`/product/42`) instead of
hash URLs (`/#/product/42`). Nothing to change — just know *why* it's there.

### TODO 8 — `beforeEach` navigation guard
**Concept:** `beforeEach` runs before *every* navigation. You inspect where the user is going
(`to`), decide, and then **call `next()` exactly once**.

```js
// EXAMPLE — protecting a product detail page
router.beforeEach((to, from, next) => {
  // 1. Only guard routes that opted in via meta
  if (to.meta.requiresProduct) {
    const store = useProductStore()          // call INSIDE the guard (see TODO 2)
    const id = Number(to.params.sku)         // params are strings — cast!
    const exists = store.products.some(p => p.id === id)

    if (!exists) {
      // redirect somewhere safe, pass a query flag the target page can read
      return next({ path: '/products', query: { error: 'notfound' } })
    }
  }
  next()   // ALWAYS reachable — omit it and navigation hangs forever
})
```

**Rules to internalize:**
1. Call `next()` (or `return next(...)`) on **every** path through the function.
2. `next()` = allow. `next({ path, query })` = redirect. `next(false)` = cancel.
3. Cast `to.params.*` to `Number` before comparing to numeric IDs.
4. Get the store *inside* the function, never at module top level.

---

## 2. `HomeView.vue`

### TODO 1 — Detect the `?error=notfound` query
**Concept:** `useRoute()` gives the current route; `.query` holds `?key=value` pairs (as strings).
Wrap it in `computed` so it stays reactive if the query changes.
```js
// EXAMPLE
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const showBanner = computed(() => route.query.error === 'notfound')
```

### TODO 2 — Conditionally render the banner
**Pattern:** `v-if` bound to your computed.
```vue
<div class="error-banner" v-if="showBanner">⚠️ Not found.</div>
```

### TODO 3 — A `RouterLink` in the nav
**Pattern:** `RouterLink` replaces `<a>` for internal navigation (no full page reload).
```vue
<RouterLink to="/about">About</RouterLink>
```
> **Bonus (extension):** `RouterLink` auto-adds `router-link-active` /
> `router-link-exact-active` classes to the *current* link. Style them:
> ```css
> .page-nav a.router-link-active { color: #1B2A4A; font-weight: 700; }
> ```

### TODO 4 & 5 — Link each list item to its detail route
**Concept:** build the target path from the item's id. Use a **template literal** with `:to`
(the `:` makes it a JS expression, not a literal string).
```vue
<!-- EXAMPLE — products, inside a v-for="p in store.products" -->
<li v-for="p in store.products" :key="p.id">
  <RouterLink :to="`/product/${p.id}`">{{ p.title }}</RouterLink>
</li>
```
- `to="/product/5"` → literal string (wrong for dynamic ids).
- `:to="`/product/${p.id}`"` → evaluated expression (correct).
- Alternative object form: `:to="{ path: `/product/${p.id}` }"`.

Keep the existing `:class="{ done: task.done }"` on the label — just wrap it in the link.

---

## 3. `TaskDetailView.vue`

### TODO 1 — Get `route` and `router`
**Concept:** two different composables.
- `useRoute()` → **read** the *current* route (params, query). Reactive.
- `useRouter()` → the router *instance*, used to **navigate** (`push`, `replace`, `back`).
```js
// EXAMPLE
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
```

### TODO 2 — Find the matching record (reactively)
**Concept:** param is a **string**; store ids are numbers. Cast, then `find`, wrapped in `computed`.
```js
// EXAMPLE — product, not task
const product = computed(() =>
  store.products.find(p => p.id === Number(route.params.sku))
)
```
> `computed` matters: if the id changes while staying on the same route (e.g. next/prev
> navigation), the displayed record updates automatically.

### TODO 3 — `goBack()` via programmatic navigation
**Pattern:** `router.push(target)`. Push a string path or an object.
```js
function goBack() {
  router.push('/products')          // string form
  // router.push({ path: '/products' })   // object form — equivalent
  // router.back()                         // browser-history back — different behavior
}
```
> `push` adds a history entry; `replace` swaps the current one; `back` pops the stack.

### TODO 4 — Guard the template with `v-if`
**Pattern:** only render the detail block when the record was found.
```vue
<div v-if="product">
  <!-- ...detail markup... -->
</div>
```
The router guard should already stop bad ids from reaching here, but the `v-if` is a
sensible defensive fallback for the moment before data loads.

### TODO 5 — Interpolate the record's fields
**Concept:** `{{ }}` for text; ternary/expressions are allowed inside.
```vue
<!-- EXAMPLE — product fields -->
<h1>{{ product.title }}</h1>
<p>In stock: {{ product.inStock ? 'Yes' : 'No' }}</p>
<p>Price: {{ product.price }}</p>
```
Map these to *your* fields — your task objects carry `name`, `done`, `dueDate`, `priority`
(see the Day 2 data shape). Render the boolean (`done`) as human-readable text with a ternary.

---

## 4. Extensions (optional, extra points)

| Extension | Pattern / hint |
|-----------|----------------|
| `/stats` route | New static route → a small view rendering `computed` totals (`store.tasks.length`, `.filter(t => t.done).length`, etc.). |
| Active-link styling | Style `.router-link-active` (see §2 TODO 3). |
| Page transitions | Wrap `RouterView` in `<Transition>` and add enter/leave CSS classes: `<Transition name="fade"><RouterView /></Transition>` then define `.fade-enter-active` / `.fade-leave-active`. Vue-router exposes a slot form of `RouterView` if you need per-route control. |

---

## 5. (If you chose Pinia) minimal store shape

Only relevant if you install Pinia. Register it in `main.js` **before** the router:
```js
// PATTERN — do not copy field-for-field
import { createPinia } from 'pinia'
createApp(App).use(createPinia()).use(router).mount('#app')
```
```js
// stores/productStore.js — PATTERN
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('products', () => {
  const products = ref([ /* seed data with numeric ids */ ])
  return { products }
})
```
Your task store would expose a `tasks` array shaped like your Day 2 tasks
(`{ id, name, done, dueDate, priority }`) so the guard's `find`/`some` check works.

---

## 6. Quick reference — common pitfalls

| Symptom | Likely cause |
|---------|--------------|
| Blank page, nothing routes | No `<RouterView />` in `App.vue`, or `app.use(router)` missing. |
| Navigation "hangs" | A `beforeEach` path that never calls `next()`. |
| `getActivePinia()` error | `useTaskStore()` called at module top level instead of inside the guard/setup. |
| Detail always "not found" | Comparing string `route.params.id` to a numeric id without `Number(...)`. |
| Link doesn't update the URL | Used `<a href>` instead of `<RouterLink>`, or `to=` (literal) where `:to=` (expression) was needed. |
| Import error on router load | Importing a view/store file that doesn't exist yet — comment it until it's created. |

---

### Order of attack (suggested)
1. §0 — fix imports, decide store vs no-store, add `RouterView` + `app.use(router)`.
2. `router/index.js` TODOs 1→8.
3. `HomeView.vue` TODOs 1→5.
4. `TaskDetailView.vue` TODOs 1→5.
5. Test the sad path: visit `/task/99999` → should bounce to home with the banner.
6. Extensions last.
