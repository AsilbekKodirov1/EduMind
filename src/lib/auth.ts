import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
const secret = process.env.AUTH_SECRET;
if (process.env.NODE_ENV === "production" && !secret) throw new Error("AUTH_SECRET must be configured in production.");
const key = new TextEncoder().encode(secret || "development-secret-change-before-deploy");
export type SessionUser = { id: string; name: string; email: string; role: "ADMIN" | "TEACHER" | "STUDENT" };
export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key);
  (await cookies()).set("edumind_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get("edumind_session")?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, key)).payload as unknown as SessionUser; } catch { return null; }
}
export async function clearSession() { (await cookies()).delete("edumind_session"); }

