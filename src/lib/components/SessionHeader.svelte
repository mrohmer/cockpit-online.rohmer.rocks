<script lang="ts">
  import type {Race} from '../models/race';
  import IoIosExpand from 'svelte-icons/io/IoIosExpand.svelte';
  import IoIosContract from 'svelte-icons/io/IoIosContract.svelte';
  import {slide} from 'svelte/transition';
  import {db} from '$lib/db';
  import {fullscreen} from '$lib/utils/fullscreen';
  import {releaseWakeLock, requestWakeLock} from '$lib/utils/wake-lock';
  import Navbar from '$lib/components/Navbar.svelte';

  let canGoFullscreen = $state(fullscreen.canGoFullscreen());
  let isFullscreen = $derived($fullscreen);

  const setWakeLockState = async (state: boolean) => {
    if (state) {
      return releaseWakeLock();
    } else if (!!(await db.settings.get('wakeLock'))?.value) {
      return requestWakeLock();
    }
  }
  const toggleFullscreen = async () => {
    const wasFullscreen = $fullscreen;
    fullscreen.toggle();

    await setWakeLockState(wasFullscreen);
  }

  interface Props {
    status: Race['status'];
    name: Race['name'];
    mode: Race['mode'];
    time?: Race['time'];
    lapsToGo?: Race['lapsToGo'];
    backLink?: string;
    onBackLinkClick?: (event: Event) => void;
  }

  let {
    status,
    name,
    mode,
    time,
    lapsToGo,
    backLink = '/',
    onBackLinkClick,
  }: Props = $props();
</script>

<Navbar {backLink} {onBackLinkClick} viewTransitionName="session-header">
    <h1 class="text-3xl text-center overflow-hidden text-ellipsis whitespace-nowrap"
        class:pr-10={!canGoFullscreen}>
        {name}
    </h1>
    {#snippet actions()}
        {#if canGoFullscreen}
            <button type="button" class="w-10 h-6 px-2 cursor-pointer"
                    title="Fullscreen"
                    onclick={toggleFullscreen}>
                {#if isFullscreen}
                    <IoIosContract/>
                {:else}
                    <IoIosExpand/>
                {/if}
            </button>
        {/if}
    {/snippet}
    {#snippet bottomBar()}
        {#if mode}
            <div class="mt-4 mb-4">
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
            </div>
        {/if}
    {/snippet}
</Navbar>
