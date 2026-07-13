<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Completed</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Completed</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list v-if="store.completedTasks.length" :inset="true">
        <ion-item
          v-for="task in store.completedTasks"
          :key="task.id"
          button
          :detail="true"
          @click="goToDetail(task.id)"
        >
          <ion-thumbnail v-if="task.photo" slot="start" class="thumb">
            <ion-img :src="task.photo" />
          </ion-thumbnail>
          <ion-label>
            <h2 class="done">{{ task.title }}</h2>
            <p>{{ task.description }}</p>
          </ion-label>
          <ion-icon slot="end" :icon="checkmarkCircle" color="success" />
        </ion-item>
      </ion-list>

      <div v-else class="empty-state">
        <ion-icon :icon="checkmarkDoneOutline" />
        <h2>Nothing completed yet</h2>
        <p>Finished tasks will show up here.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonThumbnail,
  IonImg,
} from '@ionic/vue';
import { checkmarkCircle, checkmarkDoneOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { useTasksStore } from '@/stores/tasks';

const router = useRouter();
const store = useTasksStore();

const goToDetail = (id: number) => router.push(`/tabs/tasks/${id}`);
</script>

<style scoped>
.thumb {
  --size: 44px;
  border-radius: 8px;
  overflow: hidden;
}

.done {
  text-decoration: line-through;
  opacity: 0.6;
}

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
