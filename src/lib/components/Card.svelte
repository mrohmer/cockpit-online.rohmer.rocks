<script lang="ts">
  export let hasHover = false;
</script>
<div class="shadow transition-all rounded-xl overflow-hidden dark:shadow-none dark:border dark:border-neutral-800"
     class:hover:shadow={hasHover}
     class:dark:hover:shadow-neutral-800={hasHover}
>
    <slot/>
</div>
