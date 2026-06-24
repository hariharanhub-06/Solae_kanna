import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "admin_session";
const ALG = "HS256";

export type Role = "ADMIN" | "SUPERADMIN";

export type SessionUser = {
  userId: string;
  email: string;
  name: string;
  role: Role;
  mustChange: boolean;
};

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

/** Create a signed session token (valid 7 days) carrying the user's identity & role. */
export async function createSessionToken(user: {
  id: string;
  email: string;
  name: string;
  role: string;
  mustChangePassword: boolean;
}): Promise<string> {
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
    mch: user.mustChangePassword,
  })
    .setProtectedHeader({ alg: ALG })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

/** Verify a token and return its claims, or null if invalid. Edge & node safe. */
export async function verifyToken(token: string | undefined): Promise<SessionUser | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: [ALG] });
    return {
      userId: String(payload.sub || ""),
      email: String(payload.email || ""),
      name: String(payload.name || ""),
      role: payload.role === "SUPERADMIN" ? "SUPERADMIN" : "ADMIN",
      mustChange: payload.mch === true,
    };
  } catch {
    return null;
  }
}

/** Generate a readable temporary password, e.g. "Solar-7K2Q4M". */
export function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let s = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const b of bytes) s += chars[b % chars.length];
  return `Solar-${s}`;
}
