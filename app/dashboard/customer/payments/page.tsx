import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCustomerPayments, } from "@/lib/actions/payment";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  CheckCircle2,
  Receipt,
  Calendar,
  Wrench,
} from "lucide-react";
import { PaymentRecord } from "@/app/types";

const CustomerPayments = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in?redirectTo=/dashboard/customer/payments");
  }

  const payments: PaymentRecord[] = await getCustomerPayments(
    session.user.email,
  );

  const totalPaidAmount = payments
    .filter((item) => (item.paymentStatus || "paid").toLowerCase() === "paid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment History</h1>
          <p className="text-sm text-muted-foreground">
            View all completed Stripe payments, transaction IDs, and service
            charges.
          </p>
        </div>

        <Link href="/dashboard/customer/bookings">
          <Button variant="outline" className="rounded-xl cursor-pointer">
            <Wrench className="mr-2 h-4 w-4" />
            My Bookings
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Total Paid Amount
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600">
              <CreditCard className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold">
            ${totalPaidAmount.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Confirmed repair payments
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Completed Transactions
            </p>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600">
              <Receipt className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold">{payments.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Total payment receipts recorded
          </p>
        </div>
      </div>

      {/* Empty State or Payments List */}
      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-14 text-center">
          <CreditCard className="h-11 w-11 text-muted-foreground/70 mb-3" />
          <h2 className="text-lg font-semibold">No payment history yet</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            Once a repair job is completed and you complete checkout, your
            payment receipts will appear here.
          </p>
          <Link href="/dashboard/customer/bookings" className="mt-5">
            <Button className="rounded-xl cursor-pointer">
              Go to My Bookings
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Technician</th>
                    <th className="py-3.5 px-4">Transaction ID</th>
                    <th className="py-3.5 px-4">Paid Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70 text-sm">
                  {payments.map((payment) => {
                    const statusText = (
                      payment.paymentStatus || "paid"
                    ).toLowerCase();
                    const currencySymbol =
                      (payment.currency || "usd").toLowerCase() === "usd"
                        ? "$"
                        : `${(payment.currency || "").toUpperCase()} `;

                    return (
                      <tr
                        key={payment._id}
                        className="hover:bg-muted/25 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-semibold">
                          {payment.serviceTitle || "Repair Service"}
                        </td>

                        <td className="py-3.5 px-4 text-muted-foreground">
                          {payment.technicianName || "N/A"}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">
                          {payment.transactionId ||
                            payment.stripeSessionId ||
                            "N/A"}
                        </td>

                        <td className="py-3.5 px-4 text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {payment.paidAt
                              ? new Date(payment.paidAt).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold capitalize">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {statusText}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right font-bold">
                          {currencySymbol}
                          {Number(payment.amount || 0).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {payments.map((payment) => {
              const statusText = (payment.paymentStatus || "paid").toLowerCase();
              const currencySymbol =
                (payment.currency || "usd").toLowerCase() === "usd"
                  ? "$"
                  : `${(payment.currency || "").toUpperCase()} `;

              return (
                <div
                  key={payment._id}
                  className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">
                        {payment.serviceTitle || "Repair Service"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Tech: {payment.technicianName || "N/A"}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold capitalize shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {statusText}
                    </span>
                  </div>

                  <p className="font-mono text-xs text-muted-foreground break-all">
                    Txn:{" "}
                    {payment.transactionId || payment.stripeSessionId || "N/A"}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
                    <span>
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {currencySymbol}
                      {Number(payment.amount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerPayments;