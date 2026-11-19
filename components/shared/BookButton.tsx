"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookings, IServiceItem, ServiceCategory, UserRole } from "@/app/types";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Loader2, Calendar, MapPin, Phone, FileText } from "lucide-react";
import { bookingsData } from "@/lib/actions/bookings";

interface BookButtonProps {
  isAvailable: boolean;
  service: IServiceItem;
}

export default function BookButton({ isAvailable, service }: BookButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");

  const handleBookClick = () => {
    if (!user) {
      router.push(`/sign-in?redirectTo=/services/${service._id}`);
      return;
    }

    if (user.role !== "customer") {
      toast.error("Only customers are allowed to book repair services.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);

      const bookingData: Bookings = {
        serviceId: service._id,
        serviceTitle: service.title,
        serviceImage: service.image,
        category: service.category as ServiceCategory,
        basePrice: Number(service.basePrice),
        finalAmount: Number(service.basePrice),
        technicianName: service.technicianName,
        technicianEmail: service.technicianEmail,
        customerName: user.name || "",
        customerEmail: user.email || "",
        customerRole: ((user as { role?: string }).role ||
          "customer") as UserRole,
        customerPhone: phone.trim(),
        address: address.trim(),
        preferredDate,
        problemDescription: problemDescription.trim(),
        status: "requested",
        paymentStatus: "unpaid",
      };

      const result = await bookingsData(bookingData);

      if (result?.insertedId || result?.success) {
        toast.success("Service booked successfully!");
        router.push('/dashboard/customer/bookings')
        setIsModalOpen(false);
        setPhone("");
        setAddress("");
        setPreferredDate("");
        setProblemDescription("");
        
        router.refresh();
      } else {
        toast.error(
          result?.message || "Failed to book service. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error booking service:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleBookClick}
        className="w-full h-11 cursor-pointer rounded-xl font-semibold text-base"
        disabled={!isAvailable}
      >
        Book This Service
      </Button>

      {/* Booking Information Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/70">
              <div>
                <h3 className="text-lg font-bold">Book Repair Service</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {service.title} • ${service.basePrice}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Service Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Road, Area, City"
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary" />
                  Problem Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Describe the issue briefly..."
                  className="w-full p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="rounded-xl cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl cursor-pointer min-w-28"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
