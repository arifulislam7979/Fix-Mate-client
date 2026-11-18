

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { IServiceItem } from "@/components/shared/MyServices";
import EditService from "@/components/shared/EditService";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getServiceDetails(id: string): Promise<IServiceItem | null> {
  try {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.service || data;
  } catch (error) {
    console.error("Error fetching service details:", error);
    return null;
  }
}

export default async function ServiceEditPage({ params }: { params: { id: string } }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const service = await getServiceDetails(params.id);

  if (!service) {
    return (
      <div className="text-center py-20 space-y-3">
        <h2 className="text-xl font-bold">Service Not Found</h2>
        <p className="text-sm text-muted-foreground">The service you are trying to edit does not exist.</p>
      </div>
    );
  }

  return <EditService service={service} />;
}