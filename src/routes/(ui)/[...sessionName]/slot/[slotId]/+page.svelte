<script lang="ts">
  import { run } from 'svelte/legacy';

  import type {Race} from '$lib/models/race';
  import {page} from '$app/state';
  import Content from '$lib/components/Content.svelte';
  import Loading from "$lib/components/Loading.svelte";
  import SlotTopCard from "./_/components/slot-top-card/SlotTopCard.svelte";
  import SlotFact from "./_/components/SlotFact.svelte";
  import IoIosAlert from 'svelte-icons/io/IoIosAlert.svelte'
  import IoMdStopwatch from 'svelte-icons/io/IoMdStopwatch.svelte';
  import IoIosSpeedometer from 'svelte-icons/io/IoIosSpeedometer.svelte';
  import type {ApiData} from '$lib/models/api-data';
  import {browser} from '$app/environment';
  import {liveQuery} from 'dexie';
  import {db} from '$lib/db';
  import type {Settings} from '$lib/models/settings';
  import {createVibrationNotifier} from '$lib/utils/vibration';
  import {cleanSessionName} from '$lib/utils/clean-session-name';
  import SessionHeader from "$lib/components/SessionHeader.svelte";
  import {digits} from "$lib/utils/digits";
  import {addSession, removeSession} from '$lib/utils/sessions';
  import {handleBackLinkClick} from "$lib/utils/handle-back-link-click.js";
  import {createRaceStore} from '$lib/utils/race-store';
  import LastUpdate from '$lib/components/LastUpdate.svelte';

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

  let gasGreen = $derived(slot?.remainingGas > 0.8);
  let gasRed = $derived(slot?.remainingGas < 0.3);
  let gasYellow = $derived(!gasGreen && !gasRed);
  let gasPulsing = $derived(slot?.remainingGas < 0.2);
  let date = $derived($race?.date);
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
                       backLink={page.route.id === "/(ui)/[...sessionName]/slot/[slotId]" ? `/${cleanSessionName(page.params.sessionName)}` : '/'}
                       on:clickBackLink={handleBackLinkClick}/>
    </Content>
    <Content>
        <div class="flex gap-4 flex-wrap">
            <div class="w-full">
                <SlotTopCard {...slot} totalLaps={$race.data.lapsToGo} />
            </div>

            <div class="flex-1 min-w-[150px]">
                <SlotFact>
                    {#snippet icon()}
                    <IoMdStopwatch />
                  {/snippet}
                    {#snippet title()}
                    <span >Letzte <span class="hidden sm:inline-block">Runde</span></span>
                  {/snippet}

                    {#if slot.lastLap?.time}
                        {slot.lastLap.time}s
                    {:else}
                        <div class="text-neutral-300 text-sm dark:text-neutral-600">---</div>
                    {/if}
                </SlotFact>
            </div>
            <div class="flex-1 min-w-[150px]">
                <SlotFact>
                    {#snippet icon()}
                    <IoMdStopwatch />
                  {/snippet}
                    {#snippet title()}
                    <span >Schnellste <span class="hidden sm:inline-block">Runde</span></span>
                  {/snippet}

                    {#if slot.fastestLap?.time}
                        {slot.fastestLap.time}s
                    {:else}
                        <div class="text-neutral-300 text-sm dark:text-neutral-600">---</div>
                    {/if}
                </SlotFact>
            </div>
            <div class="flex-1 min-w-[160px]">
                <SlotFact>
                    {#snippet icon()}
                    <IoIosSpeedometer />
                  {/snippet}
                    {#snippet title()}
                    <span >Tankstand</span>
                  {/snippet}
                    {#snippet indicator()}
                    <div  class="w-full h-full">
                          <div class="w-full h-full shadow-sm transition-colors"
                               class:bg-green-600={gasGreen}
                               class:shadow-green-600={gasGreen}
                               class:bg-yellow-400={gasYellow}
                               class:shadow-yellow-400={gasYellow}
                               class:bg-red-600={gasRed}
                               class:shadow-red-600={gasRed}
                               class:animate-pulse={gasPulsing}
                          ></div>
                      </div>
                  {/snippet}
                    {((slot.remainingGas ?? 0) * 100).toFixed(0)}%
                </SlotFact>
            </div>
            <div class="flex-1 min-w-[250px]">
                <SlotFact>
                    {#snippet icon()}
                    <IoIosAlert />
                  {/snippet}
                    {#snippet indicator()}
                    <div  class="w-full h-full">
                          <div class="w-full h-full shadow-sm transition-colors"
                               class:bg-green-600={!slot.penalty}
                               class:shadow-green-600={!slot.penalty}
                               class:bg-red-600={!!slot.penalty}
                               class:shadow-red-600={!!slot.penalty}
                               class:animate-pulse={!!slot.penalty}
                          ></div>
                      </div>
                  {/snippet}
                    <div class="transition-colors font-normal h-11 flex justify-center items-center"
                    >
                        <div>
                            {#if slot.penalty === 'pit'}
                                Boxenstrafe aktiv
                            {:else if slot.penalty === 'unknown'}
                                Strafe aktiv
                            {:else}
                                Keine Strafen aktiv
                            {/if}
                        </div>
                    </div>
                </SlotFact>
            </div>
        </div>
    </Content>

    {#if date}
        <Content class="mt-10">
            <LastUpdate {date} />
        </Content>
    {/if}
{:else }
    <Loading/>
{/if}
