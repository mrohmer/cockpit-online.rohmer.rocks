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

  let width: number = $state();

  let isDesktop = $derived(!width || width >= 390);

  let gasGreen = $derived(remainingGas > 0.8);
  let gasRed = $derived(remainingGas < 0.3);
  let gasYellow = $derived(!gasGreen && !gasRed);
  let gasPulsing = $derived(remainingGas < 0.2);
</script>


<div class="flex"
     class:gap-x-6={isDesktop}
     class:gap-x-3={!isDesktop}
     class:flex-wrap={!isDesktop}
     bind:clientWidth={width}
>
    <div class="w-[6.4rem]" class:w-[5rem]={!isDesktop}>
        <SlotCardLowerRowFact>
            {#snippet icon()}
            <IoMdStopwatch />
          {/snippet}
            {#snippet title()}
            <span >Letzte {isDesktop ? 'Runde' : ''}</span>
          {/snippet}

            {#if lastLap?.time}
                {lastLap.time}s
            {:else}
                <div class="text-neutral-300 text-sm dark:text-neutral-600">---</div>
            {/if}
        </SlotCardLowerRowFact>
    </div>
    <div class="w-[7.9rem]" class:w-[5.5rem]={!isDesktop}>
        <SlotCardLowerRowFact>
            {#snippet icon()}
            <IoMdStopwatch />
          {/snippet}
            {#snippet title()}
            <span >Schnellste {isDesktop ? 'Runde' : ''}</span>
          {/snippet}

            {#if fastestLap?.time}
                {fastestLap.time}s
            {:else}
                <div class="text-neutral-300 text-sm dark:text-neutral-600">---</div>
            {/if}
        </SlotCardLowerRowFact>
    </div>
    <div class="w-[6.2rem]">
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
            {(remainingGas * 100).toFixed(0)}%
        </SlotCardLowerRowFact>
    </div>
</div>
