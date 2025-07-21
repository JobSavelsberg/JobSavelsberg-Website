<!-- MusicEmbed Svelte component with reactive theme switching -->
<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { themeStore, THEMES } from "../stores/theme";

    let mounted = false;
    let cleanup: (() => void) | undefined;

    // Reactive statements - automatically update when theme store changes
    $: theme = $themeStore;
    $: albumsrc = `https://embed.music.apple.com/us/album/all-that-happened-in-the-meantime/1511908765?theme=${theme}`;
    $: songsrc = `https://embed.music.apple.com/us/song/partial-eclipse/1784744158?theme=${theme}`;

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

<section class="flex flex-col items-center justify-center gap-8">
    {#if mounted}
        <iframe
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            height="175"
            style="width:100%;overflow:hidden;border-radius:10px;"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            src={songsrc}
            title="Apple Music Embed"
        ></iframe>
        <iframe
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            height="500"
            style="width:100%;overflow:hidden;border-radius:10px;"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            src={albumsrc}
            title="Apple Music Embed"
        ></iframe>
    {:else}
        <p>Loading music...</p>
    {/if}
</section>
