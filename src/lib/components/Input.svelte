<script lang="ts">
  export let value: any;
  export let id = (Math.random() * 1000).toFixed(0);
  export let name = id;
  export let type = 'text';
  export let min;
  export let max;
  export let required;
  export let autofocus;

  let inputEl: HTMLInputElement;

  export const focus = (options?: FocusOptions) => inputEl?.focus(options);

  let klass: string
  export {klass as class};
</script>

<svelte:options accessors={true}/>

<div class="border rounded border-primary flex overflow-hidden py-1 mb-3 {klass}" class:pr-8={$$slots.icon}>
    <label for={id} class="px-4 block h-10 leading-10 w-fit opacity-80">
        <slot/>
    </label>
    {#if type === 'text'}
        <input bind:this={inputEl} type="text" {name} {id} {min} {max} {required} {autofocus}
               class="flex-1 h-10 leading-10 text-left" bind:value on:change on:input/>
    {:else if type === 'date'}
        <input bind:this={inputEl} type="date" {name} {id} {min} {max} {required}
               class="flex-1 h-10 leading-10 text-left" bind:value on:change on:input/>
    {:else if type === 'number'}
        <input bind:this={inputEl} type="number" {name} {id} {min} {max} {required}
               class="flex-1 h-10 leading-10 text-left" bind:value on:change on:input/>
    {/if}

    {#if $$slots.icon}
        <div class="absolute top-0 right-0 bottom-0 py-1.5">
            <slot name="icon"></slot>
        </div>
    {/if}
</div>
<slot name="error"/>
