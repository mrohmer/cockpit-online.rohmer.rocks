<script lang="ts">
  import { page } from '$app/stores';
</script>

{#if $page?.error?.message}
    <div class="text-center p-5">
        <div class="mb-1">
            {$page.error.message}
        </div>
        <a href="/{$page.route?.id === '/s/[...sessionName]' ? '' : $page.params.sessionName ?? ''}"  class="text-primary">
            zurück
        </a>
    </div>
{:else }
    <div class="text-center p-5">
        <div class="mb-1">
            Irgendetwas lief schief 🙈
        </div>
        <a href="/" class="text-primary">
            zurück
        </a>
    </div>
{/if}
