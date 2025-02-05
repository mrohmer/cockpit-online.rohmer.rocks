<script lang="ts">
  import IoIosArrowBack from 'svelte-icons/io/IoIosArrowBack.svelte';

  interface Props {
    backLink?: string;
    children: import('svelte').Snippet;
    actions?: import('svelte').Snippet;
    bottomBar?: import('svelte').Snippet;
    onBackLinkClick?: (event: Event) => void;
    viewTransitionName?: string;
  }

  let {
    viewTransitionName,
    backLink,
    children,
    actions,
    bottomBar,
    onBackLinkClick,
  }: Props = $props();
</script>

<div class="mt-4 mb-4"
     style={viewTransitionName ? `view-transition-name: ${viewTransitionName}` : undefined}>
    <div class="flex items-center">
        {#if backLink}
            <a href={backLink} class="w-10 h-6 px-2" onclick={onBackLinkClick}>
                <IoIosArrowBack/>
            </a>
        {/if}
        <div class="flex-1 min-w-0">
            {@render children()}
        </div>
        {#if actions}
            <div class="flex items-center gap-x-2">
                {@render actions()}
            </div>
        {/if}
    </div>

    {#if bottomBar}
        <div class="flex justify-center items-center gap-x-2">
            {@render bottomBar()}
        </div>
    {/if}
</div>
