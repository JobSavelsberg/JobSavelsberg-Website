<!-- ThemeToggle Svelte component with interactive theme switching -->
<script lang="ts">
    import { onMount } from "svelte";
    import { themeStore, isDark } from "../stores/themeStore";

    let mounted = false;

    onMount(() => {
        mounted = true;
        themeStore.init(); // run only in browser
    });

    function toggleTheme() {
        themeStore.toggle();
    }
</script>

{#if !mounted}
    <!-- Show a placeholder to not trip up the layout containing this component-->
    <div class="h-[30px] w-[30px] rounded-full"></div>
{:else}
    <button
        class="theme-toggle relative flex cursor-pointer items-center
           justify-center overflow-hidden rounded-xl border-0
           bg-transparent"
        aria-label="Toggle theme"
        on:click={toggleTheme}
    >
        <div class="relative h-[30px] w-[30px] overflow-hidden rounded">
            <div
                class="rotating-disc animate absolute top-0 -left-4 h-[60px] w-[60px]"
                class:light={!$isDark}
                class:dark={$isDark}
            >
                <!-- Sun icon -->
                <svg
                    class="theme-icon absolute text-current"
                    style="left: 20px; top: 35px;"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="6"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                    ></circle>
                    <path
                        d="m12 0.5 0 1.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    ></path>
                    <path
                        d="m12 22 0 1.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    ></path>
                    <path
                        d="m3.5 3.5 1.5 1.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    ></path>
                    <path
                        d="m19 19 1.5 1.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    ></path>
                    <path
                        d="m0.5 12 1.5 0"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    ></path>
                    <path
                        d="m22 12 1.5 0"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    ></path>
                    <path
                        d="m5 19-1.5 1.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    ></path>
                    <path
                        d="m20.5 3.5-1.5 1.5"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                    ></path>
                </svg>

                <!-- Moon icon -->
                <svg
                    class="theme-icon absolute text-current"
                    style="left: 20px; top: 4px;"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path
                        d="M21 12.79A10 10 0 1 1 10.21 3 7 7 0 0 0 21 12.79z"
                        stroke="currentColor"
                        stroke-width="2"
                        fill="none"
                    >
                    </path>
                </svg>
            </div>
        </div>
    </button>
{/if}

<style>
    .theme-toggle {
        transition: transform 0.1s ease-in-out;
    }

    .theme-toggle:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
    }

    .theme-toggle::before {
        content: "";
        position: absolute;
        inset: 0;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease-in-out;
        background: radial-gradient(
            ellipse 45% 90% at bottom,
            rgba(0, 0, 0, 0.3),
            transparent
        );
    }

    :global(.dark) .theme-toggle::before {
        background: radial-gradient(
            ellipse 45% 90% at bottom,
            rgba(255, 255, 255, 0.3),
            transparent
        );
    }

    @media (hover: hover) {
        .theme-toggle:hover::before {
            opacity: 1;
        }
    }

    .rotating-disc {
        transform-origin: 30px 30px;
    }
    .rotating-disc.animate {
        transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .rotating-disc.light {
        transform: rotate(180deg);
    }

    .rotating-disc.dark {
        transform: rotate(0deg);
    }

    .theme-icon {
        transition: opacity 0.2s ease-in-out;
    }

    :global(.dark) .theme-icon {
        color: white;
    }

    .theme-icon circle,
    .theme-icon path {
        /* Remove color transitions to prevent flash during theme changes */
        transition: fill 0.2s ease-in-out;
    }

    @media (hover: hover) {
        .theme-toggle:hover .theme-icon circle,
        .theme-toggle:hover .theme-icon path {
            fill: currentColor;
            opacity: 1;
        }
    }

    /* Reduced motion accessibility */
    @media (prefers-reduced-motion: reduce) {
        .rotating-disc,
        .theme-toggle::before,
        .theme-icon circle,
        .theme-icon path {
            transition: none !important;
        }
    }
</style>
