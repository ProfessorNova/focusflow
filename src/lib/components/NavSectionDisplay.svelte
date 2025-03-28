<script lang="ts">
    import {navigationSections, navSection} from "$lib/store/navSectionStore";

    let previousSections: string[][] = [];
    let nextSections: string[][] = [];
    let section: string = "";

    $: {
        section = $navSection;
        nextSections = [];
        previousSections = [];
        for (let i = 0; i < navigationSections.length; i++) {
            if (navigationSections[i][0] == section) {
                nextSections.push(navigationSections.slice(i + 1, navigationSections.length).map((_section) => _section[0]));
                break;
            }
            previousSections.push(navigationSections[i]);
        }
    }

</script>

<!-- Make a arc below the header which indicates the current navigation -->
<div class="flex gap-2 justify-center">

    {#each previousSections as previousSection}
        <p>{previousSection[0]}</p>
    {/each}

    <p class="underline">{section}</p>

    {#each nextSections as nextSection}
        <p>{nextSection[0]}</p>
    {/each}
</div>

<!-- For later use -->

<!--<svg width="400" height="150">-->
<!--    <defs>-->
<!--        <path id="arcPath" d="M50,100 A150,80 0 0,1 350,100"/>-->
<!--    </defs>-->
<!--    <text font-size="18" fill="black">-->
<!--        <textPath href="#arcPath" startOffset="50%">-->
<!--            {section} Navigation-->
<!--        </textPath>-->
<!--    </text>-->
<!--</svg>-->