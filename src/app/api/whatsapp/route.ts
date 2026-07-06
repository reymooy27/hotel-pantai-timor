import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { asNullableString, ensureAdminRequest } from "@/lib/admin-api";

export async function POST(request: NextRequest) {
  const authError = ensureAdminRequest(request);

  if (authError) {
    return authError;
  }

  const body = (await request.json().catch(() => null)) as
    | { message?: string; phone?: string }
    | null;

  const phone = asNullableString(body?.phone);
  const message = asNullableString(body?.message);

  if (!phone || !message) {
    return NextResponse.json(
      { error: "phone and message are required" },
      { status: 400 }
    );
  }

  const normalizedPhone = phone.replace(/\D/g, "");
  const endpoint = `${process.env.WAHA_API_URL ?? "http://localhost:3000"}/api/sendText`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chatId: `${normalizedPhone}@c.us`,
      session: "default",
      text: message,
    }),
  });

  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    return NextResponse.json(
      { error: "WAHA request failed", payload },
      { status: response.status }
    );
  }

  return NextResponse.json({ ok: true, payload });
}
