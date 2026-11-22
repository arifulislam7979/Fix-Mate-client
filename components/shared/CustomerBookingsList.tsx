"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bookings } from "@/app/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Calendar,
  CreditCard,
  XCircle,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  PackageOpen,
  Trash2,
  Search,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import { cancelBooking } from "@/lib/actions/bookings";
import { createPayment } from "@/lib/actions/payment";

const STATUS_BADGE_STYLES: Record<string, string> = {
  requested: "bg-blue-500/15 text-blue-700 border-blue-500/35",
  accepted: "bg-indigo-500/15 text-indigo-700 border-indigo-500/35",
  "in-progress": "bg-amber-500/15 text-amber-700 border-amber-500/35",
  completed: "bg-emerald-500/15 text-emerald-700 border-emerald-500/35",
  rejected: "bg-rose-500/15 text-rose-700 border-rose-500/35",
  cancelled: "bg-slate-500/15 text-slate-700 border-slate-500/35",
};

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Accepted", value: "accepted" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Rejected", value: "rejected" },
];

interface CustomerBookingsListProps {
  initialBookings: Bookings[];
  customerEmail: string;
  initialStatus?: string;
  initialSearch?: string;
}

export default function CustomerBookingsList({
  initialBookings,
  customerEmail,
  initialStatus = "all",
  initialSearch = "",
}: CustomerBookingsListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, Bookings["status"]>
  >({});
  const [selectedStatus, setSelectedStatus] = useState<string>(
    initialStatus.toLowerCase() || "all",
  );
  const [searchInput, setSearchInput] = useState<string>(initialSearch);

  const [payingId, setPayingId] = useState<string | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Bookings | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const [bookingToRemoveFromUi, setBookingToRemoveFromUi] =
    useState<Bookings | null>(null);

  const storageKey = `hidden_cancelled_bookings_${customerEmail || "guest"}`;

  const [hiddenIds, setHiddenIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const bookings = initialBookings.map((item) =>
    item._id && statusOverrides[item._id]
      ? { ...item, status: statusOverrides[item._id] }
      : item,
  );

  const applyBackendFilters = (nextStatus: string, nextSearch: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextStatus && nextStatus.toLowerCase() !== "all") {
      params.set("status", nextStatus.toLowerCase());
    } else {
      params.delete("status");
    }

    if (nextSearch.trim()) {
      params.set("search", nextSearch.trim());
    } else {
      params.delete("search");
    }

    const queryString = params.toString();
    startTransition(() => {
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
      router.refresh();
    });
  };

  const handleStatusChange = (statusValue: string) => {
    setSelectedStatus(statusValue);
    applyBackendFilters(statusValue, searchInput);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyBackendFilters(selectedStatus, searchInput);
  };

  const handleResetFilters = () => {
    setSelectedStatus("all");
    setSearchInput("");
    applyBackendFilters("all", "");
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel?._id) return;

    try {
      setCancelling(true);
      const result = await cancelBooking(bookingToCancel._id);

      if (result?.success || result?.modifiedCount > 0 || result?._id) {
        toast.success("Booking request cancelled.");
        const targetId = bookingToCancel._id;
        setStatusOverrides((prev) => ({
          ...prev,
          [targetId]: "cancelled" as Bookings["status"],
        }));
        setBookingToCancel(null);
        startTransition(() => {
          router.refresh();
        });
      } else {
        toast.error(result?.message || "Could not cancel this booking.");
      }
    } catch (error) {
      console.error("Cancel booking error:", error);
      toast.error("Something went wrong while cancelling.");
    } finally {
      setCancelling(false);
    }
  };

  const handleRemoveFromUi = () => {
    if (!bookingToRemoveFromUi?._id) return;

    const updatedHidden = Array.from(
      new Set([...hiddenIds, bookingToRemoveFromUi._id]),
    );
    setHiddenIds(updatedHidden);

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedHidden));
    } catch (error) {
      console.error("Failed to save hidden booking preference:", error);
    }

    toast.success("Removed from your bookings view.");
    setBookingToRemoveFromUi(null);
  };

  const handlePayNow = async (booking: Bookings) => {
    if (!booking._id) return;

    try {
      setPayingId(booking._id);

      const data = await createPayment(booking);

      if (typeof data?.url === "string" && data.url.trim().length > 0) {
        window.location.assign(data.url.trim());
        return;
      }

      toast.error(data?.message || "Failed to start Stripe checkout.");
    } catch (error) {
      console.error("Payment session error:", error);
      toast.error("Could not initiate payment. Please try again.");
    } finally {
      setPayingId(null);
    }
  };

  const visibleBookings = bookings.filter(
    (item) => !item._id || !hiddenIds.includes(item._id),
  );

  const hasActiveFilter =
    selectedStatus !== "all" || searchInput.trim().length > 0;

  return (
    <>
      {/* Backend Filter Controls */}
      <div className="rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/80 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Status Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTER_OPTIONS.map((option) => {
              const isActive = selectedStatus === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleStatusChange(option.value)}
                  disabled={isPending}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                      : "bg-[#EBECE4] text-muted-foreground border-[#C2C0B1] hover:bg-[#E2E1D8] hover:text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Search Input + Reset */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 w-full lg:w-auto"
          >
            <div className="relative flex-1 lg:w-64">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search service, address..."
                className="w-full h-9 rounded-xl border border-[#C2C0B1] bg-[#EBECE4] text-foreground placeholder:text-muted-foreground/80 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="h-9 rounded-xl cursor-pointer font-semibold"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>

            {hasActiveFilter && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleResetFilters}
                disabled={isPending}
                className="h-9 rounded-xl cursor-pointer bg-[#EBECE4] border-[#C2C0B1] hover:bg-[#E2E1D8] text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            )}
          </form>
        </div>
      </div>

      {visibleBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#C2C0B1] bg-[#E2E1D8]/55 px-6 py-14 text-center">
          <PackageOpen className="h-11 w-11 text-muted-foreground/75 mb-3" />
          <h2 className="text-lg font-semibold text-foreground">
            {hasActiveFilter ? "No matching bookings found" : "No bookings yet"}
          </h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {hasActiveFilter
              ? "Try changing or resetting your status or search filter."
              : "You haven't requested any device or home appliance repair yet. Explore approved services to get started."}
          </p>
          {hasActiveFilter ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleResetFilters}
              className="mt-5 rounded-xl cursor-pointer bg-[#EBECE4] border-[#C2C0B1] hover:bg-[#E2E1D8] text-foreground"
            >
              Reset Filters
            </Button>
          ) : (
            <Link href="/services" className="mt-5">
              <Button className="rounded-xl cursor-pointer font-semibold">
                Explore Repair Services
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#C2C0B1] bg-[#E2E1D8]/85 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Technician</th>
                    <th className="py-3.5 px-4">Preferred Date</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C2C0B1] text-sm">
                  {visibleBookings.map((booking) => {
                    const statusKey = (
                      booking.status || "requested"
                    ).toLowerCase();
                    const isPaid = booking.paymentStatus === "paid";
                    const canCancel = statusKey === "requested";
                    const canPay = statusKey === "completed" && !isPaid;
                    const canRemoveFromUi = statusKey === "cancelled";
                    const displayAmount =
                      statusKey === "completed" && booking.finalAmount
                        ? booking.finalAmount
                        : booking.basePrice;

                    return (
                      <tr
                        key={booking._id}
                        className="hover:bg-[#E2E1D8]/50 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-[#C2C0B1] bg-[#E2E1D8] shrink-0">
                              <Image
                                src={booking.serviceImage || "/placeholder.png"}
                                alt={booking.serviceTitle}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground line-clamp-1">
                                {booking.serviceTitle}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {booking.category}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-medium text-foreground">
                            {booking.technicianName}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            {booking.preferredDate
                              ? new Date(
                                  booking.preferredDate,
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-foreground">
                          ${Number(displayAmount || 0).toFixed(2)}
                          {statusKey !== "completed" && (
                            <span className="block text-[11px] font-normal text-muted-foreground">
                              Base price
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                              STATUS_BADGE_STYLES[statusKey] ||
                              "bg-[#E2E1D8] text-foreground border-[#C2C0B1]"
                            }`}
                          >
                            {statusKey.replace("-", " ")}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/35 px-2.5 py-0.5 text-xs font-semibold">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/35 px-2.5 py-0.5 text-xs font-semibold">
                              Unpaid
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            {canPay && (
                              <Button
                                size="sm"
                                onClick={() => handlePayNow(booking)}
                                disabled={payingId === booking._id}
                                className="rounded-lg cursor-pointer font-semibold"
                              >
                                {payingId === booking._id ? (
                                  <>
                                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    Redirecting...
                                  </>
                                ) : (
                                  <>
                                    <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                                    Pay Now
                                  </>
                                )}
                              </Button>
                            )}

                            {canCancel && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setBookingToCancel(booking)}
                                className="rounded-lg cursor-pointer hover:text-red-500"
                              >
                                <XCircle className="mr-1.5 h-3.5 w-3.5" />
                                Cancel
                              </Button>
                            )}

                            {canRemoveFromUi && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setBookingToRemoveFromUi(booking)}
                                className="rounded-lg text-muted-foreground hover:text-rose-600 cursor-pointer"
                              >
                                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                Remove
                              </Button>
                            )}

                            {!canPay && !canCancel && !canRemoveFromUi && (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {visibleBookings.map((booking) => {
              const statusKey = (booking.status || "requested").toLowerCase();
              const isPaid = booking.paymentStatus === "paid";
              const canCancel = statusKey === "requested";
              const canPay = statusKey === "completed" && !isPaid;
              const canRemoveFromUi = statusKey === "cancelled";
              const displayAmount =
                statusKey === "completed" && booking.finalAmount
                  ? booking.finalAmount
                  : booking.basePrice;

              return (
                <div
                  key={booking._id}
                  className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs overflow-hidden"
                >
                  <div className="p-4 bg-[#E2E1D8]/55 border-b border-[#C2C0B1] flex items-start gap-3">
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-[#C2C0B1] bg-[#E2E1D8] shrink-0">
                      <Image
                        src={booking.serviceImage || "/placeholder.png"}
                        alt={booking.serviceTitle}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {booking.serviceTitle}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Tech: {booking.technicianName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Date:{" "}
                        {booking.preferredDate
                          ? new Date(booking.preferredDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 space-y-3 bg-[#EBECE4]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                            STATUS_BADGE_STYLES[statusKey] ||
                            "bg-[#E2E1D8] text-foreground border-[#C2C0B1]"
                          }`}
                        >
                          {statusKey.replace("-", " ")}
                        </span>
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/35 px-2.5 py-0.5 text-xs font-semibold">
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/35 px-2.5 py-0.5 text-xs font-semibold">
                            Unpaid
                          </span>
                        )}
                      </div>

                      <p className="font-bold text-sm text-foreground">
                        ${Number(displayAmount || 0).toFixed(2)}
                      </p>
                    </div>

                    {(canPay || canCancel || canRemoveFromUi) && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#C2C0B1]">
                        {canPay && (
                          <Button
                            size="sm"
                            onClick={() => handlePayNow(booking)}
                            disabled={payingId === booking._id}
                            className="rounded-lg cursor-pointer font-semibold"
                          >
                            {payingId === booking._id ? (
                              <>
                                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                Redirecting...
                              </>
                            ) : (
                              <>
                                <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                                Pay Now
                              </>
                            )}
                          </Button>
                        )}
                        {canCancel && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setBookingToCancel(booking)}
                            className="rounded-lg cursor-pointer"
                          >
                            <XCircle className="mr-1.5 h-3.5 w-3.5" />
                            Cancel
                          </Button>
                        )}
                        {canRemoveFromUi && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setBookingToRemoveFromUi(booking)}
                            className="rounded-lg text-muted-foreground hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                            Remove
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Cancel Confirmation Modal */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xl overflow-hidden">
            <div className="p-5 bg-[#E2E1D8]/80 border-b border-[#C2C0B1] flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-700 border border-rose-500/30">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Cancel Repair Request?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Are you sure you want to cancel your request for{" "}
                  <strong className="text-foreground">
                    {bookingToCancel.serviceTitle}
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-5 bg-[#EBECE4] flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBookingToCancel(null)}
                disabled={cancelling}
                className="rounded-xl cursor-pointer bg-[#E2E1D8]/75 border-[#C2C0B1] hover:bg-[#E2E1D8] text-foreground"
              >
                Keep Request
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="rounded-xl cursor-pointer"
              >
                {cancelling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Cancelled Booking from UI Only Modal */}
      {bookingToRemoveFromUi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xl overflow-hidden">
            <div className="p-5 bg-[#E2E1D8]/80 border-b border-[#C2C0B1] flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 border border-amber-500/30">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Remove from List?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  This only hides{" "}
                  <strong className="text-foreground">
                    {bookingToRemoveFromUi.serviceTitle}
                  </strong>{" "}
                  from your current bookings view; your booking history remains
                  saved.
                </p>
              </div>
            </div>

            <div className="p-5 bg-[#EBECE4] flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBookingToRemoveFromUi(null)}
                className="rounded-xl cursor-pointer bg-[#E2E1D8]/75 border-[#C2C0B1] hover:bg-[#E2E1D8] text-foreground"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleRemoveFromUi}
                className="rounded-xl cursor-pointer"
              >
                Remove from View
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}