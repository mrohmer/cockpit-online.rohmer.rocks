<script lang="ts">
  import '../app.css';
  import PoweredBy from '@rohmer/svelte-base/PoweredBy.svelte';
  import Content from "$lib/components/Content.svelte";
  import {onMount, setContext} from 'svelte';
  import {writable} from 'svelte/store';
  import {liveQuery, Observable} from 'dexie';
  import {db} from '../lib/db';
  import {PeriodicSync, registerPeriodicSync, unregisterPeriodicSync} from '../lib/utils/register-periodic-sync';
  import ms from 'ms';

  const registration = writable();
  let hasNotifications: Observable<boolean>;

  setContext('serviceWorker', {
    registration,
  })

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      registration.set(await navigator.serviceWorker.register('/service-worker.js'));
    }
  }
  onMount(async () => {
    await registerServiceWorker();

    hasNotifications = liveQuery(async () => {
      const count = await db.remainingGasSubscriptions.count();
      return count > 0;
    })
  });

  $: {
    if (hasNotifications && $registration) {
      if ($hasNotifications) {
        await registerPeriodicSync($registration, PeriodicSync.UPDATE_SESSIONS, ms('3 sec'));
      } else {
        await unregisterPeriodicSync($registration, PeriodicSync.UPDATE_SESSIONS);
      }
    }
  }
</script>

<svelte:head>
    <title>Carrera-Live</title>
    <meta name="description" content="Live Data powered by Carrera-XP">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <meta name="theme-color" content="#ff9a5a"/>
    <link rel="manifest" href="/manifest.json"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-title" content="Carrera-Live"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
</svelte:head>

<slot/>

<Content class="mt-2">
    <div class="text-center text-xs opacity-70">
        Daten bereitgestellt von <a href="https://online.cockpit-xp.de" target="_blank" rel="noreferrer noopener"
                                    class="text-primary">online.cockpit-xp.de</a>.<br>
        Dies ist eine Überarbeitung des UIs für private Zwecke.
    </div>
    <div class="-mt-12">
        <PoweredBy name="Matthias Rohmer"
                   url="https://matthias.rohmer.rocks"
                   technologies={['Cockpit-XP Online', 'svelte', 'netlify']}
                   sourceCodeUrl="https://github.com/mrohmer/carrera-live.rohmer.rocks"/>
    </div>
</Content>
