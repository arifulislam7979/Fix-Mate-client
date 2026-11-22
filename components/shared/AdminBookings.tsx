"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Phone,
  MapPin,
  Calendar,
  FileText,
  User,
  Wrench,
  RefreshCw,
} from "lucide-react";
import { BookingStatus, RepairRequestBooking } from "@/app/types";

const statusStyleMap: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  requested: {
    label: "Requested",
    className: "bg-blue-500/10 text-blue-700 border-blue-500/35",
  },
  accepted: {
    label: "Accepted",
    className: "bg-indigo-500/10 text-indigo-700 border-indigo-500/35",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-amber-500/10 text-amber-700 border-amber-500/35",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/35",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/10 text-red-700 border-red-500/35",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-zinc-500/10 text-zinc-700 border-zinc-500/35",
  },
};

type FilterStatus = "all" | BookingStatus;

const STATUS_FILTERS: Array<{ key: FilterStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "rejected", label: "Rejected" },
  { key: "cancelled", label: "Cancelled" },
];

interface AdminBookingsClientProps {
  initialBookings?: RepairRequestBooking[];
  initialStatus?: string;
}

export default function AdminBookingsClient({
  initialBookings = [],
  initialStatus = "all",
}: AdminBookingsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const normalizedInitial = (initialStatus || "all").toLowerCase() as FilterStatus;

  const [selectedStatus, setSelectedStatus] =
    useState<FilterStatus>(normalizedInitial);
  const [bookings, setBookings] =
    useState<RepairRequestBooking[]>(initialBookings);

  const [prevInitialBookings, setPrevInitialBookings] =
    useState<RepairRequestBooking[]>(initialBookings);
  const [prevStatusKey, setPrevStatusKey] = useState<string>(
    `${normalizedInitial}::${searchParams.toString()}`
  );

  if (initialBookings !== prevInitialBookings) {
    setPrevInitialBookings(initialBookings);
    setBookings(initialBookings);
  }

  const paramStatus = (
    searchParams.get("status") || normalizedInitial
  ).toLowerCase();
  const validStatus: FilterStatus = STATUS_FILTERS.some(
    (t) => t.key === paramStatus
  )
    ? (paramStatus as FilterStatus)
    : "all";

  const currentStatusKey = `${validStatus}::${searchParams.toString()}`;
  if (currentStatusKey !== prevStatusKey) {
    setPrevStatusKey(currentStatusKey);
    setSelectedStatus(validStatus);
  }

  const handleStatusChange = (nextStatus: FilterStatus) => {
    setSelectedStatus(nextStatus);

    const current = new URLSearchParams(searchParams.toString());
    if (nextStatus === "all") {
      current.delete("status");
    } else {
      current.set("status", nextStatus);
    }

    const qs = current.toString();
    router.push(qs ? `?${qs}` : "?", { scroll: false });
  };

  const handleRefresh = () => {
    router.refresh();
  };

  const formatDate = (dateValue?: string) => {
    if (!dateValue) return "N/A";
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return dateValue;
    return parsed.toISOString().split("T")[0];
  };

  const renderStatusBadges = (booking: RepairRequestBooking) => {
    const badge = statusStyleMap[booking.status] || statusStyleMap.requested;
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="outline" className={badge.className}>
          {badge.label}
        </Badge>
        {booking.status === "completed" && (
          <Badge
            variant="outline"
            className={
              booking.paymentStatus === "paid"
                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/35 text-[11px]"
                : "bg-amber-500/10 text-amber-700 border-amber-500/35 text-[11px]"
            }
          >
            {booking.paymentStatus === "paid" ? "Paid" : "Unpaid"}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-1 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/85 px-5 py-4 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            All Bookings ({bookings.length})
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Server-filtered repair bookings across all customers and technicians.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="rounded-xl cursor-pointer self-start sm:self-auto bg-[#EBECE4] border-[#C2C0B1] hover:bg-[#E2E1D8]"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>

      {/* Server-side Status Filter Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((item) => (
          <Button
            key={item.key}
            type="button"
            size="sm"
            variant={selectedStatus === item.key ? "default" : "outline"}
            onClick={() => handleStatusChange(item.key)}
            className={`rounded-xl cursor-pointer shrink-0 text-xs sm:text-sm ${
              selectedStatus === item.key
                ? ""
                : "bg-[#EBECE4] border-[#C2C0B1] hover:bg-[#E2E1D8]"
            }`}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <Card className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs">
        <CardContent className="p-4 sm:p-6">
          {bookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#C2C0B1] bg-[#E2E1D8]/50 py-10 sm:py-12 px-4 text-center space-y-2">
              <p className="text-sm font-medium text-foreground">
                No bookings found
              </p>
              <p className="text-xs text-muted-foreground">
                No bookings match the selected status on the server.
              </p>
              {selectedStatus !== "all" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 rounded-xl cursor-pointer bg-[#EBECE4] border-[#C2C0B1]"
                  onClick={() => handleStatusChange("all")}
                >
                  Show All Bookings
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Mobile & Tablet Card View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:hidden">
                {bookings.map((booking) => {
                  const displayAmount =
                    booking.status === "completed"
                      ? Number(booking.finalAmount ?? booking.basePrice ?? 0)
                      : Number(booking.basePrice ?? 0);

                  return (
                    <div
                      key={booking._id}
                      className="rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/55 p-4 space-y-3 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm text-foreground truncate">
                              {booking.serviceTitle}
                            </h3>
                            <p className="text-xs text-foreground/85 flex items-center gap-1 mt-0.5 truncate">
                              <User className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="truncate">
                                {booking.customerName}
                              </span>
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {booking.customerEmail}
                            </p>
                          </div>
                          <div className="shrink-0">
                            {renderStatusBadges(booking)}
                          </div>
                        </div>

                        {booking.technicianEmail && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
                            <Wrench className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="truncate">
                              Tech: {booking.technicianEmail}
                            </span>
                          </p>
                        )}

                        {booking.problemDescription && (
                          <p className="text-xs text-muted-foreground line-clamp-2 flex items-start gap-1.5">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                            <span>{booking.problemDescription}</span>
                          </p>
                        )}

                        <div className="space-y-1.5 text-xs text-foreground/85 border-t border-[#C2C0B1] pt-2.5">
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="truncate">
                              {booking.customerPhone || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                            <span className="line-clamp-2">
                              {booking.address || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-0.5">
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span>{formatDate(booking.preferredDate)}</span>
                            </span>
                            <div className="text-right">
                              <span className="font-bold text-sm text-foreground">
                                ${displayAmount.toFixed(2)}
                              </span>
                              <span className="block text-[10px] text-muted-foreground">
                                {booking.status === "completed"
                                  ? "Final"
                                  : "Base Price"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-[#C2C0B1] bg-[#EBECE4]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#C2C0B1] bg-[#E2E1D8] text-xs uppercase text-muted-foreground">
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Service & Technician</th>
                      <th className="py-3 px-3">Address & Date</th>
                      <th className="py-3 px-3">Amount</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C2C0B1] text-sm align-top">
                    {bookings.map((booking) => {
                      const displayAmount =
                        booking.status === "completed"
                          ? Number(
                              booking.finalAmount ?? booking.basePrice ?? 0
                            )
                          : Number(booking.basePrice ?? 0);

                      return (
                        <tr
                          key={booking._id}
                          className="hover:bg-[#E2E1D8]/55 transition-colors"
                        >
                          <td className="py-4 px-3 min-w-[180px]">
                            <div className="font-semibold text-foreground">
                              {booking.customerName}
                            </div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {booking.customerEmail}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-foreground/80">
                              <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span>{booking.customerPhone || "N/A"}</span>
                            </div>
                          </td>

                          <td className="py-4 px-3 max-w-[270px]">
                            <div className="font-semibold text-foreground">
                              {booking.serviceTitle}
                            </div>
                            {booking.technicianEmail && (
                              <div className="text-xs text-muted-foreground truncate mt-0.5">
                                Tech: {booking.technicianEmail}
                              </div>
                            )}
                            {booking.problemDescription && (
                              <p className="mt-1 text-xs text-muted-foreground line-clamp-2 flex items-start gap-1">
                                <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                                <span>{booking.problemDescription}</span>
                              </p>
                            )}
                          </td>

                          <td className="py-4 px-3 min-w-[185px]">
                            <div className="flex items-start gap-1.5 text-xs text-foreground/85">
                              <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                              <span>{booking.address || "N/A"}</span>
                            </div>
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span>{formatDate(booking.preferredDate)}</span>
                            </div>
                          </td>

                          <td className="py-4 px-3 whitespace-nowrap">
                            <div className="font-semibold text-foreground">
                              ${displayAmount.toFixed(2)}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {booking.status === "completed"
                                ? "Final Amount"
                                : `Base: $${Number(booking.basePrice ?? 0).toFixed(2)}`}
                            </div>
                          </td>

                          <td className="py-4 px-3 whitespace-nowrap">
                            {renderStatusBadges(booking)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}