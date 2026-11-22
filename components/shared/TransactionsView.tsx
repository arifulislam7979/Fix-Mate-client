"use client";

import React, { useMemo, useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Receipt,
  Search,
  Calendar,
} from "lucide-react";

export interface AdminTransactionItem {
  id: string;
  serviceTitle: string;
  customerEmail: string;
  technicianEmail: string;
  transactionId: string;
  status: string;
  currency: string;
  amount: number;
  paidAt: string;
}

interface TransactionsViewProps {
  transactions: AdminTransactionItem[];
}

function getPaymentStatusStyle(status: string): string {
  switch (status.trim().toLowerCase()) {
    case "paid":
    case "completed":
    case "succeeded":
      return "border-emerald-500/35 bg-emerald-500/15 text-emerald-700";
    case "pending":
      return "border-amber-500/35 bg-amber-500/15 text-amber-700";
    case "failed":
    case "refunded":
    case "cancelled":
      return "border-rose-500/35 bg-rose-500/15 text-rose-700";
    default:
      return "border-[#C2C0B1] bg-[#E2E1D8] text-foreground";
  }
}

function formatCurrencyAmount(amount: number, currency: string): string {
  const symbol =
    currency.trim().toLowerCase() === "usd"
      ? "$"
      : `${currency.toUpperCase()} `;
  return `${symbol}${amount.toFixed(2)}`;
}

export default function TransactionsView({ transactions }: TransactionsViewProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTransactions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return transactions.filter((item) => {
      const normalizedStatus = item.status.trim().toLowerCase();
      const matchesStatus =
        statusFilter === "all" || normalizedStatus === statusFilter;

      if (!matchesStatus) return false;
      if (!q) return true;

      return (
        item.serviceTitle.toLowerCase().includes(q) ||
        item.customerEmail.toLowerCase().includes(q) ||
        item.technicianEmail.toLowerCase().includes(q) ||
        item.transactionId.toLowerCase().includes(q)
      );
    });
  }, [transactions, searchQuery, statusFilter]);

  const totalRevenue = useMemo(() => {
    return transactions
      .filter((item) =>
        ["paid", "completed", "succeeded"].includes(
          item.status.trim().toLowerCase(),
        ),
      )
      .reduce((sum, item) => sum + item.amount, 0);
  }, [transactions]);

  const paidCount = useMemo(() => {
    return transactions.filter((item) =>
      ["paid", "completed", "succeeded"].includes(
        item.status.trim().toLowerCase(),
      ),
    ).length;
  }, [transactions]);

  const pendingCount = useMemo(() => {
    return transactions.filter(
      (item) => item.status.trim().toLowerCase() === "pending",
    ).length;
  }, [transactions]);

  return (
    <div className="space-y-6 rounded-3xl border border-[#C2C0B1] bg-[#EBECE4] p-4 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/85 px-5 py-4 shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            All Transactions
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl mt-0.5">
            Monitor all customer payments, technician payouts, and Stripe
            transaction records across the platform.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-[#C2C0B1] bg-[#EBECE4] px-3.5 py-1.5 text-xs font-semibold text-foreground shrink-0 w-fit">
          <Receipt className="h-3.5 w-3.5 text-primary" />
          <span>Showing {filteredTransactions.length} Records</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs transition-all duration-200 hover:border-[#B8B5A5] hover:shadow-md overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 bg-[#E2E1D8]/70 border-b border-[#C2C0B1]">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Paid Volume
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
              <CreditCard className="h-4 w-4" />
            </span>
          </div>
          <div className="px-5 py-4 bg-[#EBECE4] space-y-1">
            <p className="text-3xl font-bold tracking-tight tabular-nums text-foreground">
              ${totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              Confirmed paid transactions
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs transition-all duration-200 hover:border-[#B8B5A5] hover:shadow-md overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 bg-[#E2E1D8]/70 border-b border-[#C2C0B1]">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Transactions
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-700 border border-sky-500/30">
              <Receipt className="h-4 w-4" />
            </span>
          </div>
          <div className="px-5 py-4 bg-[#EBECE4] space-y-1">
            <p className="text-3xl font-bold tracking-tight tabular-nums text-foreground">
              {transactions.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {paidCount} paid records found
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs transition-all duration-200 hover:border-[#B8B5A5] hover:shadow-md overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 bg-[#E2E1D8]/70 border-b border-[#C2C0B1]">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pending Payments
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 border border-amber-500/30">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <div className="px-5 py-4 bg-[#EBECE4] space-y-1">
            <p className="text-3xl font-bold tracking-tight tabular-nums text-foreground">
              {pendingCount}
            </p>
            <p className="text-xs text-muted-foreground">
              Awaiting payment confirmation
            </p>
          </div>
        </div>
      </div>

      {/* Search & Status Filter */}
      <div className="rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/80 p-4 shadow-2xs flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by service, customer email, technician email, or transaction ID..."
            className="w-full rounded-xl border border-[#C2C0B1] bg-[#EBECE4] pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/80 shadow-2xs transition-colors outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-[#C2C0B1] bg-[#EBECE4] px-4 py-2.5 text-sm font-semibold text-foreground shadow-2xs transition-colors outline-none focus:border-primary cursor-pointer"
        >
          <option value="all" className="bg-[#EBECE4]">
            All Status
          </option>
          <option value="paid" className="bg-[#EBECE4]">
            Paid
          </option>
          <option value="pending" className="bg-[#EBECE4]">
            Pending
          </option>
          <option value="refunded" className="bg-[#EBECE4]">
            Refunded
          </option>
          <option value="failed" className="bg-[#EBECE4]">
            Failed
          </option>
        </select>
      </div>

      {/* Empty State or List */}
      {filteredTransactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#C2C0B1] bg-[#E2E1D8]/55 px-6 py-12 text-center space-y-1.5">
          <p className="text-base font-semibold text-foreground">
            No transactions found
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search keyword or status filter.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#C2C0B1] bg-[#E2E1D8]/85 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Technician</th>
                    <th className="py-3.5 px-4">Transaction ID</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C2C0B1] text-sm bg-[#EBECE4]">
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-[#E2E1D8]/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        {tx.serviceTitle}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        {tx.customerEmail}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        {tx.technicianEmail}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">
                        <span className="rounded-lg border border-[#C2C0B1] bg-[#E2E1D8]/75 px-2.5 py-1">
                          {tx.transactionId}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-primary" />
                          {tx.paidAt}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getPaymentStatusStyle(
                            tx.status,
                          )}`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold tabular-nums text-foreground whitespace-nowrap">
                        {formatCurrencyAmount(tx.amount, tx.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs overflow-hidden"
              >
                <div className="p-4 bg-[#E2E1D8]/65 border-b border-[#C2C0B1] flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {tx.serviceTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground break-all">
                      Customer: {tx.customerEmail}
                    </p>
                    <p className="text-xs text-muted-foreground break-all">
                      Technician: {tx.technicianEmail}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize shrink-0 ${getPaymentStatusStyle(
                      tx.status,
                    )}`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {tx.status}
                  </span>
                </div>

                <div className="p-4 space-y-3 bg-[#EBECE4]">
                  <p className="font-mono text-xs text-muted-foreground break-all rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 px-3 py-2">
                    Txn: {tx.transactionId}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#C2C0B1] text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      {tx.paidAt}
                    </span>
                    <span className="text-sm font-bold tabular-nums text-foreground">
                      {formatCurrencyAmount(tx.amount, tx.currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}