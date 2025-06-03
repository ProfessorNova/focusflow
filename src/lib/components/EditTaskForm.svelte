<script lang="ts">
    import { onMount } from "svelte";
    import { Save } from "lucide-svelte";
    import TaskForm from "./TaskForm.svelte";

    let { updateSuccess = $bindable(false), ...props } = $props();

  let taskId: number = props.taskId;
  $effect(() => {
    if (props.checkSavings == true) {
      // Handle event when modal closes
      LoadTaskData();
    }
  });
  let title: string = $state("");
  let teaser: string = $state("");
  let description: string = $state("");
  let dueDate: string = $state("");
  let priority: string = $state("");
  let tags: string[] = $state([]);

  async function LoadTaskData() {
    try {
      const res = await fetch(`/api/tasks/${taskId}`);
      const task = await res.json();
      title = task.title;
      teaser = task.teaser;
      description = task.description;
      dueDate = task.dueDate
        ? new Date(new Date(task.dueDate).getTime() - new Date(task.dueDate).getTimezoneOffset() * 60000)
          .toISOString().substring(0, 16)
        : ""; // Format to 'YYYY-MM-DDTHH:MM' with correct timezone
      priority = task.priority;
      tags = task.tags;
    } catch (err) {
      console.error("Failed to load task.");
    }
  }

  // Load the task data on mount
  onMount(() => {
    LoadTaskData();
  });

  // Update the task via PUT request
  async function updateTask(): Promise<void> {
    try {
      console.log(priority);
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, teaser, description, dueDate, priority, tags })
      });
      if (res.ok) {
        updateSuccess = true;
        setTimeout(() => {
          updateSuccess = false;
        }, 5000);
      } else {
        console.error("Failed to update task.");
      }
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  }
</script>

<!-- Update Task Form -->
<form onsubmit={updateTask} class="container mx-auto">
  <div class="card md:card-side bg-base-100">
    <div class="card-body">
      <TaskForm bind:title={title} bind:teaser={teaser} bind:description={description}
                bind:dueDate={dueDate} bind:priority={priority} bind:tags={tags} />
      <div class="form-control flex justify-end">
        <button type="submit" class="btn btn-primary"
          data-testid="EditTaskFormSave"
        >
          <Save />
        </button>
      </div>
    </div>
  </div>
</form>

