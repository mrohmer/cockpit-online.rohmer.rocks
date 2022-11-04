<script lang="ts">
  import {onMount} from 'svelte';
  import Switch from "./Switch.svelte";

  let isSupported = false;
  let wakeLock: any;

  let requesting = false;
  let releasing = false;

  const requestWakeLock = async () => {
    if (requesting || wakeLock) {
      return;
    }
    requesting = true;
    try {
      wakeLock = await (navigator as any).wakeLock.request('screen');
    } finally {
      requesting = false;
    }
  }
  const releaseWakeLock = async () => {
    if (releasing || !wakeLock) {
      return;
    }
    releasing = true;
    try {
      await wakeLock.release();
      wakeLock = undefined;
    } finally {
      releasing = false;
    }
  }

  const toggleWakeLock = () => wakeLock ? releaseWakeLock() : requestWakeLock();

  onMount(() => {
    isSupported = 'wakeLock' in navigator;

    return () => releaseWakeLock();
  })
</script>

{#if isSupported}
    <Switch checked={!!wakeLock} on:change={toggleWakeLock}>
        <span class="text-neutral-700 dark:text-neutral-300">
            Display nicht deaktivieren
        </span>
    </Switch>
{/if}
