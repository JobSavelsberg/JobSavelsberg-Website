// Copyright 2025 Sorama B.V.
import { writable, get } from "svelte/store";

const THEMES = {
    DARK: "dark",
    LIGHT: "light",
} as const;

type Theme = (typeof THEMES)[keyof typeof THEMES];

// Create the writable store
function createThemeStore() {
    const store = writable<Theme>(THEMES.LIGHT);

    return {
        subscribe: store.subscribe,
        // Initialize theme from DOM/localStorage
        init: () => {
            if (typeof window === "undefined") return;

            const isDark = document.documentElement.classList.contains(
                THEMES.DARK
            );
            store.set(isDark ? THEMES.DARK : THEMES.LIGHT);

            // Watch for theme changes using MutationObserver
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (
                        mutation.type === "attributes" &&
                        mutation.attributeName === "class"
                    ) {
                        const isDark =
                            document.documentElement.classList.contains(
                                THEMES.DARK
                            );
                        store.set(isDark ? THEMES.DARK : THEMES.LIGHT);
                    }
                });
            });

            observer.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ["class"],
            });

            // Handle Astro page navigation
            const handlePageLoad = () => {
                const isDark = document.documentElement.classList.contains(
                    THEMES.DARK
                );
                store.set(isDark ? THEMES.DARK : THEMES.LIGHT);
            };

            document.addEventListener("astro:page-load", handlePageLoad);

            // Return cleanup function
            return () => {
                observer.disconnect();
                document.removeEventListener("astro:page-load", handlePageLoad);
            };
        },
        // Helper to get if current theme is dark
        isDark: () => get(store) === THEMES.DARK,
    };
}

export const themeStore = createThemeStore();
export { THEMES };
export type { Theme };
