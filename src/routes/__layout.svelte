<script lang="ts">
  import '../app.css';
  import PoweredBy from '@rohmer/svelte-base/PoweredBy.svelte';
  import Content from "$lib/components/Content.svelte";
  import {onMount} from 'svelte';

  const registerPeriodicSync = async (registration: any) => {
    try {
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync',
      } as any);

      if (status.state === 'granted') {
        await registration.periodicSync.register('update-sessions', {
          minInterval: 3000,
        });
        console.log('Periodic Sync registered!')
      } else {
        console.log('Periodic Sync is not allowed!')
      }
    } catch (e) {
      console.error('Periodic Sync could not be registered!', e);
    }
  }
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      if ('periodicSync' in registration) ;
      await registerPeriodicSync(registration);
    }
  }
  onMount(async () => {
    await registerServiceWorker();
  });
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
