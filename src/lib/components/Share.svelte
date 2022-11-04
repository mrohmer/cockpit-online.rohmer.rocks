<script lang="ts">
  import QRCode from 'qrcode';
  import {onMount} from 'svelte';
  import { page } from '$app/stores';

  let dataUrl: string;
  let canShare = false;

  const generateQrCode = () => QRCode.toDataURL(
    url,
    {
      color: {
        light: '#ffffff00'
      },
      margin: 2,
      width: 150,
    },
    (err, u) => dataUrl = err ? undefined : u,
  );

  const share = async () => {
    if (!canShare) {
      return;
    }

    await navigator.share({
      url,
      title: document.title,
    })
  }

  onMount(() => {
    canShare = 'share' in navigator;
  })

  $: url = $page.url.href;
  $: url && generateQrCode();
</script>

{#if url && dataUrl}
    <div class="flex flex-col items-center justify-center gap-y-0.5 px-2"
         class:cursor-pointer={canShare}
         on:click={() => share()}
    >
        <div class="text-xl">Teile diese Seite</div>
        <img class="block dark:invert max-w-full" src={dataUrl} alt="QR Code"/>
    </div>
{/if}
