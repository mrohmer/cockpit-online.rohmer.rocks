<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();
</script>

<Card>
    <div class="p-4">
        {@render children?.()}
    </div>
</Card>
