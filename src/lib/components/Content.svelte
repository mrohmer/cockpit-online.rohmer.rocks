<script lang="ts">
    let klass: string;

    export {klass as class};
</script>
<div class="w-full max-w-5xl mx-auto px-5 {klass}">
    <slot />
</div>
