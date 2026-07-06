import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { ADMIN_COOKIE_NAME } from "@/lib/admin-config";

export const ADMIN_LOGIN_PATH = "/admin/login";

function getExpectedPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function isValidAdminPassword(password?: string | null) {
  const expected = getExpectedPassword();
  return Boolean(expected && password && password === expected);
}

export function parseBasicAuthPassword(header?: string | null) {
  if (!header?.startsWith("Basic ")) {
    return null;
  }

  try {
    const encoded = header.slice(6);
    const decoded =
      typeof atob === "function"
        ? atob(encoded)
        : Buffer.from(encoded, "base64").toString("utf8");
    const [, password = ""] = decoded.split(":");
    return password || null;
  } catch {
    return null;
  }
}

export async function hasAdminSession() {
  const cookieStore = await cookies();
  return isValidAdminPassword(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

export async function requireAdminSession() {
  if (!(await hasAdminSession())) {
    redirect(ADMIN_LOGIN_PATH);
  }
}

export function getAdminCookieOptions(maxAge = 60 * 60 * 12) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function requestHasAdminAccess(
  request: Pick<NextRequest, "cookies" | "headers">
) {
  const cookiePassword = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const basicPassword = parseBasicAuthPassword(
    request.headers.get("authorization")
  );

  return isValidAdminPassword(cookiePassword) || isValidAdminPassword(basicPassword);
}

export function getConfiguredAdminPassword() {
  return getExpectedPassword();
}
