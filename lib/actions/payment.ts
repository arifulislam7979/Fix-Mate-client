"use server";

import { Bookings } from "@/app/types";

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
