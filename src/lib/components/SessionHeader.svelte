<script lang="ts">
  import type {Race} from '../models/race';
  import {createEventDispatcher, onMount} from 'svelte';
  import IoIosArrowBack from 'svelte-icons/io/IoIosArrowBack.svelte';
  import IoIosExpand from 'svelte-icons/io/IoIosExpand.svelte';
  import IoIosContract from 'svelte-icons/io/IoIosContract.svelte';
  import {slide} from 'svelte/transition';
  import {browser} from '$app/environment';
  import {liveQuery} from 'dexie';
  import {db} from '$lib/db';
  import {run} from 'svelte/legacy';
  import {releaseWakeLock, requestWakeLock} from '$lib/utils/wake-lock';

  const dispatch = createEventDispatcher();

  let canGoFullscreen = $state(false);
  let isFullscreen = $state(false);
  const wakeLockEnabled = browser ? liveQuery(() => db.settings.get('wakeLock')) : undefined;

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();

      releaseWakeLock();
    } else {
      document.body.requestFullscreen();

      $wakeLockEnabled?.value && requestWakeLock();
    }
  }


  const onFullscreenChange = () => {
    isFullscreen = !!document.fullscreenElement;
  }

  onMount(() => {
    canGoFullscreen = document.fullscreenEnabled;
    onFullscreenChange();

    window.addEventListener('fullscreenchange', onFullscreenChange);

    return () => window.removeEventListener('fullscreenchange', onFullscreenChange)
  })

  interface Props {
    status: Race['status'];
    name: Race['name'];
    mode: Race['mode'];
    time: Race['time'];
    lapsToGo: Race['lapsToGo'];
    backLink?: string;
  }

  let {
    status,
    name,
    mode,
    time,
    lapsToGo,
    backLink = '/'
  }: Props = $props();
</script>

<div class="mt-4 mb-10">
    <div class="flex items-center">
        <a href={backLink} class="w-10 h-6 px-2" onclick={(event) => dispatch('clickBackLink', event)}>
            <IoIosArrowBack/>
        </a>
        <div class="flex-1 min-w-0">
            <h1 class="text-3xl text-center overflow-hidden text-ellipsis whitespace-nowrap"
                class:pr-10={!canGoFullscreen}>
                {name}
            </h1>
        </div>
        {#if canGoFullscreen}
            <div class="w-10 h-6 px-2 cursor-pointer"
                 title="Fullscreen"
                 onclick={toggleFullscreen}>
                {#if isFullscreen}
                    <IoIosContract/>
                {:else}
                    <IoIosExpand/>
                {/if}
            </div>
        {/if}
    </div>

    {#if mode}
        <div class="flex justify-center items-center gap-x-2" transition:slide>
            <div class="flex h-2 w-2">
                <div class="animate-ping absolute h-full w-full rounded-full opacity-75"
                     class:bg-green-400={status === 'running'}
                     class:bg-red-500={status === 'stopped'}
                     class:bg-yellow-200={status === 'starting'}
                     class:animate-ping={status === 'starting'}
                ></div>
                <div class="rounded-full h-full w-full"
                     class:bg-green-400={status === 'running'}
                     class:bg-red-500={status === 'stopped'}
                     class:bg-yellow-200={status === 'starting'}></div>
            </div>
            <div class="pr-2">{mode}</div>
        </div>
    {/if}
</div>
