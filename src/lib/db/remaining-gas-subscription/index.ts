import {notificationPermission} from '../../stores/permission';
import {db} from '../index';
import type {RemainingGasSubscription} from '../../models/remaining-gas-subscription';

export const a = 2;

const subscribe = async ({sessionName, slotId, driverName}: Pick<RemainingGasSubscription, 'sessionName'|'slotId'|'driverName'>) => {
  const state = await notificationPermission.query();
  if (state === 'prompt') {
    await notificationPermission.request();
  }

  // even if it's still not granted, save it to the db so we can show the prompt again later 🤷
  await db.transaction('rw?', db.remainingGasSubscriptions, async () => {
    const subscription = await db.remainingGasSubscriptions.where({sessionName, slotId}).first();

    if (!subscription) {
      await db.remainingGasSubscriptions.add({sessionName, slotId, driverName, created: new Date()});
    }
  });
}
const unsubscribe = ({sessionName, slotId}: Pick<RemainingGasSubscription, 'sessionName'|'slotId'>) =>
  db.transaction('rw?', db.remainingGasSubscriptions, async () => {
    const subscription = await db.remainingGasSubscriptions.where({sessionName, slotId}).first();

    if (!!subscription) {
      await db.remainingGasSubscriptions.delete(subscription.id);
    }
  })

export const remainingGasSubscription = {
  subscribe,
  unsubscribe,
}
