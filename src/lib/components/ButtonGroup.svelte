<script lang="ts">

  interface Props {
    value: string|number;
    options?: [string|number, string][];
    onchange?: (value: string|number) => void;
  }

  let { value, onchange, options = [] }: Props = $props();
</script>

<div class="flex rounded-xl overflow-hidden border-primary border">
    {#each options ?? [] as [v, label], index}
        <div class="py-2 px-3 cursor-pointer border-neutral-200 dark:border-neutral-700 transition-colors"
             class:border-l={index > 0}
             class:border-primary={String(value) === String(v)}
             class:bg-primary={String(value) === String(v)}
             onclick={() => onchange?.(typeof value === 'number' ? +v : v)}
        >
            {label}
        </div>
    {/each}
</div>
