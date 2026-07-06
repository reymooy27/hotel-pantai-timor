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
  const result = await supabase
    .from("pricing_rules")
    .select("*")
    .order("date_from", { ascending: true });

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json(result.data);
}

export async function POST(request: NextRequest) {
  const authError = ensureAdminRequest(request);

  if (authError) {
    return authError;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const result = await supabase
    .from("pricing_rules")
    .insert({
      date_from: asNullableString(body.date_from),
      date_to: asNullableString(body.date_to),
      is_active: body.is_active !== false,
      multiplier: asNumber(body.multiplier),
      name: asNullableString(body.name),
    })
    .select("*")
    .single();

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json(result.data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const authError = ensureAdminRequest(request);

  if (authError) {
    return authError;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const id = asNullableString(body?.id);

  if (!body || !id) {
    return NextResponse.json({ error: "Pricing rule id is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const result = await supabase
    .from("pricing_rules")
    .update({
      date_from: asNullableString(body.date_from),
      date_to: asNullableString(body.date_to),
      is_active: body.is_active === true,
      multiplier: asNumber(body.multiplier),
      name: asNullableString(body.name),
    })
    .eq("id", id)
    .select("*")
    .single();

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json(result.data);
}

export async function DELETE(request: NextRequest) {
  const authError = ensureAdminRequest(request);

  if (authError) {
    return authError;
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const id = asNullableString(body?.id);

  if (!id) {
    return NextResponse.json({ error: "Pricing rule id is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const result = await supabase.from("pricing_rules").delete().eq("id", id);

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
