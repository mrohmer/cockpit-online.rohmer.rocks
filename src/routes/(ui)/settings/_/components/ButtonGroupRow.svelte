<script lang="ts">
  import Row from "./Row.svelte";
  import ButtonGroup from "$lib/components/ButtonGroup.svelte";

  interface Props {
    value: string | number;
    options?: [string|number, string][];
    disabled?: boolean;
    isLast?: boolean;
    children?: import('svelte').Snippet;
    hint?: import('svelte').Snippet;
  }

  let {
    value,
    options = [],
    disabled = false,
    isLast = false,
    children,
    hint
  }: Props = $props();

  const hint_render = $derived(hint);
</script>

<Row {disabled} {isLast}>
    <div class="flex flex-col gap-y-4">
        <div>
            {@render children?.()}
        </div>
        <div class="flex justify-end">
            <ButtonGroup {value} {options} on:change />
        </div>
    </div>
    {#snippet hint()}
    {@render hint_render?.()}
  {/snippet}
</Row>
