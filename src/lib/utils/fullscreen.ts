import type {Readable, Subscriber, Unsubscriber} from 'svelte/store';
import {browser} from '$app/environment';

const checkFullscreen = () =>  browser && !!document.fullscreenElement;
let isFullscreen = checkFullscreen();
let listenerAdded = false;
const listeners = new Set<(state: boolean) => void>();

const eventHandler = () => {
  isFullscreen = checkFullscreen();
  listeners.forEach(listener => listener(isFullscreen));
}
const afterUpdateSubscribers = () => {
  if (!browser) {
    return;
  }

  if (listenerAdded && listeners.size === 0) {
    window.removeEventListener('fullscreenchange', eventHandler);
    listenerAdded = false;
  } else if (!listenerAdded && listeners.size > 0) {
    window.addEventListener('fullscreenchange', eventHandler);
    listenerAdded = true;
  }
}

interface Fullscreen extends Readable<boolean> {
  canGoFullscreen: () => boolean;
  enter: () => void;
  exit: () => void;
  toggle: () => void;
}

export const fullscreen: Fullscreen = {
  subscribe(run: Subscriber<boolean>, invalidate?: () => void): Unsubscriber {
    isFullscreen = checkFullscreen();
    listeners.add(run);
    afterUpdateSubscribers();

    run(isFullscreen);

    return () => {
      listeners.delete(run);
      afterUpdateSubscribers();
    };
  },
  canGoFullscreen: () =>
    browser && document.fullscreenEnabled,
  enter: () => {
    if (!browser || !fullscreen.canGoFullscreen() || isFullscreen) {
      return;
    }
    document.documentElement.requestFullscreen();
  },
  exit: () => {
    if (!browser || !isFullscreen) {
      return;
    }
    document.exitFullscreen();
  },
  toggle: () => {
    if (isFullscreen) {
      fullscreen.exit();
    } else {
      fullscreen.enter();
    }
  },
};
