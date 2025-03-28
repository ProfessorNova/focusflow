import { writable } from "svelte/store";

// Ensure we are in the browser before accessing window
const isBrowser = typeof window !== "undefined";

// Stores the current section the user is in
export const navSection = writable("null");
// Has all the user sections stored
export const navigationSections = [
    ["Home", "/"],
    ["Settings", "/settings"],
];

// Maybe add an getIndex() and getLink() method

// Apply theme only in the browser
if (isBrowser) {
    navSection.subscribe((value) => {
        localStorage.setItem("navSection", value);
    });
}
