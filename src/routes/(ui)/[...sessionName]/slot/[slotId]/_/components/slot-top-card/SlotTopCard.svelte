<script lang="ts">
    import type {Slot} from '$lib/models/slot';
    import Card from "$lib/components/Card.svelte";
    import SlotTopCardImage from "./SlotTopCardImage.svelte";
    import SlotTopCardBackground from "./SlotTopCardBackground.svelte";


    interface Props {
        id: Slot['id'];
        name: Slot['name'];
        position: Slot['position'];
        image: Slot['image'];
        car: Slot['car'];
        lap: Slot['lap'];
        totalLaps: number;
    }

    let {
        id,
        name,
        position,
        image,
        car,
        lap,
        totalLaps
    }: Props = $props();
</script>

<Card>
    <div class="flex py-3 pl-4 pr-6 items-center gap-x-4 overflow-hidden">
        <SlotTopCardBackground {id} hasImage={!!image} />

        <SlotTopCardImage {image} {position} {name} />

        <div class="flex-1 min-w-0" class:pl-6={!image}>
            <div class="font-normal text-xl overflow-hidden text-ellipsis whitespace-nowrap">{name}</div>
            {#if car?.name}
                <div class="font-normal text-neutral-400 overflow-hidden text-ellipsis whitespace-nowrap">{car.name}</div>
            {/if}
        </div>
        <div class="text-center min-w-[3rem]">
            <div class="font-normal text-neutral-400">
                Runde
            </div>
            <div class="font-bold text-xl">
                {#if lap || totalLaps}
                    {lap ?? 0}
                    {#if totalLaps}
                        <span class="text-neutral-300 dark:text-neutral-600 font-normal">/ {totalLaps}</span>
                    {/if}
                {:else}
                    <span class="text-neutral-300 text-sm dark:text-neutral-600">---</span>
                {/if}
            </div>
        </div>
    </div>
</Card>
