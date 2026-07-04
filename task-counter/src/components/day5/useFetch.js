// =============================================================
//  DAY 5 ASSIGNMENT — composables/useFetch.js
//  Topic: API Integration, Async/Await, Error Handling, Composables
//  Files: composables/useFetch.js  |  TodoListView.vue
//  Time: 60 minutes
// =============================================================
//
// OBJECTIVE
// ---------
// Build a reusable useFetch() composable that encapsulates the
// loading/error/data pattern for any API call. Then use it to
// display live data from a free public REST API.
//
// API: https://jsonplaceholder.typicode.com/todos
// (Returns 200 todo items — no auth required)
//
// WHAT TO BUILD
// -------------
// composables/useFetch.js:
//   - Accepts a URL string as an argument
//   - Returns: { data, loading, error }
//   - data    = ref(null)  — the parsed JSON response
//   - loading = ref(true)  — true while fetching, false after
//   - error   = ref(null)  — error message string if request failed
//   - Fetches automatically when the component using it mounts
//
// TodoListView.vue:
//   - Uses useFetch() to load todos from JSONPlaceholder
//   - Shows a loading spinner while fetching
//   - Shows an error message if the request fails
//   - Shows the list with a filter bar (All / Done / Pending) on success
//   - Limits the display to the first 20 results
//
// REQUIREMENTS (Acceptance Criteria)
// ------------------------------------
//  [x] useFetch is a standalone function in its own file (not in a component)
//  [x] Uses onMounted() to trigger the fetch
//  [x] Uses try/catch/finally — loading becomes false in finally
//  [x] Response status is checked: if (!response.ok) throw new Error(...)
//  [x] Loading state shows a visible spinner or message in the template
//  [x] Error state shows a visible error message
//  [x] Filter buttons work — computed() derives the visible list
//
// EXTENSION
// ---------
//  - Add a "Retry" button that re-fetches when the request fails
//  - Add a search input that filters todos by title text
//  - Create a second view that fetches /users and displays a user card grid
//
// HINTS (read only if stuck)
// ---------------------------
//  Hint 1: export function useFetch(url) { ... return { data, loading, error } }
//  Hint 2: Inside useFetch, call onMounted(async () => { ... })
//  Hint 3: const response = await fetch(url)
//          if (!response.ok) throw new Error(`HTTP ${response.status}`)
//          data.value = await response.json()
//  Hint 4: Use try/catch/finally — put loading.value = false in the finally block
//  Hint 5: In the component — const { data: todos, loading, error } = useFetch(url)
//          The ': todos' part renames 'data' to 'todos' locally
//  Hint 6: filteredTodos = computed(() => { if (!todos.value) return []; ... })
//          Always guard against null before filtering
// =============================================================

import { ref, onMounted } from 'vue'

// TODO 1: Export a useFetch function that accepts a url parameter
export function useFetch(url) {

  // TODO 2: Create three refs — data, loading, error
  const data    = ref(null)
  const loading = ref(true)
  const error   = ref(null)

  // TODO 4: fetch the url, check response.ok, parse JSON into data.value
  async function execute() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      data.value = await response.json()
    } catch (e) {
    //   TODO 5: assign the error message to error.value
      error.value = e.message
    } finally {
    //   TODO 6: set loading.value = false
      loading.value = false
    }
  }

  // TODO 3: Use onMounted with an async callback to fetch the data
  onMounted(execute)

  // TODO 7: Return the three refs (+ refetch for the Retry extension)
  return { data, loading, error, refetch: execute }
}
