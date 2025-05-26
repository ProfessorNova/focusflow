<script lang="ts">
    import TaskTagList from "./TaskTagList.svelte";

    let {
      title = $bindable(""),
      teaser = $bindable(""),
      description = $bindable(""),
      dueDate = $bindable(""),
      priority = $bindable(""),
      tags = $bindable<string[]>([]),
      ...props
    } = $props();
</script>


<div class="grid grid-rows-5 grid-cols-2 gap-4 self-center">
  <div class="flex justify-center items-center col-1 row-1">
    <input
      id="taskTitle"
      type="text"
      placeholder="Task Title"
      bind:value={title}
      class="input input-bordered"
      required
    />
  </div>
  <div class="flex justify-center items-center col-1 row-2">
    <input
      id="taskTeaser"
      type="text"
      placeholder="Task Teaser"
      bind:value={teaser}
      class="input input-bordered"
    />
  </div>

  <div class="col-1 row-start-3 row-span-2 flex justify-center items-center h-full">
        <textarea
          id="taskDescription"
          placeholder="Task Description"
          bind:value={description}
          class="textarea"
          rows="3"
        ></textarea>
  </div>

  <div class="col-1 row-5 flex justify-center items-center h-full">
    <input
      id="updateTaskDueDate"
      bind:value={dueDate}
      type="datetime-local"
      class="input"
    />
  </div>

  <div class="flex justify-center items-center">
    <select
      id="taskPriority"
      bind:value={priority}
      class="select select-bordered w-full max-w-xs"
    >
      <option value="" disabled selected>Select Priority</option>
      <option value="Low">Low</option>
      <option value="Mid">Mid</option>
      <option value="High">High</option>
    </select>
  </div>

  <div class="flex justify-center items-center col-2 row-start-2 row-span-4 max-h-80">
    <TaskTagList bind:tags={tags} />
  </div>
</div>


        
        