import {PrismaClient} from "../generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient().$extends(withAccelerate());

export default prisma;