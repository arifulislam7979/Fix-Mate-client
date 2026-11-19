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
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IServiceItem } from "@/app/types";
import { deleteServices, statusUpdate } from "@/lib/actions/services";

interface ServicesManageProps {
  initialServices: IServiceItem[];
}

export default function ServicesManage({
  initialServices,
}: ServicesManageProps) {
  const [services, setServices] = useState<IServiceItem[]>(initialServices);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );

  const router = useRouter();

  const handleStatusChange = async (serviceId: string, newStatus: string) => {
    try {
      setActionLoading(serviceId);
      const result = await statusUpdate(serviceId, {
        approvalStatus: newStatus,
      });
      if (result.modifiedCount > 0) {
        toast.success(`Service status updated to ${newStatus}`);
      }

      setServices((prev) =>
        prev.map((service) =>
          service._id === serviceId
            ? {
                ...service,
                approvalStatus: newStatus as
                  | "pending"
                  | "approved"
                  | "rejected",
              }
            : service,
        ),
      );
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const openDeleteModal = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setDeleteModalOpen(true);
  };

  
  const confirmDeleteService = async () => {
    if (!selectedServiceId) return;

    try {
      setActionLoading(selectedServiceId);
      const result = await deleteServices(selectedServiceId);
      if (result.deletedCount > 0 || result.deleteCount > 0) {
        toast.success("Service deleted successfully");
      }

      setServices((prev) =>
        prev.filter((service) => service._id !== selectedServiceId),
      );
      router.refresh();
    } catch {
      toast.error("Failed to delete service");
    } finally {
      setActionLoading(null);
      setDeleteModalOpen(false);
      setSelectedServiceId(null);
    }
  };

  return (
    <>
      <Card className="rounded-2xl border-border/70 shadow-xs bg-card">
        <CardHeader>
          <CardTitle className="text-lg">All Platform Services</CardTitle>
          <CardDescription>
            Review and control all services published by technicians.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No services found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Approval Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-sm">
                  {services.map((service) => {
                    const status = service.approvalStatus || "pending";
                    const isProcessing = actionLoading === service._id;

                    return (
                      <tr
                        key={service._id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        {/* Service Title & Image */}
                        <td className="py-3.5 px-4 font-medium flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0">
                            <Image
                              src={service.image || "/placeholder.png"}
                              alt={service.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold line-clamp-1">
                              {service.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {service.technicianEmail || "N/A"}
                            </p>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 capitalize text-muted-foreground">
                          {service.category || "General"}
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-semibold text-primary">
                          ${service.basePrice}
                        </td>

                        {/* Approval Status Dropdown / Badge */}
                        <td className="py-3.5 px-4">
                          <select
                            value={status}
                            disabled={isProcessing}
                            onChange={(e) =>
                              handleStatusChange(service._id, e.target.value)
                            }
                            className={`text-xs font-semibold rounded-lg border px-3 py-1.5 focus:outline-none focus:ring-2 cursor-pointer transition-colors ${
                              status === "approved"
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 focus:ring-emerald-500"
                                : status === "rejected"
                                  ? "bg-red-500/15 border-red-500/40 text-red-600 focus:ring-red-500"
                                  : "bg-amber-500/10 border-amber-500/30 text-amber-600 focus:ring-amber-500"
                            }`}
                          >
                            <option
                              value="pending"
                              className="bg-background text-foreground"
                            >
                              Pending
                            </option>
                            <option
                              value="approved"
                              className="bg-background text-foreground"
                            >
                              Approved
                            </option>
                            <option
                              value="rejected"
                              className="bg-background text-foreground"
                            >
                              Rejected
                            </option>
                          </select>
                        </td>

                        {/* Actions (Delete) */}
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isProcessing}
                            onClick={() => openDeleteModal(service._id)}
                            className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                            title="Delete Service"
                          >
                            {isProcessing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Popup Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-lg space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <div className="p-3 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">Delete this service?</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this service? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setSelectedServiceId(null);
                }}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteService}
                className="rounded-xl"
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
