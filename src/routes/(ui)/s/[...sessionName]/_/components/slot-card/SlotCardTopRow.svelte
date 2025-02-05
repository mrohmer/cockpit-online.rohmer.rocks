<script lang="ts">
  import type {Slot} from '$lib/models/slot';
  import IoIosArrowForward from 'svelte-icons/io/IoIosArrowForward.svelte';

  interface Props extends Pick<Slot, 'id' | 'name' | 'car' | 'lap' | 'position'> {
    leaderLap: number;
  }

  let {
    id,
    name,
    car,
    lap,
    position,
    leaderLap
  }: Props = $props();

  let isDistance = $derived(position !== 1 && !!leaderLap);
</script>

<div class="flex items-center gap-x-4 h-16 my-1">
    <div class="flex-1 min-w-0">
        <div class="overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-normal">
            {name}
        </div>
        {#if car?.name}
            <div class="text-neutral-400 text-xs overflow-hidden text-ellipsis whitespace-nowrap font-normal">
                {car.name}
            </div>
        {/if}
    </div>
    <div class="text-center min-w-[3rem]">
        <div class="font-normal text-2xl">
            {#if lap}
                {#if !isDistance}
                    {lap}
                {:else}
                    {Math.sign(lap - leaderLap) < 0 ? '-' : '+'}{Math.abs(lap - leaderLap)}
                {/if}
            {:else}
                <div class="text-neutral-300 text-sm dark:text-neutral-600">---</div>
            {/if}
        </div>
        <div class="font-normal text-neutral-400 text-xs">
            {isDistance ? 'Abstand' : 'Runde'}
        </div>
    </div>
    <div class="h-4 text-neutral-400">
        <IoIosArrowForward/>
    </div>
</div>
