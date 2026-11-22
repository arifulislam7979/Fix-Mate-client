import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

import { getUserByEmail } from "@/lib/api/users";
import {
  BookingRecord,
  PaymentRecord,
  TechnicianBookingItem,
  Users,
} from "@/app/types";
import TechnicianPage from "@/components/shared/TechnicianPage";
import { getToken } from "@/lib/core/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_URL ||
  "https://fix-mate-server.vercel.app";

interface BookingsApiResponse {
  bookings?: BookingRecord[];
  data?: BookingRecord[];
}

interface PaymentsApiResponse {
  payments?: PaymentRecord[];
  data?: PaymentRecord[];
}

interface BookingSchemaFields {
  finalAmount?: number | string;
  basePrice?: number | string;
  amount?: number | string;
  price?: number | string;
  totalAmount?: number | string;
  servicePrice?: number | string;
  paymentStatus?: string;
  address?: string;
  preferredDate?: string;
  createdAt?: string | Date;
}

function parseAmount(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.-]+/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function getBookingAmount(booking: BookingRecord): number {
  const fields = booking as BookingRecord & BookingSchemaFields;
  return parseAmount(
    fields.finalAmount ??
      fields.amount ??
      fields.price ??
      fields.basePrice ??
      fields.totalAmount ??
      fields.servicePrice ??
      0,
  );
}

function getBookingTimestamp(booking: BookingRecord): number {
  const fields = booking as BookingRecord & BookingSchemaFields;
  const rawDate =
    fields.createdAt ||
    fields.preferredDate ||
    booking.date ||
    booking.scheduledDate;
  if (!rawDate) return 0;
  const time = new Date(String(rawDate)).getTime();
  return Number.isFinite(time) ? time : 0;
}

function extractBookingsList(
  payload: BookingRecord[] | BookingsApiResponse,
): BookingRecord[] {
  if (Array.isArray(payload)) return payload;
  return payload.bookings || payload.data || [];
}

function extractPaymentsList(
  payload: PaymentRecord[] | PaymentsApiResponse,
): PaymentRecord[] {
  if (Array.isArray(payload)) return payload;
  return payload.payments || payload.data || [];
}

export default async function TechnicianOverviewPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  const sessionEmail = session.user.email.trim().toLowerCase();
  const dbUser = (await getUserByEmail(sessionEmail)) as Users | null;
  const token = await getToken();

  const authHeaders: HeadersInit = token
    ? { authorization: `Bearer ${token}` }
    : {};

  const techBookingsUrl = new URL(`${BASE_URL}/bookings/technician`);
  techBookingsUrl.searchParams.set("technicianEmail", sessionEmail);

  const paymentsUrl = new URL(`${BASE_URL}/payments/admin`);
  paymentsUrl.searchParams.set("technicianEmail", sessionEmail);

  let technicianBookings: BookingRecord[] = [];
  let technicianPayments: PaymentRecord[] = [];

  try {
    const [bookingsRes, paymentsRes] = await Promise.all([
      fetch(techBookingsUrl.toString(), {
        method: "GET",
        headers: authHeaders,
        cache: "no-store",
      }),
      fetch(paymentsUrl.toString(), {
        method: "GET",
        headers: authHeaders,
        cache: "no-store",
      }),
    ]);

    if (bookingsRes.ok) {
      const bookingsData: BookingRecord[] | BookingsApiResponse =
        await bookingsRes.json();
      technicianBookings = extractBookingsList(bookingsData);
    }

    if (paymentsRes.ok) {
      const paymentsData: PaymentRecord[] | PaymentsApiResponse =
        await paymentsRes.json();
      technicianPayments = extractPaymentsList(paymentsData);
    }
  } catch (error) {
    console.error("Failed to fetch technician overview data:", error);
  }

  const assignedBookings = technicianBookings
    .filter((booking) => {
      const techEmail = String(
        booking.technicianEmail ||
          booking.assignedTechnicianEmail ||
          booking.providerEmail ||
          "",
      )
        .trim()
        .toLowerCase();
      const techId = String(
        booking.technicianId || booking.assignedTechnicianId || "",
      );

      return (
        techEmail === sessionEmail ||
        (Boolean(dbUser?._id) && techId === String(dbUser?._id))
      );
    })
    .sort((a, b) => getBookingTimestamp(b) - getBookingTimestamp(a));

  const activeJobs = assignedBookings.filter((booking) =>
    ["in-progress", "in progress", "assigned", "accepted"].includes(
      String(booking.status || "").trim().toLowerCase(),
    ),
  ).length;

  const completedList = assignedBookings.filter(
    (booking) =>
      String(booking.status || "").trim().toLowerCase() === "completed",
  );

  const pendingJobs = assignedBookings.filter((booking) =>
    ["pending", "requested"].includes(
      String(booking.status || "").trim().toLowerCase(),
    ),
  ).length;

  const paidPayments = technicianPayments.filter((payment) => {
    const state = String(payment.status || payment.paymentStatus || "")
      .trim()
      .toLowerCase();
    return state === "paid" || state === "succeeded" || state === "completed";
  });

  const paymentsTotal = paidPayments.reduce(
    (sum, payment) => sum + parseAmount(payment.amount),
    0,
  );

  const bookingsPaidTotal = assignedBookings
    .filter((booking) => {
      const fields = booking as BookingRecord & BookingSchemaFields;
      const paymentStatusLower = String(fields.paymentStatus || "")
        .trim()
        .toLowerCase();

      return paymentStatusLower === "paid";
    })
    .reduce((sum, booking) => sum + getBookingAmount(booking), 0);

  const totalEarnings = paymentsTotal > 0 ? paymentsTotal : bookingsPaidTotal;

  const recentBookings: TechnicianBookingItem[] = assignedBookings
    .slice(0, 5)
    .map((booking, index) => {
      const fields = booking as BookingRecord & BookingSchemaFields;
      const bookingIdStr = String(booking._id || booking.id || "");

      return {
        id: bookingIdStr || `booking-${index}`,
        serviceTitle:
          booking.serviceTitle ||
          booking.serviceName ||
          booking.title ||
          "Service Request",
        customerName:
          booking.customerName ||
          booking.userName ||
          booking.customerEmail ||
          "Customer",
        area:
          fields.address ||
          booking.area ||
          booking.location ||
          dbUser?.area ||
          "Not specified",
        date:
          fields.preferredDate ||
          booking.date ||
          booking.scheduledDate ||
          "N/A",
        status: booking.status || "Pending",
        amount: getBookingAmount(booking),
      };
    });

  return (
    <TechnicianPage
      technician={{
        name: dbUser?.name || session.user.name || "Technician",
        email: session.user.email,
        phone: dbUser?.phone || "",
        area: dbUser?.area || "",
        role: dbUser?.role || "technician",
        bio: dbUser?.bio || "",
        image: dbUser?.image || session.user.image || "",
      }}
      stats={{
        activeJobs,
        completedJobs: completedList.length,
        pendingJobs,
        totalEarnings,
      }}
      recentBookings={recentBookings}
    />
  );
}