<script lang="ts">
  import '../app.css';
  import PoweredBy from '@rohmer/svelte-base/PoweredBy.svelte';
  import Content from "$lib/components/Content.svelte";
  import IoIosSettings from 'svelte-icons/io/IoIosSettings.svelte';
  import Share from "../lib/components/Share.svelte";
  import {page} from "$app/stores";
  import {browser} from '$app/environment'
  import {liveQuery} from 'dexie';
  import {db} from '$lib/db';
  import {releaseWakeLock, requestWakeLock} from '../lib/utils/wake-lock';

  const wakeLockEnabled = browser ? liveQuery(() => db.settings.get('wakeLock')) : undefined;

  $: $wakeLockEnabled?.value ? requestWakeLock() : releaseWakeLock();
</script>

<svelte:head>
    <meta name="description" content="Live Data powered by Carrera-XP">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <meta name="theme-color" content="#ff9a5a"/>
    <link rel="manifest" href="/manifest.json"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-title" content="Carrera-Live"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
</svelte:head>

<slot/>

{#if $page.route.id !== '/settings'}
    <a href="/settings" class="flex justify-center items-center mt-32 px-4">
        <div class="w-10 h-6 px-2">
            <IoIosSettings/>
        </div>
        <div class="pr-10">
            Settings
        </div>
    </a>
{/if}

<Content class="mt-10">
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

<div class="my-10">
    <Share/>
</div>
