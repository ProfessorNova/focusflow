<script lang="ts">
    import { onMount } from "svelte";

    
    let props = $props();
    
    let taskId: number = props.taskId;

    let dueDate: string = $state("");
    let formattedDate = $derived( dueDate ? 
        new Date(dueDate).toLocaleString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
        : ''
    );
    // derived.by creates complex derivations like functions
    let dueClass = $derived.by(() => {
        if (!dueDate) return '';
        const due = new Date(dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);
        if (due < today) {
            return 'text-error';
        } else if (due.getTime() === today.getTime()) {
            return 'text-warning';
        } else if (due > today) {
            return 'text-success';
        }
    });

    $effect(() => {
        if(props.update) {
            LoadDueDate();
        }
    });
    
    async function LoadDueDate() {
        try {
            const res = await fetch(`/api/tasks/${taskId}`);
            const task = await res.json();
            dueDate = task.dueDate;
        } catch (err) {
            console.error("Failed to load task.");
        }
    }
    onMount(() => {
        LoadDueDate();
    })
</script>

<div class={dueClass}>
    Due: {formattedDate}
</div>