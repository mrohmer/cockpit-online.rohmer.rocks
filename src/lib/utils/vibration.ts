import {browser, dev} from '$app/environment';

export const isVibrationSupported = () => browser && 'vibrate' in navigator;

export const createVibrationNotifier = (id: string, pattern: number|number[]) => {
  let notified = false;

  return {
    notify: () => {
      if (notified) {
        return;
      }
      notified = true;
      dev && console.log('[vibrate]', id);

      if (isVibrationSupported()) {
        try {
          navigator.vibrate(pattern)
        } catch {}
      }
    },
    reset: () => {
      if (!notified) {
        return;
      }
      notified = false;
      dev && console.log('[vibrate]', 'cancel', id);
    },
  }
}
