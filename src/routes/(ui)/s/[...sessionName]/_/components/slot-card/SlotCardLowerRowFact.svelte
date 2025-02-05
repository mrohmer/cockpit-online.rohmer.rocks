<script lang="ts">
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

<div class="flex items-center gap-x-1.5">
    {#if icon}
        <div class="w-5 h-5 text-neutral-400 max-[450px]:hidden">
            {@render icon?.()}
        </div>
    {/if}
    {#if indicator}
        <div class="h-7 w-1">
            {@render indicator?.()}
        </div>
    {/if}
    <div>
        {#if title}
            <div class="text-xs text-neutral-400 font-normal overflow-hidden text-ellipsis whitespace-nowrap">
                {@render title?.()}
            </div>
        {/if}
        <div class="text-sm font-normal">
            {@render children?.()}
        </div>
    </div>
</div>
