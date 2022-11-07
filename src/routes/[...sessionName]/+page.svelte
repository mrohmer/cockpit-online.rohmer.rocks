<script lang="ts">
  import type {Race} from '$lib/models/race';
  import {onMount} from 'svelte';
  import {page} from '$app/stores';
  import Content from '$lib/components/Content.svelte';
  import Standings from "./components/Standings.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import {slide} from 'svelte/transition';
  import {invalidate} from '$app/navigation';
  import {isDataSaveEnabled} from '../../lib/utils/is-data-save-enabled';

  export let data: Race;
  let mounted = false;

  let timeout: number;

  onMount(() => {
    mounted = true;
    return () => (mounted = false)
  });

  const scheduleLoad = () => {
    if (!mounted || timeout) {
      return;
    }

    timeout = setTimeout(
      () => {
        timeout = undefined;
        invalidate(`session:${$page.params.sessionName}`)
      },
      (isDataSaveEnabled() ? 3 : 1) * 1000
    ) as number;
  }

  $: {
    if (data && mounted) {
      scheduleLoad();
    }
  }
</script>

<svelte:head>
    <title>{data.name} | Carrera-Live</title>
</svelte:head>
{#if data}
    <Content>
        {#if data.time || data.lapsToGo}
            <div class="flex justify-center items-center gap-x-3 mt-6 max-w-[200px] mx-auto mb-10 -mt-6"
                 transition:slide|local>
                {#if data.time}
                    <div class="text-center flex-1">
                        <div class="text-xs">Zeit</div>
                        <div class="font-normal">{data.time || '00:00:00'}</div>
                    </div>
                {/if}
                {#if data.lapsToGo}
                    <div class="text-center flex-1">
                        <div class="text-xs">Runden</div>
                        <div class="font-normal">{data.lapsToGo || 225}</div>
                    </div>
                {/if}
            </div>
        {/if}

        <Standings sessionName={$page.params.sessionName} slots={data.slots}/>
    </Content>
{:else }
    <Loading/>
{/if}
