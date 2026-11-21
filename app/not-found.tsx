import React from "react";
import Link from "next/link";
import { Wrench, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[75vh] w-full bg-[#EBECE4] text-[#111827] flex items-center justify-center px-3 sm:px-4 md:px-6 py-16">
      <div className="w-full max-w-7xl mx-auto flex justify-center">
        <div className="w-full max-w-xl rounded-3xl border border-[#D5D6CC] bg-[#E2E1D8]/70 p-7 sm:p-10 text-center space-y-6 shadow-xs">
          {/* FixMate Brand Logo */}
          <div className="flex justify-center">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="h-10 w-10 rounded-xl bg-[#008A00] text-white flex items-center justify-center shadow-xs group-hover:bg-[#007500] transition-colors">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-[#111827]">
                Fix<span className="text-[#008A00]">Mate</span>
              </span>
            </Link>
          </div>

          {/* 404 Status */}
          <div className="space-y-2">
            <span className="inline-block rounded-full border border-[#D5D6CC] bg-[#EBECE4] px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#008A00]">
              Error 404
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111827]">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-[#4B5563] max-w-md mx-auto leading-relaxed">
              The page or service you are looking for might have been moved,
              removed, or the URL is incorrect.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#008A00] hover:bg-[#007500] text-white font-semibold text-sm h-11 px-6 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#D5D6CC] bg-[#EBECE4] hover:bg-white text-[#111827] font-semibold text-sm h-11 px-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Browse Services</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}