// Server-only admin auth.
// The /admin panel is gated by the ADMIN_PASSCODE env var. On login the API
// route sets an http-only cookie holding a SHA-256 token derived from the
// passcode — the passcode itself never ships to the client.

import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "lumiere_admin";

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSCODE);
}

export function adminToken(): string {
  const passcode = process.env.ADMIN_PASSCODE ?? "";
  return createHash("sha256")
    .update(`lumiere-admin:${passcode}`)
    .digest("hex");
}

export function passcodeMatches(candidate: unknown): boolean {
  if (!adminConfigured() || typeof candidate !== "string") return false;
  const expected = process.env.ADMIN_PASSCODE as string;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  return Boolean(value) && value === adminToken();
}
