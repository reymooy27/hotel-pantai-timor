import { ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";
import { hasAdminSession } from "@/lib/admin-auth";
import { HOTEL_NAME } from "@/lib/admin-config";

import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  if (await hasAdminSession()) {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.18),_transparent_35%),linear-gradient(180deg,_#020617,_#0f172a)] px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-950/85 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
        <div className="mb-8 flex items-start gap-4">
          <div className="rounded-2xl bg-cyan-500/15 p-3 text-cyan-300">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
              Secure Access
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white">{HOTEL_NAME}</h1>
            <p className="mt-2 text-sm text-slate-400">
              Enter admin password to open bookings, pricing, reviews, and room controls.
            </p>
          </div>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}
