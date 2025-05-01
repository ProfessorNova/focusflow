import {writable} from "svelte/store";
import {PrismaClient} from "$lib/../generated/prisma";
// import {PrismaClient} from "@prisma/client";

import prisma from "$lib/prisma";

// const prisma = new PrismaClient();
export const prismaClient = writable(prisma);

// export const prismaClient = writable(PrismaClient);
