<script lang="ts">
    import Banner from "$lib/components/Banner.svelte";
    import {onMount} from "svelte";

    import type {PageData} from "./$types";
    import {navSection} from "$lib/store/navSectionStore";
    import NavSectionDisplay from "$lib/components/NavSectionDisplay.svelte";
    import Navbar from "$lib/components/NavBar.svelte";

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

    <p class="p-4">
        Night City, 2077.

        Rain stabbed the concrete like broken glass, washing blood into the gutters alongside spent casings and
        shattered dreams. Neon signs buzzed through the storm, advertising synthetic flesh, eternal youth, and
        brain-dances you’d never come back from.

        In an alley just off Jig-Jig Street, Silas Vane leaned against the brick, smoke curling from his neural
        interface. His chrome fingers trembled. Not from fear. The tremors had started ever since he installed the
        black-market memory array. The seller called it a “GhostDrive.” Said it could let you upload fragments of other
        people’s minds.

        Silas hadn't realized they stayed with you.

        At first, it was useful. He could talk like a corpo exec, shoot like a veteran soldier, seduce like a braindance
        star. But lately, they were talking back.

        Voices. Dozens. Hundreds. Whispering in languages he didn’t speak, screaming at things he couldn’t see.

        One voice—Clara—always came back. Soft. Clear. Real. A memory of a woman he'd never met, but missed like a dead
        lover. She told him things. Secrets. Passwords. Places to go. She was leading him somewhere.

        Tonight, it ended.

        He pushed open a rusted gate into an abandoned med-tech clinic in Watson. Old Militech tech hung from the
        ceiling, dripping oil like black tears. As he stepped inside, the lights flickered on—by themselves.

        “Welcome back, Silas,” Clara’s voice echoed through the speakers. It wasn’t a recording. It was live.

        “How are you in the system?” he asked, pulling his gun. "You were just a ghost."

        “I was uploaded, same as them,” she said. “But I was different. I didn’t forget who I was.”

        A panel slid open in the floor. A staircase descended into flickering blue light.

        “Come see,” she whispered.

        Downstairs, he found a glass chamber. Inside floated a girl, twenty-something, tubes plugged into her skull,
        eyes open but empty. Clara. The real Clara.

        Or what was left of her.

        “They used me to build the GhostDrive,” her voice said, now from all around him. “They said it would free people
        from their bodies. But it trapped them. We’re all in here, Silas. All of us.”

        Silas dropped to his knees. The chamber hissed open. Her body sagged forward, lifeless. But her mind… her voice…

        “You can free me,” she said.

        “How?”

        A panel on the wall lit up. A single red button: PURGE.

        “Wait,” said a new voice in his head. One of the others. “She’s lying. If you purge, we all die. You die.”

        Another voice screamed. Then another. Then a hundred more. Arguing. Pleading. Laughing.

        His vision blurred. His skin felt wrong. Was it even his anymore?

        Silas raised his hand toward the button.

        “Who am I?” he asked the room.

        Silence.

        Then Clara’s voice, soft and final: “You’re what’s left of us all.”

        He pressed the button.

        Everything went white.
    </p>
</main>