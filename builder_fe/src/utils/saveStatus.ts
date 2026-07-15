import { useSyncExternalStore } from 'react';

// Persistence in this builder is auto-save, and it is scattered: a debounced style write, a
// section add, a node edit from the text/image panels, a page rename. Rather than teach every one
// of those call sites to report progress, the axios layer counts in-flight mutations into this one
// store, and the header reads it. That is why the old "Save" button could sit there doing nothing —
// there was never anything to click; the work was already being saved.

export type SaveState = 'idle' | 'saving' | 'saved' | 'error';

let pending = 0;
let state: SaveState = 'idle';
const listeners = new Set<() => void>();

const emit = () => listeners.forEach(listener => listener());

const set = (next: SaveState) => {
  if (next === state) return;
  state = next;
  emit();
};

// A save started. Any number can overlap; we only leave "saving" when the last one settles.
export const beginSave = () => {
  pending += 1;
  set('saving');
};

export const endSave = (ok: boolean) => {
  pending = Math.max(0, pending - 1);
  if (!ok) {
    // An error is sticky: it must not be painted over by a later success the user did not see.
    set('error');
    return;
  }
  if (pending === 0 && state !== 'error') set('saved');
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Current state without subscribing — for the hook's snapshot and for tests.
export const getSaveState = (): SaveState => state;

export const useSaveStatus = (): SaveState =>
  useSyncExternalStore(subscribe, getSaveState, () => 'idle');
