<script lang="ts">
    import {onMount} from "svelte";
    import {fly} from "svelte/transition";
    import {ListPlus, Pencil, Trash2} from "lucide-svelte";
    import Modal from "$lib/components/Modal.svelte";
    import EditTaskForm from "$lib/components/EditTaskForm.svelte";
    import TaskDate from "$lib/components/TaskDate.svelte";
    import Banner from "./Banner.svelte";
    import TaskEditor from "./TaskEditor.svelte";

    // Global import of passed parameters
    let props = $props();
    // export let userId: number;
    let userId: number = props.userId;

    let tasks: Array<{
        id: number,
        title: string,
        teaser: string,
        tag: string[],
        description: string,
        // changed: boolean,
    }> = $state([]);
    // New form of declaring variables in runes version (cant mix old with new syntax)
    // Also updates UI when changed is implemented
    let error: string | null = $state("");
    let editTaskSuccess = $state(false);
    let taskModalClosed = $state(false);

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

    let title: string = $state("");
    let teaser: string = $state("");
    let tags: string[] = $state([]);
    let description: string = $state("");

    /**
     * Creates a new task by sending a POST request.
     *
     * @param {string} title - The title of the task.
     * @param {string} teaser - The teaser of the task.
     * @param {string[]} tags - The tags of the task.
     * @param {string} description - The description of the task.
     * @returns {Promise<void>}
     */
    async function createTask(title: string, teaser: string, tags: string[], description: string): Promise<void> {
        const assignee = "User";
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title, teaser, tags, description, userId, assignee})
            });
            if (res.ok) {
                const newTask = await res.json();
                tasks.unshift(newTask); // = [...tasks, newTask];
                // To directly sort tasks call refreshTasks
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

    /**
     * Refreshes the task list by re-fetching from the server.
     */
    async function refreshTasks(): Promise<void> {
        error = null;
        try {
            const res = await fetch(`/api/tasks?userId=${userId}`);
            tasks = await res.json();
            // console.log(tasks)
        } catch (err) {
            error = "Failed to refresh tasks.";
        }
    }
    
</script>


{#if editTaskSuccess}
    <Banner>
        <p class="text-success">Task updated successfully!</p>
    </Banner>
{/if}
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
                <!-- id to identify changed task | class property (list-row) does weird things | transition:fly={{x: 50, duration: 300}} -->
                <li id="{task.id.toString()}" class="flex p-2 rounded-xl items-center justify-between" transition:fly={{x: 50, duration: 300}}>
                    <div class="flex gap-2 items-center">
                        <div>
                            <div>{task.title}</div>
                            <div class="text-xs uppercase font-semibold opacity-60">{task.teaser}</div>
                            <TaskDate taskId={task.id} update={editTaskSuccess}/>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <Modal bind:modalClosed={taskModalClosed} close={editTaskSuccess}>
                            <Pencil slot="icon" />
                            <EditTaskForm slot="content" checkSavings={taskModalClosed} taskId={task.id} bind:updateSuccess={editTaskSuccess}/>
                        </Modal>
                        <button class="btn btn-square btn-ghost" title="Delete task" onclick={() => deleteTask(task.id)}>
                            <Trash2/>
                        </button>
                    </div>
                </li>
                <div class="divider my-1"></div>
            {/each}
        </ul>
    {/if}

    <!-- Form for creating a new task -->
    <form class="mt-4 card bg-base-100 shadow-xl p-4 gap-4 flex-row justify-center items-end"
          onsubmit={() => createTask(title, teaser, tags, description)}>
        <TaskEditor bind:title={title} bind:teaser={teaser} bind:tags={tags} bind:description={description}/>
        <div class="form-control">
            <button type="submit" class="btn btn-primary">
                <ListPlus/>
            </button>
        </div>
    </form>
</div>
