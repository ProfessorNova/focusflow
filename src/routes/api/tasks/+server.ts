import { json, type RequestHandler } from "@sveltejs/kit";
import { createTask, getTasksByUserId } from "$lib/server/objects/task";

export const GET: RequestHandler = async ({ url }) => {
  const userId = Number(url.searchParams.get("userId"));
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Invalid or missing userId" }),
      { status: 400 },
    );
  }
  try {
    const tasks = await getTasksByUserId(userId);
    return json(tasks);
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  const {
    title,
    userId,
    teamId,
    teaser,
    description,
    dueDate,
    priority,
    tags,
    status,
  } = await request.json();
  try {
    const task = await createTask(
      title,
      userId,
      teamId,
      teaser,
      description,
      dueDate,
      priority,
      tags,
      status,
    );
    if(!task) {
      throw new Error("Failed to create a task");
    }
    return json(task);
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
