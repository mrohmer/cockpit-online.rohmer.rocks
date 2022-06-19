<script lang="ts">
    import type {Race} from '../models/race';
    import Content from "./Content.svelte";
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    export let status: Race['status'];
    export let name: Race['name'];
    export let mode: Race['mode'];
    export let time: Race['time'];
    export let lapsToGo: Race['lapsToGo'];
    export let backLink = '/';
</script>

<div class="bg-gray-200 dark:bg-black py-2">
    <div class="absolute inset-0"
         class:bg-green-400={status === 'running'}
         class:dark:bg-green-700={status === 'running'}
         class:bg-red-500={status === 'stopped'}
         class:dark:bg-red-700={status === 'stopped'}
         class:bg-yellow-200={status === 'starting'}
         class:dark:bg-yellow-500={status === 'starting'}
         class:animate-pulse={status === 'starting'}
    ></div>
    <Content class="flex items-center">
        <a href={backLink} on:click={(event) => dispatch('clickBackLink', event)} class="block p-2 -ml-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="34" height="34" class="rotate-90">
                <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" class="dark:fill-white"/>
            </svg>
        </a>
        <div class="flex-1 text-3xl truncate">{name}</div>
        <div class="flex flex-col text-sm items-end">
            <div class="flex-1">{mode}</div>
            <div class="flex">
                {#if time}
                    <div class="flex items-baseline">
                        <div class="text-xs mr-0.5">Zeit</div>
                        <div>{time}</div>
                    </div>
                {/if}
                {#if lapsToGo}
                    <div class="flex ml-1 items-baseline">
                        <div class="text-xs mr-0.5 h-5">Runden</div>
                        <div>{lapsToGo}</div>
                    </div>
                {/if}
            </div>
        </div>
    </Content>
</div>
