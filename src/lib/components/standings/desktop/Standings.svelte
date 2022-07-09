<script lang="ts">
  import StandingsRow from "./StandingsRow.svelte";
  import type {Slot} from '../../../models/slot';
  import {cleanSessionName} from "../../../utils/clean-session-name.js";

  export let slots: Slot[] = [];
  export let sessionName: string;

  $: hasImageCol = slots?.some(slot => !!slot.image) ?? false;
</script>

<div class="px-3">
    <StandingsRow type="header" {hasImageCol}/>
    {#each slots as slot}
        <a href="/{cleanSessionName(sessionName)}/slot/{slot.id}" class="block">
            <StandingsRow {slot} {hasImageCol}/>
        </a>
    {/each}
</div>
