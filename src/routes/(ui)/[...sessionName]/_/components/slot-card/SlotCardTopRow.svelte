<script lang="ts">
  import type {Slot} from '$lib/models/slot';
  import IoIosArrowForward from 'svelte-icons/io/IoIosArrowForward.svelte';

  interface Props {
    name: Slot['name'];
    car: Slot['car'];
    lap: Slot['lap'];
    position: Slot['position'];
    leaderLap: number;
  }

  let {
    name,
    car,
    lap,
    position,
    leaderLap
  }: Props = $props();
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
                {#if position === 1 || !leaderLap}
                    {lap}
                {:else}
                    {Math.sign(lap - leaderLap) < 0 ? '-' : '+'}{Math.abs(lap - leaderLap)}
                {/if}
            {:else}
                <div class="text-neutral-300 text-sm dark:text-neutral-600">---</div>
            {/if}
        </div>
    </div>
    <div class="h-4 text-neutral-400">
        <IoIosArrowForward/>
    </div>
</div>
