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

      <ion-refresher slot="fixed" @ion-refresh="handleRefresh">
        <ion-refresher-content />
      </ion-refresher>

      <ion-list v-if="store.completedTasks.length" :inset="true">
        <ion-item-sliding v-for="task in store.completedTasks" :key="task.id">
          <ion-item button :detail="true" @click="goToDetail(task.id)">
            <ion-thumbnail v-if="task.photo" slot="start" class="thumb">
              <ion-img :src="task.photo" :alt="`Photo for ${task.title}`" />
            </ion-thumbnail>
            <ion-label>
              <h2 class="done">{{ task.title }}</h2>
              <p>{{ task.description }}</p>
              <div v-if="task.category" class="meta">
                <ion-chip class="cat-chip" outline>{{ task.category }}</ion-chip>
              </div>
            </ion-label>
            <ion-icon
              slot="end"
              :icon="checkmarkCircle"
              color="success"
              aria-label="Completed"
            />
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option @click="store.toggleDone(task.id)">
              <ion-icon slot="icon-only" :icon="arrowUndoOutline" />
            </ion-item-option>
            <ion-item-option color="danger" @click="onDelete(task)">
              <ion-icon slot="icon-only" :icon="trashOutline" />
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <empty-state
        v-else
        :icon="checkmarkDoneOutline"
        title="Nothing completed yet"
        message="Finished tasks will show up here."
      />
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
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonIcon,
  IonChip,
  IonThumbnail,
  IonImg,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/vue';
import {
  checkmarkCircle,
  checkmarkDoneOutline,
  arrowUndoOutline,
  trashOutline,
} from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { useTasksStore, type Task } from '@/stores/tasks';
import { useTaskActions } from '@/composables/useTaskActions';
import EmptyState from '@/components/EmptyState.vue';

const router = useRouter();
const store = useTasksStore();
const { deleteWithUndo } = useTaskActions();

const goToDetail = (id: number) => router.push(`/tabs/tasks/${id}`);

const onDelete = (task: Task) => deleteWithUndo(task);

const handleRefresh = async (event: CustomEvent) => {
  await store.loadTasks();
  (event.target as HTMLIonRefresherElement).complete();
};
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

.meta {
  margin-top: 6px;
}

.cat-chip {
  height: 20px;
  font-size: 11px;
  margin: 0;
}
</style>
