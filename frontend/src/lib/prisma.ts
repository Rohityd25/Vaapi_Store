// Prisma 7 client with PostgreSQL driver adapter.
// Lazy initialization: does NOT crash at import time when DATABASE_URL is
// missing (needed so `next build` can complete on Vercel BEFORE the user
// has configured environment variables). The real client is created only
// on first query; if DATABASE_URL is still missing at query time, we throw
// a clear runtime error.
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

let _client: PrismaClient | null = null

function getRealClient(): PrismaClient {
  if (_client) return _client
  if (globalForPrisma.prisma) {
    _client = globalForPrisma.prisma
    return _client
  }
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not configured. Set it in your environment (locally in .env, or on Vercel → Project → Settings → Environment Variables) and redeploy.'
    )
  }
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  _client = new PrismaClient({ adapter })
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = _client
  return _client
}

// Proxy that defers instantiation. Any property access on `prisma`
// (e.g. `prisma.user.findUnique(...)`) triggers real client creation.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getRealClient(), prop, receiver)
  },
}) as PrismaClient
