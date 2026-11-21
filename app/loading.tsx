import React from "react";
import { Wrench, Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <main className="min-h-[75vh] w-full bg-[#EBECE4] text-[#111827] flex items-center justify-center px-3 sm:px-4 md:px-6 py-16">
      <div className="w-full max-w-7xl mx-auto flex justify-center">
        <div className="w-full max-w-md rounded-3xl border border-[#D5D6CC] bg-[#E2E1D8]/70 p-7 sm:p-9 text-center space-y-5 shadow-xs">
          {/* FixMate Brand Logo */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-[#008A00] text-white flex items-center justify-center shadow-xs">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#111827]">
                Fix<span className="text-[#008A00]">Mate</span>
              </span>
            </div>
          </div>

          {/* Spinner & Loading Message */}
          <div className="flex flex-col items-center gap-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D5D6CC] bg-[#EBECE4] px-3.5 py-1.5 text-xs font-semibold text-[#008A00]">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </div>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Preparing your repair services and details, please wait.
            </p>
          </div>

          {/* Subtle Skeleton Bars */}
          <div className="space-y-2.5 pt-1 text-left">
            <div className="h-3.5 w-full rounded-lg bg-[#D5D6CC]/80 animate-pulse" />
            <div className="h-3.5 w-5/6 rounded-lg bg-[#D5D6CC]/80 animate-pulse" />
            <div className="h-10 w-full rounded-xl bg-[#D5D6CC]/80 animate-pulse mt-3" />
          </div>
        </div>
      </div>
    </main>
  );
}