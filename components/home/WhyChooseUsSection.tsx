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
  code: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FEATURES: FeatureItem[] = [
  {
    code: "01",
    title: "Admin-Approved Services",
    description:
      "Every listed service is reviewed and approved so you only see active, reliable offerings.",
    icon: UserCheck,
  },
  {
    code: "02",
    title: "Upfront Pricing",
    description:
      "See starting prices clearly before booking with no hidden last-minute surprises.",
    icon: BadgeDollarSign,
  },
  {
    code: "03",
    title: "Flexible Service Modes",
    description:
      "Choose home visit convenience or drop off your item directly at the technician's shop.",
    icon: Clock,
  },
  {
    code: "04",
    title: "Dedicated Support",
    description:
      "Clear booking updates and organized payment records keep your repair experience stress-free.",
    icon: HeadphonesIcon,
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="relative w-full bg-[#EBECE4] border-y border-[#C2C0B1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/85 px-6 py-5 shadow-xs">
          <div className="space-y-2 min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#EBECE4] border border-[#C2C0B1] px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-primary">
                Why FixMate
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Built for Fast &amp; Reliable Repairs
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Designed to connect customers with skilled technicians quickly,
              transparently, and safely.
            </p>
          </div>

          <Link href="/services" className="w-full sm:w-auto shrink-0">
            <Button className="w-full sm:w-auto rounded-xl cursor-pointer font-semibold gap-1.5 justify-center h-10 px-5 shadow-xs transition-transform active:scale-[0.99]">
              <span>Explore Services</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" />
            </Button>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          {FEATURES.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs hover:shadow-md hover:border-[#B8B5A5] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
              >
                <CardHeader className="flex flex-row items-center justify-between gap-3.5 space-y-0 px-5 pt-5 pb-3.5 bg-[#E2E1D8]/60 border-b border-[#C2C0B1]">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary border border-primary/25 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors duration-200">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Benefit {feature.code}
                      </span>
                      <CardTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>

                  <span className="h-8 w-8 rounded-lg border border-[#C2C0B1] bg-[#EBECE4] flex items-center justify-center text-muted-foreground shrink-0 transition-all duration-200 group-hover:border-primary/35 group-hover:bg-primary/10 group-hover:text-primary">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </CardHeader>

                <CardContent className="px-5 py-4 bg-[#EBECE4]">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}