<script lang="ts">
    import { onMount } from "svelte";
    import { Toy } from "./toy";

    let container: HTMLDivElement;
    let toy: Toy;

    onMount(() => {
        toy = new Toy(container);
        toy.render();

        const handleResize = () => {
            toy?.handleResize();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            if (toy) {
                toy.dispose();
            }
            window.removeEventListener("resize", handleResize);
        };
    });
</script>

<div class="toy">
    <div
        bind:this={container}
        on:pointermove={toy?.interaction.pointermove}
        on:pointerdown={toy?.interaction.pointerdown}
        on:pointerup={toy?.interaction.pointerup}
        on:keydown={toy?.interaction.keydown}
        on:keyup={toy?.interaction.keyup}
        role="button"
        tabindex="0"
        class="h-64 w-full"
        aria-label="Interactive 3D audio visualizer. Use mouse to interact, spacebar for animations."
    ></div>
</div>

<style>
</style>
