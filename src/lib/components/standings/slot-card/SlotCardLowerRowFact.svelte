<div class="flex items-center gap-x-1.5">
    {#if $$slots.icon}
        <div class="w-5 h-5 text-neutral-400">
            <slot name="icon"/>
        </div>
    {/if}
    {#if $$slots.indicator}
        <div class="h-7 w-1">
            <slot name="indicator"/>
        </div>
    {/if}
    <div>
        {#if $$slots.title}
            <div class="text-xs text-neutral-400 font-normal overflow-hidden text-ellipsis whitespace-nowrap">
                <slot name="title"/>
            </div>
        {/if}
        <div class="text-sm font-normal">
            <slot/>
        </div>
    </div>
</div>
