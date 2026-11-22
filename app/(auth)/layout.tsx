"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wrench,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SignUpORSignInLayoutProps {
  children: React.ReactNode;
}

const AUTH_HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Verified Repair Specialists",
    description:
      "Connect with approved technicians for appliances, electronics, and home services.",
  },
  {
    icon: Clock,
    title: "Live Booking & Status Tracking",
    description:
      "Track requests from booking confirmation to completion with clear pricing.",
  },
  {
    icon: Sparkles,
    title: "Role-Based Access & Security",
    description:
      "Dedicated workspaces for customers, technicians, and administrators.",
  },
];

export default function SignUpORSignInLayout({
  children,
}: SignUpORSignInLayoutProps) {
  const pathname = usePathname();
  const isSignUp = pathname?.includes("sign-up");

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#F7F7F2] via-[#F4F4EC] to-[#E9E9DF] text-foreground">
      {/* Subtle Ambient Gradient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 right-8 h-[380px] w-[380px] rounded-full bg-gradient-to-tr from-primary/15 via-emerald-500/10 to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 left-8 h-[340px] w-[340px] rounded-full bg-gradient-to-tr from-amber-300/15 via-[#ECECE4]/40 to-transparent blur-3xl"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-h-screen flex flex-col justify-between">
        {/* Top Bar */}
        <header className="flex items-center justify-between gap-4 pb-5 border-b border-stone-200/85">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-2xs ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105">
              <Wrench className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground leading-none">
                Fix<span className="text-primary">Mate</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-stone-500 mt-1">
                Repair Platform
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              href={isSignUp ? "/sign-in" : "/sign-up"}
              className="hidden sm:inline-flex items-center rounded-xl border border-stone-200/90 bg-white/85 px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 shadow-2xs transition-colors hover:bg-white hover:text-primary"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200/90 bg-[#FAF9F5] px-3.5 py-2 text-xs sm:text-sm font-medium text-stone-700 shadow-2xs transition-colors hover:bg-white hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </header>

        {/* Main Split Content */}
        <main className="my-auto py-8 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Brand & Value Showcase */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-200/90 bg-white/90 px-4 py-1.5 shadow-2xs">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  {isSignUp ? "Create Your Account" : "Welcome Back"}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-extrabold tracking-tight text-foreground leading-[1.14]">
                  {isSignUp ? (
                    <>
                      Join{" "}
                      <span className="bg-gradient-to-r from-primary to-emerald-700 bg-clip-text text-transparent">
                        FixMate
                      </span>{" "}
                      for Fast &amp; Reliable Repairs
                    </>
                  ) : (
                    <>
                      Sign In to Manage Your{" "}
                      <span className="bg-gradient-to-r from-primary to-emerald-700 bg-clip-text text-transparent">
                        Repair Workspace
                      </span>
                    </>
                  )}
                </h1>

                <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {isSignUp
                    ? "Register as a customer to book doorstep or workshop repairs, or join as a technician to manage service requests."
                    : "Access your bookings, service schedules, and account settings seamlessly in one organized place."}
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-3 pt-1 max-w-xl mx-auto lg:mx-0 text-left">
                {AUTH_HIGHLIGHTS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="group flex items-start gap-3.5 rounded-2xl border border-stone-200/85 bg-[#FAF9F5]/95 p-4 shadow-2xs transition-all duration-200 hover:border-primary/35 hover:bg-white/95"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/15 transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h2>
                        <p className="text-xs text-stone-600 leading-relaxed mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Switcher Pill */}
              <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-stone-600 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  {isSignUp ? "Already have an account?" : "New to FixMate?"}
                </span>
                <Link
                  href={isSignUp ? "/sign-in" : "/sign-up"}
                  className={cn(
                    "font-semibold text-primary underline underline-offset-4 hover:opacity-85",
                  )}
                >
                  {isSignUp ? "Sign In here" : "Create an account"}
                </Link>
              </div>
            </div>

            {/* Right Auth Form Container */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md rounded-3xl border border-stone-200/90 bg-gradient-to-b from-[#FAF9F5] to-[#F5F4EE] p-6 sm:p-8 shadow-xl ring-1 ring-black/[0.02]">
                {children}
              </div>
            </div>
          </div>
        </main>

        {/* Footer Note */}
        <footer className="pt-5 border-t border-stone-200/85 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} FixMate. All rights reserved.</p>
          <p>Trusted Device &amp; Appliance Repair Platform</p>
        </footer>
      </div>
    </div>
  );
}