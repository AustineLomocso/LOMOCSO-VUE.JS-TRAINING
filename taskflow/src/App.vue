<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useTasksStore } from '@/stores/tasks';
import { useTheme } from '@/composables/useTheme';

const store = useTasksStore();
const { init: initTheme } = useTheme();

onMounted(() => {
  store.loadTasks();
  initTheme();
});
</script>
