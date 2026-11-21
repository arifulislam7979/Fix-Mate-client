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
      return "border-emerald-500/30 bg-emerald-500/15 text-emerald-700";
    case "pending":
      return "border-amber-500/30 bg-amber-500/15 text-amber-700";
    case "failed":
    case "refunded":
    case "cancelled":
      return "border-rose-500/30 bg-rose-500/15 text-rose-700";
    default:
      return "border-border bg-muted/60 text-foreground";
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Monitor all customer payments, technician payouts, and Stripe
          transaction records across the platform.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Paid Volume
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700">
              <CreditCard className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-bold tracking-tight">
            ${totalRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground">
            Confirmed paid transactions
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Total Transactions
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-700">
              <Receipt className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-bold tracking-tight">
            {transactions.length}
          </p>
          <p className="text-xs text-muted-foreground">
            {paidCount} paid records found
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Pending Payments
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-bold tracking-tight">{pendingCount}</p>
          <p className="text-xs text-muted-foreground">
            Awaiting payment confirmation
          </p>
        </div>
      </div>

      {/* Search & Status Filter */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-xs flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by service, customer email, technician email, or transaction ID..."
            className="w-full rounded-xl border border-border bg-background pl-9 pr-3.5 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Empty State or List */}
      {filteredTransactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center space-y-1">
          <p className="text-base font-semibold">No transactions found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search keyword or status filter.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Technician</th>
                    <th className="py-3.5 px-4">Transaction ID</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70 text-sm">
                  {filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-muted/25 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-semibold">
                        {tx.serviceTitle}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        {tx.customerEmail}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        {tx.technicianEmail}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">
                        {tx.transactionId}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {tx.paidAt}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${getPaymentStatusStyle(
                            tx.status,
                          )}`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold">
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
                className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{tx.serviceTitle}</h3>
                    <p className="text-xs text-muted-foreground">
                      Customer: {tx.customerEmail}
                    </p>
                    <p className="text-xs text-muted-foreground">
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

                <p className="font-mono text-xs text-muted-foreground break-all">
                  Txn: {tx.transactionId}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
                  <span>{tx.paidAt}</span>
                  <span className="text-sm font-bold text-foreground">
                    {formatCurrencyAmount(tx.amount, tx.currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}