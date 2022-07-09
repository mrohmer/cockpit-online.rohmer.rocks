<script lang="ts">
  import type {Slot} from '../../../models/slot';
  import {cleanSessionName} from "../../../utils/clean-session-name.js";
  import StandingsRow from "./StandingsRow.svelte";

  export let slots: Slot[] = [];
  export let sessionName: string;

  $: hasImageCol = slots?.some(slot => !!slot.image) ?? false;
</script>

{#each slots as slot}
    <a href="/{cleanSessionName(sessionName)}/slot/{slot.id}" class="block">
        <StandingsRow {slot} {hasImageCol} />
    </a>
{/each}
