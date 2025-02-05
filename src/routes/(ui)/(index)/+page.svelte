<script lang="ts">
  import type {Session} from '$lib/models/session';
  import type {Observable} from 'dexie';
  import {liveQuery} from 'dexie';
  import {db} from '$lib/db';
  import Content from "$lib/components/Content.svelte";
  import Input from "$lib/components/Input.svelte";
  import {goto} from '$app/navigation';
  import Navbar from '$lib/components/Navbar.svelte';
  import {browser} from '$app/environment';

  let sessions: Observable<Session[]> | undefined = browser ? liveQuery(() => db.sessions.toArray()) : undefined;

  let sessionName: string | undefined = $state();

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    if ((sessionName?.trim().length ?? 0) < 3) {
      return;
    }

    return goto(`/s/${sessionName.trim().replace(/^\/*/, '')}`);
  }
</script>

<svelte:head>
    <title>Cockpit Online by MRohmer</title>
</svelte:head>

<style lang="postcss">
    .content {
        @apply flex flex-col text-center justify-center max-w-sm mx-auto -mb-12 pt-10;

        min-height: calc(100vh - 6.5rem);
    }
</style>

<Content>
    <Navbar>
        <div class="flex items-center justify-center gap-x-4">
            <div class="w-10 h-10">
                <img src="/favicon.png" class="max-w-full max-h-full" alt="Logo">
            </div>
            <div class="text-3xl font-bolder text-primary">
                Cockpit Online
            </div>
        </div>
        <div class="text-xs text-lighter text-center opacity-75">
            Alternatives UI by MRohmer
        </div>
    </Navbar>
    <div class="content">
        <form onsubmit={handleSubmit}>
            <Input bind:value={sessionName} autofocus>
                Session Name
                {#snippet icon()}
                    <button type="submit" class:opacity-20={(sessionName?.trim().length ?? 0) < 3}
                            aria-label="Abschicken">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34"
                             class="-rotate-90">
                            <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" class="fill-primary"/>
                        </svg>
                    </button>
                {/snippet}
            </Input>
            <div class="text-xs opacity-50 -mt-2">
                Zu finden in der URL von Cokpit XP.<br> Der gesmmte Pfad nach der Domain online.cockpit-xp.de.
            </div>
        </form>
        {#if $sessions?.length}
            <div class="mt-5">
                <div class="text-xs pt-1 opacity-70">Letzte Sessions</div>
                {#each $sessions as session, i}
                    <a href="/s/{session.name}" class="block border-gray-400 py-2"
                       class:border-t={i > 0}>
                        {session.name}
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</Content>
