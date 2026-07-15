<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tasks</ion-title>
        <ion-buttons slot="end">
          <ion-button id="sort-trigger" aria-label="Sort tasks">
            <ion-icon slot="icon-only" :icon="swapVerticalOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar
          v-model="searchTerm"
          placeholder="Search tasks"
          :debounce="150"
        />
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment v-model="priorityFilter" scrollable>
          <ion-segment-button value="all"><ion-label>All</ion-label></ion-segment-button>
          <ion-segment-button value="high"><ion-label>High</ion-label></ion-segment-button>
          <ion-segment-button value="medium"><ion-label>Medium</ion-label></ion-segment-button>
          <ion-segment-button value="low"><ion-label>Low</ion-label></ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tasks</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-refresher slot="fixed" @ion-refresh="handleRefresh">
        <ion-refresher-content />
      </ion-refresher>

      <!-- Category filter chips -->
      <div class="category-bar">
        <ion-chip
          :color="categoryFilter === 'all' ? 'primary' : undefined"
          :outline="categoryFilter !== 'all'"
          @click="categoryFilter = 'all'"
        >
          <ion-label>All</ion-label>
        </ion-chip>
        <ion-chip
          v-for="c in categories"
          :key="c"
          :color="categoryFilter === c ? 'primary' : undefined"
          :outline="categoryFilter !== c"
          @click="categoryFilter = c"
        >
          <ion-label>{{ c }}</ion-label>
        </ion-chip>
      </div>

      <!-- Loading skeletons on first load -->
      <ion-list v-if="store.isLoading" :inset="true">
        <ion-item v-for="n in 4" :key="n">
          <ion-thumbnail slot="start"><ion-skeleton-text :animated="true" /></ion-thumbnail>
          <ion-label>
            <h2><ion-skeleton-text :animated="true" style="width: 60%" /></h2>
            <p><ion-skeleton-text :animated="true" style="width: 85%" /></p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-list v-else-if="filteredTasks.length" :inset="true">
        <ion-item-sliding v-for="task in filteredTasks" :key="task.id">
          <ion-item button :detail="true" @click="goToDetail(task.id)">
            <ion-checkbox
              slot="start"
              :checked="task.done"
              aria-label="Mark task complete"
              @click.stop
              @ion-change="onToggle(task)"
            />

            <ion-thumbnail v-if="task.photo" slot="start" class="thumb">
              <ion-img :src="task.photo" :alt="`Photo for ${task.title}`" />
            </ion-thumbnail>

            <ion-label>
              <h2 :class="{ done: task.done }">{{ task.title }}</h2>
              <p>{{ task.description }}</p>
              <div class="meta">
                <ion-badge :color="priorityColor(task.priority)">
                  {{ priorityLabel(task.priority) }}
                </ion-badge>
                <ion-chip v-if="task.category" class="cat-chip" outline>
                  {{ task.category }}
                </ion-chip>
                <span
                  v-if="task.dueDate"
                  class="due"
                  :class="{ overdue: isOverdue(task.dueDate, task.done) }"
                >
                  <ion-icon
                    :icon="isOverdue(task.dueDate, task.done) ? alertCircleOutline : calendarOutline"
                    aria-hidden="true"
                  />
                  {{ formatDate(task.dueDate) }}
                </span>
              </div>
            </ion-label>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option @click="onEdit(task, $event)">
              <ion-icon slot="icon-only" :icon="createOutline" />
            </ion-item-option>
            <ion-item-option color="danger" @click="onDelete(task)">
              <ion-icon slot="icon-only" :icon="trashOutline" />
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <empty-state
        v-else-if="hasActiveFilters"
        :icon="searchOutline"
        title="No matching tasks"
        message="Try adjusting your search or filters."
      />
      <empty-state
        v-else-if="store.tasks.length"
        :icon="checkmarkDoneOutline"
        title="All caught up!"
        message="No pending tasks. Nice work."
      />
      <empty-state
        v-else
        :icon="clipboardOutline"
        title="No tasks yet"
        message="Tap the + button to add your first task."
      />

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button aria-label="Add task" @click="openAdd">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>

      <task-form-modal
        :is-open="showForm"
        :task="editingTask"
        @submit="onSubmit"
        @close="closeForm"
      />
    </ion-content>

    <ion-popover trigger="sort-trigger" :dismiss-on-select="true">
      <ion-content>
        <ion-list>
          <ion-list-header>Sort by</ion-list-header>
          <ion-item
            v-for="opt in sortOptions"
            :key="opt.value"
            button
            :detail="false"
            @click="sortBy = opt.value"
          >
            <ion-label>{{ opt.label }}</ion-label>
            <ion-icon
              v-if="sortBy === opt.value"
              slot="end"
              :icon="checkmarkOutline"
              color="primary"
            />
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-popover>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonBadge,
  IonChip,
  IonThumbnail,
  IonImg,
  IonCheckbox,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButton,
  IonButtons,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonPopover,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
} from '@ionic/vue';
import {
  add,
  clipboardOutline,
  searchOutline,
  checkmarkDoneOutline,
  swapVerticalOutline,
  checkmarkOutline,
  createOutline,
  trashOutline,
  alertCircleOutline,
  calendarOutline,
} from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { useTasksStore, TASK_CATEGORIES, type Task } from '@/stores/tasks';
import { usePriority } from '@/composables/usePriority';
import { useTaskFilters, SORT_OPTIONS } from '@/composables/useTaskFilters';
import { useHaptics } from '@/composables/useHaptics';
import { useReminders } from '@/composables/useReminders';
import { useTaskActions } from '@/composables/useTaskActions';
import { formatDate, isOverdue } from '@/utils/date';
import TaskFormModal, { type TaskFormPayload } from '@/components/TaskFormModal.vue';
import EmptyState from '@/components/EmptyState.vue';

