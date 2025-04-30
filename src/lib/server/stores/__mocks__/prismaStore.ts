// src/lib/server/stores/__mocks__/prismaStore.ts
import { PrismaClient } from '@prisma/client'
import { beforeEach }    from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'

// 1) create one shared deep mock…
export const prismaMock = mockDeep<PrismaClient>()

// 2) reset between each test
beforeEach(() => {
  mockReset(prismaMock)
})

// 3) export a “fake” Svelte‐store whose .subscribe immediately yields the mock
export const prismaClient = {
  subscribe: (cb: (p: PrismaClient) => void) => {
    cb(prismaMock)
    return () => {}
  }
}
