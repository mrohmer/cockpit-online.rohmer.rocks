<script lang="ts">
  import type {Race} from '$lib/models/race';
  import type {Slot} from '$lib/models/slot';
  import SlotCard from '../../../../_/components/slot-card/SlotCard.svelte';
  import StandingsRow from './StandingsRow.svelte';
  import Card from '$lib/components/Card.svelte';

  type Props = {
    slotData: Slot;
    leaderLap?: number;
    race: Race;
  }
  let {slotData: currentSlot, leaderLap, race}: Props = $props();

</script>

{#if race?.slots?.length}
    <Card class="h-full">
        <div class="px-1.5 py-3 flex gap-4 flex-col"
        >
            {#each race.slots as slot}
                <div class="block flex-1">
                    <StandingsRow slotData={slot} {leaderLap} isCurrentSlot={slot.id === currentSlot.id}/>
                </div>
            {/each}
        </div>
    </Card>
{/if}
