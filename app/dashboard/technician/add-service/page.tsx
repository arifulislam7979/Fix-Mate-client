"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/imgbb"; // আপনার তৈরি করা imgbb ফাংশন ইমপোর্ট করা হলো
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Wrench,
  Loader2,
  ShieldCheck,
  UserCheck,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { getService } from "@/lib/actions/services";
import { IServices } from "@/app/types";

export default function AddServicesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const user = session?.user as
    | { role?: string; name?: string; email?: string }
    | undefined;
  const userRole = user?.role || "customer";

  // আপনার তৈরি করা uploadImageToImgBB ফাংশন ব্যবহার করে ইমেজ আপলোড হ্যান্ডলার
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await uploadImageToImgBB(file);
      setImageUrl(url);
      toast.success("Image uploaded successfully!");
    } catch {
      toast.error("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error("Please upload a service banner image.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const serviceData: IServices = {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
      image: imageUrl,
      basePrice: Number(formData.get("basePrice")),
      estimatedDuration: formData.get("estimatedDuration") as string,
      serviceMode: formData.get("serviceMode") as string,
      serviceArea: formData.get("serviceArea") as string,
      technicianName: user?.name || "Admin",
      technicianEmail: user?.email || "",
      approvalStatus: userRole === "admin" ? "approved" : "pending",
      isAvailable: true,
      createdAt: new Date(),
    };

    try {
      console.log("Submitting service schema data:", serviceData);

      const result = await getService(serviceData);

      if (result.insertedId) {
        toast.success(
          userRole === "admin"
            ? "Service published successfully!"
            : "Service submitted for admin approval!",
        );
      }

      if (userRole === "admin") {
        router.push("/dashboard/admin/services");
      } else {
        router.push("/dashboard/technician/my-services");
      }
    } catch {
      toast.error("Failed to add service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add New Service</h2>
          <p className="text-sm text-muted-foreground">
            {userRole === "admin"
              ? "Publish a new verified service to the platform."
              : "Submit a new repair service for admin approval."}
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 shadow-xs">
          {userRole === "admin" ? (
            <>
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase text-primary">
                Admin Mode
              </span>
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-semibold uppercase text-amber-600">
                Technician Mode
              </span>
            </>
          )}
        </div>
      </div>

      {/* Form Card */}
      <Card className="rounded-2xl border-border/70 shadow-xs bg-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" /> Service Schema Form
          </CardTitle>
          <CardDescription>
            Fill in the details according to the database requirements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder='e.g. "iPhone Screen Replacement"'
                className="rounded-xl h-11"
              />
            </div>

            {/* Category & Service Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue="Smartphone">
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Smartphone">Smartphone</SelectItem>
                    <SelectItem value="Laptop & PC">Laptop & PC</SelectItem>
                    <SelectItem value="AC">AC</SelectItem>
                    <SelectItem value="Refrigerator">Refrigerator</SelectItem>
                    <SelectItem value="TV">TV</SelectItem>
                    <SelectItem value="Washing Machine">
                      Washing Machine
                    </SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="serviceMode">Service Mode</Label>
                <Select name="serviceMode" defaultValue="Home Visit">
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Home Visit">Home Visit</SelectItem>
                    <SelectItem value="Shop Drop-off">Shop Drop-off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Base Price & Estimated Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="basePrice">Base Price (USD)</Label>
                <Input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  required
                  min="0"
                  placeholder="45"
                  className="rounded-xl h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                <Input
                  id="estimatedDuration"
                  name="estimatedDuration"
                  required
                  placeholder='e.g. "2-3 hours", "1 day"'
                  className="rounded-xl h-11"
                />
              </div>
            </div>

            {/* Service Area */}
            <div className="space-y-1.5">
              <Label htmlFor="serviceArea">Service Area</Label>
              <Input
                id="serviceArea"
                name="serviceArea"
                required
                placeholder='e.g. "Dhanmondi, Dhaka"'
                className="rounded-xl h-11"
              />
            </div>

            {/* ImgBB Image Upload */}
            <div className="space-y-1.5 ">
              <Label htmlFor="image">Service Banner Image (ImgBB)</Label>
              <div className="flex items-center gap-3 ">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="h-11 rounded-xl px-2 py-1.5 text-sm text-muted-foreground cursor-pointer file:mr-3 file:h-full file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                {uploadingImage && (
                  <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0 " />
                )}
              </div>
              {imageUrl && (
                <div className="flex items-center gap-2 mt-2 text-xs text-emerald-600 font-medium ">
                  <ImageIcon className="h-4 w-4" /> Uploaded successfully!
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                required
                placeholder="What the service includes..."
                className="rounded-xl resize-none p-3"
              />
            </div>

            {/* Readonly Technician / User Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
              <div className="space-y-1.5">
                <Label htmlFor="technicianName">
                  Technician Name (Read-only)
                </Label>
                <Input
                  id="technicianName"
                  value={user?.name || ""}
                  readOnly
                  disabled
                  className="rounded-xl h-11 bg-muted/50 cursor-not-allowed font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="technicianEmail">
                  Technician Email (Read-only)
                </Label>
                <Input
                  id="technicianEmail"
                  value={user?.email || ""}
                  readOnly
                  disabled
                  className="rounded-xl h-11 bg-muted/50 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full rounded-xl h-11 font-semibold shadow-sm transition-all mt-4 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Service...
                </>
              ) : (
                "Submit for review"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
