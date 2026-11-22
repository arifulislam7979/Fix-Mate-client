import React, { Suspense } from "react";
import AdminBookingsClient from "@/components/shared/AdminBookings";
import { getAllBookings } from "@/lib/actions/bookings";

interface BookingsPageProps {
  searchParams?: Promise<{ status?: string }> | { status?: string };
}

const BookingsPage = async ({ searchParams }: BookingsPageProps) => {
  const resolvedParams = await Promise.resolve(searchParams);
  const initialStatus = resolvedParams?.status || "all";
  const initialBookings = await getAllBookings(initialStatus);

  const normalizedBookings = Array.isArray(initialBookings)
    ? initialBookings
    : Array.isArray(initialBookings?.bookings)
      ? initialBookings.bookings
      : Array.isArray(initialBookings?.data)
        ? initialBookings.data
        : [];

  return (
    <div className="min-h-full rounded-3xl bg-[#EBECE4]/65 p-3 sm:p-6">
      <Suspense
        fallback={
          <div className="p-6 rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] text-sm text-muted-foreground">
            Loading bookings...
          </div>
        }
      >
        <AdminBookingsClient
          initialBookings={normalizedBookings}
          initialStatus={initialStatus}
        />
      </Suspense>
    </div>
  );
};

export default BookingsPage;