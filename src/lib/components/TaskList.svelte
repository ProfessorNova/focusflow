<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { ListPlus, Pencil, Trash2 } from "lucide-svelte";
  import TaskEditModal from "$lib/components/TaskEditModal.svelte";
  import EditTaskForm from "$lib/components/EditTaskForm.svelte";
  import TaskDate from "$lib/components/TaskDate.svelte";
  import Banner from "./Banner.svelte";
  import TaskForm from "./TaskForm.svelte";
  import TaskStatusSelection from "$lib/components/TaskStatusSelection.svelte";

  // Global import of passed parameters
  let props = $props();
  // export let userId: number;
  let userId: number = props.userId;

  let tasks: Array<{
    id: number,
    title: string,
    teaser: string,
    description: string,
    dueDate: string | null,
    priority: string,
    status: string,
    tags: string[]
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
  let description: string = $state("");
  let dueDate: string = $state("");
  let priority: string = $state("Low");
  let tags: string[] = $state([]);

  async function createTask(title: string, teaser: string,  description: string,
                            dueDate: string, priority: string, tags: string[]): Promise<void> {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, title, teaser, description, dueDate, priority, tags })
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
        method: "DELETE"
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
    <div class="border border-info rounded-lg p-4 text-center">
      <span>Everything done!</span>
    </div>
  {:else}
    <!-- List of tasks with collapsible descriptions -->
    <ul class="list bg-base-100 rounded-box">
      {#each tasks as task (task.id)}
        <li id="{task.id.toString()}" class="flex p-2 rounded-xl items-center justify-between"
            transition:fly={{x: 50, duration: 300}}>
          <div class="flex gap-2 items-center">
            <TaskStatusSelection taskId={task.id} status={task.status} />
            <div>
              <div data-testid="TaskListTitle">{task.title}</div>
              <div class="text-xs uppercase font-semibold opacity-60" data-testid="TaskListTeaser">{task.teaser}</div>
              <TaskDate taskId={task.id} update={editTaskSuccess} />
            </div>
          </div>
          <div class="flex gap-2">
            <TaskEditModal bind:modalClosed={taskModalClosed} close={editTaskSuccess}>
              {#snippet Icon()}
                <Pencil slot="icon" />
              {/snippet}
              {#snippet Content(onCloseFn: Function)}
                <EditTaskForm slot="content" checkSavings={taskModalClosed} taskId={task.id}
                              bind:updateSuccess={editTaskSuccess} onclose={onCloseFn}/>
              {/snippet}
            </TaskEditModal>
            <button class="btn btn-square btn-ghost" title="Delete task" onclick={() => deleteTask(task.id)}>
              <Trash2 />
            </button>
          </div>
        </li>
        <div class="divider my-1"></div>
      {/each}
    </ul>
  {/if}

  <!-- Form for creating a new task -->
  <form class="mt-4 card bg-base-100 p-4 gap-4 flex-row justify-center items-end"
        onsubmit={() => {
          createTask(title, teaser, description, dueDate, priority, tags);
        }}>
    <TaskForm bind:title={title} bind:teaser={teaser} bind:description={description}
              bind:dueDate={dueDate} bind:priority={priority} bind:tags={tags} />
    <div class="form-control">
      <button type="submit" class="btn btn-primary"
        data-testid="TaskListCreate"
      >
        <ListPlus />
      </button>
    </div>
  </form>
</div>
