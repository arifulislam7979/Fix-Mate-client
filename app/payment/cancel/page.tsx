"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CancelContent = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  return (
    <section className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-muted/20">
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-7 text-center shadow-sm space-y-6">
        <div className="space-y-3 py-1">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 ring-1 ring-amber-500/20">
            <XCircle className="h-9 w-9 text-amber-600" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Payment Cancelled
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Your payment was not completed or was cancelled. No charges were
            made, and you can retry your payment whenever you are ready.
          </p>
        </div>

        {bookingId && (
          <div className="rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-left">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">Booking ID</span>
              <span className="font-mono font-medium text-foreground break-all text-right">
                {bookingId}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <Button size="lg" className="w-full h-11 rounded-xl font-medium">
            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <RotateCcw className="h-4 w-4 shrink-0" />
              <span>Try Payment Again</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full h-11 rounded-xl font-medium"
          >
            <Link
              href="/dashboard/customer/bookings"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span>Back to My Bookings</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const CancelFallback = () => (
  <div className="min-h-[75vh] flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

const PaymentCancelPage = () => {
  return (
    <Suspense fallback={<CancelFallback />}>
      <CancelContent />
    </Suspense>
  );
};

export default PaymentCancelPage;
