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

export interface ApprovedServicesQueryParams {
  q?: string;
  category?: string;
  mode?: string;
  sort?: string;
}
export const getApprovedServices = async (
  params: ApprovedServicesQueryParams = {},
) => {
  const url = new URL(`${BASE_URL}/services`);
  url.searchParams.set("approvalStatus", "approved");
  url.searchParams.set("isAvailable", "true");

  const q = params.q?.trim();
  const category = params.category?.trim();
  const mode = params.mode?.trim();
  const sort = params.sort?.trim();

  if (q) {
    url.searchParams.set("q", q);
  }
  if (category && category.toLowerCase() !== "all") {
    url.searchParams.set("category", category);
  }
  if (mode && mode.toLowerCase() !== "all") {
    url.searchParams.set("mode", mode);
  }
  if (sort && sort.toLowerCase() !== "newest") {
    url.searchParams.set("sort", sort);
  }

  const res = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!res.ok) {
    notFound();
  }
  return res.json();
};
