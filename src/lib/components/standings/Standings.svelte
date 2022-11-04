<script lang="ts">
  import type {Slot} from '$lib/models/slot';
  import SlotCard from "./slot-card/SlotCard.svelte";

  export let slots: Slot[] = [];
  export let sessionName: string;

  let width = 0;

  $: leaderLap = slots?.[0]?.lap;
  $: twoCols = width > 950;
</script>

<div class="overflow-x-auto" bind:clientWidth={width}>
    <div class="px-2 flex gap-y-4"
         class:flex-col={!twoCols}
         class:flex-wrap={twoCols}
    >
        {#each slots as slot}
            <a href="/{sessionName}/slot/{slot.id}" class="block" class:w-[48%]={twoCols} class:mr-[2%]={twoCols}>
                <SlotCard {slot} {leaderLap} />
            </a>
        {/each}
    </div>
</div>
