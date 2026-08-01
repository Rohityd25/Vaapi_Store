import IORedis from 'ioredis'

const globalForRedis = globalThis as unknown as {
  redis: IORedis | undefined
}

function createRedisClient(): IORedis {
  const url = process.env.REDIS_URL || 'redis://localhost:6379'
  const redis = new IORedis(url, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  })

  redis.on('error', (err) => {
    console.error('[Redis] Error:', err.message)
  })

  return redis
}

export const redis = globalForRedis.redis ?? createRedisClient()

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis
}

// ─── Cart helpers ─────────────────────────────────────────────────────────────

export const CART_TTL = 60 * 60 * 24 * 30 // 30 days

export async function getCartFromRedis(sessionId: string) {
  const data = await redis.get(`cart:${sessionId}`)
  return data ? JSON.parse(data) : null
}

export async function setCartInRedis(sessionId: string, cart: unknown) {
  await redis.set(`cart:${sessionId}`, JSON.stringify(cart), 'EX', CART_TTL)
}

export async function deleteCartFromRedis(sessionId: string) {
  await redis.del(`cart:${sessionId}`)
}

// ─── Rate limiting helpers ─────────────────────────────────────────────────────

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const current = await redis.incr(key)
  if (current === 1) {
    await redis.expire(key, windowSeconds)
  }
  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
  }
}
