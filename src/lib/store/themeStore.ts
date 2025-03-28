import {writable} from "svelte/store";

// Ensure we are in the browser before accessing window
const isBrowser = typeof window !== "undefined";

// Get user preference from localStorage or system preference
const prefersDark = isBrowser ? window.matchMedia("(prefers-color-scheme: dark)").matches : true;
const savedTheme = isBrowser ? localStorage.getItem("theme") : null;
const savedIsDarkMode = isBrowser ? localStorage.getItem("isDarkMode") : null;

// Set the default theme
export const theme = writable(savedTheme || (prefersDark ? "focusflowDark" : "focusflowLight"));
export const isDarkMode = writable((savedIsDarkMode != null ? (savedIsDarkMode == "true") : (prefersDark)));

// Apply theme only in the browser
if (isBrowser) {
    theme.subscribe((value) => {
        localStorage.setItem("theme", value);
        document.documentElement.setAttribute("data-theme", value);
    });
    isDarkMode.subscribe((value: boolean) => {
        localStorage.setItem("isDarkMode", value ? "true" : "false");
        theme.set(value ? "focusflowDark" : "focusflowLight");
    });
}
