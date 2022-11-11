<script lang="ts">
  import Row from "./Row.svelte";
  import Switch from "$lib/components/Switch.svelte";
  import ButtonGroup from "$lib/components/ButtonGroup.svelte";

  export let value: string | number;
  export let options: Record<string | number, string> = {};
  export let disabled = false;
  export let isLast = false;
</script>

<Row {disabled} {isLast}>
    <div class="flex flex-col gap-y-4">
        <div>
            <slot />
        </div>
        <div class="flex justify-end">
            <ButtonGroup {value} {options} on:change />
        </div>
    </div>
    <slot slot="hint" name="hint" />
</Row>
