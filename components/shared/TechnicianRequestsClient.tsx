"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  XCircle,
  Play,
  ClipboardCheck,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Search,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { BookingStatus, RepairRequestBooking } from "@/app/types";
import { bookingStatusUpdate } from "@/lib/actions/bookings";

const statusStyleMap: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  requested: {
    label: "Requested",
    className: "bg-blue-500/15 text-blue-700 border-blue-500/35",
  },
  accepted: {
    label: "Accepted",
    className: "bg-indigo-500/15 text-indigo-700 border-indigo-500/35",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-amber-500/15 text-amber-700 border-amber-500/35",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/35",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-500/15 text-rose-700 border-rose-500/35",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-500/15 text-slate-700 border-slate-500/35",
  },
};

type RequestFilterStatus =
  | "all"
  | "requested"
  | "accepted"
  | "in-progress"
  | "completed"
  | "rejected"
  | "canceled";

const STATUS_TABS: Array<{ key: RequestFilterStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "rejected", label: "Rejected" },
  { key: "canceled", label: "Cancelled" },
];

export interface BookingStatusUpdatePayload {
  status: BookingStatus;
  technicianEmail?: string;
  finalAmount?: number;
}

interface TechnicianRequestsClientProps {
  initialBookings?: RepairRequestBooking[];
  initialTechnicianEmail?: string;
  initialStatus?: string;
  initialSearch?: string;
}

