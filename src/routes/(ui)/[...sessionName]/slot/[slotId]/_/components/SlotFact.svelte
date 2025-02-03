<script lang="ts">
  import SlotCard from "./SlotCard.svelte";

  interface Props {
    icon?: import('svelte').Snippet;
    indicator?: import('svelte').Snippet;
    title?: import('svelte').Snippet;
    bg?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
    iconColorNormal?: boolean;
  }

  let {
    icon,
    indicator,
    title,
    children,
    bg,
    iconColorNormal
  }: Props = $props();
</script>

<SlotCard>
    {#if bg}
        <div class="absolute inset-0">
            {@render bg?.()}
        </div>
    {/if}
    <div class="flex items-center gap-x-2.5">
        {#if icon}
            <div class="w-8 h-8" class:text-neutral-400={!iconColorNormal}>
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
                <div class="text-xs text-neutral-400 font-normal overflow-hidden text-ellipsis whitespace-nowrap">
                    {@render title?.()}
                </div>
            {/if}
            <div class="font-normal text-xl">
                {@render children?.()}
            </div>
        </div>
    </div>
</SlotCard>
