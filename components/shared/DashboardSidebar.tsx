"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  LayoutDashboard,
  CalendarCheck,
  PlusCircle,
  ClipboardList,
  Users,
  User,
  LogOut,
  Home,
  Plus,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  onItemClick?: () => void;
}

export default function DashboardSidebar({
  onItemClick,
}: DashboardSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user;

  const role = user?.role || "customer";

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw new Error(error.message);
      toast.success("Signed out successfully");
      router.replace("/sign-in");
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  const getNavItems = () => {
    if (role === "admin") {
      return [
        { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
        {
          name: "Manage Services",
          href: "/dashboard/admin/services",
          icon: Wrench,
        },
        {
          name: "All Bookings",
          href: "/dashboard/admin/bookings",
          icon: ClipboardList,
        },
        {
          name: "Transactions",
          href: "/dashboard/admin/transections",
          icon: CreditCard,
        },
        { name: "My Profile", href: "/dashboard/profile", icon: User },
      ];
    }

    if (role === "technician") {
      return [
        {
          name: "Overview",
          href: "/dashboard/technician",
          icon: LayoutDashboard,
        },
        {
          name: "Add-Service",
          href: "/dashboard/technician/add-service",
          icon: Plus,
        },
        {
          name: "My Services",
          href: "/dashboard/technician/my-services",
          icon: Wrench,
        },
        {
          name: "Manage Request",
          href: "/dashboard/technician/requests",
          icon: ClipboardList,
        },
        { name: "My Profile", href: "/dashboard/profile", icon: User },
      ];
    }

    return [
      { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
      {
        name: "My Bookings",
        href: "/dashboard/customer/bookings",
        icon: CalendarCheck,
      },
      {
        name: "Payment History",
        href: "/dashboard/customer/payments",
        icon: PlusCircle,
      },
      { name: "My Profile", href: "/dashboard/profile", icon: User },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-full flex-col justify-between py-6 px-4 bg-slate-900 text-slate-100 border-r border-slate-800">
      <div className="space-y-6">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={onItemClick}
          className="flex items-center gap-2.5 px-2 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Fix<span className="text-primary">Mate</span>
          </span>
        </Link>

        {/* User Info Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-3.5 shadow-xs">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-slate-700">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary/20 text-primary-foreground font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {user?.name}
              </p>
              <Badge
                variant="secondary"
                className="mt-1 capitalize text-[10px] font-semibold bg-primary/20 text-primary-foreground border-primary/30"
              >
                {role} Panel
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-2 border-t border-slate-800 pt-4">
        <Link
          href="/"
          onClick={onItemClick}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800/80 hover:text-white"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-950/40 hover:text-red-300 cursor-pointer"
        >
          <LogOut className="h-4 w-4 text-red-400 " />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
