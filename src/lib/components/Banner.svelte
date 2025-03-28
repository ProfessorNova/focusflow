<script lang="ts">
    import {onMount, tick} from "svelte";

    export let visibleTime : number = 3000,
        fadeIn : number = 500,
        fadeOut : number = 1000;

    onMount(async () => {
        await tick(); // Ensures DOM is ready

        const htmlBanner = document.getElementById("banner");
        if (!htmlBanner) return;

        htmlBanner.style.transition = fadeIn + "ms";
        htmlBanner.style.translate = "-50% 0%";
        htmlBanner.style.opacity = "100%";
        
        setTimeout(() => {
            htmlBanner.style.transition = fadeOut + "ms";
            htmlBanner.style.translate = "-50% -100%";
            htmlBanner.style.opacity = "0%";
        }, visibleTime);
    })
</script>

<div id="banner" class="absolute z-1 bg-base-100 max-w-md w-fit px-6 py-4 border rounded-lg border-info place-items-center 
    left-[50%] translate-x-[-50%] translate-y-[-100%] opacity-0">
    <slot/>
</div>