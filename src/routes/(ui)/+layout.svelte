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
  import {onNavigate} from '$app/navigation';

  interface Props {
    children?: import('svelte').Snippet;
  }

  const sourceCodeUrl = 'https://github.com/mrohmer/cockpit-online.rohmer.rocks'
  let {children}: Props = $props();

  onNavigate((navigation) => {
    if (
      !document.startViewTransition ||
      navigation.from?.url.href === navigation.to?.url.href
    ) {
      return;
    }

    return new Promise((resolve) => {
      document.startViewTransition(() => {
        resolve();
        return navigation.complete;
      });
    });
  });

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
    <footer class="footer">
        {#if page?.route?.id !== '/settings'}
            <a href="/settings" class="flex justify-center items-center mt-32 px-4">
                <div class="w-10 h-6 px-2">
                    <IoIosSettings/>
                </div>
                <div class="pr-10">
                    Einstellungen
                </div>
            </a>
        {/if}

        <Content class="mt-10">
            <div class="text-center text-xs opacity-70 space-y-4 max-w-md mx-auto">
                <div>
                    Dies ist ein alternatives UI mit Performance- & Usability-Optimierungen.
                </div>
                <div>
                    Die gezeigten Daten werden bereitgestellt über <a href="https://online.cockpit-xp.de" target="_blank"
                                                 rel="noreferrer noopener"
                                                 class="text-primary">online.cockpit-xp.de</a>.<br>
                    Darüber hinaus besteht keine Verbindung zu Cockpit XP & Cockpit XP Online.
                </div>
                <div>
                    Die Verwendung ist kostenlos und ohne Registrierung möglich, jedoch auf eigene Gefahr und ohne jegliche Gewähr auf Richtigkeit der gezeigten Daten und Stabilität.<br/>
                </div>
                <div>
                    Verbesserungsvorschläge, Feature-Requests & Bug-Reports können gerne via
                    <a href="{sourceCodeUrl}/issues" target="_blank" rel="noreferrer noopener" class="text-primary">GitHub</a>
                    eingereicht werden. Gerne auch direkt als Pull-Request 😉
                </div>
            </div>
            <div class="-mt-4">
                <PoweredBy name="Matthias Rohmer"
                           url="https://matthias.rohmer.rocks"
                           technologies={['Cockpit-XP Online', 'svelte', 'netlify']}
                           {sourceCodeUrl} />
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
    </footer>
{/if}

<style>
    .footer {
        view-transition-name: footer;
    }
</style>
