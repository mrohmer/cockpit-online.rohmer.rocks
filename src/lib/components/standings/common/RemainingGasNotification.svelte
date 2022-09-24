<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  import Bell from 'svelte-material-icons/Bell.svelte'
  import BellBadge from 'svelte-material-icons/BellBadge.svelte'
  import BellOutline from 'svelte-material-icons/BellOutline.svelte'
  import BellBadgeOutline from 'svelte-material-icons/BellBadgeOutline.svelte'

  const dispatch = createEventDispatcher();

  const handleClick = () => {
    state = !state;

    if (state) {
      dispatch('subscribe');
    } else {
      dispatch('unsubscribe');
    }
  }

  export let state = false;
  export let hasNotification = false;
  const size = '25px';
</script>

<div class='py-1 px-2' class:opacity-50={!state} class:opacity-70={state} on:click|preventDefault={handleClick}>
    {#if state && hasNotification}
        <BellBadge {size} />
    {:else if state}
        <Bell {size} />
    {:else if hasNotification}
        <BellBadgeOutline {size} />
    {:else}
        <BellOutline {size} />
    {/if}
</div>
