"use server";

import { Bookings } from "@/app/types";
import { notFound } from "next/navigation";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const bookingsData = async (bookingData: Bookings) => {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });
  return res.json();
};
export const getCustomerBookings = async (email: string) => {
  const res = await fetch(
    `${BASE_URL}/bookings?customerEmail=${encodeURIComponent(email)}`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    notFound();
  }

  return res.json();
};

export const cancelBooking = async (id: string) => {
  const res = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json"
    },
  });
  return res.json();
};
