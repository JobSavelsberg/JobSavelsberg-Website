<!-- MusicEmbed Svelte component with reactive theme switching -->
<script lang="ts">
    import { themeStore } from "../stores/themeStore";
    import { derived } from "svelte/store";

    const albumsrc = derived(
        themeStore,
        theme =>
            `https://embed.music.apple.com/us/album/all-that-happened-in-the-meantime/1511908765?theme=${theme}`
    );

    const songsrc = derived(
        themeStore,
        theme =>
            `https://embed.music.apple.com/us/song/partial-eclipse/1784744158?theme=${theme}`
    );
</script>

<section class="flex flex-col items-center justify-center gap-8">
    <!-- Backup link: https://www.youtube.com/watch?v=qzlN7elbsS8 -->
    <iframe
        width="100%"
        height="315"
        src="https://www.youtube.com/embed/InE-YK4d6_o"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        style="border-radius:10px;"
    ></iframe>
    <iframe
        allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
        height="175"
        style="width:100%;overflow:hidden;border-radius:10px;"
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
        src={$songsrc}
        title="Apple Music Embed"
    ></iframe>
    <iframe
        allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
        height="500"
        style="width:100%;overflow:hidden;border-radius:10px;"
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
        src={$albumsrc}
        title="Apple Music Embed"
    ></iframe>
</section>
