import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IServiceItem } from "@/app/types";
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
} from "lucide-react";
import { getSession } from "@/lib/core/server";
import BookButton from "@/components/shared/BookButton";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

interface SessionUser {
  id?: string;
  name?: string;
  email?: string;
  role?: "customer" | "technician" | "admin" | string;
}

async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const session = await getSession();
    return session?.user || null;
  } catch {
    return null;
  }
}

async function getServiceById(id: string): Promise<IServiceItem | null> {
  try {
    const res = await fetch(`${BASE_URL}/services/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.service || data || null;
  } catch (error) {
    console.error("Failed to fetch service details:", error);
    return null;
  }
}

async function ServiceDetailsContent({ id }: { id: string }) {
  const [service, currentUser] = await Promise.all([
    getServiceById(id),
    getCurrentUser(),
  ]);

  if (!service || !service._id) {
    notFound();
  }

  const userRole = currentUser?.role?.toLowerCase();
  const isCustomer = userRole === "customer";
  const isAvailable = service.isAvailable !== false;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/services">
          <Button variant="ghost" className="gap-2 rounded-xl px-3">
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Button>
        </Link>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Image & Description (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border border-border/70 bg-muted shadow-xs">
            <Image
              src={service.image || "/placeholder.png"}
              alt={service.title}
              fill
              className="object-cover"
              priority
            />
            <Badge className="absolute top-4 right-4 bg-background/85 backdrop-blur-md text-foreground border-border capitalize px-3 py-1">
              {service.category || "General"}
            </Badge>
          </div>

          <Card className="rounded-2xl border-border/70 shadow-xs bg-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold tracking-tight">
                {service.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {service.description}
              </p>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/60">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <Wrench className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Service Mode
                    </p>
                    <p className="text-sm font-semibold">
                      {service.serviceMode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Service Area
                    </p>
                    <p className="text-sm font-semibold">
                      {service.serviceArea}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <Clock className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Est. Duration
                    </p>
                    <p className="text-sm font-semibold">
                      {service.estimatedDuration || "Flexible"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Pricing, Technician Info & Booking CTA (1 Column) */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-border/70 shadow-xs bg-card sticky top-20">
            <CardHeader className="border-b border-border/60 pb-4">
              <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                Starting Price
              </p>
              <div className="text-3xl font-bold text-primary mt-1">
                ${service.basePrice}
              </div>
            </CardHeader>

            <CardContent className="pt-5 space-y-5">
              {/* Technician Info */}
              <div className="space-y-2.5">
                <h3 className="text-sm font-semibold">
                  Technician Information
                </h3>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <UserCheck className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium text-foreground">
                    {service.technicianName || "Verified Technician"}
                  </span>
                </div>
                {service.technicianEmail && (
                  <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{service.technicianEmail}</span>
                  </div>
                )}
              </div>

              {/* Availability Status */}
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl">
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
                  service={service}
                ></BookButton>
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

export default async function ServiceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
        <ServiceDetailsContent id={id} />
      </Suspense>
    </div>
  );
}
