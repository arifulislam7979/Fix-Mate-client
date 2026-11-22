"use server";
import { IServices } from "@/app/types";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { getToken } from "../core/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const getService = async (data: IServices) => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateServices = async (id: string, data: unknown) => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/services/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  revalidatePath("/dashboard/technician/my-services");
  return res.json();
};

export const deleteServices = async (id: string) => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/services/${id}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const statusUpdate = async (id: string, data: unknown) => {
     const token = await getToken()
  const res = await fetch(`${BASE_URL}/services/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const latestService = async () => {
  const res = await fetch(`${BASE_URL}/services/latest`, {
    cache: "no-store",
  });
  if (!res.ok) {
    notFound();
  }
  return res.json();
};
