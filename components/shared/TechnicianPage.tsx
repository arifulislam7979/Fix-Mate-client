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
      return "border-emerald-500/30 bg-emerald-500/15 text-emerald-700";
    case "accepted":
    case "assigned":
    case "in-progress":
    case "in progress":
      return "border-sky-500/30 bg-sky-500/15 text-sky-700";
    case "requested":
    case "pending":
      return "border-amber-500/30 bg-amber-500/15 text-amber-700";
    case "rejected":
    case "cancelled":
    case "canceled":
      return "border-rose-500/30 bg-rose-500/15 text-rose-700";
    default:
      return "border-border bg-muted/60 text-foreground";
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
  allJobsHref = "/dashboard",
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Technician Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {technician?.name || "Technician"}. Here is a summary
            of your assigned jobs and earnings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/dashboard/profile">
            <Button variant="outline" className="rounded-xl cursor-pointer">
              <UserCheck className="mr-2 h-4 w-4" />
              My Profile
            </Button>
          </Link>
          <Link href={allJobsHref}>
            <Button className="rounded-xl cursor-pointer">
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
              className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3"
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
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Technician Profile Information */}
      {technician && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="border-b border-border/70 pb-3">
            <h2 className="text-base font-bold">Technician Information</h2>
            <p className="text-xs text-muted-foreground">
              Your registered profile and service details
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="rounded-xl border border-border/70 bg-muted/25 p-3">
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="font-semibold mt-0.5">{technician.name}</p>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/25 p-3">
              <p className="text-xs text-muted-foreground">Email Address</p>
              <p className="font-semibold mt-0.5 truncate">
                {technician.email}
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/25 p-3">
              <p className="text-xs text-muted-foreground">Phone Number</p>
              <p className="font-semibold mt-0.5">
                {technician.phone || "Not added"}
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/25 p-3">
              <p className="text-xs text-muted-foreground">Service Area</p>
              <p className="font-semibold mt-0.5">
                {technician.area || "Not set"}
              </p>
            </div>
          </div>

          {technician.bio && (
            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Bio: </span>
              {technician.bio}
            </div>
          )}
        </div>
      )}

      {/* Recent Assigned Jobs */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div>
            <h2 className="text-base font-bold">Recent Assigned Jobs</h2>
            <p className="text-xs text-muted-foreground">
              Latest service requests assigned to your account
            </p>
          </div>
        </div>

        {recentBookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-1">
            <p className="text-sm font-medium">No assigned jobs yet</p>
            <p className="text-xs text-muted-foreground">
              New bookings assigned to you will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="py-3.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    {booking.serviceTitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>Customer: {booking.customerName}</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {booking.area}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {booking.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold">
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
  );
};

export default TechnicianPage;