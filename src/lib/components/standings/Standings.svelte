<script lang="ts">
  import type {Slot} from '../../models/slot';
  import StandingsRow from "./StandingsRow.svelte";

  export let slots: Slot[] = [];
</script>

<div class="overflow-x-auto">
    <div class="min-w-[500px]">
        <StandingsRow type="header"/>
        {#each slots as slot}
            <StandingsRow {slot}/>
        {/each}
    </div>
</div>
