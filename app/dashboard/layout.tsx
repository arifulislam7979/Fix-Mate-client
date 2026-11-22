"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShieldCheck, Loader2 } from "lucide-react";
import DashboardSidebar from "@/components/shared/DashboardSidebar";

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user as
    | {
        role?: "customer" | "technician" | "admin";
      }
    | undefined;

  const role = user?.role || "customer";

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        router.replace("/sign-in");
        return;
      }

      if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
        router.replace(`/dashboard/${role}`);
      } else if (
        pathname.startsWith("/dashboard/technician") &&
        role !== "technician"
      ) {
        router.replace(`/dashboard/${role}`);
      } else if (
        pathname.startsWith("/dashboard/customer") &&
        role !== "customer"
      ) {
        router.replace(`/dashboard/${role}`);
      }
    }
  }, [session, isPending, pathname, role, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EBECE4]">
        <div className="flex items-center gap-2.5 rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/80 px-5 py-3.5 text-muted-foreground shadow-xs">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="flex min-h-screen bg-[#EBECE4] text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-[#C2C0B1] bg-[#E2E1D8]/75 lg:block">
        <div className="sticky top-0 h-screen">
          <DashboardSidebar />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#C2C0B1] bg-[#EBECE4]/95 px-4 backdrop-blur-md shadow-2xs lg:px-8">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Sidebar Trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/80 text-foreground shadow-2xs hover:bg-[#E2E1D8] cursor-pointer">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 p-0 bg-[#EBECE4] border-r border-[#C2C0B1]"
              >
                <DashboardSidebar onItemClick={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2.5 rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/80 px-3.5 py-1.5">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <h1 className="text-sm sm:text-base font-bold capitalize text-foreground truncate">
                {role} Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 min-w-0">
            <span className="hidden text-xs font-medium text-muted-foreground rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/75 px-3 py-1.5 sm:inline truncate max-w-[240px]">
              {session.user.email}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#EBECE4]">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#EBECE4]">
          <div className="flex items-center gap-2.5 rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/80 px-5 py-3.5 text-muted-foreground shadow-xs">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="font-medium">Loading dashboard...</span>
          </div>
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}