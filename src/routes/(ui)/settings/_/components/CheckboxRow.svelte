<script lang="ts">
  import Row from "./Row.svelte";
  import Switch from "$lib/components/Switch.svelte";

  interface Props {
    checked?: boolean;
    disabled?: boolean;
    isLast?: boolean;
    children?: import('svelte').Snippet;
    checkbox?: import('svelte').Snippet;
    hint?: import('svelte').Snippet;
    onchange?: (value: boolean) => void;
  }

  let {
    checked = false,
    disabled = false,
    isLast = false,
    children,
    checkbox,
    hint,
    onchange
  }: Props = $props();

  const hint_render = $derived(hint);
</script>

<Row {disabled} {isLast}>
    <div class="flex items-center">
        <div class="flex-1">
            {@render children?.()}
        </div>
        <div class="w-10">
            {#if checkbox}
                {@render checkbox?.()}
            {:else}
                <Switch {checked} {onchange} />
            {/if}
        </div>
    </div>
    {#snippet hint()}
    {@render hint_render?.()}
  {/snippet}
</Row>
