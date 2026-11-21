
import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Bookings } from "@/app/types";
import { getCustomerBookings } from "@/lib/actions/bookings";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  Activity,
  CheckCircle2,
  ArrowRight,
  Wrench,
  CreditCard,
} from "lucide-react";

const STATUS_BADGE_STYLES: Record<string, string> = {
  requested: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  accepted: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30",
  "in-progress": "bg-amber-500/15 text-amber-600 border-amber-500/30",
  completed: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  rejected: "bg-rose-500/15 text-rose-600 border-rose-500/30",
  cancelled: "bg-slate-500/15 text-slate-600 border-slate-500/30",
};

const ACTIVE_STATUSES = new Set(["requested", "accepted", "in-progress"]);

const CustomerPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in?redirectTo=/dashboard/customer");
  }

  const bookings: Bookings[] = await getCustomerBookings(session.user.email);

  const totalRequests = bookings.length;
  const activeJobs = bookings.filter((item) =>
    ACTIVE_STATUSES.has((item.status || "").toLowerCase()),
  ).length;
  const completedJobs = bookings.filter(
    (item) => (item.status || "").toLowerCase() === "completed",
  ).length;

  const recentBookings = bookings.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {session.user.name || "Customer"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of your repair requests, active jobs, and completed
            services.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/dashboard/customer/bookings">
            <Button variant="outline" className="rounded-xl cursor-pointer">
              My Bookings
            </Button>
          </Link>
          <Link href="/services">
            <Button className="rounded-xl cursor-pointer">
              <Wrench className="mr-2 h-4 w-4" />
              Book Service
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Total Requests
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600">
              <ClipboardList className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold">{totalRequests}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            All repair requests submitted
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Active Jobs
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
              <Activity className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold">{activeJobs}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Requested, accepted &amp; in-progress
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Completed Jobs
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold">{completedJobs}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Finished repair services
          </p>
        </div>
      </div>

      {/* Recent Requests & Quick Links */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent Repair Requests</h2>
            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No repair requests found yet.
            </p>
          ) : (
            <div className="divide-y divide-border/70">
              {recentBookings.map((booking) => {
                const statusKey = (booking.status || "requested").toLowerCase();
                const amount =
                  statusKey === "completed" && booking.finalAmount
                    ? booking.finalAmount
                    : booking.basePrice;

                return (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {booking.serviceTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Technician: {booking.technicianName}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-semibold">
                        ${Number(amount || 0).toFixed(2)}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          STATUS_BADGE_STYLES[statusKey] ||
                          "bg-muted text-foreground border-border"
                        }`}
                      >
                        {statusKey.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Navigation */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
          <h2 className="text-base font-semibold">Quick Actions</h2>
          <p className="text-xs text-muted-foreground">
            Manage your ongoing repairs or review completed payments.
          </p>

          <div className="flex flex-col gap-2.5 pt-1">
            <Link href="/dashboard/customer/bookings">
              <Button
                variant="outline"
                className="w-full justify-between rounded-xl cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Manage Bookings
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/dashboard/customer/payments">
              <Button
                variant="outline"
                className="w-full justify-between rounded-xl cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment History
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;