<script module lang="ts">

    const dateFormat = Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const timeFormat = Intl.DateTimeFormat('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
</script>

<script lang="ts">
    type Props = {
        date?: Date|string;
    };

    let {date}: Props = $props();

    const cleaned = $derived(typeof date === 'string' ? new Date(date) : date);
</script>

{#if cleaned}
    <div class="text-center text-sm font-normal">
        <div class="text-neutral-400">Stand</div>
        <div>
            <span>
            {dateFormat.format(cleaned)}
            </span>
            <span>
            {timeFormat.format(cleaned)}
            </span>
        </div>
    </div>
{/if}
