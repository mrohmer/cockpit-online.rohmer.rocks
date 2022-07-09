<script lang="ts">
    export let image: string;
</script>
{#if image}
    <div class="h-full w-full bg-center bg-no-repeat bg-contain"
         style="background-image: url('{image}')">
    </div>
{/if}
