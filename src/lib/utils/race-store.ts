import {readable, type Readable, readonly, type Subscriber, type Unsubscriber} from 'svelte/store';
import type {ApiData} from '$lib/models/api-data';
import type {Race} from '$lib/models/race';
import {browser} from '$app/environment';
import {isDataSaveEnabled} from '$lib/utils/is-data-save-enabled';

export const createRaceStore =  (sessionName: string, initial: ApiData<Race>): Readable<ApiData<Race>> => {
  if (!browser) {
    return readonly(readable(initial));
  }

  return {
    subscribe(run: Subscriber<ApiData<Race>>, invalidate?: () => void): Unsubscriber {
      let timeout: number|NodeJS.Timeout|undefined = undefined;
      let running = true;

      const fetchSessionData = async () => {
        const response = await fetch(`/api/sessions/${sessionName}`);
        return response.json();
      }

      const handler = async () => {
        if (!running) {
          return;
        }

        try {
          const data = await fetchSessionData();
          run(data);
        } catch (e) {
          console.error(e);
        } finally {
          timeout = setTimeout(handler, (isDataSaveEnabled() ? 5 : 1.25) * 1000);
        }
      }

      initial && run(initial);
      handler();

      return () => {
        running = false;
        clearTimeout(timeout);
      }
    }
  }
}
