import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifyToken } from "@/lib/auth";

// Protect all /admin routes (except the login page). Also force users with a
// temporary password to change it before doing anything else.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isChangePw = pathname === "/admin/change-password";

  const user = await verifyToken(req.cookies.get(SESSION_COOKIE)?.value);

  // Not authenticated → must log in.
  if (!user) {
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
  if (user.mustChange && !isChangePw) {
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
