import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
import { RepairRequestBooking } from "@/app/types";
import TechnicianRequestsClient from "@/components/shared/TechnicianRequestsClient";
import { getSession } from "@/lib/core/server";
import { technicianBookingData } from "@/lib/actions/bookings";

export const instant = false;

async function TechnicianRequests() {
  const session = await getSession();

  const technicianEmail = session?.user?.email?.trim().toLowerCase();

  if (!technicianEmail) {
    redirect("/sign-in");
  }

  let bookings: RepairRequestBooking[] = [];

  try {
    const data = await technicianBookingData(technicianEmail);
    bookings = Array.isArray(data)
      ? data
      : Array.isArray(data?.bookings)
        ? data.bookings
        : Array.isArray(data?.data)
          ? data.data
          : [];
  } catch (error) {
    console.error("Error loading technician bookings:", error);
  }

  return (
    <TechnicianRequestsClient
      initialBookings={bookings}
      initialTechnicianEmail={technicianEmail}
    />
  );
}

function RequestsFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <p className="text-sm">Loading technician requests...</p>
    </div>
  );
}

const RequestsPage = () => {
  return (
    <Suspense fallback={<RequestsFallback />}>
      <TechnicianRequests />
    </Suspense>
  );
};

export default RequestsPage;