import type {FetchDidSucceedCallbackParam, WorkboxPlugin} from 'workbox-core';
import {db} from '../db';
import type {Race} from '../models/race';
import {notificationPermission} from '../stores/permission';

export class SubscriptionPlugin implements WorkboxPlugin {
  constructor(public serviceWorker: ServiceWorkerRegistration) {
  }

  private async getRemainingGasSubscriptions(): Promise<Record<string, string[]>> {
    const subscriptions = await db.remainingGasSubscriptions.toArray();

    return subscriptions.reduce(
      (prev, {sessionName, slotId}) => ({
        ...prev,
        [sessionName]: Array.from(new Set([...(prev[sessionName] ?? []), slotId]).values()),
      }),
      {} as Record<string, string[]>
    );
  }

  private async getRemainingGasSubscriptionsBySessionName(sessionName: string): Promise<string[]> {
    const subscriptions = await db.remainingGasSubscriptions.where({sessionName}).toArray();
    return subscriptions.map(({slotId}) => slotId);
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

    const slotIds = await this.getRemainingGasSubscriptionsBySessionName(sessionName);
    if (!slotIds?.length) {
      return
    }

    const {slots} = (await response.clone().json()) as Race;
    const slotsToNotify = slots
      .filter(({id, remainingGas}) => remainingGas !== undefined && remainingGas <= 0.2 && slotIds.includes(id));

    if (!slotsToNotify.length) {
      return;
    }

    const promises = slotsToNotify.map(slot => {
      const {id, name, remainingGas, image} = slot;
      return this.serviceWorker.showNotification(
        `${name} hat weniger als ${(remainingGas! * 100).toFixed(0)}% Tankfüllung`,
        {
          body: `In Session ${sessionName}`,
          tag: `subscription--remaining-gas[${sessionName}][${id}]`,
          image,
          data: {
            ...slot,
            sessionName,
          }
        },
      )
    });

    await Promise.allSettled(promises);
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
}
