<script lang="ts">
  import IoIosArrowBack from 'svelte-icons/io/IoIosArrowBack.svelte';
  import CheckboxRow from "./components/CheckboxRow.svelte";
  import Content from "$lib/components/Content.svelte";
  import {isWakeLockSupported} from "$lib/utils/wake-lock.js";
  import ThemeSwitch from "$lib/components/ThemeSwitch.svelte";
  import {browser} from '$app/environment';
  import {liveQuery} from 'dexie';
  import {db} from '$lib/db';
  import {afterNavigate} from '$app/navigation';
  import Section from "./components/Section.svelte";
  import type {Settings} from '$lib/models/settings';
  import Loading from "$lib/components/Loading.svelte";
  import ButtonGroupRow from "./components/ButtonGroupRow.svelte";
  import {isVibrationSupported} from "$lib/utils/vibration.js";

  let previousPage: string;

  afterNavigate(({from}) => {
    previousPage = from?.url.pathname || previousPage
  })

  const settings = browser ? liveQuery(() => db.getSettingsObj()) : undefined;

  const handleChange = (key: Settings['key'], value: Settings['value']) => db.settings.put({key, value} as Settings);
</script>

{#if $settings}
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
            <Section>
                {#if isWakeLockSupported()}
                    <CheckboxRow checked={$settings?.wakeLock}
                                 on:change={({detail}) => handleChange('wakeLock', detail)}>
                        Display nicht deaktivieren
                    </CheckboxRow>
                {/if}
                <CheckboxRow isLast={true}>
                    Dark Mode
                    <div slot="checkbox">
                        <ThemeSwitch/>
                    </div>
                </CheckboxRow>
            </Section>

            {#if isVibrationSupported()}
                <Section>
                    <div slot="header">
                        Slot Detail Seite
                    </div>
                    <CheckboxRow checked={$settings?.slotDetailVibrationEmpty}
                                 on:change={({detail}) => handleChange('slotDetailVibrationEmpty', detail)}>
                        Vibrieren bei leerem Tank
                    </CheckboxRow>
                    <ButtonGroupRow value={$settings?.slotDetailVibrationEmptyThreshold ?? 0.2}
                                    options={[[0, '0%'], [0.05, '5%'], [0.1, '10%'], [0.15, '15%'], [0.2, '20%']]}
                                    disabled={!$settings?.slotDetailVibrationEmpty}
                                    on:change={({detail}) => handleChange('slotDetailVibrationEmptyThreshold', +detail)}>
                        Schwellwert für Vibration bei leerem Tank
                    </ButtonGroupRow>
                    <CheckboxRow checked={$settings?.slotDetailVibrationFull}
                                 on:change={({detail}) => handleChange('slotDetailVibrationFull', detail)}>
                        Vibrieren bei vollem Tank
                    </CheckboxRow>
                    <ButtonGroupRow value={$settings?.slotDetailVibrationFullThreshold ?? 0.9}
                                    options={[[0.8, '80%'], [0.85, '85%'], [0.9, '90%'], [0.95, '95%'], [1, '100%']]}
                                    disabled={!$settings?.slotDetailVibrationFull}
                                    on:change={({detail}) => handleChange('slotDetailVibrationFullThreshold', +detail)}
                                    isLast={true}>
                        Schwellwert für Vibration bei vollem Tank
                    </ButtonGroupRow>
                </Section>
            {/if}
        </div>
    </Content>
{:else}
    <Loading/>
{/if}
