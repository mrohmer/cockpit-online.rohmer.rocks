<script lang="ts">
  import type {Slot} from '../../../models/slot';
  import StandingsValue from "./StandingsValue.svelte";
  import Image from "../common/Image.svelte";
  import RemainingGas from "../common/RemainingGas.svelte";
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  export let slot: Slot;
  export let type: 'header' | 'row' = 'row';
  export let hasImageCol = false;
  export let subscribedForRemainingGas: boolean = false;

  let width: number;

  $: isHeader = type === 'header';
  $: isSmall = width < 450;
</script>
{#if slot || isHeader}
    <div class="text-xl mb-2"
         class:font-normal={isHeader}
         class:h-14={!isHeader}
         bind:clientWidth={width}>
        <div class="flex items-top h-full">
            <div class="w-8 font-normal text-center mr-1"
                 class:my-2={!isHeader}
                 class:text-2xl={!isHeader}
                 class:leading-10={!isHeader}
            >
                {isHeader ? 'Pos' : slot.position ?? ''}
            </div>
            {#if hasImageCol}
                <div class="my-1 w-12 min-w-[2.5rem] mr-2"
                     class:h-12={!isHeader}
                >
                    <Image image={slot?.image} />
                </div>
            {/if}
            <StandingsValue header="Fahrer" {isHeader} class="flex-1 mx-1 min-w-[5rem] overflow-x-visible"
                            textAlign="left">
                <div class="truncate">{slot?.name ?? ''}</div>
                {#if slot?.penalty}
                    <div class="text-red-700 dark:text-red-500 whitespace-nowrap">
                        {#if slot.penalty === 'pit'}
                            Boxenstrafe aktiv!
                        {:else}
                            Strafe aktiv!
                        {/if}
                    </div>
                {/if}
            </StandingsValue>
            <StandingsValue header="Runde" {isHeader} class="w-[3.75rem]">
                <div>
                    {#if slot?.lap}
                        {slot.lap}
                    {:else}
                        ---
                    {/if}
                </div>
            </StandingsValue>
            <StandingsValue header="Zeit" {isHeader} class="w-32">
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

            </StandingsValue>
            <StandingsValue header="Tankstand" {isHeader} class="w-32 h-full">
                <RemainingGas {...(slot ?? {})} subscribed={subscribedForRemainingGas} on:subscribe={() => dispatch('subscribeRemainingGas')} on:unsubscribe={() => dispatch('unsubscribeRemainingGas')} />
            </StandingsValue>
        </div>
    </div>
{/if}
