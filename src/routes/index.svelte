<script lang="ts">
  import {onMount} from 'svelte';
  import type {Session} from '$lib/models/session';
  import type {Observable} from 'dexie';
  import {liveQuery} from 'dexie';
  import {db} from '$lib/db';
  import Content from "$lib/components/Content.svelte";
  import Input from "../lib/components/Input.svelte";
  import { goto } from '$app/navigation';


  let mounted = false;
  let sessions: Observable<Session[]>;

  let sessionName: string;

  const handleSubmit = () => {
    if ((sessionName?.trim().length ?? 0) < 3) {
      return;
    }

    return goto(`/${sessionName.trim().replace(/^\/*/, '')}`);
  }

  onMount(() => mounted = true);

  $: {
    if (mounted) {
      sessions = liveQuery(
        () => db.sessions.toArray()
      )
    }
  }
</script>

<style lang="postcss">
    .content {
        @apply flex flex-col text-center justify-center max-w-sm mx-auto -mb-12;

        min-height: calc(100vh - 4.5rem);
    }
</style>

<Content>
    <div class="content">
        <form on:submit|preventDefault={handleSubmit}>
            <Input bind:value={sessionName} autofocus>
                Session Name
                <button type="submit" slot="icon" class:opacity-20={(sessionName?.trim().length ?? 0) < 3}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34" class="-rotate-90">
                        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" class="fill-primary"/>
                    </svg>
                </button>
            </Input>
        </form>
        {#if $sessions?.length}
            {#each $sessions as session}
                <a href="/{session.name}" class="block border-t border-gray-400 py-2">
                    {session.name}
                </a>
            {/each}
        {/if}
    </div>
</Content>
