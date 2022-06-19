<script lang="ts">
  import type {Slot} from '../../models/slot';
  import StandingsRow from "./StandingsRow.svelte";
  import {cleanSessionName} from "../../utils/clean-session-name.js";

  export let slots: Slot[] = [];
  export let sessionName: string;

  $: hasImageCol = slots?.some(slot => !!slot.image) ?? false;
</script>

<div class="overflow-x-auto">
    <div class="min-w-[500px]">
        <StandingsRow type="header" {hasImageCol}/>
        {#each slots as slot}
            <a href="/{cleanSessionName(sessionName)}/slot/{slot.id}" class="block">
                <StandingsRow {slot} {hasImageCol}/>
            </a>
        {/each}
    </div>
</div>
