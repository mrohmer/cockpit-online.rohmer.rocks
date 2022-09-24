<script lang="ts">
  import StandingsRow from "./StandingsRow.svelte";
  import type {Slot} from '../../../models/slot';
  import {cleanSessionName} from "../../../utils/clean-session-name.js";
  import type {RemainingGasSubscription} from '../../../models/remaining-gas-subscription';
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

  export let slots: Slot[] = [];
  export let sessionName: string;
  export let remainingGasSubscriptions: RemainingGasSubscription[] = [];

  $: hasImageCol = slots?.some(slot => !!slot.image) ?? false;
</script>

<div class="px-3">
    <StandingsRow type="header" {hasImageCol}/>
    {#each slots as slot}
        <a href="/{cleanSessionName(sessionName)}/slot/{slot.id}" class="block">
            <StandingsRow {slot} {hasImageCol}
                          subscribedForRemainingGas={remainingGasSubscriptions?.some(({slotId}) => slot.id === slotId)}
                          on:subscribeRemainingGas={() => dispatch('subscribeRemainingGas', { slotId: slot.id, driverName: slot.name })}
                          on:unsubscribeRemainingGas={() => dispatch('unsubscribeRemainingGas', { slotId: slot.id })}  />
        </a>
    {/each}
</div>
