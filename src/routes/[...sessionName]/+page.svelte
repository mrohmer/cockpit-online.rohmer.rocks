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
  import type {ApiData} from '$lib/models/api-data';

  export let data: ApiData<Race>;
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

  $: race = data?.data
  $: {
    if (race && mounted) {
      scheduleLoad();
    }
  }
</script>

<svelte:head>
    <title>{race?.name} | Carrera-Live</title>
</svelte:head>
{#if race}
    <Content>
        {#if race.time || race.lapsToGo}
            <div class="flex justify-center items-center gap-x-3 mt-6 max-w-[200px] mx-auto mb-10 -mt-6"
                 transition:slide|local>
                {#if race.time}
                    <div class="text-center flex-1">
                        <div class="text-xs">Zeit</div>
                        <div class="font-normal">{race.time || '00:00:00'}</div>
                    </div>
                {/if}
                {#if race.lapsToGo}
                    <div class="text-center flex-1">
                        <div class="text-xs">Runden</div>
                        <div class="font-normal">{race.lapsToGo || 225}</div>
                    </div>
                {/if}
            </div>
        {/if}

        <Standings sessionName={$page.params.sessionName} slots={race.slots}/>
    </Content>
{:else }
    <Loading/>
{/if}
