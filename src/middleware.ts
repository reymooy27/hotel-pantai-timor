import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ADMIN_LOGIN_PATH, requestHasAdminAccess } from "@/lib/admin-auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === ADMIN_LOGIN_PATH) {
    if (requestHasAdminAccess(request)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
  }

  if (requestHasAdminAccess(request)) {
    return NextResponse.next();
  }

  const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
