<script lang="ts">
  import type {Slot} from '$lib/models/slot';
  import IoMdStopwatch from 'svelte-icons/io/IoMdStopwatch.svelte';
  import IoIosSpeedometer from 'svelte-icons/io/IoIosSpeedometer.svelte';
  import SlotCardLowerRowFact from "./SlotCardLowerRowFact.svelte";

  export let lastLap: Slot['lastLap'];
  export let fastestLap: Slot['fastestLap'];
  export let remainingGas: Slot['remainingGas'];
  export let inPit: Slot['inPit'];

  let width: number;

  $: isDesktop = !width || width >= 390;

  $: gasGreen = remainingGas > 0.8;
  $: gasRed = remainingGas < 0.3;
  $: gasYellow = !gasGreen && !gasRed;
  $: gasPulsing = remainingGas < 0.2;
</script>


<div class="flex"
     class:gap-x-6={isDesktop}
     class:gap-x-3={!isDesktop}
     class:flex-wrap={!isDesktop}
     bind:clientWidth={width}
>
    <div class="w-[6.4rem]" class:w-[5rem]={!isDesktop}>
        <SlotCardLowerRowFact>
            <IoMdStopwatch slot="icon"/>
            <span slot="title">Letzte {isDesktop ? 'Runde' : ''}</span>

            {#if lastLap?.time}
                {lastLap.time}s
            {:else}
                <div class="text-neutral-300 text-sm">---</div>
            {/if}
        </SlotCardLowerRowFact>
    </div>
    <div class="w-[7.9rem]" class:w-[5.5rem]={!isDesktop}>
        <SlotCardLowerRowFact>
            <IoMdStopwatch slot="icon"/>
            <span slot="title">Schnellste {isDesktop ? 'Runde' : ''}</span>

            {#if fastestLap?.time}
                {fastestLap.time}s
            {:else}
                <div class="text-neutral-300 text-sm">---</div>
            {/if}
        </SlotCardLowerRowFact>
    </div>
    <div class="w-[6.2rem]">
        <SlotCardLowerRowFact>
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
            {(remainingGas * 100).toFixed(0)}%
        </SlotCardLowerRowFact>
    </div>
</div>
