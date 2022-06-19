<script lang="ts">
  import type {Slot} from '../../models/slot';
  import StandingsValue from "./StandingsValue.svelte";

  export let slot: Slot;
  export let type: 'header' | 'row' = 'row';

  let width: number;

  $: isHeader = type === 'header';
  $: isSmall = width < 450;
</script>
{#if slot || isHeader}
    <div class="text-xl pr-3 mb-2"
         class:font-normal={isHeader}
         class:h-14={!isHeader}
         bind:clientWidth={width}>
        <div class="flex items-top h-full">
            <div class="w-8 font-normal text-center mr-1">
                {isHeader ? 'Pos' : slot.position ?? ''}
            </div>
            <StandingsValue header="Fahrer" {isHeader} class="flex-1 mx-1 min-w-[50px] overflow-x-visible" textAlign="left">
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
                {#if slot?.inPit || slot?.remainingGas}
                    <div class="absolute left-0 top-0 h-full bg-green-700"
                         style="width: {((slot.remainingGas ?? +slot.inPit) * 100).toFixed(0)}%"
                         class:bg-secondary={slot.inPit}
                         class:animate-pulse={slot.inPit}
                         class:opacity-50={!slot.inPit}
                         class:bg-green-700={!slot.inPit && slot.remainingGas >= 0.2}
                         class:bg-red-700={!slot.inPit && slot.remainingGas < 0.2}
                    ></div>
                    <div class="py-2 leading-10">
                        {#if slot.inPit}
                            in Pit
                        {:else if slot.remainingGas}
                            {(slot.remainingGas * 100).toFixed(0)}%
                        {/if}
                    </div>
                {/if}
            </StandingsValue>
        </div>
    </div>
{/if}
