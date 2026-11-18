"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  onItemClick?: () => void;
}

export default function DashboardSidebar({ onItemClick }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user as
    | {
        name?: string;
        email?: string;
        image?: string;
        role?: "customer" | "technician" | "admin";
      }
    | undefined;

  const role = user?.role || "customer";

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully");
            window.location.href = "/sign-in";
          },
        },
      });
    } catch {
      toast.error("Failed to sign out");
    }
  };

  // রোল অনুযায়ী মেনু আইটেম
  const getNavItems = () => {
    if (role === "admin") {
      return [
        { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
        { name: "Manage Services", href: "/dashboard/admin/services", icon: Wrench },
        { name: "All Bookings", href: "/dashboard/admin/bookings", icon: ClipboardList },
        { name: "Manage Users", href: "/dashboard/admin/users", icon: Users },
        { name: "My Profile", href: "/dashboard/profile", icon: User },
      ];
    }

    if (role === "technician") {
      return [
        { name: "Overview", href: "/dashboard/technician", icon: LayoutDashboard },
        { name: "Assigned Jobs", href: "/dashboard/technician/jobs", icon: ClipboardList },
        { name: "My Services", href: "/dashboard/technician/services", icon: Wrench },
        { name: "My Profile", href: "/dashboard/profile", icon: User },
      ];
    }

    // Default: Customer
    return [
      { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
      { name: "My Bookings", href: "/dashboard/customer/bookings", icon: CalendarCheck },
      { name: "Book a Repair", href: "/services", icon: PlusCircle },
      { name: "My Profile", href: "/dashboard/profile", icon: User },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="flex h-full flex-col justify-between py-6 px-4">
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
          <span className="text-xl font-bold tracking-tight">
            Fix<span className="text-primary">Mate</span>
          </span>
        </Link>

        {/* User Info Card */}
        <div className="rounded-2xl border border-border/70 bg-muted/40 p-3.5">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {user?.name}
              </p>
              <Badge
                variant="secondary"
                className="mt-1 capitalize text-[10px] font-semibold bg-primary/10 text-primary"
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
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
      <div className="space-y-2 border-t border-border/70 pt-4">
        <Link
          href="/"
          onClick={onItemClick}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Home className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}