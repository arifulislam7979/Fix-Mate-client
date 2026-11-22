import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Wrench,
  ShieldCheck,
  Clock,
  Star,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const HERO_BG_IMAGE =
  "https://gesrepair.com/wp-content/uploads/bigstock-Repair-motherboard-in-electron-135850715.jpg";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#C2C0B1] bg-gradient-to-br from-[#EBECE4] via-[#E7E8DF] to-[#E2E1D8] py-16 sm:py-20 lg:py-28">
      {/* Background Electronics Repair Image */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 scale-105"
        style={{
          backgroundImage: `url("${HERO_BG_IMAGE}")`,
        }}
      />

      {/* Gradient Overlays for Text Contrast & Smooth Bottom Blend */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#EBECE4]/95 via-[#EBECE4]/78 to-[#E2E1D8]/68"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#EBECE4] to-transparent"
      />

      {/* Ambient Gradient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-10 h-[360px] w-[360px] rounded-full bg-gradient-to-tr from-primary/15 via-emerald-500/10 to-transparent blur-3xl"
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Text & CTA */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C2C0B1] bg-[#E2E1D8]/95 px-4 py-1.5 shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground/85">
                Trusted Home &amp; Device Repair Service
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight text-foreground leading-[1.12]">
              Expert Repairs for Your{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-700 bg-clip-text text-transparent">
                Devices &amp; Appliances
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-foreground/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
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
                  "w-full sm:w-auto rounded-xl font-semibold shadow-md px-7 h-12 text-base bg-gradient-to-r from-primary to-primary/90 transition-all hover:opacity-95",
                )}
              >
                Book a Repair Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/about"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:w-auto rounded-xl font-semibold px-7 h-12 text-base bg-[#EBECE4] border-[#C2C0B1] text-foreground transition-all hover:bg-[#E2E1D8]",
                )}
              >
                How It Works
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#C2C0B1] max-w-lg mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-bold text-foreground">
                  4.9/5
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 font-medium">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  Customer Rating
                </span>
              </div>

              <div className="flex flex-col items-center lg:items-start border-x border-[#C2C0B1] px-4">
                <span className="text-xl sm:text-2xl font-bold text-foreground">
                  500+
                </span>
                <span className="text-xs text-muted-foreground mt-0.5 font-medium">
                  Repairs Done
                </span>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <span className="text-xl sm:text-2xl font-bold text-foreground">
                  100%
                </span>
                <span className="text-xs text-muted-foreground mt-0.5 font-medium">
                  Verified Experts
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Diagnostics Card */}
          <div className="lg:col-span-5 flex justify-center pb-6 lg:pb-8">
            <div className="relative w-full max-w-md">
              {/* Main Card */}
              <div className="rounded-3xl border border-[#C2C0B1] bg-[#EBECE4]/95 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#C2C0B1]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary border border-primary/20">
                      <Wrench className="h-6 w-6" />
                    </div>

                    <div>
                      <h2 className="font-bold text-foreground text-base">
                        Quick Diagnostics
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Instant Booking &amp; Quote
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-500/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Live
                  </span>
                </div>

                {/* Service Highlights */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-3 rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/75 p-3.5 transition-colors hover:bg-[#E2E1D8]">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <div className="text-sm font-medium text-foreground">
                      Certified Professional Technicians
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/75 p-3.5 transition-colors hover:bg-[#E2E1D8]">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                    <div className="text-sm font-medium text-foreground">
                      30-Day Service Warranty Guaranteed
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/75 p-3.5 transition-colors hover:bg-[#E2E1D8]">
                    <Clock className="h-5 w-5 text-primary shrink-0" />
                    <div className="text-sm font-medium text-foreground">
                      Same-Day Doorstep Repair Service
                    </div>
                  </div>
                </div>

                {/* Explore Services Button */}
                <div className="pt-2 border-t border-[#C2C0B1]">
                  <Link
                    href="/services"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-full rounded-xl border-[#C2C0B1] bg-[#E2E1D8] text-foreground font-semibold h-11 hover:bg-primary/10 hover:text-primary hover:border-primary/35 transition-colors",
                    )}
                  >
                    Explore All Services
                  </Link>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-7 sm:-left-5 flex items-center gap-3 rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8] p-4 shadow-lg">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700">
                  <Sparkles className="h-5 w-5" />
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