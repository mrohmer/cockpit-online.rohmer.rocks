<script lang="ts">
    interface Props {
        class?: string;
        children?: import('svelte').Snippet;
    }

    let { class: klass = '', children }: Props = $props();


</script>
<div class="w-full max-w-5xl mx-auto {klass}" class:pl-2={!/p(l|x)-/.test(klass)} class:pr-2={!/p(r|x)-/.test(klass)}>
    {@render children?.()}
</div>
