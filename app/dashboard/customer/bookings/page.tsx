import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import CustomerBookingsList from "@/components/shared/CustomerBookingsList";
import { getCustomerBookings } from "@/lib/actions/bookings";

interface CustomerBookingsPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

const CustomerBookings = async ({
  searchParams,
}: CustomerBookingsPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in?redirectTo=/dashboard/customer/bookings");
  }

  const resolvedParams = await searchParams;
  const activeStatus = resolvedParams?.status || "all";
  const activeSearch = resolvedParams?.search || "";

  const bookings = await getCustomerBookings(session.user.email, {
    activeStatus,
    activeSearch,
  });

  return (
    <div className="space-y-6 rounded-3xl border border-[#C2C0B1] bg-[#EBECE4] p-4 sm:p-6 shadow-xs">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/85 px-5 py-4 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            My Bookings
          </h1>
          <p className="text-sm text-muted-foreground">
            Track your repair requests, cancel pending requests, and pay after
            completion.
          </p>
        </div>
        <Link href="/services" className="shrink-0">
          <Button className="rounded-xl cursor-pointer font-semibold shadow-xs">
            <Wrench className="mr-2 h-4 w-4" />
            Browse Services
          </Button>
        </Link>
      </div>

      <CustomerBookingsList
        initialBookings={bookings}
        customerEmail={session.user.email}
        initialStatus={activeStatus}
        initialSearch={activeSearch}
      />
    </div>
  );
};

export default CustomerBookings;