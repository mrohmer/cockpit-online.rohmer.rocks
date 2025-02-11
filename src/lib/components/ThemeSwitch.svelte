<script lang="ts">
  import {onMount} from 'svelte';

  let dark = $state();

  const getThemeFromLocalStorage = (): boolean | undefined => {
    if (!('theme' in localStorage)) {
      return undefined;
    }
    const data = localStorage.getItem('theme');
    if (data) {
      return JSON.parse(data)?.mode === 'dark';
    }
  }
  const getThemeFromSystemPreferences = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const changeTheme = () => {
    dark = !dark;
    const data = {mode: dark ? 'dark' : 'light'};
    localStorage.setItem('theme', JSON.stringify(data));
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  onMount(() => {
    dark = getThemeFromLocalStorage() ?? getThemeFromSystemPreferences();
  })
</script>

<style lang="postcss">
    .toggle__handler {
        @apply transition-all duration-[400ms];
        box-shadow: 0 2px 6px rgba(0, 0, 0, .3);
        /* transition: all 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55); */
    }

    .crater {
        @apply absolute bg-[#E8CDA5] opacity-0 rounded-full transition-opacity duration-200;
        /* transition: opacity 200ms ease-in-out; */
    }

    .crater--1 {
        @apply top-2 left-1.5 w-0.5 h-0.5;
    }

    .crater--2 {
        @apply top-1 left-3 w-1 h-1;
    }

    .crater--3 {
        @apply top-3 left-3 w-1.5 h-1.5;
    }


    .star {
        @apply absolute bg-white rounded-[100%] transition-all duration-300;
    //transition: all 300ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
    }

    .star--1,
    .star--2,
    .star--3 {
        @apply w-6 h-1;
    }

    .star--1 {
        @apply top-1 left-6 z-0;
    }

    .star--2 {
        @apply top-2.5 left-5 z-10;
    }

    .star--3 {
        @apply top-4 left-7 z-0;
    }

    .star--4,
    .star--5,
    .star--6 {
        @apply opacity-0 z-0;
        /* transition: all 300ms 0 cubic-bezier(0.445, 0.05, 0.55, 0.95); */
        @apply transition-all duration-300;
    }

    .star--4 {
        @apply top-6 left-7 w-0.5 h-0.5;
        transform: translate3d(3px, 0, 0);
    }

    .star--5 {
        @apply top-5 left-2 w-1 h-1;
        transform: translate3d(3px, 0, 0);
    }

    .star--6 {
        @apply top-1 left-2 w-0.5 h-0.5;
        transform: translate3d(3px, 0, 0);
    }

    .dark .toggle__handler {
        @apply bg-[#FFE5B5];
        transform: translate3d(28px, 0, 0) rotate(0);
    }

    .dark .crater {
        @apply opacity-100;
    }

    .dark .star--1 {
        @apply w-0.5 h-0.5;
    }

    .dark .star--2 {
        @apply w-1 h-1;
        transform: translate3d(-5px, 0, 0);
    }

    .dark .star--3 {
        @apply w-0.5 h-0.5;
        transform: translate3d(-9px, 2px, 0);
    }

    .dark .star--4,
    .dark .star--5,
    .dark .star--6 {
        @apply opacity-100;
        transform: translate3d(0, 0, 0);
    }

    .dark .star--4 {
        /* transition: all 300ms 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95); */
        @apply transition-all delay-200 duration-300;
    }

    .dark .star--5 {
        /* transition: all 300ms 300ms cubic-bezier(0.445, 0.05, 0.55, 0.95); */
        @apply transition-all delay-300 duration-300;
    }

    .dark .star--6 {
        transition: all 300ms 400ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
        @apply transition-all delay-[400ms] duration-300;
    }
</style>

{#if typeof dark === 'boolean'}
    <div class="flex flex-col justify-center items-center gap-y-1 cursor-pointer w-full">
        <button type="button" aria-label="Thema" onclick={() => changeTheme()} class="flex justify-center">
            <div class="transition-colors duration-200 cursor-pointer w-14 h-7 rounded-3xl bg-[#83D8FF]"
                 class:dark
                 class:bg-[#749DD6]={dark}>
                <div class="toggle__handler z-10 top-0.5 left-0.5 w-6 h-6 bg-[#FFCF96] rounded-full -rotate-45">
                    <div class="crater crater--1"></div>
                    <div class="crater crater--2"></div>
                    <div class="crater crater--3"></div>
                </div>
                <div class="star star--1"></div>
                <div class="star star--2"></div>
                <div class="star star--3"></div>
                <div class="star star--4"></div>
                <div class="star star--5"></div>
                <div class="star star--6"></div>
            </div>
        </button>
    </div>
{/if}

