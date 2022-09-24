export interface RemainingGasSubscription {
  id?: number;
  sessionName: string;
  slotId: string;
  driverName?: string;
  lastNotifiedOnValue?: number;
  created: Date;
}

