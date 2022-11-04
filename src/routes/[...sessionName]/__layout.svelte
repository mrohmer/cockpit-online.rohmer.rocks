<script lang="ts">
  import WakeLock from "$lib/components/WakeLock.svelte";
</script>

<slot />

<div class="flex justify-center mt-32">
    <WakeLock />
</div>
