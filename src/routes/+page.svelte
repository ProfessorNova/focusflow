<script lang="ts">
    import Banner from "$lib/components/Banner.svelte";
    import {onMount} from "svelte";

    import type {PageData} from "./$types";
    import {navSection} from "$lib/store/navSectionStore";
    import NavSectionDisplay from "$lib/components/NavSectionDisplay.svelte";
    import Navbar from "$lib/components/NavBar.svelte";
    import TaskList from "$lib/components/TaskList.svelte";

    export let data: PageData;

    // Changing storage to current navbar section
    navSection.set("Home");

    let firstLogin: boolean;
    onMount(() => {
        // Looking for first initialization
        const isSessionInit = localStorage.getItem("SessionInitialized");
        if (isSessionInit == null || isSessionInit == "false") {
            localStorage.setItem("SessionInitialized", "true");
            firstLogin = true;
        } else {
            firstLogin = false;
        }
    });
</script>

<Navbar/>
<NavSectionDisplay/>

<main class="w-full">
    {#if firstLogin === true}
        <Banner visibleTime={2600} fadeIn={600} fadeOut={750}>
            <p>Welcome {data.user.username}!</p>
        </Banner>
    {/if}

    <h1 class="text-3xl font-bold text-center mt-8">Your Tasks</h1>

    <div class="w-full flex flex-col items-center mt-8">
        <TaskList userId={data.user.id}/>
    </div>
</main>