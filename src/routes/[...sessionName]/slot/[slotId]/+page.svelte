<script lang="ts">
  import type {Race} from '$lib/models/race';
  import {onMount} from 'svelte';
  import {page} from '$app/stores';
  import Content from '$lib/components/Content.svelte';
  import Loading from "$lib/components/Loading.svelte";
  import SlotTopCard from "./components/slot-top-card/SlotTopCard.svelte";
  import SlotFact from "./components/SlotFact.svelte";
  import IoIosAlert from 'svelte-icons/io/IoIosAlert.svelte'
  import IoMdStopwatch from 'svelte-icons/io/IoMdStopwatch.svelte';
  import IoIosSpeedometer from 'svelte-icons/io/IoIosSpeedometer.svelte';
  import {isDataSaveEnabled} from '../../../../lib/utils/is-data-save-enabled';
  import type {ApiData} from '$lib/models/api-data';
  import {browser} from '$app/environment';
  import {liveQuery} from 'dexie';
  import {db} from '$lib/db';
  import type {Settings} from '$lib/models/settings';
  import {createVibrationNotifier} from '../../../../lib/utils/vibration';
  import {cleanSessionName} from '../../../../lib/utils/clean-session-name';
  import SessionHeader from "$lib/components/SessionHeader.svelte";
  import {digits} from "$lib/utils/digits";
  import {addSession, removeSession} from '../../../../lib/utils/sessions';
  import {handleBackLinkClick} from "$lib/utils/handle-back-link-click.js";

  export let data: ApiData<Race>;
  const settings = browser ? liveQuery(() => db.getSettingsObj()) : undefined;

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

  const vibrationLow = createVibrationNotifier('low', 100);
  const vibrationHigh = createVibrationNotifier('high', 100);

  $: race = data?.data
  $: {
    if (race && mounted && $page?.params?.sessionName) {
      scheduleLoad();
    }
  }

  $: slot = race?.slots.find(slot => slot.id === $page?.params?.slotId);
  $: position = (race?.slots.findIndex(slot => slot.id === $page?.params?.slotId) ?? -1) + 1;
  $: sessionName = $page.params?.sessionName ?? '';

  $: gasGreen = slot?.remainingGas > 0.8;
  $: gasRed = slot?.remainingGas < 0.3;
  $: gasYellow = !gasGreen && !gasRed;
  $: gasPulsing = slot?.remainingGas < 0.2;
  $: date = typeof data?.date === 'string' ? new Date(data.date) : data?.date;
  $: browser && race && $page.params.sessionName && (race?.slots?.length ? addSession($page.params.sessionName) : removeSession($page.params.sessionName));

  $: {
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
  }
</script>

<svelte:head>
    {#if race && slot?.name}
        <title>{slot?.name} in {race.name} | Carrera-Live</title>
    {/if}
</svelte:head>
{#if race && slot}
    <Content>
        <SessionHeader {...race ?? {}}
                       backLink={$page.route.id === "/[...sessionName]/slot/[slotId]" ? `/${cleanSessionName($page.params.sessionName)}` : '/'}
                       on:clickBackLink={handleBackLinkClick}/>
    </Content>
    <Content>
        <div class="flex gap-4 flex-wrap">
            <div class="w-full">
                <SlotTopCard {...slot} totalLaps={race.lapsToGo} />
            </div>

            <div class="flex-1 min-w-[150px]">
                <SlotFact>
                    <IoMdStopwatch slot="icon"/>
                    <span slot="title">Letzte <span class="hidden sm:inline-block">Runde</span></span>

                    {#if slot.lastLap?.time}
                        {slot.lastLap.time}s
                    {:else}
                        <div class="text-neutral-300 text-sm dark:text-neutral-600">---</div>
                    {/if}
                </SlotFact>
            </div>
            <div class="flex-1 min-w-[150px]">
                <SlotFact>
                    <IoMdStopwatch slot="icon"/>
                    <span slot="title">Schnellste <span class="hidden sm:inline-block">Runde</span></span>

                    {#if slot.fastestLap?.time}
                        {slot.fastestLap.time}s
                    {:else}
                        <div class="text-neutral-300 text-sm dark:text-neutral-600">---</div>
                    {/if}
                </SlotFact>
            </div>
            <div class="flex-1 min-w-[160px]">
                <SlotFact>
                    <IoIosSpeedometer slot="icon"/>
                    <span slot="title">Tankstand</span>
                    <div slot="indicator" class="w-full h-full">
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
                    {(slot.remainingGas * 100).toFixed(0)}%
                </SlotFact>
            </div>
            <div class="flex-1 min-w-[250px]">
                <SlotFact>
                    <IoIosAlert slot="icon"/>
                    <div slot="indicator" class="w-full h-full">
                        <div class="w-full h-full shadow-sm transition-colors"
                             class:bg-green-600={!slot.penalty}
                             class:shadow-green-600={!slot.penalty}
                             class:bg-red-600={!!slot.penalty}
                             class:shadow-red-600={!!slot.penalty}
                             class:animate-pulse={!!slot.penalty}
                        ></div>
                    </div>
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
