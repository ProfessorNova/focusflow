import type {
  $Enums,
  PrismaClient,
  Tag,
  TaskPriority,
  TaskStatus,
} from "@prisma/client";
import { prismaClient } from "$lib/server/stores/prismaStore";

let prisma: PrismaClient;
prismaClient.subscribe((value) => {
  prisma = value;
});

/**
 * Creates a new task in the database.
 *
 * This function creates a new task record with the provided details.
 * Default values are used for teaser, description, dueDate, priority, tags, and status if not provided.
 *
 * @param {string} title - The title of the task.
 * @param {number} [userId] - (Optional) The unique identifier of the user to whom the task is assigned.
 * @param {number} [teamId] - (Optional) The unique identifier of the team to which the task is assigned.
 * @param {string} [teaser="No teaser"] - (Optional) A brief teaser or summary of the task.
 * @param {string} [description="No description"] - (Optional) A detailed description of the task.
 * @param {Date} [dueDate=new Date(new Date().setHours(23, 59, 59, 999))] - (Optional) The due date of the task. Defaults to the current date with time set to 23:59:59.999.
 * @param {TaskPriority} [priority="Low"] - (Optional) The priority level of the task.
 * @param {Tag[]} [tags=[]] - (Optional) An array of tags associated with the task.
 * @param {TaskStatus} [status="Open"] - (Optional) The current status of the task.
 * @param {boolean} [changed=false] - (Optional) Indicates whether the task has been changed.
 * @returns {Promise<Task>} A promise that resolves to the newly created Task object.
 */
export async function createTask(
  title: string,
  userId?: number,
  teamId?: number,
  teaser: string = "No teaser",
  description: string = "No description",
  dueDate: Date = new Date(new Date().setHours(23, 59, 59, 999)),
  priority: TaskPriority = "Low",
  tags: Tag[] = [],
  status: TaskStatus = "Open",
  changed: boolean = false,
): Promise<Task> {
  return prisma.task.create({
    data: {
      title,
      teaser,
      description,
      dueDate,
      priority,
      tags,
      status,
      changed,
      userId,
      teamId,
    },
  });
}

/**
 * Retrieves a task by its unique identifier.
 *
 * This function queries the database for a task that matches the provided taskId.
 *
 * @param {number} taskId - The unique identifier of the task to be retrieved.
 * @returns {Promise<Task | null>} A promise that resolves to the Task object if found, or null if not found.
 */
export async function getTask(taskId: number): Promise<Task | null> {
  return prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });
}

/**
 * Retrieves all tasks associated with a specific user.
 *
 * This function queries the database for tasks that have the specified userId.
 *
 * @param {number} userId - The unique identifier of the user whose tasks are to be retrieved.
 * @returns {Promise<Task[]>} A promise that resolves to an array of Task objects.
 */
export async function getTasksByUserId(userId: number): Promise<Task[]> {
  return prisma.task.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      status: "asc",
    },
  });
}

/**
 * Retrieves all tasks associated with a specific team.
 *
 * This function queries the database for tasks that have the specified teamId.
 *
 * @param {number} teamId - The unique identifier of the team whose tasks are to be retrieved.
 * @returns {Promise<Task[]>} A promise that resolves to an array of Task objects.
 */
export async function getTasksByTeamId(teamId: number): Promise<Task[]> {
  return prisma.task.findMany({
    where: {
      teamId: teamId,
    },
    orderBy: {
      status: "asc",
    },
  });
}

/**
 * Updates an existing task in the database.
 *
 * This function updates the task record that matches the provided taskId with the new data.
 *
 * @param {number} taskId - The unique identifier of the task to be updated.
 * @param {Partial<Task>} data - An object containing the fields to be updated.
 * @returns {Promise<Task>} A promise that resolves to the updated Task object.
 */
export async function updateTask(
  taskId: number,
  data: Partial<Task>,
): Promise<Task> {
  return prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      ...data,
    },
  });
}

/**
 * Deletes a task from the database.
 *
 * This function deletes the task record that matches the provided taskId.
 *
 * @param {number} taskId - The unique identifier of the task to be deleted.
 * @returns {Promise<Task>} A promise that resolves to the deleted Task object.
 */
export async function deleteTask(taskId: number): Promise<Task> {
  return prisma.task.delete({
    where: {
      id: taskId,
    },
  });
}

/**
 * Represents a task entity.
 *
 * @interface Task
 * @property {number} id - The unique identifier of the task.
 * @property {string} title - The title of the task.
 * @property {string} teaser - A brief summary or teaser for the task.
 * @property {string} description - A detailed description of the task.
 * @property {Date} dueDate - The due date of the task.
 * @property {TaskPriority} priority - The priority level of the task.
 * @property {Tag[]} tags - An array of tags associated with the task.
 * @property {TaskStatus} status - The current status of the task.
 * @property {boolean} changed - Will change for a short time when task updates.
 */
export interface Task {
  id: number;
  title: string;
  teaser: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  tags: Tag[];
  status: TaskStatus;
  changed: boolean;
}

// Additional object of the actual interface to test functions
export class TTask implements Task {
  id: number;
  title: string;
  teaser: string;
  description: string;
  dueDate: Date;
  priority: $Enums.TaskPriority;
  tags: $Enums.Tag[];
  status: $Enums.TaskStatus;
  changed: boolean;
  
  constructor(id: number, title: string, teaser: string, description: string, dueDate: Date | null, priority: $Enums.TaskPriority, tags: $Enums.Tag[], status: $Enums.TaskStatus, changed: boolean) {
    this.id = id;
    this.title = title;
    this.teaser = teaser;
    this.description = description;
    this.dueDate = dueDate ?? new Date(new Date().setHours(23, 59, 59, 999));
    this.priority = priority;
    this.tags = tags;
    this.status = status;
    this.changed = changed;
  }

  // Methods which can be tested with Unit Tests
  setDueDate(dueDate: Date): void {
    this.dueDate = dueDate;
  }
  IsTaskOverdue(date: Date = new Date()): boolean {
    return this.dueDate < date;
  }

  setChanged(changed: boolean): void {
    this.changed = changed;
    setTimeout(() => {
      this.changed = false;
    }, 5000); // Reset changed after 5 seconds
  }
}