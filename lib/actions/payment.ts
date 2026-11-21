"use server";

import { Bookings, PaymentRecord } from "@/app/types";
import { notFound } from "next/navigation";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const createPayment = async (booking: Bookings) => {
  const res = await fetch(`${BASE_URL}/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( booking ),
  });
  return res.json()
};

export const getCustomerPayments = async (
  customerEmail: string,
): Promise<PaymentRecord[]> => {
  const url = new URL(`${BASE_URL}/payments?${customerEmail}`);
  url.searchParams.set("customerEmail", customerEmail);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    notFound();
  }

  const data = await res.json();
  return Array.isArray(data) ? data : data?.payments || [];
};