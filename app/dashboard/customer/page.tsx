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
  requested: "bg-blue-500/15 text-blue-700 border-blue-500/35",
  accepted: "bg-indigo-500/15 text-indigo-700 border-indigo-500/35",
  "in-progress": "bg-amber-500/15 text-amber-700 border-amber-500/35",
  completed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/35",
  rejected: "bg-rose-500/15 text-rose-700 border-rose-500/35",
  cancelled: "bg-slate-500/15 text-slate-700 border-slate-500/35",
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
    <div className="space-y-6 rounded-3xl border border-[#C2C0B1] bg-[#EBECE4] p-4 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/85 px-5 py-4 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {session.user.name || "Customer"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of your repair requests, active jobs, and completed
            services.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link href="/dashboard/customer/bookings">
            <Button
              variant="outline"
              className="rounded-xl cursor-pointer bg-[#EBECE4] border-[#C2C0B1] hover:bg-[#E2E1D8] text-foreground font-semibold"
            >
              My Bookings
            </Button>
          </Link>
          <Link href="/services">
            <Button className="rounded-xl cursor-pointer font-semibold shadow-xs">
              <Wrench className="mr-2 h-4 w-4" />
              Book Service
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 bg-[#E2E1D8]/60 border-b border-[#C2C0B1]">
            <p className="text-sm font-semibold text-foreground/85">
              Total Requests
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-700 border border-blue-500/30">
              <ClipboardList className="h-4 w-4" />
            </span>
          </div>
          <div className="px-5 py-4">
            <p className="text-3xl font-bold text-foreground">{totalRequests}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              All repair requests submitted
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 bg-[#E2E1D8]/60 border-b border-[#C2C0B1]">
            <p className="text-sm font-semibold text-foreground/85">
              Active Jobs
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 border border-amber-500/30">
              <Activity className="h-4 w-4" />
            </span>
          </div>
          <div className="px-5 py-4">
            <p className="text-3xl font-bold text-foreground">{activeJobs}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Requested, accepted &amp; in-progress
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 bg-[#E2E1D8]/60 border-b border-[#C2C0B1]">
            <p className="text-sm font-semibold text-foreground/85">
              Completed Jobs
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="px-5 py-4">
            <p className="text-3xl font-bold text-foreground">{completedJobs}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Finished repair services
            </p>
          </div>
        </div>
      </div>

      {/* Recent Requests & Quick Links */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 bg-[#E2E1D8]/75 border-b border-[#C2C0B1]">
            <h2 className="text-base font-bold text-foreground">
              Recent Repair Requests
            </h2>
            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="p-5">
            {recentBookings.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground rounded-xl border border-dashed border-[#C2C0B1] bg-[#E2E1D8]/45">
                No repair requests found yet.
              </p>
            ) : (
              <div className="divide-y divide-[#C2C0B1]">
                {recentBookings.map((booking) => {
                  const statusKey = (
                    booking.status || "requested"
                  ).toLowerCase();
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
                        <p className="font-semibold text-sm text-foreground truncate">
                          {booking.serviceTitle}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Technician: {booking.technicianName}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-bold text-foreground">
                          ${Number(amount || 0).toFixed(2)}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                            STATUS_BADGE_STYLES[statusKey] ||
                            "bg-[#E2E1D8] text-foreground border-[#C2C0B1]"
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
        </div>

        {/* Quick Navigation */}
        <div className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs overflow-hidden h-fit">
          <div className="px-5 py-4 bg-[#E2E1D8]/75 border-b border-[#C2C0B1]">
            <h2 className="text-base font-bold text-foreground">
              Quick Actions
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Manage your ongoing repairs or review completed payments.
            </p>
          </div>

          <div className="p-5 flex flex-col gap-2.5">
            <Link href="/dashboard/customer/bookings">
              <Button
                variant="outline"
                className="w-full justify-between rounded-xl cursor-pointer bg-[#E2E1D8]/70 border-[#C2C0B1] hover:bg-[#E2E1D8] text-foreground font-medium"
              >
                <span className="inline-flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  Manage Bookings
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>

            <Link href="/dashboard/customer/payments">
              <Button
                variant="outline"
                className="w-full justify-between rounded-xl cursor-pointer bg-[#E2E1D8]/70 border-[#C2C0B1] hover:bg-[#E2E1D8] text-foreground font-medium"
              >
                <span className="inline-flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Payment History
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;