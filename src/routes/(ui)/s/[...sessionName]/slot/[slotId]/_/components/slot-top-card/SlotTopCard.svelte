<script lang="ts">
  import type {Slot} from '$lib/models/slot';
  import Card from "$lib/components/Card.svelte";
  import SlotTopCardImage from "./SlotTopCardImage.svelte";
  import SlotTopCardBackground from "./SlotTopCardBackground.svelte";


  interface Props extends Pick<Slot, 'id' | 'name' | 'position' | 'image' | 'car' | 'lap'> {
    totalLaps?: number;
    leaderLap?: number;
  }

  let {
    id,
    name,
    position,
    image,
    car,
    lap,
    totalLaps,
    leaderLap
  }: Props = $props();
</script>

<Card viewTransitionName="slot-card-{id}">
    <div class="flex py-3 pl-4 pr-6 items-center gap-x-4 overflow-hidden">
        <SlotTopCardBackground {id} hasImage={!!image}/>

        <SlotTopCardImage {id} {image} {position} {name}/>

        <div class="flex-1 min-w-0" class:pl-3={!image}>
            <div class="font-normal text-2xl overflow-hidden text-ellipsis whitespace-nowrap">{name}</div>
            {#if car?.name}
                <div class="font-normal text-neutral-400 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                    {car.name}
                </div>
            {/if}
        </div>
        <div class="text-center min-w-[3rem]">
            <div class="font-normal text-2xl">
                {#if lap || totalLaps}
                    {lap ?? 0}
                    {#if totalLaps}
                        <span class="text-neutral-300 dark:text-neutral-600 font-normal">/ {totalLaps}</span>
                    {/if}
                {:else}
                    <span class="text-neutral-300 text-sm dark:text-neutral-600">---</span>
                {/if}
            </div>
            <div class="font-normal text-neutral-400 text-xs">
                Runde
            </div>
        </div>
        {#if leaderLap !== undefined}
            <div class="text-center min-w-[3rem]">
                <div class="font-normal text-2xl">
                    {#if lap}
                        {#if position === 1 || !leaderLap}
                            0
                        {:else}
                            {Math.sign(lap - leaderLap) < 0 ? '-' : '+'}{Math.abs(lap - leaderLap)}
                        {/if}
                    {:else}
                        <span class="text-neutral-300 text-sm dark:text-neutral-600">---</span>
                    {/if}
                </div>
                <div class="font-normal text-neutral-400 text-xs">
                    Abstand
                </div>
            </div>
        {/if}
    </div>
</Card>
