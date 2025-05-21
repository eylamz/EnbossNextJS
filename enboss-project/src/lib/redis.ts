import { Redis } from '@upstash/redis'

if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
  throw new Error('Redis environment variables are not defined')
}

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
})

// Set a value with expiration (in seconds)
export const setCache = async <T>(key: string, value: T, expireInSeconds = 3600): Promise<void> => {
  await redis.set(key, JSON.stringify(value), { ex: expireInSeconds })
}

// Get a cached value
export const getCache = async <T>(key: string): Promise<T | null> => {
  const data = await redis.get<string>(key)
  return data ? JSON.parse(data) as T : null
}

// Delete a cached value
export const deleteCache = async (key: string): Promise<void> => {
  await redis.del(key)
}

// Delete multiple cached values by pattern
export const deleteCacheByPattern = async (pattern: string): Promise<void> => {
  const keys = await redis.keys(pattern)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}

export default redis