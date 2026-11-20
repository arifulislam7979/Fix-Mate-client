import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";
import CustomerBookingsList from "@/components/shared/CustomerBookingsList";
import { getCustomerBookings } from "@/lib/actions/bookings";

const CustomerBookings = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in?redirectTo=/dashboard/customer/bookings");
  }

  const bookings = await getCustomerBookings(session.user.email);
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-sm text-muted-foreground">
            Track your repair requests, cancel pending requests, and pay after
            completion.
          </p>
        </div>
        <Link href="/services">
          <Button className="rounded-xl cursor-pointer">
            <Wrench className="mr-2 h-4 w-4" />
            Browse Services
          </Button>
        </Link>
      </div>

      <CustomerBookingsList
        initialBookings={bookings}
        customerEmail={session.user.email}
      />
    </div>
  );
};

export default CustomerBookings;