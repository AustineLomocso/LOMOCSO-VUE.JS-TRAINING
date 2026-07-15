import { toastController } from '@ionic/vue';
import { useTasksStore, type Task } from '@/stores/tasks';
import { useHaptics } from '@/composables/useHaptics';
import { useReminders } from '@/composables/useReminders';

/**
 * Shared task actions that involve UI feedback (toasts/haptics), kept in one
 * place so the delete + undo flow isn't duplicated across the list views.
 */
export function useTaskActions() {
  const store = useTasksStore();
  const haptics = useHaptics();
  const reminders = useReminders();

  /** Remove a task, cancel its reminder, and offer an Undo toast that restores it. */
  async function deleteWithUndo(task: Task) {
    const snapshot: Task = { ...task };
    store.removeTask(snapshot.id);
    reminders.cancel(snapshot.id);
    haptics.warning();

    const toast = await toastController.create({
      message: `Deleted "${snapshot.title}"`,
      duration: 4000,
      buttons: [
        {
          text: 'Undo',
          handler: () => {
            store.restoreTask(snapshot);
            reminders.sync(snapshot);
          },
        },
      ],
    });
    await toast.present();
  }

  return { deleteWithUndo };
}
