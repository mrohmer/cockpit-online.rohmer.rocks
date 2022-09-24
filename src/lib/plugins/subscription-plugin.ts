import type {FetchDidSucceedCallbackParam, WorkboxPlugin} from 'workbox-core';
import {db} from '../db';
import type {Race} from '../models/race';
import {notificationPermission} from '../stores/permission';
import type {RemainingGasSubscription} from '../models/remaining-gas-subscription';
import type {Slot} from '../models/slot';

export class SubscriptionPlugin implements WorkboxPlugin {
  private readonly GAS_THRESHOLD = 0.2;

  constructor(public serviceWorker: ServiceWorkerRegistration) {
  }

  private async getRemainingGasSubscriptionsBySessionName(sessionName: string): Promise<RemainingGasSubscription[]> {
    return db.remainingGasSubscriptions.where({sessionName}).toArray();
  }

  private getSessionName(url: URL): string | undefined {
    const {pathname} = url;

    if (/^\/api\/(.*)\/image\//.test(pathname)) {
      return undefined;
    }

    return pathname.match(/^\/api\/(?<sessionName>.*)\/?$/)?.groups?.sessionName;
  }

  private async notifySlots(sessionName: string, response: Response) {
    const permission = await notificationPermission.query();
    if (permission !== 'granted') {
      return;
    }

    const subscribedSlots = await this.getRemainingGasSubscriptionsBySessionName(sessionName);
    if (!subscribedSlots?.length) {
      return
    }

    const {slots} = (await response.clone().json()) as Race;
    const slotsAndSubscriptions = Object.values(
        slots
          .map(({
                  id,
                  ...slot
                }) => [{id, ...slot}, subscribedSlots.find(s => s.slotId === id)] as [Slot, RemainingGasSubscription])
          .filter(([, subsription]) => !!subsription)
          .reduce(
            (prev, curr) => ({
              ...prev,
              [curr[0].id]: curr,
            }),
            {} as Record<string, [Slot, RemainingGasSubscription]>
          )
      )
    ;

    console.log('slotsAndSubscriptions', slotsAndSubscriptions);

    await Promise.all([
      this.updateSubscriptions(slotsAndSubscriptions),
      this.processNotifications(sessionName, slotsAndSubscriptions),
    ]);
  }

  async fetchDidSucceed({request, response}: FetchDidSucceedCallbackParam): Promise<Response> {
    try {
      const sessionName = this.getSessionName(new URL(request.url));

      if (sessionName) {
        await this.notifySlots(sessionName, response);
      }

    } catch (e) {
      console.error('🤔', e);
    }
    return response;
  }

  async canHandleNotificationClick(tag: string): Promise<boolean> {
    return tag.startsWith('subscription--remaining-gas');
  }

  async handleNotificationClick(notification: Notification): Promise<void> {

  }

  private showNotification(slot: Slot, sessionName: string): Promise<void> {
    const {id, name, remainingGas, image} = slot;
    return this.serviceWorker.showNotification(
      `${name} hat weniger als ${(remainingGas! * 100).toFixed(0)}% Tankfüllung`,
      {
        body: `${sessionName}`,
        tag: `subscription--remaining-gas[${sessionName}][${id}]`,
        image,
        data: {
          ...slot,
          sessionName,
        },
      },
    )
  }

  private processNotifications(sessionName: string, slotsAndSubscriptions: [Slot, RemainingGasSubscription][]): Promise<any> {
    const slotsToNotify = slotsAndSubscriptions
      .filter(([{remainingGas}]) => remainingGas !== undefined && remainingGas <= this.GAS_THRESHOLD)
      .filter(([{remainingGas}, {lastNotifiedOnValue}]) => lastNotifiedOnValue === undefined || remainingGas! < lastNotifiedOnValue)

    const slotsToUnnotify = slotsAndSubscriptions
      .filter(([{remainingGas}]) => !(remainingGas !== undefined && remainingGas <= this.GAS_THRESHOLD));

    return Promise.all([
      this.createAndUpdateNotifications(sessionName, slotsToNotify),
      this.removeNotifications(sessionName, slotsToUnnotify)
    ]);
  }

  private async createAndUpdateNotifications(sessionName: string, slotsAndSubscriptions: [Slot, RemainingGasSubscription][]) {
    const promises = slotsAndSubscriptions
      .map(async ([{id, remainingGas, ...slot}]) => this.showNotification({id, remainingGas, ...slot}, sessionName));

    return Promise.allSettled(promises);
  }
  private async removeNotifications(sessionName: string, slotsAndSubscriptions: [Slot, RemainingGasSubscription][]) {
    const promises = slotsAndSubscriptions
      .map((async ([{id}]) => {
        const notifications = await this.serviceWorker.getNotifications({tag: `subscription--remaining-gas[${sessionName}][${id}]`});

        if (!notifications?.length) {
          return undefined;
        }

        notifications.forEach(n => n.close())
      }))

    return Promise.allSettled(promises);
  }

  private updateSubscriptions(slotsAndSubscriptions: [Slot, RemainingGasSubscription][]): Promise<any> {
    return db.transaction(
      'rw',
      db.remainingGasSubscriptions,
      () => Promise.all(slotsAndSubscriptions.map(([slot, subscription]) => this.updateSubscription(subscription, slot)))
    )
  }

  private updateSubscription(subscription: RemainingGasSubscription, slot: Pick<Slot, 'remainingGas'>): Promise<any> {
    return db.remainingGasSubscriptions.update(subscription.id!, {
      lastNotifiedOnValue: slot.remainingGas,
    });
  }
}
