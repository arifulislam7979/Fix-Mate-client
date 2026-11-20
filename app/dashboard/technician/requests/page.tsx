import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
import { RepairRequestBooking } from "@/app/types";
import TechnicianRequestsClient from "@/components/shared/TechnicianRequestsClient";
import { getSession } from "@/lib/core/server";
import { technicianBookingData } from "@/lib/actions/bookings";

export const instant = false;

interface RequestsPageProps {
  searchParams?:
    | Promise<{ status?: string; search?: string }>
    | { status?: string; search?: string };
}

async function TechnicianRequests({ searchParams }: RequestsPageProps) {
  const session = await getSession();

  const technicianEmail = session?.user?.email?.trim().toLowerCase();

  if (!technicianEmail) {
    redirect("/sign-in");
  }

  const resolvedParams = await Promise.resolve(searchParams);
  const initialStatus = (resolvedParams?.status || "all").toLowerCase();
  const initialSearch = resolvedParams?.search || "";

  let bookings: RepairRequestBooking[] = [];

  try {
    const data = await technicianBookingData(technicianEmail, {
      status: initialStatus,
      search: initialSearch,
    });
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
      initialStatus={initialStatus}
      initialSearch={initialSearch}
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

const RequestsPage = (props: RequestsPageProps) => {
  return (
    <Suspense fallback={<RequestsFallback />}>
      <TechnicianRequests searchParams={props.searchParams} />
    </Suspense>
  );
};

export default RequestsPage;