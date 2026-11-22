"use server";

import { Bookings, PaymentRecord } from "@/app/types";
import { notFound } from "next/navigation";
import { getToken } from "../core/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const createPayment = async (booking: Bookings) => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(booking),
  });
  return res.json();
};

export const getCustomerPayments = async (
  customerEmail: string,
): Promise<PaymentRecord[]> => {
  if (!customerEmail?.trim()) {
    return [];
  }

  const url = new URL(`${BASE_URL}/payments/customer`);
  url.searchParams.set("customerEmail", customerEmail.trim());

  const res = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const data: PaymentRecord[] | { payments?: PaymentRecord[] } =
    await res.json();
  return Array.isArray(data) ? data : data?.payments || [];
};

export const allTransection = async () => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/payments/admin`, {
    cache: "no-store",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch payments: ${res.status}`);
  }
  return res.json();
};
