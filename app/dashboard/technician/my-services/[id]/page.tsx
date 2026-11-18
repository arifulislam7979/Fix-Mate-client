import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import EditService from "@/components/shared/EditService";
import { getServiceDetails } from "@/lib/api/services";

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
      <div className="text-center py-20 space-y-3">
        <h2 className="text-xl font-bold">Service Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The service you are trying to edit does not exist.
        </p>
      </div>
    );
  }

  return <EditService service={service} />;
}
