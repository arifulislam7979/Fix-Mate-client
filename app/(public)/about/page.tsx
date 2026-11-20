import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Users,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { getSession } from "@/lib/core/server";

const highlights = [
  {
    icon: ShieldCheck,
    title: "Verified Technicians",
    description:
      "Every repair specialist is reviewed and approved so you get reliable, safe, and quality workmanship.",
  },
  {
    icon: Clock,
    title: "Transparent Workflow",
    description:
      "Track your repair request step by step from requested and accepted to in-progress and completed.",
  },
  {
    icon: MapPin,
    title: "Local Home Visit Support",
    description:
      "Book convenient home-visit or local repair services tailored to your area and preferred schedule.",
  },
  {
    icon: Sparkles,
    title: "Clear Base & Final Pricing",
    description:
      "See upfront base prices before booking and view clear final amounts once your job is completed.",
  },
];

const steps = [
  {
    step: "01",
    title: "Browse & Choose a Service",
    description:
      "Explore approved repair services by category, service mode, service area, and starting price.",
  },
  {
    step: "02",
    title: "Book with Your Details",
    description:
      "Submit your phone number, service address, preferred date, and problem details in minutes.",
  },
  {
    step: "03",
    title: "Track & Complete Repair",
    description:
      "Follow live status updates as your technician accepts, starts work, and completes the job.",
  },
];

async function HeroActionButtons() {
  const session = await getSession();
  const user = session?.user as { role?: string } | undefined;
  const role = user?.role?.toLowerCase();

  const dashboardHref =
    role === "admin"
      ? "/dashboard/admin"
      : role === "technician"
        ? "/dashboard/technician"
        : "/dashboard/customer";

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
      <Link href="/services">
        <Button className="rounded-xl cursor-pointer font-semibold gap-1.5 px-5">
          <span>Explore Services</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>

      {user ? (
        <Link href={dashboardHref}>
          <Button
            variant="outline"
            className="rounded-xl cursor-pointer font-semibold gap-1.5 px-5"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Go to Dashboard</span>
          </Button>
        </Link>
      ) : (
        <Link href="/sign-up">
          <Button
            variant="outline"
            className="rounded-xl cursor-pointer font-semibold px-5"
          >
            Join as Customer or Technician
          </Button>
        </Link>
      )}
    </div>
  );
}

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-10 sm:py-14 space-y-14">
      {/* Hero Section */}
      <section className="max-w-3xl mx-auto text-center space-y-4">
        <Badge
          variant="secondary"
          className="rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border-primary/20"
        >
          About Our Platform
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
          Reliable Repair Services Made Simple & Transparent
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          We connect customers with trusted technicians for everyday home and
          appliance repairs. From booking a service and tracking work progress
          to viewing clear pricing, everything is designed to be fast,
          organized, and stress-free.
        </p>

        <Suspense
          fallback={
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/services">
                <Button className="rounded-xl cursor-pointer font-semibold gap-1.5 px-5">
                  <span>Explore Services</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          }
        >
          <HeroActionButtons />
        </Suspense>
      </section>

      {/* Highlights Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Why Choose Us
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Built for clear communication, dependable service, and smooth booking
            management.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="rounded-2xl border-border/70 bg-card shadow-xs hover:shadow-md hover:border-primary/35 transition-all"
              >
                <CardContent className="p-5 space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="rounded-3xl border border-border/70 bg-muted/30 p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5" />
              How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Three Easy Steps to Get Fixed
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
            Whether you need quick home repair or manage repair requests as a
            technician, the workflow stays straightforward.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((item) => (
            <Card
              key={item.step}
              className="rounded-2xl border-border/70 bg-card shadow-xs"
            >
              <CardContent className="p-5 space-y-2.5">
                <span className="text-xs font-bold tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-lg inline-block">
                  STEP {item.step}
                </span>
                <h3 className="text-base font-bold text-foreground pt-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="rounded-3xl border border-border/70 bg-card p-6 sm:p-10 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary">
            <Users className="h-4 w-4" />
            <span>For Customers & Technicians</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Need a Repair or Ready to Offer Your Service?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Browse available services right away or manage your bookings and
            repair requests cleanly from your dashboard.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Easy Booking Flow
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Status & Payment Tracking
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/services">
            <Button className="rounded-xl cursor-pointer font-semibold">
              Browse All Services
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;