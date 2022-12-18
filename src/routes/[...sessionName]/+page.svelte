<script lang="ts">
  import type {Race} from '$lib/models/race';
  import {onMount} from 'svelte';
  import {page} from '$app/stores';
  import Content from '$lib/components/Content.svelte';
  import Standings from "./components/Standings.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import {slide} from 'svelte/transition';
  import {isDataSaveEnabled} from '../../lib/utils/is-data-save-enabled';
  import type {ApiData} from '$lib/models/api-data';
  import SessionHeader from "$lib/components/SessionHeader.svelte";
  import {handleBackLinkClick} from "$lib/utils/handle-back-link-click.js";
  import {cleanSessionName} from "$lib/utils/clean-session-name.js";
  import {digits} from "$lib/utils/digits.js";
  import {browser} from '$app/environment';
  import {addSession, removeSession} from '../../lib/utils/sessions';

  export let data: ApiData<Race>;
  let mounted = false;

  let timeout: number;

  onMount(() => {
    mounted = true;
    return () => (mounted = false)
  });

  const scheduleLoad = () => {
    if (!mounted || timeout || !$page?.params?.sessionName) {
      return;
    }

    timeout = setTimeout(
      async () => {
        timeout = undefined;
        try {
          const response = await fetch(`/api/sessions/${cleanSessionName($page.params.sessionName)}`);
          if (!response.ok) {
            throw await response.json();
          }

          data = await response.json();
        } catch (e) {
          console.error(e);
          data = {...data};
        }
      },
      (isDataSaveEnabled() ? 3 : 1) * 1000
    ) as number;
  }

  $: race = data?.data
  $: {
    if (race && mounted && $page?.params?.sessionName) {
      scheduleLoad();
    }
  }
  $: date = typeof data?.date === 'string' ? new Date(data.date) : data?.date;
  $: browser && race && $page.params.sessionName && (race?.slots?.length ? addSession($page.params.sessionName) : removeSession($page.params.sessionName));
</script>

<svelte:head>
    <title>{race?.name} | Cockpit Online by MRohmer</title>
</svelte:head>
{#if race}
    <Content>
        <SessionHeader {...race ?? {}}
                       backLink={$page.route.id === "/[...sessionName]/slot/[slotId]" ? `/${cleanSessionName($page.params.sessionName)}` : '/'}
                       on:clickBackLink={handleBackLinkClick}/>
    </Content>

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
