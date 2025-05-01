import {writable} from "svelte/store";
import {PrismaClient} from "../../../generated/prisma";

export const prismaClient = writable(PrismaClient);
