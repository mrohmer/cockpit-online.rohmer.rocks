<script lang="ts">
  interface Props {
    hasHover?: boolean;
    children?: import('svelte').Snippet;
  }

  let { hasHover = false, children }: Props = $props();
</script>
<div class="shadow transition-all rounded-xl overflow-hidden dark:shadow-none dark:border dark:border-neutral-800"
     class:hover:shadow={hasHover}
     class:dark:hover:shadow-neutral-800={hasHover}
>
    {@render children?.()}
</div>
