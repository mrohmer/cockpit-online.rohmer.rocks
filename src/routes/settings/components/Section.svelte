<script lang="ts">
    interface Props {
        header?: import('svelte').Snippet;
        children?: import('svelte').Snippet;
    }

    let { header, children }: Props = $props();
</script>

<div class="flex flex-col gap-y-0.5 py-5 border-neutral-200 dark:border-neutral-700 font-normal">
    {#if header}
        <div class="text-xl font-bold">
            {@render header?.()}
        </div>
    {/if}

    {@render children?.()}
</div>
