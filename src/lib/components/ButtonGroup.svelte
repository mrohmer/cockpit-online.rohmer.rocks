<script lang="ts">
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  export let value: string|number;
  export let options: Record<string|number, string> = {};
</script>

<div class="flex rounded-xl overflow-hidden border-primary border">
    {#each Object.entries(options ?? {}) as [v, label], index}
        <div class="py-2 px-3 cursor-pointer border-neutral-200 dark:border-neutral-700 transition-colors"
             class:border-l={index > 0}
             class:border-primary={String(value) === String(v)}
             class:bg-primary={String(value) === String(v)}
             on:click={() => dispatch('change', typeof value === 'number' ? +v : v)}
        >
            {label}
        </div>
    {/each}
</div>
