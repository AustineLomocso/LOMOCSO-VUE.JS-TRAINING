import { ref } from 'vue';
import { Preferences } from '@capacitor/preferences';

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'taskflow_theme';
const DARK_CLASS = 'ion-palette-dark';

// Module-level singleton state so App.vue and SettingsPage share one source of truth.
const preference = ref<ThemePreference>('system');
const isDark = ref(false);

const media =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

function resolveDark(pref: ThemePreference): boolean {
  if (pref === 'system') {
    return media?.matches ?? false;
  }
  return pref === 'dark';
}

function apply(pref: ThemePreference) {
  isDark.value = resolveDark(pref);
  document.documentElement.classList.toggle(DARK_CLASS, isDark.value);
}

/**
 * Manual light/dark/system theme control. Persists the choice via Capacitor
 * Preferences and reacts to OS changes while in 'system' mode.
 *
 * Requires main.ts to import `dark.class.css` (not `dark.system.css`) so the
 * `.ion-palette-dark` class we toggle here actually drives the palette.
 */
export function useTheme() {
  async function init() {
    const { value } = await Preferences.get({ key: STORAGE_KEY });
    if (value === 'light' || value === 'dark' || value === 'system') {
      preference.value = value;
    }
    apply(preference.value);

    // Follow OS changes only while in 'system' mode.
    media?.addEventListener('change', () => {
      if (preference.value === 'system') {
        apply('system');
      }
    });
  }

  async function setTheme(pref: ThemePreference) {
    preference.value = pref;
    apply(pref);
    await Preferences.set({ key: STORAGE_KEY, value: pref });
  }

  return { preference, isDark, init, setTheme };
}
