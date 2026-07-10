<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tasks</ion-title>
        <ion-buttons slot="end">
          <ion-button v-if="doneCount > 0" @click="clearDone">Clear done</ion-button>
        </ion-buttons>
      </ion-toolbar>

      <!-- new-task default priority (Day 1 priority select) -->
      <ion-toolbar>
        <ion-item lines="none">
          <ion-label>New task priority</ion-label>
          <ion-select v-model="newPriority" interface="popover" slot="end">
            <ion-select-option value="Low">Low</ion-select-option>
            <ion-select-option value="Medium">Medium</ion-select-option>
            <ion-select-option value="High">High</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- stats bar -->
      <ion-toolbar>
        <ion-chip slot="start">Total: {{ totalCount }}</ion-chip>
        <ion-chip slot="start" color="success">Done: {{ doneCount }}</ion-chip>
        <ion-chip slot="start" color="warning">Pending: {{ pendingCount }}</ion-chip>
      </ion-toolbar>

      <!-- filter -->
      <ion-segment v-model="filter">
        <ion-segment-button value="all"><ion-label>All</ion-label></ion-segment-button>
        <ion-segment-button value="done"><ion-label>Done</ion-label></ion-segment-button>
        <ion-segment-button value="pending"><ion-label>Pending</ion-label></ion-segment-button>
      </ion-segment>

      <!-- empty state -->
      <div v-if="visibleTasks.length === 0" class="ion-text-center ion-padding">
        <ion-text color="medium">No tasks here. Tap + to add one.</ion-text>
      </div>

      <!-- task list -->
      <ion-list>
        <ion-item-sliding v-for="task in visibleTasks" :key="task.id">
          <ion-item>
            <ion-checkbox
              slot="start"
              :checked="task.done"
              @ionChange="toggleTask(task.id)"
            />
            <ion-label :class="{ done: task.done }">{{ task.name }}</ion-label>
            <ion-badge slot="end" :color="priorityColor(task.priority)">
              {{ task.priority }}
            </ion-badge>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="danger" @click="removeTask(task.id)">
              <ion-icon slot="icon-only" :icon="trashOutline" />
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <!-- floating add button -->
      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button @click="promptNewTask">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonList, IonItem, IonLabel, IonCheckbox,
  IonBadge, IonText, IonChip, IonSegment, IonSegmentButton,
  IonItemSliding, IonItemOptions, IonItemOption,
  IonFab, IonFabButton, IonIcon,
  IonSelect, IonSelectOption,
  alertController,
} from '@ionic/vue'
import { add, trashOutline } from 'ionicons/icons'
import { storeToRefs } from 'pinia'
import { useTaskStore, type Priority } from '../stores/taskStore'

const store = useTaskStore()
const { tasks, totalCount, doneCount, pendingCount } = storeToRefs(store)
const { addTask, toggleTask, removeTask, clearDone } = store

// UI-only state (not task data) — lives in the component, like Day 1
const filter = ref<'all' | 'done' | 'pending'>('all')
const newPriority = ref<Priority>('Medium')

const visibleTasks = computed(() => {
  if (filter.value === 'done') return tasks.value.filter(t => t.done)
  if (filter.value === 'pending') return tasks.value.filter(t => !t.done)
  return tasks.value
})

function priorityColor(priority: Priority) {
  if (priority === 'High') return 'danger'
  if (priority === 'Low') return 'success'
  return 'warning'
}

// FAB opens a native prompt for the task name; uses the chosen default priority
async function promptNewTask() {
  const alert = await alertController.create({
    header: 'New Task',
    inputs: [{ name: 'name', type: 'text', placeholder: 'What needs doing?' }],
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Add',
        handler: (data) => {
          addTask(data.name ?? '', newPriority.value)
        },
      },
    ],
  })
  await alert.present()
}
</script>

<style scoped>
.done {
  text-decoration: line-through;
  opacity: 0.5;
}
</style>
