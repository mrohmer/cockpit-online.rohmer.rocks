<script lang="ts">
  import type {Slot} from '$lib/models/slot';
  import SlotCard from "./slot-card/SlotCard.svelte";

  export let slots: Slot[] = [];
  export let sessionName: string;

  $: leaderLap = slots?.[0]?.lap;
</script>

<div class="overflow-x-auto">
    <div class="px-2">
        {#each slots as slot}
            <a href="/{sessionName}/slot/{slot.id}">
                <SlotCard {slot} {leaderLap} />
            </a>
        {/each}
    </div>
</div>
