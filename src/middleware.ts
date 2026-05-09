import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin/login";
  const isAdminAuthApi = pathname === "/api/admin/auth";

  if (!isAdminRoute || isAdminLoginPage || isAdminAuthApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const valid = token ? await verifyAdminToken(token) : false;

  if (!valid) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
