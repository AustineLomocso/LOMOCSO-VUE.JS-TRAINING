/**
 * Small date helpers built on the native Date + Intl APIs (no date library).
 * All functions tolerate `undefined` so callers can pass optional Task fields directly.
 */

/** Midnight of the current day, for overdue comparisons. */
export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** A pending task whose due date is before today is overdue. */
export function isOverdue(dueDate?: string, done = false): boolean {
  if (!dueDate || done) {
    return false;
  }
  const due = new Date(dueDate);
  return !Number.isNaN(due.getTime()) && due < startOfToday();
}

/** Human-friendly date, e.g. "Jul 15, 2026". Returns '' for missing/invalid input. */
export function formatDate(value?: string): string {
  if (!value) {
    return '';
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Date + time, e.g. "Jul 15, 2026, 9:00 AM". Returns '' for missing/invalid input. */
export function formatDateTime(value?: string): string {
  if (!value) {
    return '';
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Relative phrasing like "2 days ago" / "in 3 hours". Returns '' for missing/invalid input. */
export function formatRelative(value?: string): string {
  if (!value) {
    return '';
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  const diffMs = d.getTime() - Date.now();
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 1000 * 60 * 60 * 24 * 365],
    ['month', 1000 * 60 * 60 * 24 * 30],
    ['day', 1000 * 60 * 60 * 24],
    ['hour', 1000 * 60 * 60],
    ['minute', 1000 * 60],
  ];
  for (const [unit, ms] of units) {
    if (Math.abs(diffMs) >= ms) {
      return rtf.format(Math.round(diffMs / ms), unit);
    }
  }
  return rtf.format(Math.round(diffMs / 1000), 'second');
}
