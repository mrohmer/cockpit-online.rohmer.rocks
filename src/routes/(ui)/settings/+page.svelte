<script lang="ts">
  import IoIosArrowBack from 'svelte-icons/io/IoIosArrowBack.svelte';
  import CheckboxRow from "./_/components/CheckboxRow.svelte";
  import Content from "$lib/components/Content.svelte";
  import {isWakeLockSupported} from "$lib/utils/wake-lock.js";
  import ThemeSwitch from "$lib/components/ThemeSwitch.svelte";
  import {browser} from '$app/environment';
  import {liveQuery} from 'dexie';
  import {db} from '$lib/db';
  import {afterNavigate} from '$app/navigation';
  import Section from "./_/components/Section.svelte";
  import type {Settings} from '$lib/models/settings';
  import Loading from "$lib/components/Loading.svelte";
  import ButtonGroupRow from "./_/components/ButtonGroupRow.svelte";
  import {isVibrationSupported} from "$lib/utils/vibration.js";
  import Navbar from '$lib/components/Navbar.svelte';

  let previousPage: string = $state();

  afterNavigate(({from}) => {
    previousPage = from?.url.pathname || previousPage
  })

  const settings = browser ? liveQuery(() => db.getSettingsObj()) : undefined;

  const handleChange = (key: Settings['key'], value: Settings['value']) => db.settings.put({key, value} as Settings);
</script>

{#if $settings}
    <Content>
        <Navbar backLink={previousPage ?? '/'}>
            <h1 class="text-3xl text-center overflow-hidden text-ellipsis whitespace-nowrap pr-10">
                Einstellungen
            </h1>
        </Navbar>
        <div>
            <Section>
                {#if isWakeLockSupported()}
                    <CheckboxRow checked={$settings?.wakeLock}
                                 onchange={(detail) => handleChange('wakeLock', detail)}>
                        Display nicht deaktivieren in Fullscreen
                    </CheckboxRow>
                {/if}
                <CheckboxRow isLast={true}>
                    Dark Mode
                    {#snippet checkbox()}
                    <div >
                          <ThemeSwitch/>
                      </div>
                  {/snippet}
                </CheckboxRow>
            </Section>

            {#if isVibrationSupported()}
                <Section>
                    {#snippet header()}
                    <div >
                          Slot Detail Seite
                      </div>
                  {/snippet}
                    <CheckboxRow checked={$settings?.slotDetailVibrationEmpty}
                                 onchange={(detail) => handleChange('slotDetailVibrationEmpty', detail)}>
                        Vibrieren bei leerem Tank
                    </CheckboxRow>
                    <ButtonGroupRow value={$settings?.slotDetailVibrationEmptyThreshold ?? 0.2}
                                    options={[[0, '0%'], [0.05, '5%'], [0.1, '10%'], [0.15, '15%'], [0.2, '20%']]}
                                    disabled={!$settings?.slotDetailVibrationEmpty}
                                    onchange={(detail) => handleChange('slotDetailVibrationEmptyThreshold', +detail)}>
                        Schwellwert für Vibration bei leerem Tank
                    </ButtonGroupRow>
                    <CheckboxRow checked={$settings?.slotDetailVibrationFull}
                                 onchange={(detail) => handleChange('slotDetailVibrationFull', detail)}>
                        Vibrieren bei vollem Tank
                    </CheckboxRow>
                    <ButtonGroupRow value={$settings?.slotDetailVibrationFullThreshold ?? 0.9}
                                    options={[[0.8, '80%'], [0.85, '85%'], [0.9, '90%'], [0.95, '95%'], [1, '100%']]}
                                    disabled={!$settings?.slotDetailVibrationFull}
                                    onchange={(detail) => handleChange('slotDetailVibrationFullThreshold', +detail)}
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
