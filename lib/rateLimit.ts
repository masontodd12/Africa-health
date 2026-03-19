// lib/rateLimit.ts
// Uses Upstash Redis via fetch — no SDK needed, works on Vercel Edge.
// Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in your .env

const WINDOW_SECONDS = 60;       // 1 minute window
const MAX_REQUESTS   = 5;        // 5 assessments per IP per minute
const DAILY_MAX      = 30;       // 30 per IP per day

async function redisCommand(command: string[]): Promise<unknown> {
  const url  = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // If Redis isn't configured, skip rate limiting (dev mode)
  if (!url || !token) return null;

  const res = await fetch(`${url}/${command.map(encodeURIComponent).join("/")}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = await res.json() as { result: unknown };
  return data.result;
}

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  try {
    const minuteKey = `rl:m:${ip}`;
    const dayKey    = `rl:d:${ip}`;

    // Increment minute counter
    const minuteCount = await redisCommand(["INCR", minuteKey]) as number;
    if (minuteCount === 1) await redisCommand(["EXPIRE", minuteKey, String(WINDOW_SECONDS)]);

    // Increment day counter
    const dayCount = await redisCommand(["INCR", dayKey]) as number;
    if (dayCount === 1) await redisCommand(["EXPIRE", dayKey, "86400"]);

    if (minuteCount > MAX_REQUESTS) {
      const ttl = await redisCommand(["TTL", minuteKey]) as number;
      return { allowed: false, retryAfter: ttl };
    }
    if (dayCount > DAILY_MAX) {
      return { allowed: false, retryAfter: 3600 };
    }

    return { allowed: true };
  } catch {
    // If Redis fails, allow the request (fail open — health app)
    return { allowed: true };
  }
}

export function getIP(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}