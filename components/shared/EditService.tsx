"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImageToImgBB } from "@/lib/imgbb";
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
import { Wrench, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { IServiceItem } from "@/app/types";
import { updateServices } from "@/lib/actions/services";

interface EditServiceProps {
  service: IServiceItem;
}

export default function EditService({ service }: EditServiceProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(service.image);
  const [category, setCategory] = useState(service.category);
  const [serviceMode, setServiceMode] = useState(service.serviceMode);

  // ImgBB নতুন ইমেজ আপলোড হ্যান্ডলার
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await uploadImageToImgBB(file);
      setImageUrl(url);
      toast.success("New banner image uploaded!");
    } catch {
      toast.error("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const updatedData = {
      title: formData.get("title"),
      category: category,
      description: formData.get("description"),
      image: imageUrl,
      basePrice: Number(formData.get("basePrice")),
      estimatedDuration: formData.get("estimatedDuration"),
      serviceMode: serviceMode,
      serviceArea: formData.get("serviceArea"),
    };

    try {
      await updateServices(service._id, updatedData);
      toast.success(
        "Service updated successfully! Status reset to pending for review.",
      );
      router.push("/dashboard/technician/my-services");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 rounded-3xl border border-[#C2C0B1] bg-[#EBECE4] p-4 sm:p-6 shadow-xs">
      {/* Back Link */}
      <div>
        <Link
          href="/dashboard/technician/my-services"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/80 px-3.5 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-[#E2E1D8] transition-colors shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4 text-primary" /> Back to My Services
        </Link>
      </div>

      {/* Header */}
      <div className="rounded-2xl border border-[#C2C0B1] bg-[#E2E1D8]/85 px-5 py-4 shadow-2xs">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Edit Service
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Update your service details. Note: Editing core details will reset
          approval status to pending.
        </p>
      </div>

      {/* Edit Form Card */}
      <Card className="rounded-2xl border border-[#C2C0B1] shadow-xs bg-[#EBECE4] overflow-hidden">
        <CardHeader className="bg-[#E2E1D8]/75 border-b border-[#C2C0B1] px-5 sm:px-6 py-4">
          <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" /> Modify Service
            Information
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            Make changes to your repair offering below.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 sm:p-6 bg-[#EBECE4]">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Title
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={service.title}
                required
                className="rounded-xl h-11 border border-[#C2C0B1] bg-[#E2E1D8]/65 text-foreground focus-visible:bg-[#EBECE4] focus-visible:ring-2 focus-visible:ring-primary/30"
              />
            </div>

            {/* Category & Service Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="category"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Category
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:bg-[#EBECE4] focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Smartphone">Smartphone</option>
                  <option value="Laptop & PC">Laptop & PC</option>
                  <option value="AC">AC</option>
                  <option value="Refrigerator">Refrigerator</option>
                  <option value="TV">TV</option>
                  <option value="Washing Machine">Washing Machine</option>
                  <option value="Electrical">Electrical</option>
                </select>
              </div>

              {/* Service Mode Dropdown */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="serviceMode"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Service Mode
                </Label>
                <select
                  id="serviceMode"
                  value={serviceMode}
                  onChange={(e) => setServiceMode(e.target.value)}
                  className="flex h-11 w-full rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/65 px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:bg-[#EBECE4] focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Home Visit">Home Visit</option>
                  <option value="Shop Drop-off">Shop Drop-off</option>
                </select>
              </div>
            </div>

            {/* Base Price & Estimated Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="basePrice"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Base Price (USD)
                </Label>
                <Input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  defaultValue={service.basePrice}
                  required
                  min="0"
                  className="rounded-xl h-11 border border-[#C2C0B1] bg-[#E2E1D8]/65 text-foreground focus-visible:bg-[#EBECE4] focus-visible:ring-2 focus-visible:ring-primary/30"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="estimatedDuration"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Estimated Duration
                </Label>
                <Input
                  id="estimatedDuration"
                  name="estimatedDuration"
                  defaultValue={service.estimatedDuration}
                  required
                  className="rounded-xl h-11 border border-[#C2C0B1] bg-[#E2E1D8]/65 text-foreground focus-visible:bg-[#EBECE4] focus-visible:ring-2 focus-visible:ring-primary/30"
                />
              </div>
            </div>

            {/* Service Area */}
            <div className="space-y-1.5">
              <Label
                htmlFor="serviceArea"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Service Area
              </Label>
              <Input
                id="serviceArea"
                name="serviceArea"
                defaultValue={service.serviceArea}
                required
                className="rounded-xl h-11 border border-[#C2C0B1] bg-[#E2E1D8]/65 text-foreground focus-visible:bg-[#EBECE4] focus-visible:ring-2 focus-visible:ring-primary/30"
              />
            </div>

            {/* ImgBB Image Upload & Preview */}
            <div className="space-y-2 rounded-xl border border-[#C2C0B1] bg-[#E2E1D8]/55 p-3.5">
              <Label
                htmlFor="image"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Service Banner Image
              </Label>
              <div className="flex items-center gap-4 pt-1">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#C2C0B1] bg-[#E2E1D8] shrink-0">
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="h-11 rounded-xl border border-[#C2C0B1] bg-[#EBECE4] px-2 py-1.5 text-sm text-muted-foreground cursor-pointer file:mr-3 file:h-full file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/15 file:text-primary hover:file:bg-primary/25"
                  />
                  {uploadingImage && (
                    <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor="description"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={service.description}
                rows={4}
                required
                className="rounded-xl resize-none p-3 border border-[#C2C0B1] bg-[#E2E1D8]/65 text-foreground focus-visible:bg-[#EBECE4] focus-visible:ring-2 focus-visible:ring-primary/30"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full rounded-xl h-11 font-semibold shadow-xs transition-all mt-4 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Service...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
