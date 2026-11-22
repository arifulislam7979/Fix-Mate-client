import { Suspense } from "react";
import ServicesManage from "@/components/shared/ServicesManage";
import { Services } from "@/lib/api/services";
import { Loader2 } from "lucide-react";

async function ServicesDataWrapper() {
  const services = await Services();
  return <ServicesManage initialServices={services || []} />;
}

export default function AdminServicesPage() {
  return (
    <div className="min-h-full rounded-3xl bg-[#EBECE4]/65 p-4 sm:p-6 pb-12">
      <div className="space-y-6">
        <div className="rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/85 px-5 py-4 shadow-xs">
          <h2 className="text-2xl font-bold tracking-tight">
            Service Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Review, approve, reject, or manage all technician-submitted services.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] text-muted-foreground gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm">Loading services...</p>
            </div>
          }
        >
          <ServicesDataWrapper />
        </Suspense>
      </div>
    </div>
  );
}