import React from "react";
import { Wrench, Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-[75vh] w-full bg-[#EBECE4] text-[#111827] px-3 sm:px-4 md:px-6 py-8 sm:py-10">
      <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Bar: FixMate Brand & Loading Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#D5D6CC] bg-[#E2E1D8]/70 p-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#008A00] text-white flex items-center justify-center shadow-xs shrink-0">
              <Wrench className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#111827]">
              Fix<span className="text-[#008A00]">Mate</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-[#D5D6CC] bg-[#EBECE4] px-3.5 py-1.5 text-xs font-semibold text-[#008A00]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#D5D6CC] bg-[#E2E1D8]/60 p-5 space-y-3"
            >
              <div className="h-3.5 w-24 rounded bg-[#D5D6CC] animate-pulse" />
              <div className="h-7 w-16 rounded bg-[#D5D6CC] animate-pulse" />
              <div className="h-3 w-32 rounded bg-[#D5D6CC]/80 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Main Table / Activity Panel Skeleton */}
        <div className="rounded-2xl border border-[#D5D6CC] bg-[#E2E1D8]/60 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="h-5 w-44 rounded bg-[#D5D6CC] animate-pulse" />
            <div className="h-9 w-28 rounded-xl bg-[#D5D6CC] animate-pulse" />
          </div>

          <div className="space-y-3 pt-2">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="h-12 w-full rounded-xl bg-[#D5D6CC]/75 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}