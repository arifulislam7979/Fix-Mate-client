import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  Users as UsersIcon,
  Wrench,
  Clock,
  CalendarCheck,
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { auth } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/core/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_URL ||
  "https://fix-mate-server.vercel.app";

interface AdminUserRecord {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface AdminServiceRecord {
  _id?: string;
  id?: string;
  title?: string;
  approvalStatus?: string;
  status?: string;
}

interface AdminBookingRecord {
  _id?: string;
  id?: string;
  status?: string;
  finalAmount?: number | string;
  basePrice?: number | string;
}

interface AdminPaymentRecord {
  _id?: string;
  id?: string;
  amount?: number | string;
  status?: string;
  paymentStatus?: string;
}

interface UsersResponse {
  users?: AdminUserRecord[];
  data?: AdminUserRecord[];
}

interface ServicesResponse {
  services?: AdminServiceRecord[];
  data?: AdminServiceRecord[];
}

interface BookingsResponse {
  bookings?: AdminBookingRecord[];
  data?: AdminBookingRecord[];
}

interface PaymentsResponse {
  payments?: AdminPaymentRecord[];
  data?: AdminPaymentRecord[];
}

function parseAmount(raw: unknown): number {
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : 0;
  }
  if (typeof raw === "string") {
    const cleaned = raw.replace(/[^0-9.-]+/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function extractArray<T>(
  payload:
    | T[]
    | {
        users?: T[];
        services?: T[];
        bookings?: T[];
        payments?: T[];
        data?: T[];
      },
  key: "users" | "services" | "bookings" | "payments",
): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload[key] || payload.data || [];
}

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const token = await getToken();
  const authHeaders: HeadersInit = token
    ? { authorization: `Bearer ${token}` }
    : {};

  let usersList: AdminUserRecord[] = [];
  let servicesList: AdminServiceRecord[] = [];
  let bookingsList: AdminBookingRecord[] = [];
  let paymentsList: AdminPaymentRecord[] = [];

  try {
    const [usersRes, servicesRes, bookingsRes, paymentsRes] = await Promise.all(
      [
        fetch(`${BASE_URL}/users`, {
          method: "GET",
          headers: authHeaders,
          cache: "no-store",
        }),
        fetch(`${BASE_URL}/services`, {
          method: "GET",
          headers: authHeaders,
          cache: "no-store",
        }),
        fetch(`${BASE_URL}/bookings/admin`, {
          method: "GET",
          headers: authHeaders,
          cache: "no-store",
        }),
        fetch(`${BASE_URL}/payments/admin`, {
          method: "GET",
          headers: authHeaders,
          cache: "no-store",
        }),
      ],
    );

    if (usersRes.ok) {
      const data: AdminUserRecord[] | UsersResponse = await usersRes.json();
      usersList = extractArray<AdminUserRecord>(data, "users");
    }

    if (servicesRes.ok) {
      const data: AdminServiceRecord[] | ServicesResponse =
        await servicesRes.json();
      servicesList = extractArray<AdminServiceRecord>(data, "services");
    }

    if (bookingsRes.ok) {
      const data: AdminBookingRecord[] | BookingsResponse =
        await bookingsRes.json();
      bookingsList = extractArray<AdminBookingRecord>(data, "bookings");
    }

    if (paymentsRes.ok) {
      const data: AdminPaymentRecord[] | PaymentsResponse =
        await paymentsRes.json();
      paymentsList = extractArray<AdminPaymentRecord>(data, "payments");
    }
  } catch (error) {
    console.error("Failed to fetch admin overview stats:", error);
  }

  const totalUsers = usersList.length;

  const totalTechnicians = usersList.filter(
    (user) =>
      String(user.role || "")
        .trim()
        .toLowerCase() === "technician",
  ).length;

  const pendingServices = servicesList.filter((service) => {
    const state = String(service.approvalStatus || service.status || "")
      .trim()
      .toLowerCase();
    return state === "pending";
  }).length;

  const totalBookings = bookingsList.length;

  const totalRevenue = paymentsList
    .filter((payment) => {
      const state = String(payment.status || payment.paymentStatus || "paid")
        .trim()
        .toLowerCase();
      return ["paid", "completed", "succeeded"].includes(state);
    })
    .reduce((sum, payment) => sum + parseAmount(payment.amount), 0);

  const primaryStats = [
    {
      title: "Total Users",
      value: totalUsers,
      subtitle: "Registered platform accounts",
      icon: UsersIcon,
      href: "/dashboard/admin/users",
    },
    {
      title: "Total Technicians",
      value: totalTechnicians,
      subtitle: "Active repair technicians",
      icon: Wrench,
      href: "/dashboard/admin/users",
    },
    {
      title: "Pending Services",
      value: pendingServices,
      subtitle: "Awaiting admin approval",
      icon: Clock,
      href: "/dashboard/admin/services",
    },
  ];

  const secondaryStats = [
    {
      title: "Total Bookings",
      value: totalBookings,
      subtitle: "All service requests",
      icon: CalendarCheck,
      href: "/dashboard/admin/bookings",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      subtitle: "Confirmed paid transactions",
      icon: CreditCard,
      href: "/dashboard/admin/transactions",
    },
  ];

  return (
    <div className="min-h-full rounded-3xl border border-[#C2C0B1] bg-[#EBECE4] p-4 sm:p-6 shadow-xs">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/85 px-5 py-4 shadow-2xs">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#C2C0B1] bg-[#EBECE4] px-2.5 py-0.5 text-xs font-semibold text-primary mb-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Admin Overview</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Platform Control Center
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Monitor users, technician service approvals, bookings, and platform
              revenue.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link href="/dashboard/admin/services">
              <Button
                variant="outline"
                className="rounded-xl cursor-pointer bg-[#EBECE4] border-[#C2C0B1] hover:bg-[#E2E1D8] text-foreground font-semibold shadow-2xs"
              >
                Review Pending Services ({pendingServices})
              </Button>
            </Link>
            <Link href="/dashboard/admin/transactions">
              <Button className="rounded-xl cursor-pointer font-semibold shadow-xs">
                Transactions
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Required Overview Stats: Total Users, Total Technicians, Pending Services */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {primaryStats.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs space-y-3 transition-all duration-200 hover:border-[#B8B5A5] hover:shadow-md overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 pt-4 pb-3 bg-[#E2E1D8]/70 border-b border-[#C2C0B1]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {card.title}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/25">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="px-5 pb-4 pt-1 space-y-2 bg-[#EBECE4]">
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {card.value}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{card.subtitle}</span>
                    <ArrowUpRight className="h-4 w-4 text-primary opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Additional Quick Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {secondaryStats.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs space-y-3 transition-all duration-200 hover:border-[#B8B5A5] hover:shadow-md overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 pt-4 pb-3 bg-[#E2E1D8]/70 border-b border-[#C2C0B1]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {card.title}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EBECE4] text-foreground border border-[#C2C0B1]">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="px-5 pb-4 pt-1 space-y-2 bg-[#EBECE4]">
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {card.value}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{card.subtitle}</span>
                    <ArrowUpRight className="h-4 w-4 text-primary opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Management Shortcuts */}
        <div className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-[#E2E1D8]/80 border-b border-[#C2C0B1]">
            <h2 className="text-base font-bold text-foreground">
              Quick Administration
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Jump directly to core admin management sections
            </p>
          </div>

          <div className="p-6 bg-[#EBECE4]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
              <Link
                href="/dashboard/admin/users"
                className="group rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 p-4 hover:bg-[#E2E1D8] hover:border-[#B8B5A5] transition-colors"
              >
                <p className="font-semibold text-foreground flex items-center justify-between">
                  <span>Manage Users</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  View accounts &amp; update roles
                </p>
              </Link>
              <Link
                href="/dashboard/admin/services"
                className="group rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 p-4 hover:bg-[#E2E1D8] hover:border-[#B8B5A5] transition-colors"
              >
                <p className="font-semibold text-foreground flex items-center justify-between">
                  <span>Service Approval</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Approve or reject pending listings
                </p>
              </Link>
              <Link
                href="/dashboard/admin/bookings"
                className="group rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 p-4 hover:bg-[#E2E1D8] hover:border-[#B8B5A5] transition-colors"
              >
                <p className="font-semibold text-foreground flex items-center justify-between">
                  <span>All Bookings</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Track repair job statuses
                </p>
              </Link>
              <Link
                href="/dashboard/admin/transactions"
                className="group rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 p-4 hover:bg-[#E2E1D8] hover:border-[#B8B5A5] transition-colors"
              >
                <p className="font-semibold text-foreground flex items-center justify-between">
                  <span>Transactions</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Inspect Stripe payment records
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}