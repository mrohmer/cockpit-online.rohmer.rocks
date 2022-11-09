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
  import {invalidate} from '$app/navigation';
  import {isDataSaveEnabled} from '../../../../lib/utils/is-data-save-enabled';
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

  $: slot = race?.slots.find(slot => slot.id === $page?.params?.slotId);
  $: position = (race?.slots.findIndex(slot => slot.id === $page?.params?.slotId) ?? -1) + 1;
  $: sessionName = $page.params?.sessionName ?? '';

  $: gasGreen = slot?.remainingGas > 0.8;
  $: gasRed = slot?.remainingGas < 0.3;
  $: gasYellow = !gasGreen && !gasRed;
  $: gasPulsing = slot?.remainingGas < 0.2;
</script>

<svelte:head>
    {#if race && slot?.name}
        <title>{slot?.name} in {race.name} | Carrera-Live</title>
    {/if}
</svelte:head>
{#if race && slot}
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
{:else }
    <Loading/>
{/if}
