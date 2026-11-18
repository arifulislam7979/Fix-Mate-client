"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Loader2, Image as ImageIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export interface IServiceItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
}

interface EditServiceProps {
  service: IServiceItem;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function EditService({ service }: EditServiceClientProps) {
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
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // ফর্ম সাবমিট ও আপডেট হ্যান্ডলার
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
      const res = await fetch(`${BASE_URL}/services/${service._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update service");

      toast.success("Service updated successfully! Status reset to pending for review.");
      router.push("/dashboard/technician/my-services");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Back Link */}
      <Link href="/dashboard/technician/my-services" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors gap-1.5">
        <ArrowLeft className="h-4 w-4" /> Back to My Services
      </Link>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Service</h2>
        <p className="text-sm text-muted-foreground">
          Update your service details. Note: Editing core details will reset approval status to pending.
        </p>
      </div>

      {/* Edit Form Card */}
      <Card className="rounded-2xl border-border/70 shadow-xs bg-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" /> Modify Service Information
          </CardTitle>
          <CardDescription>
            Make changes to your repair offering below.
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
                defaultValue={service.title}
                required
                className="rounded-xl h-11"
              />
            </div>

            {/* Category & Service Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Smartphone">Smartphone</SelectItem>
                    <SelectItem value="Laptop & PC">Laptop & PC</SelectItem>
                    <SelectItem value="AC">AC</SelectItem>
                    <SelectItem value="Refrigerator">Refrigerator</SelectItem>
                    <SelectItem value="TV">TV</SelectItem>
                    <SelectItem value="Washing Machine">Washing Machine</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="serviceMode">Service Mode</Label>
                <Select value={serviceMode} onValueChange={setServiceMode}>
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
                  defaultValue={service.basePrice}
                  required
                  min="0"
                  className="rounded-xl h-11"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="estimatedDuration">Estimated Duration</Label>
                <Input
                  id="estimatedDuration"
                  name="estimatedDuration"
                  defaultValue={service.estimatedDuration}
                  required
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
                defaultValue={service.serviceArea}
                required
                className="rounded-xl h-11"
              />
            </div>

            {/* ImgBB Image Upload & Preview */}
            <div className="space-y-2">
              <Label htmlFor="image">Service Banner Image</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-border shrink-0">
                  <Image src={imageUrl} alt="Preview" fill className="object-cover" />
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="h-11 rounded-xl px-2 py-1.5 text-sm text-muted-foreground cursor-pointer file:mr-3 file:h-full file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  {uploadingImage && <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={service.description}
                rows={4}
                required
                className="rounded-xl resize-none p-3"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || uploadingImage}
              className="w-full rounded-xl h-11 font-semibold shadow-sm transition-all mt-4"
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