<script lang="ts">
  import '../../app.css';
  import PoweredBy from '@rohmer/svelte-base/PoweredBy.svelte';
  import Content from "$lib/components/Content.svelte";
  import IoIosSettings from 'svelte-icons/io/IoIosSettings.svelte';
  import Share from "$lib/components/Share.svelte";
  import {page} from "$app/state";
  import {browser, dev} from '$app/environment';
  import {PUBLIC_CLOUDFLARE_TOKEN} from '$env/static/public';
  import {fullscreen} from '$lib/utils/fullscreen';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let {children}: Props = $props();
</script>

<svelte:head>
    <meta name="description" content="Alternative UI for Live Data by Cockpit XP Online">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
    <meta name="theme-color" content="#ff9a5a"/>
    <link rel="manifest" href="/manifest.json"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-title" content="Cockpit Online by MRohmer"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>

    {#if !dev && PUBLIC_CLOUDFLARE_TOKEN}
        <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
                data-cf-beacon={JSON.stringify({"token": PUBLIC_CLOUDFLARE_TOKEN})}></script>
    {/if}
</svelte:head>

{@render children?.()}

{#if !browser || !$fullscreen}
    {#if page?.route?.id !== '/settings'}
        <a href="/settings" class="flex justify-center items-center mt-32 px-4">
            <div class="w-10 h-6 px-2">
                <IoIosSettings/>
            </div>
            <div class="pr-10">
                Settings
            </div>
        </a>
    {/if}

    <Content class="mt-10">
        <div class="text-center text-xs opacity-70">
            Daten bereitgestellt von <a href="https://online.cockpit-xp.de" target="_blank" rel="noreferrer noopener"
                                        class="text-primary">online.cockpit-xp.de</a>.<br>
            Dies ist eine Überarbeitung des UIs für private Zwecke.
        </div>
        <div class="-mt-12">
            <PoweredBy name="Matthias Rohmer"
                       url="https://matthias.rohmer.rocks"
                       technologies={['Cockpit-XP Online', 'svelte', 'netlify']}
                       sourceCodeUrl="https://github.com/mrohmer/cockpit-online.rohmer.rocks"/>
        </div>
    </Content>

    <div class="my-10">
        <Share/>
    </div>

    <div class="my-10">
        <div class="flex justify-center items-center py-5 text-sm text-gray-400">
            <a class="block px-2 py-1 hover:text-white transition-colors" href="https://rohmer.rocks/impressum"
               target="_blank">impressum</a>
            <div class="px-1">|</div>
            <a class="block px-2 py-1 hover:text-white transition-colors" href="https://rohmer.rocks/datenschutz"
               target="_blank">datenschutz</a
            >
        </div>
    </div>
{/if}
