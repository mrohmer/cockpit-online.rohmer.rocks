import { build, files } from '$service-worker';
import {registerRoute} from 'workbox-routing';
import {NetworkFirst, CacheFirst} from 'workbox-strategies';

const urls = [
  '/',
  ...build,
  ...files,
];
registerRoute(
  ({url}) => urls.includes(url.pathname),
  new NetworkFirst(),
);
registerRoute(
  ({url}) => /\/api\/[\w\/]*\/image\/[1-8]\/(driver|car).(jpe?g|png|svg|gif)/gi.test(url.pathname),
  new CacheFirst(),
);

skipWaiting();
