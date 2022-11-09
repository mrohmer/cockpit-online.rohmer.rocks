<script lang="ts">
  import Content from "$lib/components/Content.svelte";
  import SessionHeader from "$lib/components/SessionHeader.svelte";
  import {handleBackLinkClick} from "$lib/utils/handle-back-link-click.js";
  import type {Race} from '$lib/models/race';
  import {page} from '$app/stores';
  import {cleanSessionName} from "$lib/utils/clean-session-name.js";
  import {addSession, removeSession} from '$lib/utils/sessions';
  import {browser} from '$app/environment';
  import type {ApiData} from '$lib/models/api-data';

  export let data: ApiData<Race>;

  const digits = (nbr: number, d = 2): string => nbr > 0 ? String(nbr.toFixed(0)).padStart(d, '0') : '00'

  $: race = data?.data;
  $: date = typeof data?.date === 'string' ? new Date(data.date) : data?.date;
  $: browser && race && $page.params.sessionName && (race?.slots?.length ? addSession($page.params.sessionName) : removeSession($page.params.sessionName));
</script>
<Content>
    <SessionHeader {...race ?? {}}
                   backLink={$page.route.id === "/[...sessionName]/slot/[slotId]" ? `/${cleanSessionName($page.params.sessionName)}` : '/'}
                   on:clickBackLink={handleBackLinkClick}/>
</Content>

<slot/>

{#if date}
    <Content class="mt-10">
        <div class="text-center text-sm font-normal">
            <div class="text-neutral-400">Stand</div>
            <div>
                <span>
                {digits(date.getDay())}.{digits(date.getMonth() + 1)}.{digits(date.getFullYear())}
                </span>
                <span>
                {digits(date.getHours())}:{digits(date.getMinutes())}:{digits(date.getSeconds())}
                </span>
            </div>
        </div>
    </Content>
{/if}
