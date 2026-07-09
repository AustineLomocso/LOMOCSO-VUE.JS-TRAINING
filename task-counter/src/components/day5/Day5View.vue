<!--
=============================================================
  DAY 5 — API Fetch
  Entry view for Day 5. Wraps TodoListView (uses the useFetch
  composable to load todos from JSONPlaceholder) in a card.
=============================================================
-->
<script setup>
import TodoListView from './TodoListView.vue'
</script>

<template>
  <div class="app">
    <TodoListView />
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
</style>
