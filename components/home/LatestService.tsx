import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { Home, MapPin, Wrench, ArrowUpRight, Loader2 } from "lucide-react";
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

function LatestServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="rounded-2xl overflow-hidden border-border/70 bg-card shadow-xs"
        >
          <div className="h-44 sm:h-52 w-full bg-muted animate-pulse" />
          <CardHeader className="space-y-2 px-4 sm:px-6 pt-4 pb-2">
            <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-3 px-4 sm:px-6 pt-0">
            <div className="h-3.5 w-full bg-muted rounded animate-pulse" />
            <div className="h-3.5 w-5/6 bg-muted rounded animate-pulse" />
            <div className="h-3.5 w-2/3 bg-muted rounded animate-pulse pt-1" />
            <div className="h-6 w-24 bg-muted rounded animate-pulse mt-2" />
          </CardContent>
          <CardFooter className="pt-2 pb-4 sm:pb-5 px-4 sm:px-6">
            <div className="h-10 w-full bg-muted rounded-xl animate-pulse" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

async function LatestServicesGrid() {
  const payload: IServiceItem[] | LatestServicesResponseWrapper =
    await latestService();
  const latestServices = extractLatestServices(payload);

  if (latestServices.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 text-center py-10 sm:py-12 px-4 max-w-md mx-auto space-y-2">
        <div className="mx-auto h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <Wrench className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          No Latest Services Available
        </p>
        <p className="text-xs text-muted-foreground">
          Newly approved services will appear here shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {latestServices.map((service) => (
        <Card
          key={service._id}
          className="group rounded-2xl overflow-hidden border-border/70 bg-card shadow-xs hover:shadow-md hover:border-primary/35 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="relative h-44 sm:h-52 w-full bg-muted overflow-hidden">
              <Image
                src={service.image || "/placeholder.png"}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
              <Badge className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-background/90 backdrop-blur-md text-foreground border-border/80 capitalize px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-medium shadow-2xs">
                {service.category || "General"}
              </Badge>
            </div>

            <CardHeader className="space-y-1.5 px-4 sm:px-6 pt-4 pb-2">
              <CardTitle className="line-clamp-1 text-base sm:text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
                {service.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 px-4 sm:px-6 pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {service.description}
              </p>

              <div className="flex flex-col xs:flex-row sm:flex-wrap sm:items-center gap-1.5 sm:gap-x-4 sm:gap-y-1.5 pt-2.5 border-t border-border/60 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground/85 shrink-0">
                  <Home className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{service.serviceMode || "Home Visit"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 min-w-0">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">
                    {service.serviceArea || "Location available"}
                  </span>
                </span>
              </div>

              <div className="pt-1 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-medium text-muted-foreground block">
                    Starting Price
                  </span>
                  <span className="font-bold text-lg sm:text-xl text-primary tracking-tight">
                    ${Number(service.basePrice ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </div>

          <CardFooter className="pt-2 pb-4 sm:pb-5 px-4 sm:px-6">
            <Link href={`/services/${service._id}`} className="w-full">
              <Button className="w-full cursor-pointer rounded-xl font-semibold text-xs sm:text-sm h-10 gap-1.5">
                <span>View Details & Book</span>
                <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function LatestService() {
  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 space-y-5 sm:space-y-7">
      {/* Section Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5 min-w-0">
          <span className="inline-block text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-2.5 sm:px-3 py-1 rounded-full">
            Newly Approved
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            Latest Repair Services
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
            Freshly approved repair services from verified technicians.
          </p>
        </div>

        <Link href="/services" className="w-full sm:w-auto shrink-0">
          <Button
            variant="outline"
            className="w-full sm:w-auto rounded-xl cursor-pointer gap-1.5 justify-center"
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
    </section>
  );
}