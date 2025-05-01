import {PrismaClient} from "$lib/../generated/prisma";
import {beforeEach} from 'vitest'
import {mockDeep, mockReset} from 'vitest-mock-extended'

export const prismaMock = mockDeep<PrismaClient>()

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaClient = {
  subscribe: (cb: (p: PrismaClient) => void) => {
    cb(prismaMock)
    return () => {}
  }
}
