import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Thin wrapper around @capacitor/haptics. Every call is fire-and-forget and
 * swallows errors, so it's safe to invoke on the web (where haptics may be
 * unavailable) without guarding at each call site.
 */
export function useHaptics() {
  const run = (fn: () => Promise<void>) => {
    try {
      void fn();
    } catch {
      /* no-op: haptics are best-effort */
    }
  };

  return {
    /** Light tap — e.g. completing a task. */
    light: () => run(() => Haptics.impact({ style: ImpactStyle.Light })),
    /** Medium tap — e.g. a more significant action. */
    medium: () => run(() => Haptics.impact({ style: ImpactStyle.Medium })),
    /** Success buzz — e.g. adding a task. */
    success: () => run(() => Haptics.notification({ type: NotificationType.Success })),
    /** Warning buzz — e.g. destructive action like delete. */
    warning: () => run(() => Haptics.notification({ type: NotificationType.Warning })),
  };
}
