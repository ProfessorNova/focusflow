<script lang="ts">
    import TaskTagList from "./TaskTagList.svelte";


    let { title = $bindable(""), 
        teaser = $bindable(""), 
        tags = $bindable<string[]>([]), 
        description = $bindable(""), 
        dueDate = $bindable(""), ...props 
    } = $props();

</script>


<div class="grid grid-rows-5 grid-cols-2 gap-4  self-center">
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
            required
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

    <div class="col-2 row-1 flex justify-center items-center h-full w-full">
        <select class="select select-neutral w-full">
            <option disabled selected class="font-bold">Task priority</option>
            <option>North America</option>
            <option>EU west</option>
            <option>South East Asia</option>
        </select>
    </div>
    
    <div class="flex justify-center items-center col-2 row-start-2 row-span-4 max-h-80">
        <TaskTagList bind:tags={tags}/>
    </div>
</div>


        
        