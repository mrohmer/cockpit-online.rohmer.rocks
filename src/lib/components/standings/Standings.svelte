<script lang="ts">
  import type {Slot} from '../../models/slot';
  import StandingsDesktop from "./desktop/Standings.svelte";
  import StandingsMobile from "./mobile/Standings.svelte";

  export let slots: Slot[] = [];
  export let sessionName: string;

  let width: number;

  $: isDesktop = !width || width >= 500
</script>

<div class="overflow-x-auto">
    <div bind:clientWidth={width}>
        {#if isDesktop}
            <StandingsDesktop {sessionName} {slots} />
        {:else}
            <StandingsMobile {sessionName} {slots} />
        {/if}
    </div>
</div>
