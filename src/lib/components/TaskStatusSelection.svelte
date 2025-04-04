<script lang="ts">
    import {onMount} from "svelte";
    import {Circle, CircleCheck, CircleDot, Target} from "lucide-svelte";

    export let taskId: number;

    let status: string = '';

    onMount(() => {
        (async () => {
            try {
                const res = await fetch(`/api/tasks/${taskId}`);
                const task = await res.json();
                status = task.status;
            } catch (err) {
                console.error("Failed to load task.");
            }
        })();
    });

    async function updateTask(): Promise<void> {
        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                // Optionally, you can handle the response here
            } else {
                console.error("Failed to update task.");
            }
        } catch (err) {
            console.error("Failed to update task:", err);
        }
    }
</script>

<div class="dropdown dropdown-bottom">
    <div tabindex="0" role="button" class="btn m-1">
        {#if status === "Open"}
            <Circle />
        {:else if status === "Pending"}
            <CircleDot class="text-info" />
        {:else if status === "InReview"}
            <Target class="text-warning" />
        {:else if status === "Closed"}
            <CircleCheck class="text-success" />
        {/if}
    </div>
    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
        <li><button type="button" on:click={() => { status = "Open"; updateTask();}}>Open</button></li>
        <li><button type="button" on:click={() => { status = "Pending"; updateTask();}}>Pending</button></li>
        <li><button type="button" on:click={() => { status = "InReview"; updateTask();}}>InReview</button></li>
        <li><button type="button" on:click={() => { status = "Closed"; updateTask();}}>Closed</button></li>
    </ul>
</div>