<script lang="ts">
    interface Props {
        disabled?: boolean;
        isLast?: boolean;
        children?: import('svelte').Snippet;
        hint?: import('svelte').Snippet;
    }

    let {
        disabled = false,
        isLast = false,
        children,
        hint
    }: Props = $props();
</script>
<div class="px-5 py-5 border-neutral-200 dark:border-neutral-700 font-normal transition-opacity"
     class:cursor-not-allowed={disabled}
     class:opacity-50={disabled}
     class:border-b={!isLast}
>
    <div class="flex flex-col gap-y-0.5"
         class:pointer-events-none={disabled}>
        {@render children?.()}

        {#if hint}
            <div class="text-neutral-400 text-sm">
                {@render hint?.()}
            </div>
        {/if}
    </div>
</div>
