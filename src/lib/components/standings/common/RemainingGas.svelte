<script lang="ts">
    import RemainingGasNotification from "./RemainingGasNotification.svelte";
    import {notificationPermission} from "../../../stores/permission.js";

    export let inPit = false;
    export let remainingGas: number;
    export let subscribed = false;
</script>

{#if inPit || remainingGas}
    <div class="absolute left-0 top-0 h-full bg-green-700"
         style="width: {((remainingGas ?? +inPit) * 100).toFixed(0)}%"
         class:bg-secondary={inPit}
         class:animate-pulse={inPit}
         class:opacity-50={!inPit}
         class:bg-green-700={!inPit && remainingGas >= 0.2}
         class:bg-red-700={!inPit && remainingGas < 0.2}
    ></div>
    <div class="flex flex-col justify-center h-full">
        <div class="flex">
            <div class="flex-1 text-center">
                {#if inPit}
                    in Pit
                {:else if remainingGas}
                    {(remainingGas * 100).toFixed(0)}%
                {/if}
            </div>
            {#if $notificationPermission !== 'denied'}
                <div>
                    <RemainingGasNotification state={subscribed} hasNotification={remainingGas < 0.2} on:subscribe on:unsubscribe/>
                </div>
            {/if}
        </div>
    </div>
{/if}
