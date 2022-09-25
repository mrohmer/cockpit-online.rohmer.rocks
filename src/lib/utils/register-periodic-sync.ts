
export enum PeriodicSync {
  UPDATE_SESSIONS = 'update-sessions',
}

export const registerPeriodicSync = async (registration: any, key: string, minInterval: number): Promise<boolean> => {
  if (!registration?.periodicSync?.register) {
    return false;
  }

  try {
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync',
    } as any);

    if (status.state === 'granted') {
      await registration.periodicSync.register(key, {
        minInterval,
      });
      return true;
    }
  } catch (e) {
    console.error('Periodic Sync could not be registered!', e);
  }
  return false;
}
export const unregisterPeriodicSync = async (registration: any, key: string): Promise<boolean> => {
  if (!registration?.periodicSync?.unregister) {
    return false;
  }
  try {
    await registration?.periodicSync?.unregister(key);
    return true;
  } catch (e) {
    console.error('Periodic Sync could not be unregistered!', e);
  }
  return false;
}
