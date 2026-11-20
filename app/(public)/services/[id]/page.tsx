import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Wrench,
  UserCheck,
  Mail,
  CheckCircle2,
  Loader2,
  ShieldAlert,
  Tag,
  Award,
  FileText,
} from "lucide-react";
import { IServiceItem, ServiceCategory } from "@/app/types";
import { getSession } from "@/lib/core/server";
import BookButton from "@/components/shared/BookButton";
import { getServiceDetails } from "@/lib/api/services";

interface SessionUser {
  id?: string;
  name?: string;
  email?: string;
  role?: "customer" | "technician" | "admin" | string;
}

type ExtendedServiceDetails = Omit<
  IServiceItem,
  "category" | "isAvailable"
> & {
  category?: ServiceCategory | string;
  isAvailable?: boolean;
  technicianImage?: string;
  technicianArea?: string;
  technicianBio?: string;
  approvalStatus?: string;
};

async function ServiceDetailsContent({ id }: { id: string }) {
  const [rawService, session] = await Promise.all([
    getServiceDetails(id),
    getSession(),
  ]);

  const service = rawService as ExtendedServiceDetails | null;

  if (!service || !service._id) {
    notFound();
  }

  if (service.approvalStatus && service.approvalStatus !== "approved") {
    notFound();
  }

  const currentUser = session?.user as SessionUser | undefined;
  const userRole = currentUser?.role?.toLowerCase();
  const isCustomer = userRole === "customer";
  const isAvailable = service.isAvailable !== false;

  const technicianDisplayName = service.technicianName || "Verified Technician";
  const technicianInitial = technicianDisplayName.charAt(0).toUpperCase();

  const bookButtonService: IServiceItem = {
    ...(service as IServiceItem),
    category: (service.category || "general") as ServiceCategory,
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/services">
          <Button variant="ghost" className="gap-2 rounded-xl px-3 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Button>
        </Link>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Image, Category & Description (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-border/70 bg-muted shadow-xs">
            <Image
              src={service.image || "/placeholder.png"}
              alt={service.title}
              fill
              className="object-cover"
              priority
            />
            <Badge className="absolute top-4 right-4 bg-background/90 backdrop-blur-md text-foreground border-border capitalize px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-primary" />
              {service.category || "General"}
            </Badge>
          </div>

          <Card className="rounded-2xl border-border/70 shadow-xs bg-card">
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="rounded-lg capitalize font-medium text-xs"
                >
                  Category: {service.category || "General"}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-lg font-medium text-xs"
                >
                  {service.serviceMode}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                {service.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {service.description}
              </p>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4 border-t border-border/60">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <Tag className="h-5 w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-semibold capitalize truncate">
                      {service.category || "General"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <Wrench className="h-5 w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Service Mode
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {service.serviceMode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Service Area
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {service.serviceArea}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <Clock className="h-5 w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Est. Duration
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {service.estimatedDuration || "Flexible"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Pricing, Detailed Technician Info & Booking CTA (1 Column) */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/70 shadow-xs bg-card sticky top-20">
            <CardHeader className="border-b border-border/60 pb-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                  Starting Price
                </p>
                <Badge variant="outline" className="capitalize text-xs">
                  {service.category || "General"}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-primary mt-1">
                ${Number(service.basePrice ?? 0).toFixed(2)}
              </div>
            </CardHeader>

            <CardContent className="pt-5 space-y-5">
              {/* Enhanced Technician Information Card */}
              <div className="rounded-xl border border-border/70 bg-muted/35 p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-primary" />
                    Technician Information
                  </h3>
                  <Badge
                    variant="secondary"
                    className="text-[11px] bg-primary/10 text-primary border-primary/20"
                  >
                    Verified Pro
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  {service.technicianImage ? (
                    <div className="relative h-11 w-11 rounded-full overflow-hidden border border-border shrink-0">
                      <Image
                        src={service.technicianImage}
                        alt={technicianDisplayName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-sm shrink-0 border border-primary/25">
                      {technicianInitial}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                      <p className="font-semibold text-sm text-foreground truncate">
                        {technicianDisplayName}
                      </p>
                    </div>
                    {service.technicianEmail && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {service.technicianEmail}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>
                      <strong className="text-foreground font-medium">
                        Coverage Area:
                      </strong>{" "}
                      {service.technicianArea || service.serviceArea || "N/A"}
                    </span>
                  </div>

                  {service.technicianBio && (
                    <div className="flex items-start gap-2 pt-0.5 leading-relaxed">
                      <FileText className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-foreground font-medium">
                          About:
                        </strong>{" "}
                        {service.technicianBio}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Availability Status */}
              <div
                className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl border ${
                  isAvailable
                    ? "text-emerald-700 bg-emerald-500/10 border-emerald-500/20"
                    : "text-amber-700 bg-amber-500/10 border-amber-500/20"
                }`}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>
                  {!isAvailable
                    ? "Currently Unavailable"
                    : "Available for Booking"}
                </span>
              </div>

              {/* Role-Restricted Book Action: Only Customer Can Book */}
              {!currentUser ? (
                <Link
                  href={`/sign-in?redirectTo=/services/${service._id}`}
                  className="block"
                >
                  <Button
                    className="w-full h-11 cursor-pointer rounded-xl font-semibold text-base"
                    disabled={!isAvailable}
                  >
                    Login as Customer to Book
                  </Button>
                </Link>
              ) : isCustomer ? (
                <BookButton
                  isAvailable={isAvailable}
                  service={bookButtonService}
                />
              ) : (
                <div className="space-y-2.5">
                  <Button
                    className="w-full h-11 rounded-xl font-semibold text-base"
                    disabled
                  >
                    Booking Restricted
                  </Button>
                  <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl">
                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      You are logged in as{" "}
                      <strong className="capitalize">{currentUser.role}</strong>
                      . Only customers can book repair services.
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

async function ServiceDetailsWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ServiceDetailsContent id={id} />;
}

export default function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-2">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
            <p className="text-sm">Loading service details...</p>
          </div>
        }
      >
        <ServiceDetailsWrapper params={params} />
      </Suspense>
    </div>
  );
}