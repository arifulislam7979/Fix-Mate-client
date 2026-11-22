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
  ChevronRight,
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
    <div className="flex h-full flex-col justify-between py-5 px-3.5 bg-[#D4D4C6] text-foreground border-r border-[#96937E]/65 select-none">
      <div className="space-y-5">
        {/* Brand Logo */}
        <div className="px-1.5">
          <Link
            href="/"
            onClick={onItemClick}
            className="flex items-center gap-2.5 rounded-2xl border border-[#96937E]/50 bg-[#EBECE4]/85 px-3 py-2.5 shadow-2xs transition-all hover:bg-[#EBECE4] group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs ring-1 ring-black/10 transition-transform duration-200 group-hover:scale-105">
              <Wrench className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-lg font-extrabold tracking-tight leading-none text-foreground">
                Fix<span className="text-primary">Mate</span>
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">
                Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* User Info Card */}
        <div className="rounded-2xl border border-[#96937E]/60 bg-[#C5C5B6]/95 p-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-[#96937E]/75 bg-[#EBECE4] shrink-0 shadow-2xs">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary/15 text-primary font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground leading-snug">
                {user?.name || "User"}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                <Badge
                  variant="secondary"
                  className="capitalize text-[10px] font-bold tracking-wide px-2 py-0 h-5 bg-[#EBECE4]/90 text-foreground/85 border border-[#96937E]/60 rounded-md"
                >
                  {role} Panel
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "group flex items-center justify-between gap-2.5 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-150 border",
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                      : "border-transparent text-foreground/85 font-medium hover:bg-[#C2C2B2] hover:border-[#96937E]/45 hover:text-foreground",
                  )}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-150",
                        active
                          ? "text-primary-foreground"
                          : "text-foreground/75 group-hover:text-foreground group-hover:scale-105",
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 transition-transform duration-150",
                      active
                        ? "opacity-90 translate-x-0.5"
                        : "opacity-0 group-hover:opacity-65 group-hover:translate-x-0.5",
                    )}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-1.5 border-t border-[#96937E]/65 pt-3.5">
        <Link
          href="/"
          onClick={onItemClick}
          className="flex items-center gap-3 rounded-xl border border-transparent px-3.5 py-2.5 text-sm font-medium text-foreground/85 transition-all hover:bg-[#C2C2B2] hover:border-[#96937E]/45 hover:text-foreground"
        >
          <Home className="h-4 w-4 shrink-0 text-foreground/75" />
          <span>Back to Home</span>
        </Link>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3.5 py-2.5 text-sm font-semibold text-rose-700 transition-all hover:bg-rose-500/15 hover:border-rose-500/30 hover:text-rose-800 cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0 text-rose-700" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}