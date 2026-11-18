import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// শুধু approved এবং available সার্ভিস ফেচ করার ফাংশন
async function getApprovedServices() {
  try {
    const res = await fetch(`${BASE_URL}/services?approvalStatus=approved&isAvailable=true`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.services || [];
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getApprovedServices();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Available Repair Services</h1>
        <p className="text-muted-foreground text-sm">
          Explore our wide range of professional repair and maintenance services offered by verified technicians.
        </p>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No approved services available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service._id} className="rounded-2xl overflow-hidden border-border/70 shadow-xs flex flex-col justify-between">
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
                  <CardTitle className="line-clamp-1 text-lg">{service.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{service.serviceMode} • {service.serviceArea}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>
                  <div className="mt-4 font-bold text-lg text-primary">${service.basePrice}</div>
                </CardContent>
              </div>
              <CardFooter className="pt-0">
                <Link href={`/services/${service._id}`} className="w-full">
                  <Button className="w-full rounded-xl font-semibold">View Details & Book</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}