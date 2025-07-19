<!-- MusicEmbed Svelte component with reactive theme switching -->
<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { themeStore, THEMES } from "../stores/theme";

    let mounted = false;
    let cleanup: (() => void) | undefined;

    // Reactive statements - automatically update when theme store changes
    $: theme = $themeStore;
    $: src = `https://embed.music.apple.com/us/album/all-that-happened-in-the-meantime/1511908765?theme=${theme}`;

    onMount(() => {
        // Initialize the theme store
        cleanup = themeStore.init();
        mounted = true;
    });

    onDestroy(() => {
        // Clean up observers and event listeners
        cleanup?.();
    });
</script>

{#if mounted}
    <iframe
        allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
        height="450"
        style="width:100%;overflow:hidden;border-radius:10px;"
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
        {src}
        title="Apple Music Embed"
    ></iframe>
{:else}
    <!-- Loading placeholder while component mounts -->
    <div
        class="flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800"
        style="height: 450px;"
    >
        <div class="text-neutral-500 dark:text-neutral-400">
            Loading music...
        </div>
    </div>
{/if}
