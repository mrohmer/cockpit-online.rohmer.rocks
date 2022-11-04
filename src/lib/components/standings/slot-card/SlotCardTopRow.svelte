<script lang="ts">
  import type {Slot} from '$lib/models/slot';
  import IoIosArrowForward from 'svelte-icons/io/IoIosArrowForward.svelte';

  export let name: Slot['name'];
  export let car: Slot['car'];
  export let lap: Slot['lap'];
  export let position: Slot['position'];
  export let leaderLap: number;
</script>

<div class="flex items-center gap-x-4 h-14">
    <div class="flex-1 font-bold min-w-0">
        <div class="overflow-hidden text-ellipsis whitespace-nowrap">
            {name}
        </div>
        {#if car?.name}
            <div class="text-neutral-400 text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                {car.name}
            </div>
        {/if}
    </div>
    <div class="text-center min-w-[3rem]">
        <div class="font-normal text-neutral-400 text-xs">
            Runde
        </div>
        <div class="font-bold">
            {#if lap}
                {position === 1 || !leaderLap ? lap : -Math.abs(lap - leaderLap)}
            {:else}
                <div class="text-neutral-300 text-sm">---</div>
            {/if}
        </div>
    </div>
    <div class="h-4 text-neutral-400">
        <IoIosArrowForward/>
    </div>
</div>
