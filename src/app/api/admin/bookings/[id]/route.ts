import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ensureAdminRequest, asNullableString } from "@/lib/admin-api";
import { bookingStatusOptions, paymentStatusOptions } from "@/lib/admin-config";
import { createAdminClient } from "@/lib/supabase";

const bookingSelect = "*, room:rooms(*)";

type BookingRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: BookingRouteContext) {
  const authError = ensureAdminRequest(request);

  if (authError) {
    return authError;
  }

  const { id } = await context.params;
  const supabase = createAdminClient();
  const result = await supabase
    .from("bookings")
    .select(bookingSelect)
    .eq("id", id)
    .single();

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json(result.data);
}

export async function PUT(request: NextRequest, context: BookingRouteContext) {
  const authError = ensureAdminRequest(request);

  if (authError) {
    return authError;
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const nextStatus = asNullableString(body.status);
  const nextPaymentStatus = asNullableString(body.payment_status);

  if (nextStatus && !bookingStatusOptions.includes(nextStatus as never)) {
    return NextResponse.json({ error: "Invalid booking status" }, { status: 400 });
  }

  if (
    nextPaymentStatus &&
    !paymentStatusOptions.includes(nextPaymentStatus as never)
  ) {
    return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
  }

  const update = {
    admin_notes:
      body.admin_notes === undefined ? undefined : asNullableString(body.admin_notes),
    guest_email:
      body.guest_email === undefined ? undefined : asNullableString(body.guest_email),
    guest_name:
      body.guest_name === undefined ? undefined : asNullableString(body.guest_name),
    guest_phone:
      body.guest_phone === undefined ? undefined : asNullableString(body.guest_phone),
    notes: body.notes === undefined ? undefined : asNullableString(body.notes),
    payment_method:
      body.payment_method === undefined
        ? undefined
        : asNullableString(body.payment_method),
    payment_status: nextPaymentStatus ?? undefined,
    status: nextStatus ?? undefined,
    updated_at: new Date().toISOString(),
  };

  const supabase = createAdminClient();
  const result = await supabase
    .from("bookings")
    .update(update)
    .eq("id", id)
    .select(bookingSelect)
    .single();

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  return NextResponse.json(result.data);
}
