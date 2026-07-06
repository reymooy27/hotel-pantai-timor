import { getBookingStatusTone, getPaymentStatusTone, humanizeStatus } from "@/lib/admin-config";
import type { Booking } from "@/lib/types";

type StatusBadgeProps =
  | {
      kind: "booking";
      value: Booking["status"];
    }
  | {
      kind: "payment";
      value: Booking["payment_status"];
    };

export function StatusBadge(props: StatusBadgeProps) {
  const tone =
    props.kind === "booking"
      ? getBookingStatusTone(props.value)
      : getPaymentStatusTone(props.value);

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${tone}`}
    >
      {humanizeStatus(props.value)}
    </span>
  );
}
