<script lang="ts">
  import { run, preventDefault } from 'svelte/legacy';

  import {onMount} from 'svelte';
  import type {Session} from '$lib/models/session';
  import type {Observable} from 'dexie';
  import {liveQuery} from 'dexie';
  import {db} from '$lib/db';
  import Content from "$lib/components/Content.svelte";
  import Input from "../lib/components/Input.svelte";
  import { goto } from '$app/navigation';

  let mounted = $state(false);
  let sessions: Observable<Session[]> = $state();

  let sessionName: string = $state();

  const handleSubmit = () => {
    if ((sessionName?.trim().length ?? 0) < 3) {
      return;
    }

    return goto(`/${sessionName.trim().replace(/^\/*/, '')}`);
  }

  onMount(() => mounted = true);

  run(() => {
    if (mounted) {
      sessions = liveQuery(
        () => db.sessions.toArray()
      )
    }
  });
</script>

<svelte:head>
    <title>Cockpit Online by MRohmer</title>
</svelte:head>

<style lang="postcss">
    .content {
        @apply flex flex-col text-center justify-center max-w-sm mx-auto -mb-12 pt-10;

        min-height: calc(100vh - 4.5rem);
    }
</style>

<Content>
    <div class="content">
        <form onsubmit={preventDefault(handleSubmit)}>
            <Input bind:value={sessionName} autofocus>
                Session Name
                {#snippet icon()}
                <button type="submit"  class:opacity-20={(sessionName?.trim().length ?? 0) < 3}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34" class="-rotate-90">
                          <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" class="fill-primary"/>
                      </svg>
                  </button>
              {/snippet}
            </Input>
            <div class="text-xs opacity-50 -mt-2">
                Zu finden in der URL von Cokpit XP.<br> Alles nach der Domain online.cockpit-xp.de.
            </div>
        </form>
        {#if $sessions?.length}
            <div class="mt-5">
                <div class="text-xs pt-1 opacity-70">Letzte Sessions</div>
                {#each $sessions as session, i}
                    <a href="/{session.name}" class="block border-gray-400 py-2"
                        class:border-t={i > 0}>
                        {session.name}
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</Content>
