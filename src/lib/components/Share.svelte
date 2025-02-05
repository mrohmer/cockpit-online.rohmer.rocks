<script lang="ts">
  import QRCode from 'qrcode';
  import {onMount} from 'svelte';
  import {page} from '$app/state';

  let dataUrl: string|undefined = $state();
  let canShare = $state(false);

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

  let url = $derived(page.url.href);
  $effect(() => {
    url && generateQrCode();
  });
</script>

{#if url && dataUrl}
    <button type="button" class="flex flex-col items-center justify-center gap-y-0.5 px-2 mx-auto"
         class:cursor-pointer={canShare}
         onclick={() => share()}
    >
        <div class="text-xl">Teile diese Seite</div>
        <img class="block dark:invert max-w-full" src={dataUrl} alt="QR Code"/>
    </button>
{/if}
