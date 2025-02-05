<script lang="ts">
  import type {Slot} from '$lib/models/slot';

  type Props = Pick<Slot, 'id'|'name'|'position'|'image'>

  let { id, name, position, image }: Props = $props();

</script>

<div class="flex items-center">
    <div class="h-12 w-12 z-10">
        <div class="font-normal bg-white text-black rounded-full flex justify-center items-center w-full h-full dark:bg-neutral-900 dark:text-white text-2xl">
            <div>{position}</div>
        </div>
    </div>
    {#if image}
        <div class="rounded-full overflow-hidden border-white bg-white border-4 h-16 w-16 -ml-4 shadow dark:bg-neutral-900 dark:border-neutral-900"
        >
            <div class="w-6 h-6 absolute inset-0 m-auto">
                <div class="w-full h-full rounded-full border-2 border-t-primary border-transparent"></div>
            </div>
            <img src={image}
                 alt={name}
                 class="bg-white dark:bg-neutral-900 transition-opacity"
            />
        </div>
    {/if}
</div>
