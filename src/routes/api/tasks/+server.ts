import {json, type RequestHandler} from '@sveltejs/kit';
import {createTask, getTasksByUserId} from '$lib/server/objects/task';

export const GET: RequestHandler = async ({url}) => {
    const userId = Number(url.searchParams.get('userId'));
    if (!userId) {
        return new Response(JSON.stringify({error: 'Invalid or missing userId'}), {status: 400});
    }
    try {
        const tasks = await getTasksByUserId(userId);
        return json(tasks);
    } catch (error) {
        return new Response(JSON.stringify({error: 'Internal server error'}), {status: 500});
    }
};

export const POST: RequestHandler = async ({request}) => {
    const {
        title,
        assignee,
        userId,
        teamId,
        teaser,
        description,
        dueDate,
        priority,
        tags,
        status
    } = await request.json();
    console.log("POST request received with data:", {
        title,
        assignee,
        userId,
        teamId,
        teaser,
        description,
        dueDate,
        priority,
        tags,
        status
    });
    try {
        const task = await createTask(title, assignee, userId, teamId, teaser, description, dueDate, priority, tags, status);
        return json(task);
    } catch (error) {
        return new Response(JSON.stringify({error: 'Internal server error'}), {status: 500});
    }
}