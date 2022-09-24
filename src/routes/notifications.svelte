<script lang="ts">
  import {onMount} from 'svelte';
  import type {Observable} from 'dexie';
  import {liveQuery} from 'dexie';
  import {db} from '$lib/db';
  import type {RemainingGasSubscription} from '../lib/models/remaining-gas-subscription';
  import RemainingGasNotification from "../lib/components/standings/common/RemainingGasNotification.svelte";
  import Loading from "../lib/components/Loading.svelte";
  import Content from "../lib/components/Content.svelte";

  let mounted = false;
  let subscriptions: Observable<{ sessionName: string; subs: RemainingGasSubscription[] }[]>;

  onMount(() => mounted = true);

  const handleUnsubscribe = (id: number) => db.remainingGasSubscriptions.delete(id);

  $: {
    if (mounted) {
      subscriptions = liveQuery(
        async () => {
          const subscriptions = await db.remainingGasSubscriptions.toArray();

          const grouped = subscriptions
            .reduce(
              (prev, curr) => ({
                ...prev,
                [curr.sessionName]: [
                  ...(prev[curr.sessionName] ?? []),
                  curr,
                ],
              }),
              {},
            );

          console.log(grouped)

          return Object.entries(grouped)
            .filter(([, subs]) => !!subs?.length)
            .map(([sessionName, subs]) => ({sessionName, subs}))
        }
      )
    }
  }
</script>

{#if $subscriptions}
    <div class="bg-gray-200 dark:bg-black py-2">
        <Content class="flex items-center">
            <a href='/' class="block p-2 -ml-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34" class="rotate-90">
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" class="dark:fill-white"/>
                </svg>
            </a>
            <div class="text-2xl">
                Benachrichtigungen
            </div>
        </Content>
    </div>
    <Content>
        {#each $subscriptions as {sessionName, subs}}
            <div class="mt-2 mb-5">
                <div class="mb-3">
                    <h3 class="text-2xl">{sessionName}</h3>
                    <hr/>
                </div>
                <div>
                    {#each subs as {id, driverName, slotId}}
                        <div class="flex">
                            <div class="flex-1 text-xl">{driverName ?? slotId}</div>
                            <RemainingGasNotification state={true} on:unsubscribe={() => handleUnsubscribe(id)} />
                        </div>
                    {/each}
                </div>
            </div>
        {:else}
            <div class="text-xs pt-1 opacity-70 text-center">Du hast keine Beanchrichtigungen aboniert</div>
        {/each}
    </Content>
{:else }
    <Loading/>
{/if}
