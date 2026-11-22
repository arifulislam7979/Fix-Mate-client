import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, CalendarCheck, ShieldCheck, Wrench } from "lucide-react";

interface StepItem {
  step: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepItem[] = [
  {
    step: "01",
    title: "Find Your Service",
    description:
      "Search by appliance or category and choose between Home Visit or Shop Drop-off.",
    icon: Search,
  },
  {
    step: "02",
    title: "Book a Slot",
    description:
      "Check transparent starting prices, service areas, and pick a convenient time.",
    icon: CalendarCheck,
  },
  {
    step: "03",
    title: "Expert Repair",
    description:
      "Verified technicians diagnose and fix your device with care and reliability.",
    icon: Wrench,
  },
  {
    step: "04",
    title: "Secure Payment",
    description:
      "Complete payment safely and track your service status and transaction history.",
    icon: ShieldCheck,
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden w-full py-14 sm:py-20 bg-gradient-to-b from-[#EBECE4] via-[#E7E8DF] to-[#E2E1D8] border-y border-[#C2C0B1]">
      {/* Subtle Ambient Accent Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[280px] w-[560px] rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Section Header */}
        <div className="rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/85 px-6 py-5 shadow-xs space-y-2">
          <span className="inline-flex items-center text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-primary bg-[#EBECE4] border border-[#C2C0B1] px-3 py-1 rounded-full">
            Simple Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Book trusted repair services in four straightforward steps from start
            to finish.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card
                key={item.step}
                className="group rounded-2xl border border-[#C2C0B1] bg-[#EBECE4] shadow-xs hover:shadow-md hover:border-[#B8B5A5] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                <CardHeader className="space-y-4 px-5 pt-5 pb-3.5 bg-[#E2E1D8]/55 border-b border-[#C2C0B1]">
                  <div className="flex items-center justify-between">
                    <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary border border-primary/25 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider text-foreground/80 bg-[#EBECE4] border border-[#C2C0B1] px-2.5 py-1 rounded-md">
                      STEP {item.step}
                    </span>
                  </div>
                  <CardTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-5 py-4 bg-[#EBECE4]">
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
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