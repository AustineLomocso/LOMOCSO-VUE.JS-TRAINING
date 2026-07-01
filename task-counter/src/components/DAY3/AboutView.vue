<!--
=============================================================
  DAY 3 — AboutView.vue
  Static info page reached via /about
=============================================================
-->
<script setup>
</script>

<template>
  <div class="about-view">
    <h1>ℹ️ About</h1>
    <p>
      This is the Day 3 routing demo for the Vue.js training. It uses
      <strong>vue-router</strong> with dynamic routes, a navigation guard that
      protects the task detail page, query params for error handling, and
      programmatic navigation.
    </p>
    <ul>
      <li><code>/home</code> — task list</li>
      <li><code>/task/:id</code> — task detail (guarded)</li>
      <li><code>/about</code> — this page</li>
      <li><code>/stats</code> — task counts</li>
    </ul>
    <nav class="page-nav">
      <RouterLink to="/home">← Back to tasks</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.about-view { max-width: 520px; margin: 40px auto; padding: 24px; font-family: Arial, sans-serif; }
h1 { color: #1B2A4A; margin-bottom: 16px; }
p { color: #4A5568; font-size: 15px; line-height: 1.6; }
ul { color: #4A5568; font-size: 14px; line-height: 1.8; }
code { background: #f4f6fa; padding: 1px 6px; border-radius: 4px; color: #1B2A4A; }
.page-nav { margin-top: 20px; }
.page-nav a { color: #42B883; text-decoration: none; font-weight: 600; }
</style>
