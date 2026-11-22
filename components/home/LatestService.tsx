import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IServiceItem } from "@/app/types";
import { Home, UserCheck, Wrench, ArrowUpRight, Loader2 } from "lucide-react";
import { latestService } from "@/lib/actions/services";

interface LatestServicesResponseWrapper {
  services?: IServiceItem[];
  data?: IServiceItem[];
}

function extractLatestServices(
  payload: IServiceItem[] | LatestServicesResponseWrapper,
): IServiceItem[] {
  if (Array.isArray(payload)) {
    return payload.slice(0, 6);
  }
  const list = payload.services || payload.data || [];
  return list.slice(0, 6);
}

function getTechnicianName(service: IServiceItem): string {
  const record = service as unknown as Record<string, unknown>;
  const candidates = [record.providerName, record.technicianName];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }

  return "Verified Technician";
}

function LatestServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="w-full h-full rounded-2xl overflow-hidden border border-[#C2C0B1] bg-[#EBECE4] shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="w-full h-48 sm:h-52 bg-[#E2E1D8] border-b border-[#C2C0B1] animate-pulse" />
            <CardHeader className="space-y-2 px-5 pt-4 pb-2">
              <div className="h-5 w-3/4 bg-[#E2E1D8] rounded-lg animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3 px-5 pt-1">
              <div className="h-4 w-2/3 bg-[#E2E1D8] rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-[#E2E1D8] rounded animate-pulse" />
              <div className="h-7 w-24 bg-[#E2E1D8] rounded-lg animate-pulse mt-2" />
            </CardContent>
          </div>
          <CardFooter className="pt-2 pb-5 px-5 border-t border-[#C2C0B1]">
            <div className="h-10 w-full bg-[#E2E1D8] rounded-xl animate-pulse" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

async function LatestServicesGrid() {
  await connection();

  const payload: IServiceItem[] | LatestServicesResponseWrapper =
    await latestService();
  const latestServices = extractLatestServices(payload);

  if (latestServices.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-dashed border-[#C2C0B1] bg-[#E2E1D8]/55 text-center py-12 px-5 max-w-md mx-auto space-y-2">
        <div className="mx-auto h-11 w-11 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
          <Wrench className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          No Latest Services Available
        </p>
        <p className="text-xs text-muted-foreground">
          Newly approved repair services will appear here shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {latestServices.map((service) => {
        const technicianName = getTechnicianName(service);

        return (
          <Card
            key={service._id}
            className="group w-full h-full rounded-2xl overflow-hidden border border-[#C2C0B1] bg-[#EBECE4] shadow-xs hover:shadow-md hover:border-[#B8B5A5] transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Service Image & Category Pill */}
              <div className="relative w-full h-48 sm:h-52 bg-[#E2E1D8] overflow-hidden border-b border-[#C2C0B1]">
                <Image
                  src={service.image || "/placeholder.png"}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                <Badge className="absolute top-3 right-3 bg-[#EBECE4]/95 text-foreground border border-[#C2C0B1] capitalize px-3 py-1 text-[11px] font-semibold shadow-2xs">
                  {service.category || "General"}
                </Badge>
              </div>

              {/* Service Title */}
              <CardHeader className="space-y-1.5 px-5 pt-4 pb-2.5">
                <CardTitle className="line-clamp-1 text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3.5 px-5 pt-0">
                {/* Service Mode & Technician Name */}
                <div className="flex flex-col gap-2 py-3 px-3.5 rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-2 font-medium text-foreground/85 min-w-0">
                    <Home className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">
                      Mode: {service.serviceMode || "Home Visit"}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 min-w-0">
                    <UserCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">
                      Technician: {technicianName}
                    </span>
                  </span>
                </div>

                {/* Starting Price */}
                <div className="pt-1 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block">
                      Starting Price
                    </span>
                    <span className="font-bold text-xl text-primary tracking-tight">
                      ${Number(service.basePrice ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </div>

            {/* Action Button */}
            <CardFooter className="pt-3 pb-5 px-5 border-t border-[#C2C0B1] bg-[#E2E1D8]/40">
              <Link href={`/services/${service._id}`} className="w-full">
                <Button className="w-full cursor-pointer rounded-xl font-semibold text-xs sm:text-sm h-10 gap-1.5 shadow-xs">
                  <span>View Details</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export default function LatestService() {
  return (
    <section className="w-full bg-[#EBECE4] border-b border-[#C2C0B1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-6 sm:space-y-8">
        {/* Section Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/85 px-6 py-5 shadow-xs">
          <div className="space-y-1.5 min-w-0">
            <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-primary bg-[#EBECE4] border border-[#C2C0B1] px-3 py-1 rounded-full">
              Newly Approved
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Latest Repair Services
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Freshly approved repair services from verified technicians.
            </p>
          </div>

          <Link href="/services" className="w-full sm:w-auto shrink-0">
            <Button
              variant="outline"
              className="w-full sm:w-auto rounded-xl cursor-pointer gap-1.5 justify-center bg-[#EBECE4] border-[#C2C0B1] hover:bg-[#E2E1D8]"
            >
              <span>View All Services</span>
              <ArrowUpRight className="h-4 w-4 shrink-0" />
            </Button>
          </Link>
        </div>

        {/* Suspense Wrapper */}
        <Suspense
          fallback={
            <div className="space-y-5">
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>Loading latest services...</span>
              </div>
              <LatestServicesSkeleton />
            </div>
          }
        >
          <LatestServicesGrid />
        </Suspense>
      </div>
    </section>
  );
}