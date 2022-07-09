<script lang="ts">
  export let header: string;
  export let isHeader = false;

  let klass = '';
  export let textAlign: 'right'|'left'|'center' = 'center';

  export {klass as class};
</script>

<div class="mx-1{klass?.trim() ? ` ${klass}` : ''}"
     class:text-right={textAlign === 'right'}
     class:text-left={textAlign === 'left'}
     class:text-center={textAlign === 'center'}
>
    {#if isHeader}
        {header}
    {:else}
        <slot />
    {/if}
</div>
