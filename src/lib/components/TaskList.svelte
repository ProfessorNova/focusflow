<script lang="ts">
    import {onMount} from "svelte";
    import {fly} from "svelte/transition";
    import {AlignJustify, ListPlus, Pencil, Trash2} from "lucide-svelte";

    export let userId: number;
    let tasks: Array<{ id: number; title: string; teaser: string, description: string }> = [];
    let error: string | null = null;

    /**
     * Lifecycle function to load tasks when the component mounts.
     */
    onMount(() => {
        (async () => {
            try {
                const res = await fetch(`/api/tasks?userId=${userId}`);
                tasks = await res.json();
            } catch (err) {
                error = "Failed to load tasks.";
            }
        })();
    });

    let title: string = '';
    let teaser: string = '';
    let description: string = '';

    /**
     * Creates a new task by sending a POST request.
     *
     * @param {string} title - The title of the task.
     * @param {string} teaser - The teaser of the task.
     * @param {string} description - The description of the task.
     * @returns {Promise<void>}
     */
    async function createTask(title: string, teaser: string, description: string): Promise<void> {
        const assignee = "User";
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title, teaser, description, userId, assignee})
            });
            if (res.ok) {
                const newTask = await res.json();
                tasks = [...tasks, newTask];
            } else {
                error = "Failed to create task.";
            }
        } catch (err) {
            error = "Failed to create task.";
        }
    }

    /**
     * Deletes an existing task by sending a DELETE request.
     *
     * @param {number} taskId - The ID of the task to delete.
     * @returns {Promise<void>}
     */
    async function deleteTask(taskId: number): Promise<void> {
        try {
            const res = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                tasks = tasks.filter(task => task.id !== taskId);
            } else {
                error = "Failed to delete task.";
            }
        } catch (err) {
            error = "Failed to delete task.";
        }
    }
</script>

<div class="container mx-auto p-4">
    <!-- Display error or empty state -->
    {#if error}
        <div class="alert alert-error">
            <span>{error}</span>
        </div>
    {:else if tasks.length === 0}
        <div class="alert alert-info">
            <span>No tasks available.</span>
        </div>
    {:else}
        <!-- List of tasks with collapsible descriptions -->
        <ul class="list bg-base-100 rounded-box shadow-md">
            {#each tasks as task (task.id)}
                <li class="list-row" transition:fly={{x: 50, duration: 300}}>
                    <div>
                        <AlignJustify/>
                    </div>
                    <div>
                        <div>{task.title}</div>
                        <div class="text-xs uppercase font-semibold opacity-60">{task.teaser}</div>
                    </div>
                    <button class="btn btn-square btn-ghost">
                        <Pencil/>
                    </button>
                    <button class="btn btn-square btn-ghost" on:click={() => deleteTask(task.id)}>
                        <Trash2/>
                    </button>
                </li>
            {/each}
        </ul>
    {/if}

    <!-- Form for creating a new task -->
    <form class="mt-4 card bg-base-100 shadow-xl p-4"
          on:submit|preventDefault={() => createTask(title, teaser, description)}>
        <div class="form-control mb-4">
            <input
                    id="taskTitle"
                    type="text"
                    placeholder="Task Title"
                    bind:value={title}
                    class="input input-bordered"
                    required
            />
        </div>
        <div class="form-control mb-4">
            <input
                    id="taskTeaser"
                    type="text"
                    placeholder="Task Teaser"
                    bind:value={teaser}
                    class="input input-bordered"
                    required
            />
        </div>
        <div class="form-control mb-4">
            <textarea
                    id="taskDescription"
                    placeholder="Task Description"
                    bind:value={description}
                    class="input input-bordered"
                    required
            ></textarea>
        </div>
        <div class="form-control">
            <button type="submit" class="btn btn-primary">
                <ListPlus/>
            </button>
        </div>
    </form>
</div>
