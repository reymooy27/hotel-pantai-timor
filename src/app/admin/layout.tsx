import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminSession } from "@/lib/admin-auth";
import { HOTEL_NAME } from "@/lib/admin-config";

export const metadata: Metadata = {
  title: `${HOTEL_NAME} Admin`,
  description: "Admin dashboard for Hotel Pantai Timor",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdminSession();

  return <AdminShell>{children}</AdminShell>;
}
