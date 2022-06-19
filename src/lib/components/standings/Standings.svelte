<script lang="ts">
  import type {Slot} from '../../models/slot';
  import StandingsRow from "./StandingsRow.svelte";

  export let slots: Slot[] = [];

  $: hasImageCol = slots?.some(slot => !!slot.image) ?? false;
</script>

<div class="overflow-x-auto">
    <div class="min-w-[500px]">
        <StandingsRow type="header" {hasImageCol}/>
        {#each slots as slot}
            <StandingsRow {slot} {hasImageCol}/>
        {/each}
    </div>
</div>
