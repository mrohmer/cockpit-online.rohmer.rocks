<script lang="ts">
  import type {Slot} from '$lib/models/slot';
  import SlotCardBackground from "./SlotCardBackground.svelte";
  import SlotCardImage from "./SlotCardImage.svelte";
  import SlotCardTopRow from "./SlotCardTopRow.svelte";
  import SlotCardLowerRow from "./SlotCardLowerRow.svelte";

  export let slot: Slot;

  export let leaderLap: number;

  let width: number;

  $: isDesktop = !width || width >= 500;
</script>

{#if slot}
    <div class="mb-4 shadow transition-all cursor-pointer rounded-xl overflow-hidden hover:shadow-md dark:shadow-none dark:border dark:border-neutral-800 dark:hover:shadow-neutral-800" bind:clientWidth={width}>
        <div class="bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
            <SlotCardBackground {...slot} hasImage={!!slot.image} />
            <div class="flex gap-x-4 px-4 py-1.5"
                 class:px-4={isDesktop}
                 class:px-2={!isDesktop}
            >
                <div>
                    <SlotCardImage {...slot} />
                </div>
                <div class="flex-1 flex flex-col">
                    <SlotCardTopRow {...slot} {leaderLap} />
                    <hr class="block -ml-2 mt-1 mb-2 border-neutral-200 dark:border-neutral-700"/>
                    <SlotCardLowerRow {...slot} />
                </div>
            </div>
        </div>
    </div>
{/if}
