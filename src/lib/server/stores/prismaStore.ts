import { writable } from "svelte/store";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const prismaClient = writable(prisma);
