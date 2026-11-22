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

  return (
    <div className="rounded-3xl border border-[#C2C0B1] bg-[#EBECE4] p-4 sm:p-6 shadow-xs">
      <div className="rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/55 p-3 sm:p-5">
        <MyServices initialServices={initialServices} />
      </div>
    </div>
  );
}