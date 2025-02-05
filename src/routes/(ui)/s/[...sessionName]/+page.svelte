<script lang="ts">
  import type {Race} from '$lib/models/race';
  import {page} from '$app/state';
  import Content from '$lib/components/Content.svelte';
  import Standings from "./_/components/Standings.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import {slide} from 'svelte/transition';
  import type {ApiData} from '$lib/models/api-data';
  import SessionHeader from "$lib/components/SessionHeader.svelte";
  import {handleBackLinkClick} from "$lib/utils/handle-back-link-click.js";
  import {cleanSessionName} from "$lib/utils/clean-session-name.js";
  import {addSession, removeSession} from '$lib/utils/sessions';
  import {createRaceStore} from '$lib/utils/race-store';
  import LastUpdate from '$lib/components/LastUpdate.svelte';
  import {fullscreen} from '$lib/utils/fullscreen';
  import {onMount} from 'svelte';

  interface Props {
    data: ApiData<Race>;
  }

  let { data = $bindable() }: Props = $props();

  const race = $derived(createRaceStore(cleanSessionName(page.params.sessionName), data));

  let date = $derived($race?.date);

  onMount(() => {
    if (page.params.sessionName && $race?.data?.slots?.length) {
      addSession(page.params.sessionName);
    } else {
      removeSession(page.params.sessionName);
    }
  });
</script>

<svelte:head>
    <title>{$race?.data?.name ?? page.params.sessionName} | Cockpit Online by MRohmer</title>
</svelte:head>
{#if $race?.data}
    <Content>
        <SessionHeader {...($race?.data ?? {})}
                       backLink={page.route.id === "/(ui)/s/[...sessionName]/slot/[slotId]" ? `/${cleanSessionName(page.params.sessionName)}` : '/'}
                       onBackLinkClick={handleBackLinkClick}
        />
    </Content>

    <Content>
        {#if $race?.data?.time || $race?.data?.lapsToGo}
            <div class="flex justify-center items-center gap-x-3 max-w-[200px] mx-auto mb-10 -mt-6"
                 transition:slide>
                {#if $race?.data?.time}
                    <div class="text-center flex-1">
                        <div class="text-xs">Zeit</div>
                        <div class="font-normal">{$race.data.time || '00:00:00'}</div>
                    </div>
                {/if}
                {#if $race?.data?.lapsToGo}
                    <div class="text-center flex-1">
                        <div class="text-xs">Runden</div>
                        <div class="font-normal">{$race.data.lapsToGo || 225}</div>
                    </div>
                {/if}
            </div>
        {/if}

        <Standings sessionName={page.params.sessionName} slots={$race?.data?.slots}/>
    </Content>

    {#if date}
        <Content class="mt-10">
            <LastUpdate {date} compact={$fullscreen} />
        </Content>
    {/if}
{:else }
    <Loading/>
{/if}
