<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useTasksStore } from '@/stores/tasks';

const store = useTasksStore();

onMounted(() => {
  store.loadTasks();
});
</script>
