<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();

  let inputEl: HTMLInputElement = $state();

  export const focus = (options?: FocusOptions) => inputEl?.focus(options);

  interface Props {
    value: any;
    id?: any;
    name?: any;
    type?: string;
    min?: any;
    max?: any;
    required?: any;
    autofocus: any;
    class?: string;
    icon?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
    error?: import('svelte').Snippet;
  }

  let {
    value = $bindable(),
    id = (Math.random() * 1000).toFixed(0),
    name = id,
    type = 'text',
    min,
    max,
    required,
    autofocus,
    class: klass,
    icon,
    children,
    error
  }: Props = $props();


  export {
  	value,
  	id,
  	name,
  	type,
  	min,
  	max,
  	required,
  	autofocus,
  	klass,
  }
</script>

<style lang="postcss">
    .input {
        @apply w-full px-4 h-10 leading-10 text-left;
    }
</style>

<div class="border rounded border-primary py-1 mb-3 {klass}" class:pr-8={icon}>
    <label for={id} class="absolute -top-2 left-3 text-xs px-1 block w-fit bg-neutral-50 dark:bg-black">
        {@render children?.()}
    </label>
    {#if type === 'text'}
        <input bind:this={inputEl} type="text" {name} {id} {min} {max} {required} {autofocus}
               class="input" bind:value onchange={bubble('change')} oninput={bubble('input')}/>
    {:else if type === 'date'}
        <input bind:this={inputEl} type="date" {name} {id} {min} {max} {required}
               class="input" bind:value onchange={bubble('change')} oninput={bubble('input')}/>
    {:else if type === 'number'}
        <input bind:this={inputEl} type="number" {name} {id} {min} {max} {required}
               class="input" bind:value onchange={bubble('change')} oninput={bubble('input')}/>
    {/if}

    {#if icon}
        <div class="absolute top-0 right-0 bottom-0 py-1.5">
            {@render icon?.()}
        </div>
    {/if}
</div>
{@render error?.()}
