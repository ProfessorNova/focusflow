<script lang="ts">
    import {onMount} from "svelte";
    import {Save} from "lucide-svelte";

    export let taskId: number;

    let title: string = '';
    let teaser: string = '';
    let description: string = '';
    let dueDate: string = '';

    let displaySuccess: boolean = false;

    // Load the task data on mount
    onMount(() => {
        (async () => {
            try {
                const res = await fetch(`/api/tasks/${taskId}`);
                const task = await res.json();
                title = task.title;
                teaser = task.teaser;
                description = task.description;
                dueDate = task.dueDate
                    ? new Date(new Date(task.dueDate).getTime() - new Date(task.dueDate).getTimezoneOffset() * 60000)
                        .toISOString().substring(0, 16)
                    : ''; // Format to 'YYYY-MM-DDTHH:MM' with correct timezone
            } catch (err) {
                console.error("Failed to load task.");
            }
        })();
    });

    // Update the task via PUT request
    async function updateTask(): Promise<void> {
        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, teaser, description, dueDate })
            });
            if (res.ok) {
                displaySuccess = true;
                setTimeout(() => {
                    displaySuccess = false;
                }, 3000);
            } else {
                console.error("Failed to update task.");
            }
        } catch (err) {
            console.error("Failed to update task:", err);
        }
    }
</script>

<!-- Update Task Form -->
<form on:submit|preventDefault={updateTask} class="container mx-auto">
    <div class="card md:card-side bg-base-100 shadow-xl">
        <div class="card-body">
            <div class="form-control mb-4">
                <input
                        id="updateTaskTitle"
                        type="text"
                        bind:value={title}
                        class="input input-ghost"
                        required
                />
            </div>
            <div class="form-control mb-4">
                <input
                        id="updateTaskTeaser"
                        type="text"
                        bind:value={teaser}
                        class="input input-ghost"
                        required
                />
            </div>
            <div class="form-control mb-4">
                <textarea
                        id="updateTaskDescription"
                        bind:value={description}
                        class="input input-ghost"
                        required
                ></textarea>
            </div>
            <div class="form-control mb-4">
                <input
                        id="updateTaskDueDate"
                        bind:value={dueDate}
                        type="datetime-local"
                        class="input input-ghost"
                />
            </div>
            <div class="form-control flex justify-end">
                <button type="submit" class="btn btn-primary">
                    <Save />
                </button>
            </div>
        </div>
    </div>
</form>

{#if displaySuccess}
    <div class="alert alert-success mt-4">
        <span>Task updated successfully!</span>
    </div>
{/if}