export default function TechnicianRequestsClient({
  initialBookings = [],
  initialTechnicianEmail = "",
  initialStatus = "all",
  initialSearch = "",
}: TechnicianRequestsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const technicianEmail = (session?.user?.email || initialTechnicianEmail || "")
    .trim()
    .toLowerCase();

  const normalizedStatus: RequestFilterStatus = STATUS_TABS.some(
    (t) => t.key === (initialStatus || "all").toLowerCase(),
  )
    ? ((initialStatus || "all").toLowerCase() as RequestFilterStatus)
    : "all";

  const [bookings, setBookings] =
    useState<RepairRequestBooking[]>(initialBookings);
  const [selectedStatus, setSelectedStatus] =
    useState<RequestFilterStatus>(normalizedStatus);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const [rejectTarget, setRejectTarget] = useState<RepairRequestBooking | null>(
    null,
  );
  const [completeTarget, setCompleteTarget] =
    useState<RepairRequestBooking | null>(null);
  const [finalAmountInput, setFinalAmountInput] = useState<string>("");

  const [prevInitialBookings, setPrevInitialBookings] =
    useState<RepairRequestBooking[]>(initialBookings);
  const [prevSyncKey, setPrevSyncKey] = useState<string>(
    `${normalizedStatus}::${initialSearch}`,
  );

  if (initialBookings !== prevInitialBookings) {
    setPrevInitialBookings(initialBookings);
    setBookings(initialBookings);
  }

  const currentSyncKey = `${normalizedStatus}::${initialSearch}`;
  if (currentSyncKey !== prevSyncKey) {
    setPrevSyncKey(currentSyncKey);
    setSelectedStatus(normalizedStatus);
    setSearchTerm(initialSearch);
  }

  const syncServerQuery = (
    nextStatus: RequestFilterStatus,
    nextSearch: string,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", nextStatus);
    }

    const trimmedSearch = nextSearch.trim();
    if (trimmedSearch) {
      params.set("search", trimmedSearch);
    } else {
      params.delete("search");
    }

    const qs = params.toString();
    router.push(qs ? `?${qs}` : "?", { scroll: false });
  };

  const handleStatusSelect = (nextStatus: RequestFilterStatus) => {
    setSelectedStatus(nextStatus);
    syncServerQuery(nextStatus, searchTerm);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    syncServerQuery(selectedStatus, searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    syncServerQuery(selectedStatus, "");
  };

  const updateBookingStatus = async (
    bookingId: string,
    nextStatus: BookingStatus,
    finalAmount?: number,
  ) => {
    try {
      setSubmittingId(bookingId);

      const payload: BookingStatusUpdatePayload = {
        status: nextStatus,
        ...(technicianEmail ? { technicianEmail } : {}),
      };

      if (typeof finalAmount === "number") {
        payload.finalAmount = finalAmount;
      }

      const data = await bookingStatusUpdate(bookingId, payload);

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId
            ? {
                ...b,
                status: data?.booking?.status || nextStatus,
                finalAmount:
                  typeof data?.booking?.finalAmount === "number"
                    ? data.booking.finalAmount
                    : typeof finalAmount === "number"
                      ? finalAmount
                      : b.finalAmount,
              }
            : b,
        ),
      );

      router.refresh();
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Status update failed";
      toast.error(message);
      return false;
    } finally {
      setSubmittingId(null);
    }
  };

  const handleAccept = async (id: string) => {
    const ok = await updateBookingStatus(id, "accepted");
    if (ok) toast.success("Repair request accepted");
  };

  const confirmReject = async () => {
    if (!rejectTarget) return;
    const ok = await updateBookingStatus(rejectTarget._id, "rejected");
    if (ok) {
      toast.success("Repair request rejected");
      setRejectTarget(null);
    }
  };

  const handleStartWork = async (id: string) => {
    const ok = await updateBookingStatus(id, "in-progress");
    if (ok) toast.success("Job moved to In Progress");
  };

  const openCompleteModal = (booking: RepairRequestBooking) => {
    setCompleteTarget(booking);
    setFinalAmountInput(String(booking.finalAmount ?? booking.basePrice ?? ""));
  };

  const confirmComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeTarget) return;

    const numericAmount = Number(finalAmountInput);
    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Final amount must be greater than 0");
      return;
    }

    const ok = await updateBookingStatus(
      completeTarget._id,
      "completed",
      numericAmount,
    );
    if (ok) {
      toast.success(
        `Job marked completed with final amount $${numericAmount.toFixed(2)}`,
      );
      setCompleteTarget(null);
      setFinalAmountInput("");
    }
  };

  const formatDate = (dateValue: string) => {
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
                ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/35 text-[11px]"
                : "bg-amber-500/15 text-amber-700 border-amber-500/35 text-[11px]"
            }
          >
            {booking.paymentStatus === "paid" ? "Paid" : "Unpaid"}
          </Badge>
        )}
      </div>
    );
  };

  const renderActionButtons = (
    booking: RepairRequestBooking,
    fullWidthMobile = false,
  ) => {
    const isRowBusy = submittingId === booking._id;

    if (booking.status === "requested") {
      return (
        <div
          className={`flex items-center gap-2 ${
            fullWidthMobile ? "w-full" : "inline-flex justify-end"
          }`}
        >
          <Button
            size="sm"
            disabled={isRowBusy}
            className={`h-8 px-3 rounded-lg cursor-pointer font-semibold ${
              fullWidthMobile ? "flex-1" : ""
            }`}
            onClick={() => handleAccept(booking._id)}
          >
            {isRowBusy ? (
              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            )}
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={isRowBusy}
            className={`h-8 px-3 rounded-lg bg-[#EBECE4] border-[#C2C0B1] text-rose-700 hover:bg-rose-500/15 hover:border-rose-500/35 cursor-pointer ${
              fullWidthMobile ? "flex-1" : ""
            }`}
            onClick={() => setRejectTarget(booking)}
          >
            <XCircle className="h-3.5 w-3.5 mr-1" />
            Reject
          </Button>
        </div>
      );
    }

    if (booking.status === "accepted") {
      return (
        <Button
          size="sm"
          disabled={isRowBusy}
          className={`h-8 px-3 rounded-lg cursor-pointer font-semibold ${
            fullWidthMobile ? "w-full" : ""
          }`}
          onClick={() => handleStartWork(booking._id)}
        >
          {isRowBusy ? (
            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
          ) : (
            <Play className="h-3.5 w-3.5 mr-1" />
          )}
          Start Work
        </Button>
      );
    }

    if (booking.status === "in-progress") {
      return (
        <Button
          size="sm"
          disabled={isRowBusy}
          className={`h-8 px-3 rounded-lg cursor-pointer font-semibold ${
            fullWidthMobile ? "w-full" : ""
          }`}
          onClick={() => openCompleteModal(booking)}
        >
          <ClipboardCheck className="h-3.5 w-3.5 mr-1" />
          Mark Completed
        </Button>
      );
    }

    return (
      <span className="text-xs text-muted-foreground">No action available</span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-1 sm:px-0">
      {/* Header */}
      <div className="rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/85 px-5 py-4 shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Manage Repair Requests ({bookings.length})
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Server-filtered and searched repair requests sent to your services.
        </p>
      </div>

      {/* Server-side Filter & Search Controls */}
      <div className="rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/80 p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 md:pb-0">
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatus === tab.key;
            return (
              <Button
                key={tab.key}
                type="button"
                size="sm"
                variant={isActive ? "default" : "outline"}
                onClick={() => handleStatusSelect(tab.key)}
                className={`rounded-xl cursor-pointer shrink-0 text-xs sm:text-sm font-semibold ${
                  isActive
                    ? "shadow-2xs"
                    : "bg-[#EBECE4] border-[#C2C0B1] text-muted-foreground hover:bg-[#E2E1D8] hover:text-foreground"
                }`}
              >
                {tab.label}
              </Button>
            );
          })}
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 w-full md:w-auto"
        >
          <div className="relative flex-1 md:w-72">
            <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search service, customer, phone..."
              className="pl-9 pr-8 h-9 rounded-xl border border-[#C2C0B1] bg-[#EBECE4] text-foreground placeholder:text-muted-foreground/80 text-xs sm:text-sm focus-visible:bg-[#EBECE4] focus-visible:ring-2 focus-visible:ring-primary/30"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="text-muted-foreground hover:text-foreground absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            size="sm"
            className="h-9 rounded-xl cursor-pointer shrink-0 font-semibold"
          >
            Search
          </Button>
        </form>
      </div>

      <Card className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs overflow-hidden">
        <CardContent className="p-4 sm:p-6 bg-[#EBECE4]">
          {bookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#C2C0B1] bg-[#E2E1D8]/55 py-10 sm:py-12 px-4 text-center space-y-2">
              <p className="text-sm font-semibold text-foreground">
                No repair requests found
              </p>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                No requests match your current server filter or search query.
              </p>
              {(selectedStatus !== "all" || searchTerm.trim()) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2 rounded-xl cursor-pointer bg-[#EBECE4] border-[#C2C0B1] hover:bg-[#E2E1D8] text-foreground"
                  onClick={() => {
                    setSelectedStatus("all");
                    setSearchTerm("");
                    syncServerQuery("all", "");
                  }}
                >
                  Reset Filters
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
                      className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs flex flex-col justify-between overflow-hidden"
                    >
                      <div>
                        <div className="p-3.5 bg-[#E2E1D8]/65 border-b border-[#C2C0B1] flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-sm text-foreground break-words">
                              {booking.serviceTitle}
                            </h3>
                            <p className="text-xs font-medium text-foreground/85 break-words mt-0.5">
                              {booking.customerName}
                            </p>
                            <p className="text-[11px] text-muted-foreground break-all">
                              {booking.customerEmail}
                            </p>
                          </div>
                          <div className="shrink-0">
                            {renderStatusBadges(booking)}
                          </div>
                        </div>

                        <div className="p-3.5 space-y-2.5">
                          <p className="text-xs text-muted-foreground flex items-start gap-1.5 break-words">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                            <span>{booking.problemDescription}</span>
                          </p>

                          <div className="space-y-1.5 text-xs text-foreground/85 border-t border-[#C2C0B1] pt-2.5">
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="break-words">
                                {booking.customerPhone}
                              </span>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                              <span className="break-words">
                                {booking.address}
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

                      <div className="px-3.5 py-3 bg-[#E2E1D8]/45 border-t border-[#C2C0B1]">
                        {renderActionButtons(booking, true)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-[#C2C0B1]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#C2C0B1] bg-[#E2E1D8]/85 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                      <th className="py-3.5 px-3">Customer &amp; Contact</th>
                      <th className="py-3.5 px-3">Service &amp; Problem</th>
                      <th className="py-3.5 px-3">Address &amp; Date</th>
                      <th className="py-3.5 px-3">Amount</th>
                      <th className="py-3.5 px-3">Status</th>
                      <th className="py-3.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C2C0B1] text-sm align-top bg-[#EBECE4]">
                    {bookings.map((booking) => {
                      const displayAmount =
                        booking.status === "completed"
                          ? Number(
                              booking.finalAmount ?? booking.basePrice ?? 0,
                            )
                          : Number(booking.basePrice ?? 0);

                      return (
                        <tr
                          key={booking._id}
                          className="hover:bg-[#E2E1D8]/45 transition-colors"
                        >
                          <td className="py-4 px-3 min-w-[175px]">
                            <div className="font-semibold text-foreground">
                              {booking.customerName}
                            </div>
                            <div className="text-xs text-muted-foreground break-all max-w-[190px]">
                              {booking.customerEmail}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-foreground/80">
                              <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span>{booking.customerPhone}</span>
                            </div>
                          </td>

                          <td className="py-4 px-3 max-w-[260px]">
                            <div className="font-semibold text-foreground">
                              {booking.serviceTitle}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground flex items-start gap-1">
                              <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                              <span>{booking.problemDescription}</span>
                            </p>
                          </td>

                          <td className="py-4 px-3 min-w-[185px]">
                            <div className="flex items-start gap-1.5 text-xs text-foreground/85">
                              <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                              <span>{booking.address}</span>
                            </div>
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span>{formatDate(booking.preferredDate)}</span>
                            </div>
                          </td>

                          <td className="py-4 px-3 whitespace-nowrap">
                            <div className="font-bold text-foreground">
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

                          <td className="py-4 px-3 whitespace-nowrap text-right">
                            {renderActionButtons(booking, false)}
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

      {/* Reject Confirmation Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-3 sm:p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xl p-0">
            <CardHeader className="flex flex-row items-center justify-between px-5 py-4 bg-[#E2E1D8]/80 border-b border-[#C2C0B1]">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                Reject Repair Request?
              </CardTitle>
              <button
                type="button"
                onClick={() => setRejectTarget(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-[#EBECE4] hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="p-5 space-y-4 bg-[#EBECE4]">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Are you sure you want to reject{" "}
                <strong className="text-foreground">
                  {rejectTarget.customerName}
                </strong>
                &apos;s request for{" "}
                <strong className="text-foreground">
                  {rejectTarget.serviceTitle}
                </strong>
                ? Once rejected, this status cannot be changed.
              </p>
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={submittingId === rejectTarget._id}
                  className="rounded-xl cursor-pointer w-full sm:w-auto bg-[#E2E1D8]/75 border-[#C2C0B1] hover:bg-[#E2E1D8] text-foreground"
                  onClick={() => setRejectTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={submittingId === rejectTarget._id}
                  className="rounded-xl cursor-pointer w-full sm:w-auto"
                  onClick={confirmReject}
                >
                  {submittingId === rejectTarget._id
                    ? "Rejecting..."
                    : "Confirm Reject"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mark Completed Modal */}
      {completeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-3 sm:p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xl p-0">
            <CardHeader className="flex flex-row items-center justify-between px-5 py-4 bg-[#E2E1D8]/80 border-b border-[#C2C0B1]">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                Complete Job &amp; Set Final Amount
              </CardTitle>
              <button
                type="button"
                onClick={() => {
                  setCompleteTarget(null);
                  setFinalAmountInput("");
                }}
                className="rounded-lg p-1 text-muted-foreground hover:bg-[#EBECE4] hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="p-5 bg-[#EBECE4]">
              <form onSubmit={confirmComplete} className="space-y-4">
                <div className="text-xs sm:text-sm text-muted-foreground space-y-1 rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 p-3">
                  <p>
                    Service:{" "}
                    <strong className="text-foreground">
                      {completeTarget.serviceTitle}
                    </strong>
                  </p>
                  <p>
                    Base Price:{" "}
                    <strong className="text-foreground">
                      ${Number(completeTarget.basePrice ?? 0).toFixed(2)}
                    </strong>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="finalAmount"
                    className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Final Amount (USD)
                  </label>
                  <Input
                    id="finalAmount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={finalAmountInput}
                    onChange={(e) => setFinalAmountInput(e.target.value)}
                    className="rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 text-foreground focus-visible:bg-[#EBECE4] focus-visible:ring-2 focus-visible:ring-primary/30"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={submittingId === completeTarget._id}
                    className="rounded-xl cursor-pointer w-full sm:w-auto bg-[#E2E1D8]/75 border-[#C2C0B1] hover:bg-[#E2E1D8] text-foreground"
                    onClick={() => {
                      setCompleteTarget(null);
                      setFinalAmountInput("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submittingId === completeTarget._id}
                    className="rounded-xl cursor-pointer w-full sm:w-auto font-semibold"
                  >
                    {submittingId === completeTarget._id
                      ? "Saving..."
                      : "Mark Completed"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}