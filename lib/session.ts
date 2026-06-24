import { cookies } from "next/headers";
import { SESSION_COOKIE, verifyToken, type SessionUser } from "./auth";

/** Read & verify the session cookie (server components / route handlers, NODE runtime). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSessionUser()) !== null;
}
