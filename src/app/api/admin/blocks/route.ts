import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { asNullableString, ensureAdminRequest } from "@/lib/admin-api";
import { createAdminClient } from "@/lib/supabase";

const blockSelect = "*, room:rooms(id,name)";

export async function GET(request: NextRequest) {
  const authError = ensureAdminRequest(request);

  if (authError) {
    return authError;
  }

  const supabase = createAdminClient();
  const result = await supabase
    .from("room_blocks")
    .select(blockSelect)
    .order("blocked_from", { ascending: true });

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
    .from("room_blocks")
    .insert({
      blocked_from: asNullableString(body.blocked_from),
      blocked_to: asNullableString(body.blocked_to),
      reason: asNullableString(body.reason),
      room_id: asNullableString(body.room_id),
    })
    .select(blockSelect)
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
    return NextResponse.json({ error: "Block id is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const result = await supabase
    .from("room_blocks")
    .update({
      blocked_from: asNullableString(body.blocked_from),
      blocked_to: asNullableString(body.blocked_to),
      reason: asNullableString(body.reason),
      room_id: asNullableString(body.room_id),
    })
    .eq("id", id)
    .select(blockSelect)
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
    return NextResponse.json({ error: "Block id is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const result = await supabase.from("room_blocks").delete().eq("id", id);

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
