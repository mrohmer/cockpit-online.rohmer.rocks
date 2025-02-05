<script lang="ts">
  interface Props {
    hasHover?: boolean;
    children?: import('svelte').Snippet;
    class?: string;
    viewTransitionName?: string;
  }

  let { viewTransitionName, hasHover = false, children, class: klass }: Props = $props();
</script>
<div class="shadow transition-all rounded-xl overflow-hidden dark:shadow-none border border-neutral-200 dark:border-neutral-700 {klass}"
     class:hover:shadow={hasHover}
     class:dark:hover:shadow-neutral-800={hasHover}
     style={viewTransitionName ? `view-transition-name: ${viewTransitionName}` : undefined}
>
    {@render children?.()}
</div>
