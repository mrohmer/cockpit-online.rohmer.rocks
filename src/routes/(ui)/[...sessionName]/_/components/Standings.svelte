<script lang="ts">
  import type {Slot} from '$lib/models/slot';
  import SlotCard from "./slot-card/SlotCard.svelte";
  import {cleanSessionName} from "$lib/utils/clean-session-name.js";

  interface Props {
    slots?: Slot[];
    sessionName: string;
  }

  let { slots = [], sessionName }: Props = $props();

  let width = $state(0);

  let leaderLap = $derived(slots?.[0]?.lap);
  let twoCols = $derived(width && width > 850);
</script>

<div class="overflow-x-auto" bind:clientWidth={width}>
    <div class="px-2 flex gap-y-4"
         class:flex-col={!twoCols}
         class:flex-wrap={twoCols}
    >
        {#each slots as slot}
            <a href="/{cleanSessionName(sessionName)}/slot/{slot.id}" class="block" class:w-[48%]={twoCols} class:mr-[2%]={twoCols}>
                <SlotCard {slot} {leaderLap} />
            </a>
        {/each}
    </div>
</div>
