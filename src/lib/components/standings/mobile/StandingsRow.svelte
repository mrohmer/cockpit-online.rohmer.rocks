<script lang="ts">
  import type {Slot} from '../../../models/slot';
  import Image from "../common/Image.svelte";
  import RemainingGas from "../common/RemainingGas.svelte";

  export let slot: Slot;
  export let hasImageCol: boolean = false;

  export let width: number;

  $: size = width >= 400 ? 'normal' : (width >= 330 ? 'small' : 'tiny');
</script>

<div class="px-1" bind:clientWidth={width}>
    <div class="flex mb-2 items-center">
        <div class="w-8 font-normal text-center mr-1 text-3xl">
            <div>
                {slot.position ?? ''}
            </div>
        </div>
        {#if hasImageCol}
            <div class="mx-1 w-12 min-w-[2.5rem] mr-2 h-12"
            >
                <Image image={slot.image}/>
            </div>
        {/if}
        <div class="flex-1 ml-1 min-w-[5rem] overflow-x-visible text-3xl">
            {slot.name ?? ''}
        </div>
    </div>
    <div class="flex text-xl mb-2 pl-9" class:justify-between={size === 'tiny'}>
        <div class="mx-1 text-center w-12 flex flex-col justify-end">
            <div class="text-xs">Runde</div>
            <div class="text-2xl">{slot.lap ?? '---'}</div>
        </div>
        <div class="mx-1">
            <div class="flex items-baseline">
                <div class="text-xs text-right w-14">letzte</div>
                <div class="w-16 text-right">
                    {#if slot?.lastLap?.time}
                        {slot.lastLap.time}<span class="text-sm">s</span>
                    {:else}
                        ---
                    {/if}
                </div>
            </div>
            <div class="flex items-baseline">
                <div class="text-xs text-right w-14">schnellste</div>
                <div class="w-16 text-right">
                    {#if slot?.lastLap?.time}
                        {slot.lastLap.time}<span class="text-sm">s</span>
                    {:else}
                        ---
                    {/if}
                </div>
            </div>
        </div>
        {#if size !== 'tiny'}
            <div class="flex-1 ml-1 h-14">
                <RemainingGas {...slot}/>
            </div>
        {/if}
    </div>
    {#if size === 'tiny'}
        <div class="flex mb-2 pl-9">
            <div class="flex-1 ml-1">
                <RemainingGas {...slot}/>
            </div>
        </div>
    {/if}
</div>
