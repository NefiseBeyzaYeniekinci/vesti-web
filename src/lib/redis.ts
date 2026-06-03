import { Redis } from "@upstash/redis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

// Create a singleton instance to avoid exhausting connections in development
export const redis =
  globalForRedis.redis ??
  new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  });

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

export async function getWeatherCache(city: string) {
  try {
    return await redis.get(`weather:${city.toLowerCase()}`);
  } catch (error) {
    console.warn("Redis get error:", error);
    return null;
  }
}

export async function setWeatherCache(city: string, data: unknown) {
  try {
    // Cache for 15 minutes (900 seconds)
    await redis.set(`weather:${city.toLowerCase()}`, data, { ex: 900 });
  } catch (error) {
    console.warn("Redis set error:", error);
  }
}
