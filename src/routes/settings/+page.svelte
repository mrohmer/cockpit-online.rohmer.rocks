<script lang="ts">
  import IoIosArrowBack from 'svelte-icons/io/IoIosArrowBack.svelte';
  import CheckboxRow from "./components/CheckboxRow.svelte";
  import Content from "$lib/components/Content.svelte";
  import {isWakeLockSupported} from "$lib/utils/wake-lock.js";
  import ThemeSwitch from "$lib/components/ThemeSwitch.svelte";
  import {browser} from '$app/environment';
  import {liveQuery} from 'dexie';
  import {db} from '$lib/db';
  import { afterNavigate } from '$app/navigation';

  let previousPage: string;

  afterNavigate(({from}) => {
    previousPage = from?.url.pathname || previousPage
  })

  const settings = browser ? liveQuery(() => db.getSettingsObj()) : undefined;

  const handleWakeLockChange = (value: boolean) => db.settings.put({key: 'wakeLock', value });
</script>
<Content>
    <div class="mt-4 mb-10">
        <div class="flex items-center">
            <a href={previousPage ?? '/'} class="w-10 h-6 px-2">
                <IoIosArrowBack/>
            </a>
            <div class="flex-1 min-w-0">
                <h1 class="text-3xl text-center overflow-hidden text-ellipsis whitespace-nowrap pr-10">
                    Settings
                </h1>
            </div>
        </div>
    </div>

    <div>
        <CheckboxRow disabled={!isWakeLockSupported()} checked={settings && $settings?.wakeLock} on:change={({detail}) => handleWakeLockChange(detail)}>
            Display nicht deaktivieren
            <div slot="hint">
                {#if !isWakeLockSupported()}
                    Von deinem Gerät nicht unterstützt.
                {/if}
            </div>
        </CheckboxRow>
        <CheckboxRow isLast={true}>
            Dark Mode
            <div slot="checkbox">
                <ThemeSwitch />
            </div>
        </CheckboxRow>
    </div>
</Content>
