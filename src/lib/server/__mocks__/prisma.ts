// src/lib/server/__mocks__/prisma.ts
import type { PrismaClient } from '@prisma/client'
import { beforeEach }        from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'

// 1️⃣ create a shared “deep” mock of PrismaClient
const prismaMock = mockDeep<PrismaClient>()

// 2️⃣ reset its state before each test
beforeEach(() => {
  mockReset(prismaMock)
})

// 3️⃣ default‐export the mock so Vitest will substitute it
export default prismaMock