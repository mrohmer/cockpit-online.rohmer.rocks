import { build, files } from '$service-worker';
import {registerRoute, setDefaultHandler, setCatchHandler} from 'workbox-routing';
import {NetworkFirst, CacheFirst} from 'workbox-strategies';
import {warmStrategyCache} from 'workbox-recipes';
import {SubscriptionPlugin} from '$lib/plugins/subscription-plugin';

const INDEX_URL = '/';
const FALLBACK_SESSION_URL = '/session';
const FALLBACK_SESSION_DETAIL_URL = '/session/slot/0';
const urls = [
  INDEX_URL,
  FALLBACK_SESSION_URL,
  FALLBACK_SESSION_DETAIL_URL,
  ...build,
  ...files,
];

const subscriptions = new SubscriptionPlugin((self as any).registration);

const strategy = new NetworkFirst({
  plugins: [
    subscriptions,
  ]
});
warmStrategyCache({
  urls,
  strategy,
});

registerRoute(
  ({url}) => /\/api\/[\w\/]*\/image\/[1-8]\/(driver|car).(jpe?g|png|svg|gif)/gi.test(url.pathname),
  new CacheFirst(),
);

setDefaultHandler(strategy);

setCatchHandler(async ({request, event}) => {
  if (request.destination === 'document') {
    const url = new URL(request.url);

    if (/^(\/)?(\?|#|$)/.test(url.pathname)) {
      return strategy.handle({event, request: INDEX_URL});
    }
    if (/^(\/\w+)+\/slot\/\d+(\?|#|$)/.test(url.pathname)) {
      return strategy.handle({event, request: FALLBACK_SESSION_DETAIL_URL});
    }
    if (/^(\/\w+)+(\?|#|$)/.test(url.pathname)) {
      return strategy.handle({event, request: FALLBACK_SESSION_URL});
    }
  }
  return Response.error();
});

(self as any).skipWaiting();
self.addEventListener('notificationclick', ((event: Record<'notification', Notification> & any) => {
  event.waitUntil((async () => {
    if (await subscriptions.canHandleNotificationClick(event.notification.tag)) {
      return subscriptions.handleNotificationClick(event.notification.tag);
    }
    return Promise.resolve();
  }) as any);
}) as any);
