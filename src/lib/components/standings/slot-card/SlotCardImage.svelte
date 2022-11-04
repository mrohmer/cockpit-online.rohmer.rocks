<script lang="ts">
  import type {Slot} from '$lib/models/slot';

  export let name: Slot['name'];
  export let penalty: Slot['penalty'];
  export let position: Slot['position'];
  export let image: Slot['image'];

  $: loaded = !image;
</script>

<div class="flex items-center" class:pt-3={!image} class:pl-3={!image}>
    <div class="z-10"
         class:h-6={!!image}
         class:w-6={!!image}
         class:h-8={!image}
         class:w-8={!image}
    >
        <div class="absolute h-3/4 w-3/4 m-auto inset-0 rounded-full bg-red-400 opacity-75"
             class:animate-ping={!!penalty}
        ></div>
        <div class="bg-white text-black rounded-full flex justify-center items-center w-full h-full dark:bg-neutral-900 dark:text-white"
             class:text-red-400={!!penalty}
             class:font-bold={!!penalty || !image}
        >
            <div>{!!penalty ? 'P' : position}</div>
        </div>
    </div>
    {#if image}
        <div class="rounded-full overflow-hidden border-white bg-white border-4 h-14 w-14 -ml-3 shadow dark:bg-neutral-900 dark:border-neutral-900"
        >
            <div class="w-6 h-6 absolute inset-0 m-auto" class:animate-spin={!loaded}>
                <div class="w-full h-full rounded-full border-2 border-t-primary border-transparent"></div>
            </div>
            <img src={image}
                 alt={name}
                 class="bg-white dark:bg-neutral-900 transition-opacity"
                 class:opacity-0={!loaded}
                 on:load={() => loaded = true}
            />
        </div>
    {/if}
</div>
