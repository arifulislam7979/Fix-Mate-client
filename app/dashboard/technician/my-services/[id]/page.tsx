import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import EditService from "@/components/shared/EditService";
import { getServiceDetails } from "@/lib/api/services";
import { Wrench } from "lucide-react";

export default async function ServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const service = await getServiceDetails(id);

  if (!service) {
    return (
      <div className="max-w-2xl mx-auto rounded-3xl border border-[#C2C0B1] bg-[#EBECE4] p-6 sm:p-8 shadow-xs">
        <div className="rounded-2xl border border-dashed border-[#C2C0B1] bg-[#E2E1D8]/55 text-center py-16 px-6 space-y-3">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/25">
            <Wrench className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Service Not Found
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The service you are trying to edit does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#C2C0B1] bg-[#EBECE4] p-4 sm:p-6 shadow-xs">
      <div className="rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/55 p-3 sm:p-5">
        <EditService service={service} />
      </div>
    </div>
  );
}
