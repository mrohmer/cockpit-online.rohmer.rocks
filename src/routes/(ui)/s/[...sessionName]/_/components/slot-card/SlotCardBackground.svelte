<script lang="ts">
  import type {Slot} from '$lib/models/slot';

  interface Props {
    id: Slot['id'];
    hasImage: boolean;
  }

  let { id, hasImage }: Props = $props();
</script>
<div class="absolute border-r-[14px] w-20 h-96 -left-7 -mt-1 ml-4 sm:ml-6 -top-10 rotate-12 origin-center bg-gray-200 shadow-xl dark:bg-gray-800 dark:shadow-neutral-800"
     class:-left-16={!hasImage}
     class:-ml-3={!hasImage}
     class:border-slot-1={id === '1'}
     class:border-slot-2={id === '2'}
     class:border-slot-3={id === '3'}
     class:border-slot-4={id === '4'}
     class:border-slot-5={id === '5'}
     class:border-slot-6={id === '6'}
></div>
