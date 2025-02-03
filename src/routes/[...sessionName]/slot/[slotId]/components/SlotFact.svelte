<script lang="ts">
  import SlotCard from "./SlotCard.svelte";
  interface Props {
    icon?: import('svelte').Snippet;
    indicator?: import('svelte').Snippet;
    title?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
  }

  let {
    icon,
    indicator,
    title,
    children
  }: Props = $props();
</script>

<SlotCard>
    <div class="flex items-center gap-x-2.5">
        {#if icon}
            <div class="w-8 h-8 text-neutral-400">
                {@render icon?.()}
            </div>
        {/if}
        {#if indicator}
            <div class="h-9 w-1">
                {@render indicator?.()}
            </div>
        {/if}
        <div>
            {#if title}
                <div class="text-sm text-neutral-400 font-normal overflow-hidden text-ellipsis whitespace-nowrap">
                    {@render title?.()}
                </div>
            {/if}
            <div class="font-normal">
                {@render children?.()}
            </div>
        </div>
    </div>
</SlotCard>
