import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ensureAdminRequest } from "@/lib/admin-api";
import { createAdminClient } from "@/lib/supabase";

type ReviewRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: ReviewRouteContext) {
  const authError = ensureAdminRequest(request);

  if (authError) {
    return authError;
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as
    | { is_approved?: boolean }
    | null;

  if (typeof body?.is_approved !== "boolean") {
    return NextResponse.json({ error: "is_approved must be boolean" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const result = await supabase
    .from("reviews")
    .update({ is_approved: body.is_approved })
    .eq("id", id)
    .select("*")
    .single();

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json(result.data);
}
