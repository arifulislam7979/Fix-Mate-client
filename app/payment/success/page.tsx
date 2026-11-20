"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("bookingId");
  const [copied, setCopied] = useState(false);

  const handleCopySession = async () => {
    if (!sessionId) return;
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-10 bg-muted/20">
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-7 text-center shadow-md space-y-6">
        {/* Status Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/20">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </div>

        {/* Heading & Confirmation Note */}
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified via Stripe Checkout
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Payment Successful
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your payment has been received by Stripe. Our webhook is updating
            your booking status to <span className="font-semibold text-foreground">Paid</span>—please
            check <span className="font-medium text-foreground">My Bookings</span> to confirm.
          </p>
        </div>

        {/* Booking & Session Metadata */}
        {(bookingId || sessionId) && (
          <div className="rounded-xl border border-border/60 bg-muted/40 p-3.5 text-left space-y-2.5">
            {bookingId && (
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono font-medium text-foreground truncate">
                  {bookingId}
                </span>
              </div>
            )}

            {sessionId && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Stripe Session ID</span>
                  <button
                    type="button"
                    onClick={handleCopySession}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-[11px] text-foreground/80 break-all rounded-lg bg-background/80 p-2 border border-border/50">
                  {sessionId}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Primary Action Button (Single line, properly aligned) */}
        <Button
          size="lg"
          className="w-full h-11 rounded-xl font-medium bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>Back to My Bookings</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-[75vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessPage;