import { Suspense } from "react";
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
import { getApprovedServices } from "@/lib/api/services";
import { Loader2, Home, MapPin, Wrench, ArrowUpRight } from "lucide-react";

async function ApprovedServicesList() {
  const services: IServiceItem[] = await getApprovedServices();

  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 text-center py-16 px-4 max-w-md mx-auto space-y-2">
        <div className="mx-auto h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <Wrench className="h-5 w-5" />
        </div>
        <h2 className="text-base font-semibold text-foreground">
          No Approved Services Yet
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          No approved repair services are available right now. Please check back
          shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Card
          key={service._id}
          className="group rounded-2xl overflow-hidden border-border/70 bg-card shadow-xs hover:shadow-md hover:border-primary/35 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="relative h-52 w-full bg-muted overflow-hidden">
              <Image
                src={service.image || "/placeholder.png"}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
              <Badge className="absolute top-3 right-3 bg-background/90 backdrop-blur-md text-foreground border-border/80 capitalize px-3 py-1 text-xs font-medium shadow-2xs">
                {service.category || "General"}
              </Badge>
            </div>

            <CardHeader className="space-y-1.5 pb-2.5">
              <CardTitle className="line-clamp-1 text-lg font-bold tracking-tight group-hover:text-primary transition-colors">
                {service.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3.5 pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {service.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground/85">
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
                  <span className="text-[11px] uppercase tracking-wider font-medium text-muted-foreground block">
                    Starting Price
                  </span>
                  <span className="font-bold text-xl text-primary tracking-tight">
                    ${Number(service.basePrice ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </div>

          <CardFooter className="pt-2 pb-5 px-6">
            <Link href={`/services/${service._id}`} className="w-full">
              <Button className="w-full cursor-pointer rounded-xl font-semibold gap-1.5">
                <span>View Details & Book</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function ServicesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="rounded-2xl overflow-hidden border-border/70 shadow-xs"
        >
          <div className="h-52 w-full bg-muted animate-pulse" />
          <CardHeader className="space-y-2 pb-2.5">
            <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse pt-1" />
            <div className="h-6 w-24 bg-muted rounded animate-pulse mt-2" />
          </CardContent>
          <CardFooter className="pt-2 pb-5 px-6">
            <div className="h-10 w-full bg-muted rounded-xl animate-pulse" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-9">
      {/* Page Header */}
      <div className="text-center space-y-2.5 max-w-2xl mx-auto">
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
          Trusted Technicians
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Available Repair Services
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Explore our wide range of professional repair and maintenance services
          offered by verified technicians.
        </p>
      </div>

      {/* Suspense Wrapper */}
      <Suspense
        fallback={
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Loading approved services...</span>
            </div>
            <ServicesGridSkeleton />
          </div>
        }
      >
        <ApprovedServicesList />
      </Suspense>
    </div>
  );
}