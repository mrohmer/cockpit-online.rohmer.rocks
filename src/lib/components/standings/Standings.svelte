<script lang="ts">
  import type {Slot} from '../../models/slot';
  import StandingsDesktop from "./desktop/Standings.svelte";
  import StandingsMobile from "./mobile/Standings.svelte";
  import {onMount} from 'svelte';
  import type {Observable} from 'dexie';
  import type {RemainingGasSubscription} from '../../models/remaining-gas-subscription';
  import {db} from '../../db';
  import {liveQuery} from 'dexie';

  export let slots: Slot[] = [];
  export let sessionName: string;

  let remainingGasSubscriptions: Observable<RemainingGasSubscription[]>;

  let width: number;
  let mounted = false;

  onMount(() => {
    mounted = true;
    return () => (mounted = false);
  });

  const handleSubscribeToRemainingGas = ({detail: {slotId}}) => db.transaction('rw?', db.remainingGasSubscriptions, async () => {
    const subscription = await db.remainingGasSubscriptions.where({sessionName, slotId}).first();

    if (!subscription) {
      await db.remainingGasSubscriptions.add({sessionName, slotId});
    }
  });
  const handleUnsubscribeFromRemainingGas = ({detail: {slotId}}) => db.transaction('rw?', db.remainingGasSubscriptions, async () => {
    const subscription = await db.remainingGasSubscriptions.where({sessionName, slotId}).first();

    if (!!subscription) {
      await db.remainingGasSubscriptions.delete(subscription.id);
    }
  });

  $: isDesktop = !width || width >= 500

  $: {
    if (mounted && sessionName) {
      remainingGasSubscriptions = liveQuery(
        () => db.remainingGasSubscriptions.where({sessionName}).toArray()
      )
    }
  }
</script>

<div class="overflow-x-auto">
    <div bind:clientWidth={width}>
        {#if isDesktop}
            <StandingsDesktop {sessionName} {slots}
                              remainingGasSubscriptions={$remainingGasSubscriptions ?? []}
                              on:subscribeRemainingGas={handleSubscribeToRemainingGas}
                              on:unsubscribeRemainingGas={handleUnsubscribeFromRemainingGas}/>
        {:else}
            <StandingsMobile {sessionName} {slots}
                             remainingGasSubscriptions={$remainingGasSubscriptions ?? []}
                             on:subscribeRemainingGas={handleSubscribeToRemainingGas}
                             on:unsubscribeRemainingGas={handleUnsubscribeFromRemainingGas}/>
        {/if}
    </div>
</div>
