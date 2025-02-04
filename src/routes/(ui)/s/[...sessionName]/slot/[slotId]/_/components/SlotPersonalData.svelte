<script lang="ts">
  import SlotTopCard from ".//slot-top-card/SlotTopCard.svelte";
  import SlotFact from "./SlotFact.svelte";
  import IoMdStopwatch from 'svelte-icons/io/IoMdStopwatch.svelte';
  import IoIosSpeedometer from 'svelte-icons/io/IoIosSpeedometer.svelte';
  import type {Race} from '$lib/models/race';
  import type {Slot} from '$lib/models/slot';
  import SlotPenalty from './SlotPenalty.svelte';

  type Props = {
    slotData: Slot;
    leaderLap?: number;
    race: Race;
  }
  let {slotData: slot, leaderLap, race}: Props = $props();
  let gasGreen = $derived(slot?.remainingGas > 0.8);
  let gasRed = $derived(slot?.remainingGas < 0.3);
  let gasYellow = $derived(!gasGreen && !gasRed);
  let gasPulsing = $derived(!!slot?.inPit);
</script>
<div class="flex gap-4 flex-wrap">

    <div class="w-full">
        <SlotTopCard {...slot} totalLaps={race.lapsToGo} {leaderLap}/>
    </div>

    <SlotPenalty {...slot} />

    <div class="w-full lg:flex-1 lg:min-w-[160px]">
        <SlotFact>
            {#snippet icon()}
                <IoIosSpeedometer/>
            {/snippet}
            {#snippet title()}
                <span>Tankstand</span>
            {/snippet}
            {#snippet indicator()}
                <div class="w-full h-full">
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
            {#snippet bg()}
                <div class="h-full opacity-20"
                     style={`width: ${(slot.remainingGas ?? 0) * 100}%`}
                     class:bg-green-600={gasGreen}
                     class:shadow-green-600={gasGreen}
                     class:bg-yellow-400={gasYellow}
                     class:shadow-yellow-400={gasYellow}
                     class:bg-red-600={gasRed}
                     class:shadow-red-600={gasRed}
                     class:animate-pulse={gasPulsing}></div>
            {/snippet}
            {((slot.remainingGas ?? 0) * 100).toFixed(0)}%
        </SlotFact>
    </div>
    <div class="flex-1 min-w-[150px]">
        <SlotFact>
            {#snippet icon()}
                <IoMdStopwatch/>
            {/snippet}
            {#snippet title()}
                <span>Letzte <span class="hidden sm:inline-block">Runde</span></span>
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
                <IoMdStopwatch/>
            {/snippet}
            {#snippet title()}
                <span>Schnellste <span class="hidden sm:inline-block">Runde</span></span>
            {/snippet}

            {#if slot.fastestLap?.time}
                {slot.fastestLap.time}s
            {:else}
                <div class="text-neutral-300 text-sm dark:text-neutral-600">---</div>
            {/if}
        </SlotFact>
    </div>
</div>
