import { writable } from "svelte/store";

export type Theme = "light" | "dark";
import { derived } from "svelte/store";

function syncTheme(theme: Theme) {
    // Keep DOM + storage in sync
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("theme", theme);
}

function createThemeStore() {
    const { subscribe, set, update } = writable<Theme>("light");

    function init() {
        // Get stored theme (if previously set from this website)
        const stored = window.localStorage.getItem("theme") as Theme | null;
        // Get browser's preferred theme
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        // Try to use stored theme, otherwise use browser preference
        const theme: Theme = stored ?? (prefersDark ? "dark" : "light");
        set(theme);
        syncTheme(theme);
    }

    function toggle() {
        update(curr => {
            const newTheme = curr === "dark" ? "light" : "dark";
            syncTheme(newTheme);
            return newTheme;
        });
    }

    return { subscribe, init, toggle };
}

export const themeStore = createThemeStore();

export const isDark = derived(
    themeStore,
    $themeStore => $themeStore === "dark"
);
