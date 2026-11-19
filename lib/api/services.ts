"use server";
import { IServiceItem } from "@/app/types";
import { notFound } from "next/navigation";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const Services = async (query = "") => {
  const res = await fetch(`${BASE_URL}/services?${query}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    notFound();
  }
  return res.json();
};
export async function getServiceDetails(
  id: string,
): Promise<IServiceItem | null> {
  const res = await fetch(`${BASE_URL}/services/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }
  return res.json();
}

export const getApprovedServices = async () => {
  const res = await fetch(
    `${BASE_URL}/services?approvalStatus=approved&isAvailable=true`,
    {
      cache: "no-store",
    },
  );
  if(!res.ok) {
    notFound()
  }
  return res.json()
};
