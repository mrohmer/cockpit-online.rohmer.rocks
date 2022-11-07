<script lang="ts">
  import type {Race} from '$lib/models/race';
  import {onMount} from 'svelte';
  import {page} from '$app/stores';
  import Content from '$lib/components/Content.svelte';
  import Standings from "$lib/components/standings/Standings.svelte";
  import {Loader} from './load';
  import Loading from "../../lib/components/Loading.svelte";
  import SessionHeader from "../../lib/components/SessionHeader.svelte";
  import {slide} from 'svelte/transition';

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
        notFound = [502, 404].includes(status);
        unknownError = !notFound && status !== 200;
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
    <Content class="py-2 px-0">
        <SessionHeader {...data} on:clickBackLink={handleBackLinkClick} />

        {#if data.time || data.lapsToGo}
            <div class="flex justify-center items-center gap-x-3 mt-6 max-w-[200px] mx-auto mb-10 -mt-6" transition:slide|local>
                {#if data.time}
                    <div class="text-center flex-1">
                        <div class="text-xs">Zeit</div>
                        <div class="font-normal">{data.time || '00:00:00'}</div>
                    </div>
                {/if}
                {#if data.lapsToGo}
                    <div class="text-center flex-1">
                        <div class="text-xs">Runden</div>
                        <div class="font-normal">{data.lapsToGo || 225}</div>
                    </div>
                {/if}
            </div>
        {/if}

        <Standings sessionName={$page.params.sessionName} slots={data.slots}/>
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
    <Loading/>
{/if}