const router = useRouter();
const store = useTasksStore();
const { priorityColor, priorityLabel } = usePriority();
const haptics = useHaptics();
const reminders = useReminders();
const { deleteWithUndo } = useTaskActions();

const categories = TASK_CATEGORIES;
const sortOptions = SORT_OPTIONS;

// Tasks tab shows pending tasks only; the composable adds search/filter/sort.
const pending = computed(() => store.pendingTasks);
const {
  searchTerm,
  priorityFilter,
  categoryFilter,
  sortBy,
  filteredTasks,
  hasActiveFilters,
} = useTaskFilters(pending);

const showForm = ref(false);
const editingTask = ref<Task | null>(null);

const openAdd = () => {
  editingTask.value = null;
  showForm.value = true;
};

const onEdit = async (task: Task, ev: Event) => {
  const sliding = (ev.target as HTMLElement).closest('ion-item-sliding') as
    | (HTMLElement & { close?: () => Promise<void> })
    | null;
  await sliding?.close?.();
  editingTask.value = task;
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  editingTask.value = null;
};

const onSubmit = (payload: TaskFormPayload) => {
  if (payload.id != null) {
    store.updateTask({
      id: payload.id,
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      dueDate: payload.dueDate,
      category: payload.category,
    });
    const updated = store.getById(payload.id);
    if (updated) reminders.sync(updated);
  } else {
    const id = store.addTask(payload);
    haptics.success();
    const created = store.getById(id);
    if (created) reminders.schedule(created);
  }
  closeForm();
};

const onToggle = (task: Task) => {
  store.toggleDone(task.id);
  haptics.light();
  const updated = store.getById(task.id);
  if (updated) reminders.sync(updated); // cancels the reminder once done
};

const onDelete = (task: Task) => deleteWithUndo(task);

const handleRefresh = async (event: CustomEvent) => {
  await store.loadTasks();
  (event.target as HTMLIonRefresherElement).complete();
};

const goToDetail = (id: number) => router.push(`/tabs/tasks/${id}`);
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

.meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.cat-chip {
  height: 20px;
  font-size: 11px;
  margin: 0;
}

.due {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: var(--ion-color-medium);
}

.due.overdue {
  color: var(--ion-color-danger);
  font-weight: 600;
}

.due ion-icon {
  font-size: 14px;
}

.category-bar {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 8px 12px 0;
}

.category-bar ion-chip {
  flex-shrink: 0;
}
</style>
