import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserCheck,
  Clock,
  BadgeDollarSign,
  HeadphonesIcon,
  ArrowUpRight,
} from "lucide-react";

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FEATURES: FeatureItem[] = [
  {
    title: "Admin-Approved Services",
    description:
      "Every listed service is reviewed and approved so you only see active, reliable offerings.",
    icon: UserCheck,
  },
  {
    title: "Upfront Pricing",
    description:
      "See starting prices clearly before booking with no hidden last-minute surprises.",
    icon: BadgeDollarSign,
  },
  {
    title: "Flexible Service Modes",
    description:
      "Choose home visit convenience or drop off your item directly at the technician's shop.",
    icon: Clock,
  },
  {
    title: "Dedicated Support",
    description:
      "Clear booking updates and organized payment records keep your repair experience stress-free.",
    icon: HeadphonesIcon,
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-14 sm:py-20 space-y-7 sm:space-y-9">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/60 pb-6">
        <div className="space-y-2 min-w-0">
          <span className="inline-flex items-center text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
            Why FixMate
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Built for Fast & Reliable Repairs
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Designed to connect customers with skilled technicians quickly,
            transparently, and safely.
          </p>
        </div>

        <Link href="/services" className="w-full sm:w-auto shrink-0">
          <Button className="w-full sm:w-auto rounded-xl cursor-pointer font-semibold gap-1.5 justify-center h-10 px-4">
            <span>Explore Services</span>
            <ArrowUpRight className="h-4 w-4 shrink-0" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:gap-6">
        {FEATURES.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card
              key={feature.title}
              className="group rounded-2xl border-border/70 bg-card shadow-xs hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <CardHeader className="flex flex-row items-center gap-3.5 space-y-0 px-5 pt-5 pb-2">
                <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary border border-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                  <IconComponent className="h-5 w-5" />
                </div>
                <CardTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-5 pb-5 pt-1.5 pl-[4.625rem]">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}