<div class="flex flex-col gap-y-0.5 py-5 border-neutral-200 dark:border-neutral-700 font-normal">
    {#if $$slots.header}
        <div class="text-xl font-bold">
            <slot name="header" />
        </div>
    {/if}

    <slot />
</div>
