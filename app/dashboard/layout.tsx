import type { Metadata } from "next";
import { DashboardScrollRestoration } from "@/components/dashboard/DashboardScrollRestoration";
import { requireDashboardUser } from "@/lib/dashboard/auth";
import { DashboardNav } from "./DashboardNav";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Heimlogik Admin",
  },
  robots: { index: false, follow: false, nocache: true },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireDashboardUser();

  return (
    <div className="min-h-screen bg-paper">
      <DashboardScrollRestoration />
      <DashboardNav userEmail={user.email ?? ""} />
      <div className="transition-[padding] duration-200 xl:pl-[var(--dashboard-sidebar-width)]">
        <main className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6 md:px-8 md:py-8 lg:px-10 xl:px-12 xl:py-10">{children}</main>
      </div>
    </div>
  );
}
