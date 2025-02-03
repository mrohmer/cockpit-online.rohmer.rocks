<script lang="ts">
  import type {Slot} from '$lib/models/slot';
  import SlotFact from './SlotFact.svelte';
  import IoIosAlert from 'svelte-icons/io/IoIosAlert.svelte'
  import {slide} from 'svelte/transition';

  type Props = {
    penalty: Slot['penalty'];
  };
  let {penalty}: Props = $props();
</script>

{#if penalty}
    <div class="w-full bg-red-600 rounded-xl" transition:slide>
        <SlotFact iconColorNormal>
            {#snippet icon()}
                <IoIosAlert/>
            {/snippet}
            <div class="transition-colors font-normal h-11 flex justify-center items-center">
                <div>
                    {#if penalty === 'pit'}
                        Boxenstrafe aktiv
                    {:else}
                        Strafe aktiv
                    {/if}
                </div>
            </div>
        </SlotFact>
    </div>
{/if}
