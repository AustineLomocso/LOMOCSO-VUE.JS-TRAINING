<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tasks</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tasks</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list v-if="store.tasks.length" :inset="true">
        <ion-item
          v-for="task in store.tasks"
          :key="task.id"
          button
          :detail="true"
          @click="goToDetail(task.id)"
        >
          <ion-checkbox
            slot="start"
            :checked="task.done"
            aria-label="Mark task complete"
            @click.stop
            @ion-change="store.toggleDone(task.id)"
          />

          <ion-thumbnail v-if="task.photo" slot="start" class="thumb">
            <ion-img :src="task.photo" />
          </ion-thumbnail>

          <ion-label>
            <h2 :class="{ done: task.done }">{{ task.title }}</h2>
            <p>{{ task.description }}</p>
          </ion-label>

          <ion-badge slot="end" :color="priorityColor(task.priority)">
            {{ task.priority }}
          </ion-badge>
        </ion-item>
      </ion-list>

      <div v-else class="empty-state">
        <ion-icon :icon="clipboardOutline" />
        <h2>No tasks yet</h2>
        <p>Tap the + button to add your first task.</p>
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="showAdd = true">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>

      <add-task-modal
        :is-open="showAdd"
        @create="onCreate"
        @close="showAdd = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonThumbnail,
  IonImg,
  IonCheckbox,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/vue';
import { add, clipboardOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { useTasksStore, type Task } from '@/stores/tasks';
import AddTaskModal from '@/components/AddTaskModal.vue';

const router = useRouter();
const store = useTasksStore();
const showAdd = ref(false);

const goToDetail = (id: number) => router.push(`/tabs/tasks/${id}`);

const priorityColor = (priority: Task['priority']) =>
  ({ high: 'danger', medium: 'warning', low: 'medium' })[priority];

const onCreate = (payload: { title: string; description: string; priority: Task['priority'] }) => {
  store.addTask(payload);
  showAdd.value = false;
};
</script>

<style scoped>
.thumb {
  --size: 44px;
  border-radius: 8px;
  overflow: hidden;
}

h2.done {
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
