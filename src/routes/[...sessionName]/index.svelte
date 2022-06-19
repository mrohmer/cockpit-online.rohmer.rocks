<script lang="ts">
  import type {Race} from '$lib/models/race';
  import {onMount} from 'svelte';
  import {page} from '$app/stores';
  import type {AxiosError} from 'axios';
  import axios from 'axios';
  import {db} from '$lib/db';
  import Content from '$lib/components/Content.svelte';
  import Standings from "$lib/components/standings/Standings.svelte";

  let timeout: number;
  let data: Race;
  let mounted = false;

  let notFound = false;
  let unknownError = false;

  onMount(() => {
    mounted = true;
    return () => (mounted = false)
  });


  const addSession = (name: string) => db.transaction('rw', db.sessions, async () => {
    const sessions = await db.sessions.where({name}).toArray();
    if (sessions.length) {
      return;
    }

    await db.sessions.add({name});
  })
  const removeSession = async (name: string) => db.transaction('rw', db.sessions, async () => {
    const sessions = await db.sessions.where({name}).toArray();
    if (!sessions.length) {
      return;
    }

    await Promise.all(sessions.map(session => db.sessions.delete(session.id)));
  })
  const cancelLoad = () => timeout && clearTimeout(timeout);
  const scheduleLoad = (name: string, delay = 1000) => {
    if (mounted) {
      console.log(delay)
      timeout = setTimeout(() => load(name), delay) as number;
    }
  }
  const load = async (name: string) => {
    try {
      const response = await axios.get<Race>(`/api/${$page.params.sessionName}`);
      notFound = false;
      unknownError = false;

      data = response.data as Race;
      await addSession(name);

      scheduleLoad(name, !data.running ? 5000 : undefined);
    } catch (e) {
      console.log(e);
      data = undefined;
      notFound = e?.request?.status === 404;
      unknownError = e?.request?.status !== 404;
      await removeSession(name);

      scheduleLoad(name, 5000);
    }
  }

  $: {
    if (mounted && $page?.params?.sessionName?.trim()) {
      cancelLoad();
      load($page.params.sessionName);
    }
  }
</script>

<svelte:head>
    {#if data}
        <title>{data.name} | Carrera-Live</title>
    {/if}
</svelte:head>
{#if data}
    <div class="bg-gray-200 dark:bg-black py-2">
        <Content class="flex items-center">
            <a href="/" class="block p-2 -ml-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34" class="rotate-90">
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" class="dark:fill-white"/>
                </svg>
            </a>
            <div class="flex-1 text-3xl truncate">{data.name}</div>
            <div class="flex flex-col text-sm items-end">
                <div class="flex-1">{data.mode}</div>
                <div class="flex">
                    {#if data.time}
                        <div class="flex items-baseline">
                            <div class="text-xs mr-0.5">Zeit</div>
                            <div>{data.time}</div>
                        </div>
                    {/if}
                    {#if data.lapsToGo}
                        <div class="flex ml-1 items-baseline">
                            <div class="text-xs mr-0.5 h-5">Runden</div>
                            <div>{data.lapsToGo}</div>
                        </div>
                    {/if}
                </div>
            </div>
        </Content>
    </div>
    <Content class="py-2 pr-0">
        <Standings slots={data.slots} />
    </Content>
{:else if notFound }
    <div class="text-center p-5">
        <div class="mb-1">
            Session nicht gefunden 🤷
        </div>
        <a href="/" class="text-primary">
            zurück
        </a>
    </div>
{:else if unknownError }
    <div class="text-center p-5">
        <div class="mb-1">
            Irgendetwas lief schief 🙈
        </div>
        <a href="/" class="text-primary">
            zurück
        </a>
    </div>
{:else }
    lädt...
{/if}
