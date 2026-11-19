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
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Service Management
        </h2>
        <p className="text-sm text-muted-foreground">
          Review, approve, reject, or manage all technician-submitted services.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-border/70 bg-card text-muted-foreground gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm">Loading services...</p>
          </div>
        }
      >
        <ServicesDataWrapper />
      </Suspense>
    </div>
  );
}