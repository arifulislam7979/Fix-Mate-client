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
import { Loader2 } from "lucide-react";

async function ApprovedServicesList() {
  const services: IServiceItem[] = await getApprovedServices();

  if (services.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">
          No approved services available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <Card
          key={service._id}
          className="rounded-2xl overflow-hidden border-border/70 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="relative h-48 w-full bg-muted">
              <Image
                src={service.image || "/placeholder.png"}
                alt={service.title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-md text-foreground border-border capitalize">
                {service.category}
              </Badge>
            </div>
            <CardHeader className="space-y-1">
              <CardTitle className="line-clamp-1 text-lg">
                {service.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {service.serviceMode} • {service.serviceArea}
              </p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {service.description}
              </p>
              <div className="mt-4 font-bold text-lg text-primary">
                ${service.basePrice}
              </div>
            </CardContent>
          </div>
          <CardFooter className="pt-0 ">
            <Link href={`/services/${service._id}`} className="w-full">
              <Button className="w-full cursor-pointer rounded-xl font-semibold">
                View Details & Book
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
          <div className="h-48 w-full bg-muted animate-pulse" />
          <CardHeader className="space-y-2">
            <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
            <div className="h-6 w-20 bg-muted rounded animate-pulse mt-3" />
          </CardContent>
          <CardFooter>
            <div className="h-10 w-full bg-muted rounded-xl animate-pulse" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">
          Available Repair Services
        </h1>
        <p className="text-muted-foreground text-sm">
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
