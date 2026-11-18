import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import MyServices, { IServiceItem } from "@/components/shared/MyServices";
import { Services } from "@/lib/api/services";

async function getTechnicianServices(email: string): Promise<IServiceItem[]> {
  try {
    const result = await Services(`technicianEmail=${email}`);

    if (Array.isArray(result)) {
      return result;
    }
    if (Array.isArray(result?.services)) {
      return result.services;
    }
    if (Array.isArray(result?.data)) {
      return result.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching technician services:", error);
    return [];
  }
}

export default async function MyServicesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const initialServices = await getTechnicianServices(session.user.email);

  return <MyServices initialServices={initialServices} />;
}