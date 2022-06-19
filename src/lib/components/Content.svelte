<script lang="ts">
    let klass: string;

    export {klass as class};
</script>
<div class="w-full max-w-5xl mx-auto {klass}" class:pl-5={!/p(l|x)-/.test(klass)} class:pr-5={!/p(r|x)-/.test(klass)}>
    <slot />
</div>
