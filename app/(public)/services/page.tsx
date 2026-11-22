import { Suspense } from "react";
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
import {
  ApprovedServicesQueryParams,
  getApprovedServices,
} from "@/lib/api/services";
import { Loader2, Home, MapPin, Wrench, ArrowUpRight } from "lucide-react";
import ServicesFilterBar from "@/components/shared/ServicesFilterBar";

interface ServicesSearchParams {
  q?: string;
  category?: string;
  mode?: string;
  sort?: string;
}

interface ServicesPageProps {
  searchParams: Promise<ServicesSearchParams>;
}

const DEFAULT_CATEGORIES = [
  "AC",
  "Refrigerator",
  "Washing Machine",
  "Television",
  "Laptop & PC",
  "Smartphone",
  "Microwave",
];

const DEFAULT_MODES = ["Home Visit", "Shop Drop-off"];

function ServicesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="rounded-2xl overflow-hidden border border-[#C2C0B1] bg-[#EBECE4] shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="h-52 w-full bg-[#E2E1D8] border-b border-[#C2C0B1] animate-pulse" />
            <CardHeader className="space-y-2 px-5 pt-4 pb-2.5">
              <div className="h-5 w-3/4 bg-[#E2E1D8] rounded-lg animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3 px-5 pt-0">
              <div className="h-4 w-full bg-[#E2E1D8] rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-[#E2E1D8] rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-[#E2E1D8] rounded animate-pulse pt-1" />
              <div className="h-7 w-24 bg-[#E2E1D8] rounded-lg animate-pulse mt-2" />
            </CardContent>
          </div>
          <CardFooter className="pt-3 pb-5 px-5 border-t border-[#C2C0B1] bg-[#E2E1D8]/40">
            <div className="h-10 w-full bg-[#E2E1D8] rounded-xl animate-pulse" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

async function ApprovedServicesList({
  queryParams,
}: {
  queryParams: ApprovedServicesQueryParams;
}) {
  await connection();

  const services: IServiceItem[] = await getApprovedServices(queryParams);

  const hasFilter = Boolean(
    queryParams.q?.trim() ||
      (queryParams.category && queryParams.category.toLowerCase() !== "all") ||
      (queryParams.mode && queryParams.mode.toLowerCase() !== "all"),
  );

  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#C2C0B1] bg-[#E2E1D8]/55 text-center py-16 px-5 max-w-md mx-auto space-y-2">
        <div className="mx-auto h-11 w-11 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
          <Wrench className="h-5 w-5" />
        </div>
        <h2 className="text-base font-semibold text-foreground">
          {hasFilter ? "No Matching Services Found" : "No Approved Services Yet"}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {hasFilter
            ? "Try changing your search keyword, category, mode, or sorting option."
            : "No approved repair services are available right now. Please check back shortly."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Card
          key={service._id}
          className="group rounded-2xl overflow-hidden border border-[#C2C0B1] bg-[#EBECE4] shadow-xs hover:shadow-md hover:border-[#B8B5A5] transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="relative h-52 w-full bg-[#E2E1D8] overflow-hidden border-b border-[#C2C0B1]">
              <Image
                src={service.image || "/placeholder.png"}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
              <Badge className="absolute top-3 right-3 bg-[#EBECE4]/95 text-foreground border border-[#C2C0B1] capitalize px-3 py-1 text-xs font-semibold shadow-2xs">
                {service.category || "General"}
              </Badge>
            </div>

            <CardHeader className="space-y-1.5 px-5 pt-4 pb-2.5">
              <CardTitle className="line-clamp-1 text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                {service.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3.5 px-5 pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {service.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2.5 px-3.5 rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 text-xs text-muted-foreground">
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
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground block">
                    Starting Price
                  </span>
                  <span className="font-bold text-xl text-primary tracking-tight">
                    ${Number(service.basePrice ?? 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </div>

          <CardFooter className="pt-3 pb-5 px-5 border-t border-[#C2C0B1] bg-[#E2E1D8]/40">
            <Link href={`/services/${service._id}`} className="w-full">
              <Button className="w-full cursor-pointer rounded-xl font-semibold gap-1.5 shadow-xs">
                <span>View Details &amp; Book</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

async function DynamicServicesSection({
  searchParams,
}: {
  searchParams: Promise<ServicesSearchParams>;
}) {
  await connection();

  const resolvedParams = await searchParams;
  const queryParams: ApprovedServicesQueryParams = {
    q: resolvedParams.q,
    category: resolvedParams.category,
    mode: resolvedParams.mode,
    sort: resolvedParams.sort,
  };

  const suspenseKey = JSON.stringify(queryParams);

  return (
    <div className="space-y-8">
      <Suspense
        fallback={
          <div className="h-14 rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/70 animate-pulse" />
        }
      >
        <div className="rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/75 p-2 sm:p-3 shadow-xs">
          <ServicesFilterBar
            categories={DEFAULT_CATEGORIES}
            modes={DEFAULT_MODES}
          />
        </div>
      </Suspense>

      <Suspense
        key={suspenseKey}
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
        <ApprovedServicesList queryParams={queryParams} />
      </Suspense>
    </div>
  );
}

export default function ServicesPage({ searchParams }: ServicesPageProps) {
  return (
    <section className="min-h-screen w-full bg-[#EBECE4]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 sm:space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-2.5 max-w-3xl mx-auto rounded-3xl border border-[#C2C0B1] bg-[#E2E1D8]/85 px-6 py-8 shadow-xs">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-[#EBECE4] border border-[#C2C0B1] px-3 py-1 rounded-full">
            Trusted Technicians
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Available Repair Services
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Explore our wide range of professional repair and maintenance
            services offered by verified technicians.
          </p>
        </div>

        {/* Runtime searchParams wrapped in Suspense */}
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="h-14 rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/70 animate-pulse" />
              <ServicesGridSkeleton />
            </div>
          }
        >
          <DynamicServicesSection searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}