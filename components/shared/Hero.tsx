import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Wrench,
  ShieldCheck,
  Clock,
  Star,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 via-background to-background py-20 lg:py-28">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[350px] w-[350px] sm:h-[500px] sm:w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3.5 py-1.5 shadow-xs backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Trusted Home & Device Repair Service
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Expert Repairs for Your{" "}
              <span className="text-primary">Devices & Appliances</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              From smartphones and laptops to home appliances, get fast,
              reliable, and professional repair services right at your doorstep
              with certified technicians.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/services"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full sm:w-auto rounded-xl font-semibold shadow-md px-7 h-12 text-base transition-all hover:opacity-95",
                )}
              >
                Book a Repair Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto rounded-xl font-semibold px-7 h-12 text-base border-border/80 transition-all hover:bg-muted/60",
                )}
              >
                How It Works
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60 max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-bold text-foreground">
                  4.9/5
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />{" "}
                  Customer Rating
                </span>
              </div>
              <div className="flex flex-col items-center lg:items-start border-x border-border/60 px-4">
                <span className="text-xl sm:text-2xl font-bold text-foreground">
                  500+
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  Repairs Done
                </span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-bold text-foreground">
                  100%
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  Verified Experts
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Card / Graphic Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Main Card */}
              <div className="rounded-3xl border border-border/80 bg-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
                      <Wrench className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base">
                        Quick Diagnostics
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Instant Booking & Quote
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />{" "}
                    Live
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <div className="text-sm font-medium text-foreground">
                      Certified Professional Technicians
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                    <div className="text-sm font-medium text-foreground">
                      30-Day Service Warranty Guaranteed
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-muted/30 p-3.5 transition-colors hover:bg-muted/50">
                    <Clock className="h-5 w-5 text-primary shrink-0" />
                    <div className="text-sm font-medium text-foreground">
                      Same-Day Doorstep Repair Service
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/services"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full rounded-xl border-border/80 font-semibold h-11 hover:bg-primary/5 hover:text-primary hover:border-primary/30",
                    )}
                  >
                    Explore All Services
                  </Link>
                </div>
              </div>

              {/* Floating Badge Accent */}
              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-xl backdrop-blur">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 font-bold">
                  ★
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">
                    Top Rated Platform
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Trusted by 1,000+ users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
