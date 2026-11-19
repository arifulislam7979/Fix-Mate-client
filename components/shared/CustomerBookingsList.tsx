"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import Image from "next/image";
import { cancelBooking } from "@/lib/actions/bookings";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

const STATUS_BADGE_STYLES: Record<string, string> = {
  requested: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  accepted: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30",
  "in-progress": "bg-amber-500/15 text-amber-600 border-amber-500/30",
  completed: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  rejected: "bg-rose-500/15 text-rose-600 border-rose-500/30",
  cancelled: "bg-slate-500/15 text-slate-600 border-slate-500/30",
};

interface CustomerBookingsListProps {
  initialBookings: Bookings[];
  customerEmail: string;
}

export default function CustomerBookingsList({
  initialBookings,
  customerEmail,
}: CustomerBookingsListProps) {
  const router = useRouter();
  const [bookings, setBookings] = useState<Bookings[]>(initialBookings);
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

  const handleConfirmCancel = async () => {
    if (!bookingToCancel?._id) return;

    try {
      setCancelling(true);
      const result = await cancelBooking(bookingToCancel._id);

      if (result?.success || result?.modifiedCount > 0 || result?._id) {
        toast.success("Booking request cancelled.");
        setBookings((prev) =>
          prev.map((item) =>
            item._id === bookingToCancel._id
              ? { ...item, status: "cancelled" as Bookings["status"] }
              : item,
          ),
        );
        setBookingToCancel(null);
        router.refresh();
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
      const res = await fetch(
        `${BASE_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: booking._id,
            customerEmail: customerEmail || booking.customerEmail,
          }),
        },
      );

      const data = await res.json();

      if (res.ok && data?.url) {
        window.location.href = data.url;
      } else {
        toast.error(data?.message || "Failed to start Stripe checkout.");
      }
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

  if (visibleBookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
        <PackageOpen className="h-11 w-11 text-muted-foreground/70 mb-3" />
        <h2 className="text-lg font-semibold">No bookings yet</h2>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          You haven&apos;t requested any device or home appliance repair yet.
          Explore approved services to get started.
        </p>
        <Link href="/services" className="mt-5">
          <Button className="rounded-xl cursor-pointer">
            Explore Repair Services
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="py-3.5 px-4">Service</th>
                <th className="py-3.5 px-4">Technician</th>
                <th className="py-3.5 px-4">Preferred Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70 text-sm">
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
                  <tr
                    key={booking._id}
                    className="hover:bg-muted/25 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-border shrink-0">
                          <Image
                            src={booking.serviceImage || "/placeholder.png"}
                            alt={booking.serviceTitle}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold line-clamp-1">
                            {booking.serviceTitle}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-medium">{booking.technicianName}</p>
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {booking.preferredDate
                          ? new Date(booking.preferredDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold">
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
                          "bg-muted text-foreground border-border"
                        }`}
                      >
                        {statusKey.replace("-", " ")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/30 px-2.5 py-0.5 text-xs font-semibold">
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
                            className="rounded-lg cursor-pointer"
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
              className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-border shrink-0">
                  <Image
                    src={booking.serviceImage || "/placeholder.png"}
                    alt={booking.serviceTitle}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate">
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

              <div className="flex items-center justify-between pt-2 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      STATUS_BADGE_STYLES[statusKey] ||
                      "bg-muted text-foreground border-border"
                    }`}
                  >
                    {statusKey.replace("-", " ")}
                  </span>
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold">
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/30 px-2.5 py-0.5 text-xs font-semibold">
                      Unpaid
                    </span>
                  )}
                </div>

                <p className="font-bold text-sm">
                  ${Number(displayAmount || 0).toFixed(2)}
                </p>
              </div>

              {(canPay || canCancel || canRemoveFromUi) && (
                <div className="flex items-center justify-end gap-2 pt-2">
                  {canPay && (
                    <Button
                      size="sm"
                      onClick={() => handlePayNow(booking)}
                      disabled={payingId === booking._id}
                      className="rounded-lg cursor-pointer"
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
          );
        })}
      </div>

      {/* Cancel Confirmation Modal */}
      {bookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Cancel Repair Request?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Are you sure you want to cancel your request for{" "}
                  <strong className="text-foreground">
                    {bookingToCancel.serviceTitle}
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBookingToCancel(null)}
                disabled={cancelling}
                className="rounded-xl cursor-pointer"
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
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Remove from List?</h3>
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

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBookingToRemoveFromUi(null)}
                className="rounded-xl cursor-pointer"
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
