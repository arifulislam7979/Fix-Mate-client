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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border/70 bg-card lg:block">
        <div className="sticky top-0 h-screen">
          <DashboardSidebar />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/70 bg-card/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-input bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground cursor-pointer">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <DashboardSidebar onItemClick={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary hidden sm:block" />
              <h1 className="text-base sm:text-lg font-bold capitalize text-foreground">
                {role} Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {session.user.email}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
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
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="flex items-center gap-2.5 text-muted-foreground">
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