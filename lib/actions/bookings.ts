"use server";

import { Bookings, } from "@/app/types";
import { BookingStatusUpdatePayload } from "@/components/shared/TechnicianRequestsClient";
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

export interface GetCustomerBookingsParams {
  activeStatus?: string;
  activeSearch?: string;
}

export const getCustomerBookings = async (
  email: string,
  params: GetCustomerBookingsParams = {},
) => {
  const url = new URL(`${BASE_URL}/bookings`);
  url.searchParams.set("customerEmail", email);

  if (
    params.activeStatus &&
    params.activeStatus.trim() &&
    params.activeStatus.toLowerCase() !== "all"
  ) {
    url.searchParams.set("status", params.activeStatus.trim().toLowerCase());
  }

  if (params.activeSearch && params.activeSearch.trim()) {
    url.searchParams.set("search", params.activeSearch.trim());
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    notFound();
  }

  return res.json();
};

export const cancelBooking = async (id: string) => {
  const res = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

export const technicianBookingData = async (
  technicianEmail: string,
  options?: { status?: string; search?: string },
) => {
  const params = new URLSearchParams();
  params.set("technicianEmail", technicianEmail.trim().toLowerCase());

  if (
    options?.status &&
    options.status.trim() &&
    options.status.trim().toLowerCase() !== "all"
  ) {
    params.set("status", options.status.trim().toLowerCase());
  }

  if (options?.search && options.search.trim()) {
    params.set("search", options.search.trim());
  }

  const res = await fetch(`${BASE_URL}/bookings?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
};

export const bookingStatusUpdate = async (
  id: string,
  data: BookingStatusUpdatePayload,
) => {
  const res = await fetch(`${BASE_URL}/bookings/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });
  return res.json();
};

export const getAllBookings = async (status?: string) => {
  const params = new URLSearchParams();
  if (status && status !== "all") {
    params.set("status", status);
  }

  const queryString = params.toString();
  const url = queryString
    ? `${BASE_URL}/bookings?${queryString}`
    : `${BASE_URL}/bookings`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
};
