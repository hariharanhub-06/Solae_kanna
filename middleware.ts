import { NextRequest, NextResponse } from "next/server";

// This middleware runs in the Edge runtime, so it must not import any module
// that pulls in Node-only APIs (e.g. jose's node build, next/headers). We verify
// the HS256 session JWT inline using the Edge-native Web Crypto API instead.

const SESSION_COOKIE = "admin_session";

function base64urlToBytes(input: string): Uint8Array {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

type Claims = { role?: string; mch?: boolean; exp?: number };

async function verifySession(token: string | undefined): Promise<Claims | null> {
  if (!token) return null;
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret) as BufferSource,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64urlToBytes(signature) as BufferSource,
      new TextEncoder().encode(`${header}.${payload}`) as BufferSource
    );
    if (!valid) return null;

    const claims = JSON.parse(new TextDecoder().decode(base64urlToBytes(payload))) as Claims;
    if (claims.exp && Date.now() / 1000 > claims.exp) return null;
    return claims;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isChangePw = pathname === "/admin/change-password";

  const claims = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);

  // Not authenticated → must log in.
  if (!claims) {
    if (isLogin) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated but on the login page → go to dashboard.
  if (isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Authenticated with a temporary password → force a password change first.
  if (claims.mch === true && !isChangePw) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/change-password";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
