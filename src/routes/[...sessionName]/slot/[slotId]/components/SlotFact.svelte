<script lang="ts">
  import SlotCard from "./SlotCard.svelte";
</script>

<SlotCard>
    <div class="flex items-center gap-x-2.5">
        {#if $$slots.icon}
            <div class="w-8 h-8 text-neutral-400">
                <slot name="icon"/>
            </div>
        {/if}
        {#if $$slots.indicator}
            <div class="h-9 w-1">
                <slot name="indicator"/>
            </div>
        {/if}
        <div>
            {#if $$slots.title}
                <div class="text-sm text-neutral-400 font-normal overflow-hidden text-ellipsis whitespace-nowrap">
                    <slot name="title"/>
                </div>
            {/if}
            <div class="font-normal">
                <slot/>
            </div>
        </div>
    </div>
</SlotCard>
