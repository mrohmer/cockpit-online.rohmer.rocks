import axios from 'axios';
import type {Race} from '$lib/models/race';
import {addSession, removeSession} from './_sessions';
import {cleanSessionName} from '$lib/utils/clean-session-name';

export class Loader {
  private timeout: number = 0;

  constructor(
    private readonly setData: (data: Race | undefined) => void,
    private readonly setError: (status: number | undefined) => void,
    private readonly isMounted: () => boolean,
  ) {
  }

  cancelLoad() {
    this.timeout && clearTimeout(this.timeout);
  }

  private isDataSaveEnabled() {
    return 'connection' in navigator && (navigator.connection as any).saveData === true;
  }
  private scheduleLoad(name: string, delay: number) {
    if (this.isMounted()) {
      delay = this.isDataSaveEnabled() ? delay * 3 : delay;
      this.timeout = setTimeout(() => this.load(name), delay) as any as number;
    }
  }

  public async load(name: string) {
    try {
      const response = await axios.get<Race>(`/api/${cleanSessionName(name)}`);
      this.setError(undefined);

      const data = response.data as Race;
      this.setData(data);
      await addSession(name);

      this.scheduleLoad(name, data.status === 'stopped' ? 5000 : 1000);
    } catch (e: any) {
      this.setData(undefined);
      this.setError(e?.request?.status ?? 500);
      await removeSession(name);

      this.scheduleLoad(name, 5000);
    }
  }
}
