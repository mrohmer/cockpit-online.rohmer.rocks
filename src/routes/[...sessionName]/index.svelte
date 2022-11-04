<script lang="ts">
  import type {Race} from '$lib/models/race';
  import {onMount} from 'svelte';
  import {page} from '$app/stores';
  import Content from '$lib/components/Content.svelte';
  import Standings from "$lib/components/standings/Standings.svelte";
  import IoIosArrowBack from 'svelte-icons/io/IoIosArrowBack.svelte';
  import {Loader} from './_load';
  import Loading from "../../lib/components/Loading.svelte";
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
        <div class="mt-4 mb-10">
            <div class="flex items-center">
                <a href="/" class="w-10 h-6 px-2" on:click={handleBackLinkClick}>
                    <IoIosArrowBack/>
                </a>
                <div class="flex-1 min-w-0">
                    <h1 class="text-3xl text-center pr-10 overflow-hidden text-ellipsis whitespace-nowrap">
                        {data.name}
                    </h1>
                </div>
            </div>

            {#if data.mode}
                <div class="flex justify-center items-center gap-x-2" transition:slide|local>
                    <div class="flex h-2 w-2">
                        <div class="animate-ping absolute h-full w-full rounded-full opacity-75"
                             class:bg-green-400={data.status === 'running'}
                             class:bg-red-500={data.status === 'stopped'}
                             class:bg-yellow-200={data.status === 'starting'}
                             class:animate-ping={data.status === 'starting'}
                        ></div>
                        <div class="rounded-full h-full w-full"
                             class:bg-green-400={data.status === 'running'}
                             class:bg-red-500={data.status === 'stopped'}
                             class:bg-yellow-200={data.status === 'starting'}></div>
                    </div>
                    <div class="pr-2">{data.mode}</div>
                </div>
            {/if}

            {#if data.time || data.lapsToGo}
                <div class="flex justify-center items-center gap-x-3 mt-6 max-w-[200px] mx-auto" transition:slide|local>
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
        </div>

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
