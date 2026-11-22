import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import TransactionsView, {
  AdminTransactionItem,
} from "@/components/shared/TransactionsView";
import { allTransection } from "@/lib/actions/payment";

interface RawPaymentDoc {
  _id?: string;
  id?: string;
  serviceTitle?: string;
  customerEmail?: string;
  technicianEmail?: string;
  transactionId?: string;
  stripeSessionId?: string;
  status?: string;
  paymentStatus?: string;
  currency?: string;
  amount?: number | string;
  paidAt?: string | Date;
  createdAt?: string | Date;
}

interface PaymentsResponseWrapper {
  payments?: RawPaymentDoc[];
  data?: RawPaymentDoc[];
}

function extractPaymentsArray(payload: unknown): RawPaymentDoc[] {
  if (Array.isArray(payload)) {
    return payload as RawPaymentDoc[];
  }
  if (payload && typeof payload === "object") {
    const wrapped = payload as PaymentsResponseWrapper;
    if (Array.isArray(wrapped.payments)) return wrapped.payments;
    if (Array.isArray(wrapped.data)) return wrapped.data;
  }
  return [];
}

function parseNumericAmount(raw: unknown): number {
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : 0;
  }
  if (typeof raw === "string") {
    const cleaned = raw.replace(/[^0-9.-]+/g, "");
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
  }
  return 0;
}

function formatDateValue(rawDate: unknown): string {
  if (!rawDate) return "N/A";
  const parsed = new Date(String(rawDate));
  if (Number.isNaN(parsed.getTime())) {
    return String(rawDate);
  }
  return parsed.toLocaleDateString();
}

export default async function TransectionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  let rawList: RawPaymentDoc[] = [];

  try {
    const response = await allTransection();
    rawList = extractPaymentsArray(response);
  } catch (error) {
    console.error("Failed to load all transactions:", error);
    rawList = [];
  }

  const transactions: AdminTransactionItem[] = rawList.map((doc, index) => ({
    id: String(doc._id || doc.id || `tx-${index}`),
    serviceTitle: doc.serviceTitle || "Repair Service",
    customerEmail: doc.customerEmail || "N/A",
    technicianEmail: doc.technicianEmail || "N/A",
    transactionId: doc.transactionId || doc.stripeSessionId || "N/A",
    status: String(doc.status || doc.paymentStatus || "paid"),
    currency: String(doc.currency || "usd"),
    amount: parseNumericAmount(doc.amount),
    paidAt: formatDateValue(doc.paidAt || doc.createdAt),
  }));

  return (
    <div className="min-h-full rounded-3xl bg-[#EBECE4]/65 p-4 sm:p-6">
      <TransactionsView transactions={transactions} />
    </div>
  );
}