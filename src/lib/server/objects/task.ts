import type {PrismaClient, Tag, TaskPriority, TaskStatus} from "@prisma/client";
import {prismaClient} from "$lib/server/stores/prismaStore";

let prisma: PrismaClient;
prismaClient.subscribe((value) => {
    prisma = value;
});

export async function getTasksByUserId(userId: number): Promise<Task[]> {
    return prisma.task.findMany({
        where: {
            userId: userId
        }
    });
}

export async function getTasksByTeamId(teamId: number): Promise<Task[]> {
    return prisma.task.findMany({
        where: {
            teamId: teamId
        }
    });
}

export async function createTask(
    title: string,
    userId?: number,
    teamId?: number,
    teaser: string = "No teaser",
    description: string = "No description",
    dueDate: Date = new Date(new Date().setHours(23, 59, 59, 999)),
    priority: TaskPriority = "Low",
    tags: Tag[] = [],
    status: TaskStatus = "Open"
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
            userId,
            teamId,
        }
    });
}

export async function deleteTask(taskId: number): Promise<Task> {
    return prisma.task.delete({
        where: {
            id: taskId,
        }
    });
}

export interface Task {
    id: number;
    title: string;
    teaser: string;
    description: string;
    dueDate: Date;
    priority: TaskPriority;
    tags: Tag[];
    status: TaskStatus;
}