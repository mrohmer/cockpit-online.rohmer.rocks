<script lang="ts">
  import type {Race} from '$lib/models/race';
  import {onMount} from 'svelte';
  import {page} from '$app/stores';
  import Content from '$lib/components/Content.svelte';
  import Standings from "$lib/components/standings/Standings.svelte";
  import SessionHeader from "$lib/components/SessionHeader.svelte";
  import {Loader} from './_load';

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

  $: {
    if (mounted && $page?.params?.sessionName?.trim()) {
      loader.cancelLoad();
      loader.load($page.params.sessionName);
    }
  }
</script>

<svelte:head>
    {#if data}
        <title>{data.name} | Carrera-Live</title>
    {/if}
</svelte:head>
{#if data}
    <SessionHeader {...data} on:clickBackLink={handleBackLinkClick} />
    <Content class="py-2 pr-0">
        <Standings sessionName={$page.params.sessionName} slots={data.slots} />
    </Content>
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
    lädt...
{/if}
