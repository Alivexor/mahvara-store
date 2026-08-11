import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit = Number(process.env.RATE_LIMIT_MAX ?? 10), windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000)) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) { buckets.set(key, { count: 1, resetAt: now + windowMs }); return { allowed: true, remaining: limit - 1 }; }
  bucket.count += 1;
  return { allowed: bucket.count <= limit, remaining: Math.max(0, limit - bucket.count) };
}

export function requestFingerprint(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const value = forwarded ?? request.headers.get("x-real-ip") ?? "unknown";
  return createHash("sha256").update(`${value}:${process.env.AUTH_SECRET ?? "dev"}`).digest("hex").slice(0, 24);
}

export function hasTrustedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  try { return new URL(origin).host === request.nextUrl.host; } catch { return false; }
}
