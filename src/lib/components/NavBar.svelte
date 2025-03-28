<script lang="ts">
	import {enhance} from "$app/forms";
	import {theme} from "$lib/store/themeStore";
	import {onMount} from "svelte";
	import ThemeToggle from "./ThemeToggle.svelte";
	import {navigationSections} from "$lib/store/navSectionStore";

	function logoutCallback() {
        localStorage.removeItem("SessionInitialized");
    }

    const ResetLocation = navigationSections[0];

    // Propably not needed
    onMount(() => {
        document.documentElement.setAttribute("data-theme", $theme);
    });
</script>

<div class="navbar bg-base-100 shadow-md border-b-1 border-secondary">
    <div class="navbar-start">
        <div class="dropdown">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"/>
                </svg>
            </div>
            <ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow border border-base200">
                {#each navigationSections as navSection}
                    <li><a href="{`${navSection[1]}`}">{navSection[0]}</a></li>
                {/each}
            </ul>
        </div>
    </div>
    <div class="navbar-center">
        <a href="{`${ResetLocation[1]}`}" title="{`${ResetLocation[0]}`}" class="btn btn-ghost text-xl text-primary">FocusFlow</a>
    </div>
    <div class="navbar-end">
        <ThemeToggle/>
        <form method="post" action="?/logout" use:enhance={() => {
				logoutCallback();
				return async ({ update }) => {
					await update();
				};
			}}>
            <button class="btn btn-ghost rounded-lg">Sign out</button>
        </form>
    </div>
</div>