<script lang="ts">
  import Row from "./Row.svelte";
  import Switch from "$lib/components/Switch.svelte";

  export let checked = false;
  export let disabled = false;
  export let isLast = false;
</script>

<Row {disabled} {isLast}>
    <div class="flex items-center">
        <div class="flex-1">
            <slot />
        </div>
        <div class="w-10">
            {#if $$slots.checkbox}
                <slot name="checkbox" />
            {:else}
                <Switch {checked} on:change />
            {/if}
        </div>
    </div>
    <slot slot="hint" name="hint" />
</Row>
