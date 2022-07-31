import type {Readable, Subscriber, Unsubscriber} from 'svelte/store';

export const permission = (name: PermissionName): Readable<PermissionState> & Record<'query', () => Promise<PermissionState>> => {
  let listener: () => void;
  let state: PermissionStatus;
  const query = () => {
    if (typeof navigator !== 'undefined') {
      return navigator.permissions.query({name});
    }
    return Promise.reject('not supported');
  }
  return {
    query: () => query().then(({state: s}) => s),
    subscribe(run: Subscriber<PermissionState>): Unsubscriber {
      query()
        .then((result) => {
          state = result;

          listener = () => run(result.state);
          listener();
          result.addEventListener('change', listener);
        })
        .catch(() => undefined) // 🤷
      ;

      return () => (listener && state.removeEventListener('change', listener));
    }
  }
}

export const notificationPermission = {
  ...permission('notifications'),
  request: () => {
    if (typeof Notification !== 'undefined') {
      return Notification.requestPermission()
    }
    return Promise.reject('not supported');
  }
};
