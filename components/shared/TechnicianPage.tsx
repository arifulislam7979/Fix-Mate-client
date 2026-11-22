import React from "react";
import Link from "next/link";
import {
  Wrench,
  CheckCircle2,
  Clock,
  Wallet,
  ArrowUpRight,
  Calendar,
  MapPin,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TechnicianBookingItem } from "@/app/types";

export interface TechnicianInfo {
  name: string;
  email: string;
  phone?: string;
  area?: string;
  role?: string;
  bio?: string;
  image?: string;
}

export interface TechnicianStats {
  activeJobs: number;
  completedJobs: number;
  pendingJobs: number;
  totalEarnings: number;
}

interface TechnicianPageProps {
  technician?: TechnicianInfo;
  stats?: TechnicianStats;
  recentBookings?: TechnicianBookingItem[];
  allJobsHref?: string;
}

function getStatusColorClass(status: string): string {
  switch (status.trim().toLowerCase()) {
    case "completed":
    case "paid":
      return "border-emerald-500/35 bg-emerald-500/15 text-emerald-700";
    case "accepted":
    case "assigned":
    case "in-progress":
    case "in progress":
      return "border-sky-500/35 bg-sky-500/15 text-sky-700";
    case "requested":
    case "pending":
      return "border-amber-500/35 bg-amber-500/15 text-amber-700";
    case "rejected":
    case "cancelled":
    case "canceled":
      return "border-rose-500/35 bg-rose-500/15 text-rose-700";
    default:
      return "border-[#C2C0B1] bg-[#E2E1D8] text-foreground";
  }
}

const TechnicianPage = ({
  technician,
  stats = {
    activeJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    totalEarnings: 0,
  },
  recentBookings = [],
  allJobsHref = "/dashboard/technician/requests",
}: TechnicianPageProps) => {
  const kpiCards = [
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      subtitle: "Currently in progress",
      icon: Wrench,
    },
    {
      title: "Completed Services",
      value: stats.completedJobs,
      subtitle: "Successfully finished",
      icon: CheckCircle2,
    },
    {
      title: "Pending Requests",
      value: stats.pendingJobs,
      subtitle: "Awaiting action",
      icon: Clock,
    },
    {
      title: "Total Earnings",
      value: `$${stats.totalEarnings.toFixed(2)}`,
      subtitle: "Confirmed completed earnings",
      icon: Wallet,
    },
  ];

  return (
    <div className="space-y-6 rounded-3xl border border-[#C2C0B1] bg-[#EBECE4] p-4 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/85 px-5 py-4 shadow-2xs">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Technician Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back, {technician?.name || "Technician"}. Here is a summary
            of your assigned jobs and earnings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link href="/dashboard/profile">
            <Button
              variant="outline"
              className="rounded-xl cursor-pointer bg-[#EBECE4] border-[#C2C0B1] hover:bg-[#E2E1D8] text-foreground font-semibold shadow-2xs"
            >
              <UserCheck className="mr-2 h-4 w-4 text-primary" />
              My Profile
            </Button>
          </Link>
          <Link href={allJobsHref}>
            <Button className="rounded-xl cursor-pointer font-semibold shadow-xs">
              View All Jobs
              <ArrowUpRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="group rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs hover:shadow-md hover:border-[#B8B5A5] transition-all duration-200 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 pt-4 pb-3 bg-[#E2E1D8]/70 border-b border-[#C2C0B1]">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </span>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/25">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="px-5 py-4 bg-[#EBECE4]">
                <div className="text-2xl font-bold tracking-tight text-foreground">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Technician Profile Information */}
      {technician && (
        <div className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-[#E2E1D8]/80 border-b border-[#C2C0B1]">
            <h2 className="text-base font-bold text-foreground">
              Technician Information
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your registered profile and service details
            </p>
          </div>

          <div className="p-6 space-y-4 bg-[#EBECE4]">
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 text-sm">
              <div className="rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 p-3.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Full Name
                </p>
                <p className="font-semibold text-foreground mt-0.5">
                  {technician.name}
                </p>
              </div>
              <div className="rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 p-3.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Email Address
                </p>
                <p className="font-semibold text-foreground mt-0.5 truncate">
                  {technician.email}
                </p>
              </div>
              <div className="rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 p-3.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Phone Number
                </p>
                <p className="font-semibold text-foreground mt-0.5">
                  {technician.phone || "Not added"}
                </p>
              </div>
              <div className="rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 p-3.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Service Area
                </p>
                <p className="font-semibold text-foreground mt-0.5">
                  {technician.area || "Not set"}
                </p>
              </div>
            </div>

            {technician.bio && (
              <div className="rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/55 p-3.5 text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Bio: </span>
                {technician.bio}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Assigned Jobs */}
      <div className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-[#E2E1D8]/80 border-b border-[#C2C0B1]">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Recent Assigned Jobs
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Latest service requests assigned to your account
            </p>
          </div>
        </div>

        <div className="p-6 bg-[#EBECE4]">
          {recentBookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#C2C0B1] bg-[#E2E1D8]/50 p-8 text-center space-y-1">
              <p className="text-sm font-semibold text-foreground">
                No assigned jobs yet
              </p>
              <p className="text-xs text-muted-foreground">
                New bookings assigned to you will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#C2C0B1]">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between hover:bg-[#E2E1D8]/35 px-2 -mx-2 rounded-xl transition-colors"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {booking.serviceTitle}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>Customer: {booking.customerName}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {booking.area}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        {booking.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold text-foreground">
                      ${booking.amount.toFixed(2)}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getStatusColorClass(
                        booking.status,
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianPage;
