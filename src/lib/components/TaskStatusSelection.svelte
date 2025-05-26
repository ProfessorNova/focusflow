<script lang="ts">
  import { onMount } from "svelte";
  import { Circle, CircleCheck, CircleDot, Target } from "lucide-svelte";

  let { statusChanged = $bindable(), ...props } = $props();

  let taskId: number = props.taskId;
  let status: string = $state("");
  let oldStatus: string = $state("");

  onMount(() => {
    (async () => {
      try {
        const res = await fetch(`/api/tasks/${taskId}`);
        const task = await res.json();
        status = task.status;
        oldStatus = status;
      } catch (err) {
        console.error("Failed to load task.");
      }
    })();
  });

  async function updateTask(): Promise<void> {
    if(oldStatus == status) {
      return;
    } else {
      statusChanged = true;
      oldStatus = status;
    }
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        statusChanged = false;
      } else {
        console.error("Failed to update task.");
      }
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  }
</script>

<div class="dropdown dropdown-bottom">
  <div tabindex="0" role="button" class="btn btn-ghost btn-circle" title="{status}">
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
  <ul id="TaskStatusList"
      class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm {statusChanged ? `hidden` : ``}">
    <li>
      <button type="button" onclick={() => { status = "Open"; updateTask();}}>Open</button>
    </li>
    <li>
      <button type="button" onclick={() => { status = "Pending"; updateTask();}}>Pending</button>
    </li>
    <li>
      <button type="button" onclick={() => { status = "InReview"; updateTask();}}>InReview</button>
    </li>
    <li>
      <button type="button" onclick={() => { status = "Closed"; updateTask();}}>Closed</button>
    </li>
  </ul>
</div>