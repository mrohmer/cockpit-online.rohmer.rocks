<script lang="ts">
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher();

    export let checked = false;
</script>

<div class="flex items-center w-fit gap-x-2 cursor-pointer" on:click={() => dispatch('change', !checked)}>
    <div class="block bg-neutral-200 dark:bg-neutral-600 rounded-full cursor-pointer w-14 h-7 transition-all"
         class:bg-primary={checked}
         class:dark:bg-primary={checked}
    >
        <div class="bg-white dark:bg-black absolute left-0 top-0 h-6 w-6 rounded-full mt-0.5 ml-0.5 transition-all"
             class:left-7={checked}
        ></div>
    </div>
    <div>
        <slot />
    </div>
</div>
