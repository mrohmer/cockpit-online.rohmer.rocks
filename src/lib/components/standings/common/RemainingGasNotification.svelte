<script lang="ts">
  import {createEventDispatcher} from 'svelte';

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
</script>

<div on:click|preventDefault={handleClick}>
    {state}
</div>
