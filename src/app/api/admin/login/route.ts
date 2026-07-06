import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  getAdminCookieOptions,
  getConfiguredAdminPassword,
  isValidAdminPassword,
} from "@/lib/admin-auth";
import { ADMIN_COOKIE_NAME } from "@/lib/admin-config";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { password?: string }
    | null;

  if (!getConfiguredAdminPassword()) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD is not configured" },
      { status: 500 }
    );
  }

  if (!isValidAdminPassword(body?.password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(
    ADMIN_COOKIE_NAME,
    body!.password!,
    getAdminCookieOptions()
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
