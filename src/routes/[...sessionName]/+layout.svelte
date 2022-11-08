<script lang="ts">
  import Content from "$lib/components/Content.svelte";
  import SessionHeader from "$lib/components/SessionHeader.svelte";
  import {handleBackLinkClick} from "$lib/utils/handle-back-link-click.js";
  import type {Race} from '$lib/models/race';
  import { page } from '$app/stores';
  import {cleanSessionName} from "$lib/utils/clean-session-name.js";
  import {addSession, removeSession} from '$lib/utils/sessions';
  import {browser} from '$app/environment';

  export let data: Race;

  $: browser && data && $page.params.sessionName && (data?.slots?.length ? addSession($page.params.sessionName) : removeSession($page.params.sessionName));
</script>
<Content>
    <SessionHeader {...data} backLink={$page.route.id === "/[...sessionName]/slot/[slotId]" ? `/${cleanSessionName($page.params.sessionName)}` : '/'} on:clickBackLink={handleBackLinkClick} />
</Content>

<slot />
