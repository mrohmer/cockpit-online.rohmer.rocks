<script lang="ts">
  import type {Race} from '$lib/models/race';
  import {onMount} from 'svelte';
  import {page} from '$app/stores';
  import Content from '$lib/components/Content.svelte';
  import SessionHeader from "$lib/components/SessionHeader.svelte";
  import {Loader} from '../_load';
  import {cleanSessionName} from "$lib/utils/clean-session-name";
  import Loading from "../../../lib/components/Loading.svelte";
  import RemainingGas from "../../../lib/components/standings/common/RemainingGas.svelte";
  import {liveQuery} from 'dexie';
  import type {Observable} from 'dexie';
  import {db} from '../../../lib/db';
  import type {RemainingGasSubscription} from '../../../lib/models/remaining-gas-subscription';

  let remainingGasSubscription: Observable<RemainingGasSubscription>
  let timeout: number;
  let data: Race;
  let mounted = false;

  let notFound = false;
  let unknownError = false;

  const loader = new Loader(
    d => data = d,
    status => {
      if (!status) {
        notFound = undefined;
        unknownError = undefined;
      } else {
        notFound = status === 404;
        unknownError = status !== 404;
      }
    },
    () => mounted,
  );

  onMount(() => {
    mounted = true;
    return () => (mounted = false)
  });

  const handleBackLinkClick = ({detail: event}) => {
    if (document.referrer?.includes('rohmer.rocks') && new URL(document.referrer).host !== window.location.host) {
      event.preventDefault();

      history.back();

      return false;
    }
  }
  const handleSubscribe = () =>
    db.utils.remainingGasSubscription.subscribe({sessionName, slotId: slot.id, driverName: slot.name});
  const handleUnsubscribe = () =>
    db.utils.remainingGasSubscription.unsubscribe({sessionName, slotId: slot.id});

  $: {
    if (mounted && $page?.params?.sessionName?.trim()) {
      loader.cancelLoad();
      loader.load($page.params.sessionName);
    }
  }
  $: {
    if (mounted && $page?.params?.sessionName?.trim() && $page?.params?.slotId?.trim()) {
      remainingGasSubscription = liveQuery(
        () => db.remainingGasSubscriptions
          .where({sessionName: $page.params.sessionName.trim(), slotId: $page.params.slotId.trim()})
          .first()
      )
    }
  }

  $: slot = data?.slots.find(slot => slot.id === $page?.params?.slotId);
  $: position = (data?.slots.findIndex(slot => slot.id === $page?.params?.slotId) ?? -1) + 1;
  $: sessionName = $page.params?.sessionName ?? '';
</script>

<svelte:head>
    {#if data && slot?.name}
        <title>{slot?.name} in {data.name} | Carrera-Live</title>
    {/if}
</svelte:head>
{#if data && slot}
    <SessionHeader {...data} backLink="/{cleanSessionName(sessionName)}" on:clickBackLink={handleBackLinkClick}/>
    <Content class="py-4">
        <div class="flex mb-4 items-center">
            {#if slot.image}
                <div class="h-14 w-14 mr-2 bg-center bg-no-repeat bg-contain"
                     style="background-image: url('{slot.image}')">
                </div>
            {/if}
            <div class="flex-1">
                <div class="text-3xl font-normal truncate">{slot.name}</div>
                <div class="truncate">{slot.car?.name}</div>
            </div>
            {#if slot.penalty}
                <div class="text-5xl font-bold text-red-700 dark:text-red-500">
                    !
                </div>
            {/if}
        </div>

        <div class="flex h-12">
            <div class="border-r border-gray-400 w-28 pr-2 mr-2 py-1 leading-10 text-right">
                Position
            </div>
            <div class="flex-1 h-full font-normal leading-10 py-1 text-xl">
                {#if position}
                    {position}
                {:else}
                    🤷
                {/if}
            </div>
        </div>
        <div class="flex h-12">
            <div class="border-r border-gray-400 w-28 pr-2 mr-2 py-1 leading-10 text-right">
                Runde
            </div>
            <div class="flex-1 h-full font-normal leading-10 py-1 text-xl">
                {slot.lap ?? '---'}
            </div>
        </div>
        <div class="flex h-12">
            <div class="border-r border-gray-400 w-28 pr-2 mr-2 py-1 leading-10 text-right">
                Strafe
            </div>
            <div class="flex-1 h-full font-normal leading-10 py-1 text-xl"
                 class:text-red-700={slot.penalty}
                 class:dark:text-red-500={slot.penalty}>
                {#if slot.penalty === 'pit'}
                    Boxenstrafe aktiv
                {:else if slot.penalty === 'unknown'}
                    Strafe aktiv
                {:else}
                    Keine
                {/if}
            </div>
        </div>
        <div class="flex h-12">
            <div class="border-r border-gray-400 w-28 pr-2 mr-2 py-1 leading-10 text-right">
                letzte Runde
            </div>
            <div class="flex-1 h-full font-normal leading-10 py-1 text-xl">
                {#if slot.lastLap?.time}
                    {slot.lastLap?.time}s
                {:else }
                    ---
                {/if}
            </div>
        </div>
        <div class="flex h-12">
            <div class="border-r border-gray-400 w-28 pr-2 mr-2 py-1 leading-5 text-right">
                schnellste<br/>Runde
            </div>
            <div class="flex-1 h-full font-normal leading-10 py-1 text-xl">
                {#if slot.fastestLap?.time}
                    {slot.fastestLap?.time}s
                    {#if slot.fastestLap.lap}
                        <span class="font-thin">in Runde {slot.fastestLap.lap}</span>
                    {/if}
                {:else }
                    ---
                {/if}
            </div>
        </div>
        <div class="flex h-12">
            <div class="border-r border-gray-400 w-28 pr-2 mr-2 py-1 leading-10 text-right">
                Tankstand
            </div>
            <div class="flex-1 h-full font-normal text-xl">
                <RemainingGas {...slot}
                              subscribed={!!$remainingGasSubscription}
                              on:subscribe={handleSubscribe}
                              on:unsubscribe={handleUnsubscribe} />
            </div>
        </div>
    </Content>
{:else if data && !slot}
    <div class="text-center p-5">
        <div class="mb-1">
            SlotID nicht gefunden 🤷
        </div>
        <a href="/${$page.params.sessionName ?? ''}" on:click={handleBackLinkClick} class="text-primary">
            zurück
        </a>
    </div>
{:else if notFound }
    <div class="text-center p-5">
        <div class="mb-1">
            Session nicht gefunden 🤷
        </div>
        <a href="/" on:click={handleBackLinkClick} class="text-primary">
            zurück
        </a>
    </div>
{:else if unknownError }
    <div class="text-center p-5">
        <div class="mb-1">
            Irgendetwas lief schief 🙈
        </div>
        <a href="/" on:click={handleBackLinkClick} class="text-primary">
            zurück
        </a>
    </div>
{:else }
    <Loading />
{/if}
