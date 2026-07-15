<template>
  <div class="empty-state">
    <ion-icon :icon="icon" aria-hidden="true" />
    <h2>{{ title }}</h2>
    <p v-if="message">{{ message }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

defineProps<{
  icon: string;
  title: string;
  message?: string;
}>();
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 64px 24px;
  color: var(--ion-color-medium);
}

.empty-state ion-icon {
  font-size: 56px;
  margin-bottom: 12px;
}

.empty-state h2 {
  margin: 0 0 4px;
}

.empty-state p {
  margin: 0;
}
</style>
