import { Redis } from '@upstash/redis';
import { THROTTLE_WINDOW } from './utils';

const redis = Redis.fromEnv();

/**
 * Used to throttle posting from the same IP
 * @param ip string
 * @returns object indicating whether the IP is rate-limited:
 *  - `limited` (boolean): true if rate-limited, false otherwise
 *  - `retryAfterSeconds` (number | undefined): seconds until limit resets (if rate-limited)
 */
export async function checkRateLimit(ip: string) {
  const key = `ratelimit:${ip}`;

  // Try to set the key with expiration only if it doesn't exist
  const wasSet = await redis.set(key, Date.now(), { nx: true, ex: THROTTLE_WINDOW });

  if (!wasSet) {
    const ttl = await redis.ttl(key);
    return {
      limited: true,
      retryAfterSeconds: ttl,
    };
  }

  return { limited: false };
}