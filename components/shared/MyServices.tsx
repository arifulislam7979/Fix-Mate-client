"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Wrench,
  Trash2,
  Edit,
  Plus,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { deleteServices, updateServices } from "@/lib/actions/services";

export interface IServiceItem {
  _id: string;
  title: string;
  category: string;
  basePrice: number;
  serviceMode: string;
  image: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  technicianEmail: string;
}

interface MyServicesProps {
  initialServices: IServiceItem[];
}

export default function MyServices({ initialServices }: MyServicesProps) {
  const [services, setServices] = useState<IServiceItem[]>(initialServices);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Availability Toggle (On/Off)
  const handleToggleAvailability = async (
    id: string,
    currentStatus: boolean,
  ) => {
    const updatedStatus = !currentStatus;

    // Optimistic UI update
    setServices((prev) =>
      prev.map((s) =>
        s._id === id ? { ...s, isAvailable: updatedStatus } : s,
      ),
    );

    try {
      await updateServices(id, { isAvailable: updatedStatus });

      toast.success(
        updatedStatus
          ? "Service is now visible to customers."
          : "Service hidden from public listings.",
      );
    } catch {
      // Revert if API fails
      setServices((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, isAvailable: currentStatus } : s,
        ),
      );
      toast.error("Failed to update availability.");
    }
  };

  // Confirm & Delete Service
  const confirmDeleteService = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      await deleteServices(deleteId);
      toast.success("Service deleted successfully.");
      setServices((prev) => prev.filter((s) => s._id !== deleteId));

      setDeleteId(null);
    } catch {
      toast.error("Failed to delete service.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/85 px-5 py-4 shadow-2xs">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            My Services
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your listed repair services, track approval status, and
            toggle availability.
          </p>
        </div>
        <Link href="/dashboard/technician/add-service" className="shrink-0">
          <Button className="rounded-xl gap-2 font-semibold shadow-xs cursor-pointer">
            <Plus className="h-4 w-4" /> Add New Service
          </Button>
        </Link>
      </div>

      {/* Main Content Card */}
      <Card className="rounded-2xl border border-[#C2C0B1] shadow-xs bg-[#EBECE4] overflow-hidden">
        <CardHeader className="bg-[#E2E1D8]/75 border-b border-[#C2C0B1] px-5 sm:px-6 py-4">
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" /> Service Catalog (
            {services.length})
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            All the repair services you have created appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 bg-[#EBECE4]">
          {services.length === 0 ? (
            <div className="p-6">
              <div className="text-center py-14 px-4 space-y-3 rounded-2xl border border-dashed border-[#C2C0B1] bg-[#E2E1D8]/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto text-primary">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg text-foreground">
                  No services found
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  You haven&apos;t added any repair services yet. Click the
                  button above to publish your first service.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#C2C0B1] bg-[#E2E1D8]/85 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                    <th className="py-3.5 px-4">Service</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Approval Status</th>
                    <th className="py-3.5 px-4">Availability</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C2C0B1] text-sm">
                  {services.map((service) => (
                    <tr
                      key={service._id}
                      className="hover:bg-[#E2E1D8]/45 transition-colors"
                    >
                      {/* Service Title & Image */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#C2C0B1] bg-[#E2E1D8] shrink-0">
                            <Image
                              src={service.image || "/placeholder.png"}
                              alt={service.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground line-clamp-1">
                              {service.title}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {service.serviceMode}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 font-medium text-muted-foreground">
                        {service.category}
                      </td>

                      {/* Base Price */}
                      <td className="py-3.5 px-4 font-bold text-foreground">
                        ${service.basePrice}
                      </td>

                      {/* Approval Status Badge */}
                      <td className="py-3.5 px-4">
                        <Badge
                          variant="outline"
                          className={`capitalize rounded-lg px-2.5 py-0.5 text-xs font-semibold ${
                            service.approvalStatus === "approved"
                              ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/35"
                              : service.approvalStatus === "rejected"
                                ? "bg-rose-500/15 text-rose-700 border-rose-500/35"
                                : "bg-amber-500/15 text-amber-700 border-amber-500/35"
                          }`}
                        >
                          {service.approvalStatus}
                        </Badge>
                      </td>

                      {/* Availability Toggle */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5 rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 px-2.5 py-1.5 w-fit">
                          <Switch
                            checked={service.isAvailable}
                            onCheckedChange={() =>
                              handleToggleAvailability(
                                service._id,
                                service.isAvailable,
                              )
                            }
                          />
                          <span className="text-xs font-medium text-foreground/85">
                            {service.isAvailable ? "Active" : "Hidden"}
                          </span>
                        </div>
                      </td>

                      {/* Actions (Edit & Delete) */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/technician/my-services/${service._id}`}
                          >
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-9 w-9 rounded-xl bg-[#E2E1D8]/75 border-[#C2C0B1] hover:bg-[#E2E1D8] cursor-pointer"
                            >
                              <Edit className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setDeleteId(service._id)}
                            className="h-9 w-9 rounded-xl bg-[#E2E1D8]/75 border-[#C2C0B1] hover:bg-rose-500/15 hover:text-rose-700 hover:border-rose-500/35 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent className="rounded-2xl sm:max-w-md border border-[#C2C0B1] bg-[#EBECE4] text-foreground p-0 overflow-hidden">
          <DialogHeader className="p-5 bg-[#E2E1D8]/80 border-b border-[#C2C0B1]">
            <DialogTitle className="text-lg font-bold text-foreground">
              Delete Service
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to delete this service? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="p-5 bg-[#EBECE4] gap-2 sm:gap-2.5">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={isDeleting}
              className="rounded-xl bg-[#E2E1D8]/75 border-[#C2C0B1] hover:bg-[#E2E1D8] text-foreground cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteService}
              disabled={isDeleting}
              className="rounded-xl cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}