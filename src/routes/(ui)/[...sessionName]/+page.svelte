<script lang="ts">
  import {run} from 'svelte/legacy';

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
  import {digits} from "$lib/utils/digits.js";
  import {browser} from '$app/environment';
  import {addSession, removeSession} from '$lib/utils/sessions';
  import {createRaceStore} from '$lib/utils/race-store';

  interface Props {
    data: ApiData<Race>;
  }

  let { data = $bindable() }: Props = $props();

  const race = $derived(createRaceStore(cleanSessionName(page.params.sessionName), data));

  let date = $derived($race?.date);
  run(() => {
    browser && race && page.params.sessionName && ($race?.data?.slots?.length ? addSession(page.params.sessionName) : removeSession(page.params.sessionName));
  });
</script>

<svelte:head>
    <title>{$race?.data?.name ?? page.params.sessionName} | Cockpit Online by MRohmer</title>
</svelte:head>
{#if $race?.data}
    <Content>
        <SessionHeader {...($race?.data ?? {})}
                       backLink={page.route.id === "/(ui)/[...sessionName]/slot/[slotId]" ? `/${cleanSessionName(page.params.sessionName)}` : '/'}
                       on:clickBackLink={handleBackLinkClick}/>
    </Content>

    <Content>
        {#if $race?.data?.time || $race?.data?.lapsToGo}
            <div class="flex justify-center items-center gap-x-3 mt-6 max-w-[200px] mx-auto mb-10 -mt-6"
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
            <div class="text-center text-sm font-normal">
                <div class="text-neutral-400">Stand</div>
                <div>
                <span>
                {digits(date.getDay())}.{digits(date.getMonth() + 1)}.{digits(date.getFullYear())}
                </span>
                    <span>
                {digits(date.getHours())}:{digits(date.getMinutes())}:{digits(date.getSeconds())}
                </span>
                </div>
            </div>
        </Content>
    {/if}
{:else }
    <Loading/>
{/if}
