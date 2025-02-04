<script lang="ts">
  import type {Race} from '$lib/models/race';
  import type {Slot} from '$lib/models/slot';
  import SlotCard from '../../../../_/components/slot-card/SlotCard.svelte';

  type Props = {
    slotData: Slot;
    leaderLap?: number;
    isCurrentSlot?: boolean
  }
  let {slotData: slot, leaderLap, isCurrentSlot}: Props = $props();

</script>

<div class="flex items-center" class:font-bold={isCurrentSlot} class:opacity-60={!isCurrentSlot}>
  <div class="w-8 text-center">
      {slot.position}
  </div>
  <div class="flex-1">
      {slot.name}
  </div>

    <div class="text-center min-w-[3rem]">
        <div>
            {#if slot.lap}
                {#if slot.position === 1 || !leaderLap}
                    0
                {:else}
                    {Math.sign(slot.lap - leaderLap) < 0 ? '-' : '+'}{Math.abs(slot.lap - leaderLap)}
                {/if}
            {:else}
                <span class="text-neutral-300 text-sm dark:text-neutral-600">---</span>
            {/if}
        </div>
    </div>
</div>
