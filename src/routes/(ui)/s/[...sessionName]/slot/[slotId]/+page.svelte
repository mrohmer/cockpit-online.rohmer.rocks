<script lang="ts">
  import { run } from 'svelte/legacy';

  import type {Race} from '$lib/models/race';
  import {page} from '$app/state';
  import Content from '$lib/components/Content.svelte';
  import Loading from "$lib/components/Loading.svelte";
  import type {ApiData} from '$lib/models/api-data';
  import {browser} from '$app/environment';
  import {liveQuery} from 'dexie';
  import {db} from '$lib/db';
  import type {Settings} from '$lib/models/settings';
  import {createVibrationNotifier} from '$lib/utils/vibration';
  import {cleanSessionName} from '$lib/utils/clean-session-name';
  import SessionHeader from "$lib/components/SessionHeader.svelte";
  import {addSession, removeSession} from '$lib/utils/sessions';
  import {handleBackLinkClick} from "$lib/utils/handle-back-link-click.js";
  import {createRaceStore} from '$lib/utils/race-store';
  import LastUpdate from '$lib/components/LastUpdate.svelte';
  import SlotPersonalData from './_/components/SlotPersonalData.svelte';
  import Standings from './_/components/Standings.svelte';
  import {fullscreen} from '$lib/utils/fullscreen';

  interface Props {
    data: ApiData<Race>;
  }

  let { data = $bindable() }: Props = $props();
  const settings = browser ? liveQuery(() => db.getSettingsObj()) : undefined;

  const race = $derived(createRaceStore(cleanSessionName(page.params.sessionName), data));

  const vibrationLow = createVibrationNotifier('low', 100);
  const vibrationHigh = createVibrationNotifier('high', 100);

  let slot = $derived($race?.data?.slots.find(slot => slot.id === page?.params?.slotId));
  let position = $derived(($race?.data?.slots.findIndex(slot => slot.id === page?.params?.slotId) ?? -1) + 1);
  let sessionName = $derived(page.params?.sessionName ?? '');

  let date = $derived($race?.date);


  let leaderLap = $derived($race?.data?.slots?.[0]?.lap);

  run(() => {
    browser && $race?.data && page.params.sessionName && ($race?.data?.slots?.length ? addSession(page.params.sessionName) : removeSession(page.params.sessionName));
  });

  run(() => {
    const s: Partial<Record<Settings['key'], Settings['value']>> = $settings ?? {};
    if (slot?.remainingGas >= 0 && s.slotDetailVibrationEmpty && slot.remainingGas <= (s.slotDetailVibrationEmptyThreshold ?? 0.2)) {
      vibrationLow.notify();
    } else {
      vibrationLow.reset();
    }
    if (slot?.remainingGas >= 0 && s.slotDetailVibrationFull && slot.remainingGas >= (s.slotDetailVibrationFullThreshold ?? 0.9)) {
      vibrationHigh.notify();
    } else {
      vibrationHigh.reset();
    }
  });
</script>

<svelte:head>
    {#if $race?.data && slot?.name}
        <title>{slot.name} in {$race.data.name} | Cockpit Online by MRohmer</title>
    {/if}
</svelte:head>
{#if $race?.data && slot}
    <Content>
        <SessionHeader {...($race?.data ?? {})}
                       backLink={page.route.id === "/(ui)/s/[...sessionName]/slot/[slotId]" ? `/s/${cleanSessionName(page.params.sessionName)}` : '/'}
                       onBackLinkClick={handleBackLinkClick}
                       compact={$fullscreen}
        />
    </Content>
    <Content>
        <div class="flex gap-y-16 sm:gap-x-4 flex-col sm:flex-row ">
            <div class="flex-1">
                <SlotPersonalData race={$race.data} slotData={slot} {leaderLap} />
            </div>
            <div class="w-full sm:w-52">
                <Standings race={$race.data} slotData={slot} {leaderLap} />
            </div>
        </div>
    </Content>

    {#if date}
        <Content>
            <div class:mt-10={!$fullscreen} class:mt-4={$fullscreen}>
                <LastUpdate {date} compact={$fullscreen} />
            </div>
        </Content>
    {/if}
{:else }
    <Loading/>
{/if}
