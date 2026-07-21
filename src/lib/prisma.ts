// Prisma 7 requires a driver adapter. We use @prisma/adapter-pg.
// Without DATABASE_URL, we return a mock-safe null client so the app
// still serves pages using hardcoded mock data.

let prismaInstance: any = null

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    // No DATABASE_URL — return a proxy that returns empty arrays so
    // all pages fall back to their built-in mock data gracefully.
    return new Proxy({} as any, {
      get: () =>
        new Proxy(() => Promise.resolve([]), {
          get: (_t, prop) => {
            if (prop === 'then') return undefined
            return () => Promise.resolve([])
          },
          apply: () => Promise.resolve([]),
        }),
    })
  }

  // Lazy import so the module doesn't crash at module-load time
  // when pg/adapter isn't available in the edge runtime.
  const { PrismaClient } = require('@prisma/client')
  const { PrismaPg } = require('@prisma/adapter-pg')
  const { Pool } = require('pg')

  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: any }

export const prisma: any = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
