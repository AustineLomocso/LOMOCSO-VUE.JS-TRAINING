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
.about-view { padding-top: 20px; }
h1 { color: #1B2A4A; margin: 0 0 16px; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
p { color: #4A5568; font-size: 15px; line-height: 1.6; margin: 0 0 12px; }
ul { color: #4A5568; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px; }
code { background: #f4f6fa; border: 1px solid #eef1f6; padding: 1px 7px; border-radius: 6px; color: #1B2A4A; font-size: 13px; }
.page-nav { margin-top: 20px; }
.page-nav a { color: #42B883; text-decoration: none; font-weight: 600; font-size: 14px; }
.page-nav a:hover { text-decoration: underline; }
</style>
