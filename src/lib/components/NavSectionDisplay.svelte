<script lang="ts">
    import {navigationSections, navSection} from "$lib/store/navSectionStore";

    let y: number = 0;
    const JUMPLIMIT: number = 55;
</script>
<!-- Scroll handler -->
<svelte:window bind:scrollY={y}/>

<div id="pageTop"></div>
<!-- hover:opacity-100 opacity-25 -->
<!-- Include those class properties here \/ to make the bar seethrough while not hovering -->
<div class="{y < JUMPLIMIT ? 'relative' : 'fixed'} z-10 top-0 left-0 flex bg-neutral w-full h-auto py-4 justify-center items-center gap-2 transition-opacity duration-750">
    {#each navigationSections as section}
        {#if section[0] == $navSection}
            <a href="#pageTop" aria-label="{`Jumps to the top`}" class="flex items-center">
                <button class="btn btn-sm btn-info hover:btn-neutral hover:border hover:border-info duration-500">
                    {section[0]}
                </button>
            </a>
        {:else}
            <a href="{`${section[1]}`}" aria-label="{`Link to ${section[0]}`}" class="flex items-center">
                <button class="btn btn-sm hover:scale-105 transition">
                    {section[0]}
                </button>
            </a>
        {/if}
    {/each}
</div>
<!-- Invisible component to fill up space -->
{#if y >= JUMPLIMIT}    
    <div class="top-0 left-0 flex bg-neutral w-full h-auto py-4 justify-center items-center gap-2 invisible">
        {#each navigationSections as section}
            {#if section[0] == $navSection}
                <a href="#pageTop" aria-label="{`Jumps to the top`}" class="flex items-center">
                    <button class="btn btn-sm btn-info hover:btn-neutral hover:border hover:border-info duration-500">
                        {section[0]}
                    </button>
                </a>
            {:else}
                <a href="{`${section[1]}`}" aria-label="{`Link to ${section[0]}`}" class="flex items-center">
                    <button class="btn btn-sm hover:scale-105 transition">
                        {section[0]}
                    </button>
                </a>
            {/if}
        {/each}
    </div>
{/if}

<!-- pseudo elements on hover for drag and drop -->