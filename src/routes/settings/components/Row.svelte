<script lang="ts">
    export let disabled = false;
    export let isLast = false;
</script>
<div class="flex flex-col gap-y-0.5 px-5 py-5 border-neutral-200 dark:border-neutral-700 font-normal "
     class:cursor-not-allowed={disabled}
     class:opacity-50={disabled}
     class:border-b={!isLast}
>
    <slot />

    {#if $$slots.hint}
        <div class="text-neutral-400 text-sm">
            <slot name="hint" />
        </div>
    {/if}
</div>
