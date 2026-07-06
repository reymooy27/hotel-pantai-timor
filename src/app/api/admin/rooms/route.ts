import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { asNullableString, asNumber, ensureAdminRequest } from "@/lib/admin-api";
import { createAdminClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const authError = ensureAdminRequest(request);

  if (authError) {
    return authError;
  }

  const supabase = createAdminClient();
  const result = await supabase.from("rooms").select("*").order("name");

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json(result.data);
}

export async function PATCH(request: NextRequest) {
  const authError = ensureAdminRequest(request);

  if (authError) {
    return authError;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const id = asNullableString(body?.id);

  if (!body || !id) {
    return NextResponse.json({ error: "Room id is required" }, { status: 400 });
  }

  const update = {
    description: body.description === undefined ? undefined : asNullableString(body.description),
    is_active:
      typeof body.is_active === "boolean" ? body.is_active : undefined,
    name: body.name === undefined ? undefined : asNullableString(body.name),
    price_high_season:
      body.price_high_season === undefined ? undefined : asNumber(body.price_high_season),
    price_weekday:
      body.price_weekday === undefined ? undefined : asNumber(body.price_weekday),
    price_weekend:
      body.price_weekend === undefined ? undefined : asNumber(body.price_weekend),
    updated_at: new Date().toISOString(),
  };

  const supabase = createAdminClient();
  const result = await supabase
    .from("rooms")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json(result.data);
}
