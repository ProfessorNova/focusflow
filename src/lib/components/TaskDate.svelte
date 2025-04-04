<script lang="ts">
    import {onMount} from "svelte";

    export let taskId: number;

    let dueDate: string = '';
    $: formattedDate = dueDate ? new Date(dueDate).toLocaleString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
    $: dueClass = (() => {
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
    })();

    onMount(() => {
        (async () => {
            try {
                const res = await fetch(`/api/tasks/${taskId}`);
                const task = await res.json();
                dueDate = task.dueDate;
            } catch (err) {
                console.error("Failed to load task.");
            }
        })();
    });
</script>

<div class={dueClass}>
    Due: {formattedDate}
</div>