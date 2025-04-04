import { json, type RequestHandler } from "@sveltejs/kit";
import { deleteTask } from "$lib/server/objects/task";

export const DELETE: RequestHandler = async ({ params }) => {
  const taskId = Number(params.id);
  if (!taskId) {
    return new Response(JSON.stringify({ error: "Invalid taskId" }), {
      status: 400,
    });
  }
  try {
    const deletedTask = await deleteTask(taskId);
    return json(deletedTask);
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
