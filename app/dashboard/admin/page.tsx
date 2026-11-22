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
    <div className="min-h-full rounded-3xl bg-[#EBECE4]/65 p-4 sm:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/70 bg-[#E2E1D8]/75 px-5 py-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Admin Overview</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Platform Control Center
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitor users, technician service approvals, bookings, and platform
              revenue.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link href="/dashboard/admin/services">
              <Button variant="outline" className="rounded-xl cursor-pointer bg-[#EBECE4]">
                Review Pending Services ({pendingServices})
              </Button>
            </Link>
            <Link href="/dashboard/admin/transactions">
              <Button className="rounded-xl cursor-pointer">
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
                className="group rounded-2xl border border-border bg-[#EBECE4]/90 p-5 shadow-xs space-y-3 transition-colors hover:border-primary/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {card.title}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold tracking-tight">
                  {card.value}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{card.subtitle}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
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
                className="group rounded-2xl border border-border bg-[#EBECE4]/90 p-5 shadow-xs space-y-3 transition-colors hover:border-primary/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {card.title}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E2E1D8] text-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold tracking-tight">
                  {card.value}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{card.subtitle}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Management Shortcuts */}
        <div className="rounded-2xl border border-border bg-[#EBECE4]/90 p-6 shadow-xs space-y-4">
          <div className="border-b border-border/70 pb-3">
            <h2 className="text-base font-bold">Quick Administration</h2>
            <p className="text-xs text-muted-foreground">
              Jump directly to core admin management sections
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <Link
              href="/dashboard/admin/users"
              className="rounded-xl border border-border/70 bg-[#E2E1D8]/70 p-4 hover:bg-[#E2E1D8] transition-colors"
            >
              <p className="font-semibold">Manage Users</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                View accounts & update roles
              </p>
            </Link>
            <Link
              href="/dashboard/admin/services"
              className="rounded-xl border border-border/70 bg-[#E2E1D8]/70 p-4 hover:bg-[#E2E1D8] transition-colors"
            >
              <p className="font-semibold">Service Approval</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Approve or reject pending listings
              </p>
            </Link>
            <Link
              href="/dashboard/admin/bookings"
              className="rounded-xl border border-border/70 bg-[#E2E1D8]/70 p-4 hover:bg-[#E2E1D8] transition-colors"
            >
              <p className="font-semibold">All Bookings</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track repair job statuses
              </p>
            </Link>
            <Link
              href="/dashboard/admin/transactions"
              className="rounded-xl border border-border/70 bg-[#E2E1D8]/70 p-4 hover:bg-[#E2E1D8] transition-colors"
            >
              <p className="font-semibold">Transactions</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Inspect Stripe payment records
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}