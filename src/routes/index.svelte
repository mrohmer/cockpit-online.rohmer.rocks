<script lang="ts" context="module">
  export const prerender = true;
</script>
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
  let hasNotifications: Observable<boolean>;

  let sessionName: string;

  const handleSubmit = () => {
    if ((sessionName?.trim().length ?? 0) < 3) {
      return;
    }

    return goto(`/${sessionName.trim().replace(/^\/*/, '')}`);
  }

  onMount(() => {
    mounted = true;

  });

  $: {
    if (mounted) {
      sessions = liveQuery(
        () => db.sessions.toArray()
      )
      hasNotifications = liveQuery(
        async () => {
          const count = await db.remainingGasSubscriptions.count();
          return count > 0;
        }
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
            <div class="text-[10px] opacity-50 -mt-2">
                Zu finden in der URL von Cokpit XP. Alles nach der Domain online.cockpit-xp.de.
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
        {#if $hasNotifications}
            <a class="mt-5" href="/notifications">
                <div class="text-xs pt-1 opacity-70">Manage deine Benachrichtigungen</div>
            </a>
        {/if}
    </div>
</Content>
