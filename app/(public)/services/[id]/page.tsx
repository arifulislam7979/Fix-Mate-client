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
    <div className="space-y-6 sm:space-y-8">
      {/* Back Button */}
      <div>
        <Link href="/services">
          <Button
            variant="outline"
            className="gap-2 rounded-xl px-3.5 h-10 cursor-pointer bg-[#FAF9F5] border-stone-200/90 hover:bg-white text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Services</span>
          </Button>
        </Link>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Left: Image, Category & Description (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-stone-200/85 bg-[#ECECE4] shadow-2xs">
            <Image
              src={service.image || "/placeholder.png"}
              alt={service.title}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            <Badge className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs text-stone-800 border border-stone-200/90 capitalize px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
              <Tag className="h-3.5 w-3.5 text-primary" />
              {service.category || "General"}
            </Badge>
          </div>

          <Card className="rounded-2xl border-stone-200/85 shadow-2xs bg-[#FAF9F5]">
            <CardHeader className="space-y-2.5 px-5 sm:px-6 pt-5 sm:pt-6 pb-3 border-b border-stone-200/70">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="rounded-lg capitalize font-semibold text-xs bg-primary/10 text-primary border border-primary/15"
                >
                  Category: {service.category || "General"}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-lg font-medium text-xs bg-white/80 border-stone-200 text-stone-700"
                >
                  {service.serviceMode}
                </Badge>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {service.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 px-5 sm:px-6 pt-5 pb-6">
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-5 border-t border-stone-200/75">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F2F2EA]/85 border border-stone-200/70">
                  <Tag className="h-5 w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-stone-500">
                      Category
                    </p>
                    <p className="text-sm font-semibold text-foreground capitalize truncate">
                      {service.category || "General"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F2F2EA]/85 border border-stone-200/70">
                  <Wrench className="h-5 w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-stone-500">
                      Service Mode
                    </p>
                    <p className="text-sm font-semibold text-foreground truncate">
                      {service.serviceMode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F2F2EA]/85 border border-stone-200/70">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-stone-500">
                      Service Area
                    </p>
                    <p className="text-sm font-semibold text-foreground truncate">
                      {service.serviceArea}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F2F2EA]/85 border border-stone-200/70">
                  <Clock className="h-5 w-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-stone-500">
                      Est. Duration
                    </p>
                    <p className="text-sm font-semibold text-foreground truncate">
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
          <Card className="rounded-2xl border-stone-200/85 shadow-sm bg-[#FAF9F5] lg:sticky lg:top-24">
            <CardHeader className="border-b border-stone-200/75 px-5 sm:px-6 pt-5 pb-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                  Starting Price
                </p>
                <Badge
                  variant="outline"
                  className="capitalize text-xs bg-white/80 border-stone-200 text-stone-700"
                >
                  {service.category || "General"}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-primary mt-1 tracking-tight">
                ${Number(service.basePrice ?? 0).toFixed(2)}
              </div>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 space-y-5">
              {/* Enhanced Technician Information Card */}
              <div className="rounded-xl border border-stone-200/80 bg-[#F2F2EA]/80 p-4 space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-primary" />
                    Technician Information
                  </h2>
                  <Badge
                    variant="secondary"
                    className="text-[11px] bg-primary/10 text-primary border border-primary/20"
                  >
                    Verified Pro
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  {service.technicianImage ? (
                    <div className="relative h-11 w-11 rounded-full overflow-hidden border border-stone-200 shrink-0 bg-white">
                      <Image
                        src={service.technicianImage}
                        alt={technicianDisplayName}
                        fill
                        sizes="44px"
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
                      <div className="flex items-center gap-1.5 text-xs text-stone-600 mt-0.5">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {service.technicianEmail}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 pt-2.5 border-t border-stone-200/75 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>
                      <strong className="text-foreground font-semibold">
                        Coverage Area:
                      </strong>{" "}
                      {service.technicianArea || service.serviceArea || "N/A"}
                    </span>
                  </div>

                  {service.technicianBio && (
                    <div className="flex items-start gap-2 pt-0.5 leading-relaxed">
                      <FileText className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-foreground font-semibold">
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
                className={`flex items-center gap-2 text-xs font-semibold px-3.5 py-2.5 rounded-xl border ${
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
                    className="w-full h-11 cursor-pointer rounded-xl font-semibold text-sm sm:text-base shadow-2xs"
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
                    className="w-full h-11 rounded-xl font-semibold text-sm sm:text-base"
                    disabled
                  >
                    Booking Restricted
                  </Button>
                  <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl">
                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-700" />
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
    <section className="min-h-screen w-full bg-[#F6F6F1]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-24 text-stone-600 gap-2.5">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
              <p className="text-sm font-medium">Loading service details...</p>
            </div>
          }
        >
          <ServiceDetailsWrapper params={params} />
        </Suspense>
      </div>
    </section>
  );
}