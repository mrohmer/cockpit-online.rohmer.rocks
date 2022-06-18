import type {Slot} from './slot';

export interface Race {
  slots: Slot[];
  name: string;
  mode: string;
  running: boolean;
  time?: string;
  lapsToGo?: number;
}
