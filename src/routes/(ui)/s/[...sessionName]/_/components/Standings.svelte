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
</script>

<div class="overflow-x-auto" bind:clientWidth={width}>
    <div class="px-2 flex gap-4 flex-col"
    >
        {#each slots as slot}
            <a href="/{cleanSessionName(sessionName)}/slot/{slot.id}" class="block flex-1">
                <SlotCard {slot} {leaderLap} />
            </a>
        {/each}
    </div>
</div>
