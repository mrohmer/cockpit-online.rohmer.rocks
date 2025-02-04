<script lang="ts">
  import type {Slot} from '$lib/models/slot';
  import IoMdStopwatch from 'svelte-icons/io/IoMdStopwatch.svelte';
  import IoIosSpeedometer from 'svelte-icons/io/IoIosSpeedometer.svelte';
  import SlotCardLowerRowFact from "./SlotCardLowerRowFact.svelte";

  interface Props {
    lastLap: Slot['lastLap'];
    fastestLap: Slot['fastestLap'];
    remainingGas: Slot['remainingGas'];
    inPit: Slot['inPit'];
  }

  let {
    lastLap,
    fastestLap,
    remainingGas,
    inPit
  }: Props = $props();

  let gasGreen = $derived(remainingGas > 0.8);
  let gasRed = $derived(remainingGas < 0.3);
  let gasYellow = $derived(!gasGreen && !gasRed);
  let gasPulsing = $derived(inPit);
</script>


<div class="flex gap-x-3 min-[550px]:gap-x-6 max-[550px]:flex-wrap"
>
    <div class="w-[5rem] min-[550px]:w-[6.4rem]">
        <SlotCardLowerRowFact>
            {#snippet icon()}
            <IoMdStopwatch />
          {/snippet}
            {#snippet title()}
            <span >Letzte <span class="hidden min-[550px]:inline">Runde</span></span>
          {/snippet}

            {#if lastLap?.time}
                {lastLap.time}s
            {:else}
                <div class="text-neutral-300 text-sm dark:text-neutral-600">---</div>
            {/if}
        </SlotCardLowerRowFact>
    </div>
    <div class="w-[5.5rem] min-[550px]:w-[7.9rem]">
        <SlotCardLowerRowFact>
            {#snippet icon()}
            <IoMdStopwatch />
          {/snippet}
            {#snippet title()}
            <span >Schnellste <span class="hidden min-[550px]:inline">Runde</span></span>
          {/snippet}

            {#if fastestLap?.time}
                {fastestLap.time}s
            {:else}
                <div class="text-neutral-300 text-sm dark:text-neutral-600">---</div>
            {/if}
        </SlotCardLowerRowFact>
    </div>
    <div class="w-[8.2rem]">
        <SlotCardLowerRowFact>
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
            {(remainingGas * 100).toFixed(0)}% {inPit ? '(in Box)' : ''}
        </SlotCardLowerRowFact>
    </div>
</div>
