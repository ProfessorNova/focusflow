import {json, type RequestHandler} from '@sveltejs/kit';
import {deleteTask, getTask, updateTask} from '$lib/server/objects/task';

export const GET: RequestHandler = async ({params}) => {
    const taskId = Number(params.id);
    if (!taskId) {
        return new Response(JSON.stringify({error: "Invalid taskId"}), {status: 400});
    }
    try {
        const task = await getTask(taskId);
        if (!task) {
            return new Response(JSON.stringify({error: "Task not found"}), {status: 404});
        }
        return json(task);
    } catch (error) {
        return new Response(JSON.stringify({error: "Internal server error"}), {status: 500});
    }
}

export const PUT: RequestHandler = async ({ request, params }) => {
    const taskId = Number(params.id);
    if (!taskId) {
        return new Response(JSON.stringify({ error: "Invalid taskId" }), { status: 400 });
    }
    try {
        const data = await request.json();
        if (data.dueDate) {
            data.dueDate = new Date(data.dueDate);
        }
        const updatedTask = await updateTask(taskId, data);
        if (!updatedTask) {
            return new Response(JSON.stringify({ error: "Task not found" }), { status: 404 });
        }
        return json(updatedTask);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({params}) => {
    const taskId = Number(params.id);
    if (!taskId) {
        return new Response(JSON.stringify({error: "Invalid taskId"}), {status: 400});
    }
    try {
        const deletedTask = await deleteTask(taskId);
        return json(deletedTask);
    } catch (error) {
        return new Response(JSON.stringify({error: "Internal server error"}), {status: 500});
    }
};